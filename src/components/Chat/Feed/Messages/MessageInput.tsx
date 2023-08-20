import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import { SendMessageArguments } from "../../../../../../backend/src/utils/types";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}: MessageInputProps) => {
  const [messageBody, setMessageBody] = useState("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageArguments
  >(MessageOperations.Mutation.sendMessage);

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        user: { id: senderId },
      } = session;
      const messageId = new ObjectId().toString();
      const newMessage: SendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody,
      };
      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
      });
      setMessageBody("");
      if (!data?.sendMessage || errors)
        throw new Error("Failed to send message");
    } catch (error: any) {
      console.log("On Send Message Error", error);
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          size="md"
          placeholder="Type new message"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
          _hover={{
            borderColor: "whiteAlpha.700",
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
