import { ConversationPopulated } from "../../../backend/src/utils/types";

// USER TYPES

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

// CONVERSATION TYPES

export interface ConverationData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
  createConversation: {
    conversationID: string;
  };
}
export interface CreateConversation {
  participantIDs: Array<string>;
}
