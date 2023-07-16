/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";

export default {
    Queries:{},
    Mutations: {
        createConversation: gql`
            mutation CreateConversation($participantIDs: [String]!) {
                createConversation(participantIDs: $participantIDs) {
                    conversationID
                }
            }
        `
    }
}