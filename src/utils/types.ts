import {
  ConversationPopulated,
  MessagePopulated,
} from "../../../backend/src/utils/types";

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

export interface ConversationsData {
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

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}

// Messages
export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}

export interface Participant {
  hasSeenLatestMessage: boolean;
  user: SearchedUser;
}
