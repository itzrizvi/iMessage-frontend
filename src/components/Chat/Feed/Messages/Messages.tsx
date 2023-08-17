import { MessagesData, MessagesVariables } from "@/utils/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import MessageOperations from "../../../../graphql/operations/message";
import React from "react";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/components/common/SkeletonLoader";

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

  if (error) {
    return null;
  }

  console.log("HERE IS MESSAGES", data);

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={10} height="50px" width="100%" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <div key={message.id}>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
