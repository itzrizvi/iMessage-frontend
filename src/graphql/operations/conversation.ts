/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
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
                    ${ConversationFields}
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
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
        subscription ConversationCreated {
            conversationCreated{
                ${ConversationFields}
            }
        }
        `,
    conversationUpdated: gql`
        subscription ConversationUpdated {
            conversationUpdated {
               conversation {
                    ${ConversationFields}
               }
            }
        }
        `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};
