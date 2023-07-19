/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";

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
        id
        sender {
            id
            username
        }
        body
        createdAt
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
  },
};
