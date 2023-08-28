import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { Observable, getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

const httpLink = new HttpLink({
  uri: "https://imessage-backend-versionone.onrender.com/graphql",
  credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    getSession().then((session) => {
      if (session) {
        operation.setContext({
          headers: {
            authorization: `Bearer ${session.authToken}`,
          },
        });
      }

      // Continue with the request chain
      const subscription = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      // Return the cleanup function
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    });
  });
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "wss://imessage-backend-versionone.onrender.com/graphql/subscriptions",
          connectionParams: async () => ({
            session: await getSession(),
          }),
        }),
      )
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        ApolloLink.from([authMiddleware, httpLink]),
      )
    : ApolloLink.from([authMiddleware, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
