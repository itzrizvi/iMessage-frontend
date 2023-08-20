/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConveratonFields = `
    id
    participants {
        user {
            id
            username
        }
        hasSeenLatestMessage
    }
    latestMessage {
        ${MessageFields}
    }
    updatedAt
`;

export default {
  Queries: {
    conversations: gql`
            query Conversations {
                conversations {
                    ${ConveratonFields}
                }
            }
        `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIDs: [String]!) {
        createConversation(participantIDs: $participantIDs) {
          conversationID
        }
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
        subscription ConversationCreated {
            conversationCreated{
                ${ConveratonFields}
            }
        }
        `,
  },
};
