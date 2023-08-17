import { MessagesData, MessagesVariables } from "@/utils/types";
import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import MessageOperations from "../../../../graphql/operations/message";
import React from "react";
import { toast } from "react-hot-toast";

interface MessagesProps {
  conversationId: string;
  userId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return <Flex direction="column" justify="flex-end" overflow="hidden"></Flex>;
};

export default Messages;
