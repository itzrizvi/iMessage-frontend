import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";
import MessageOperations from "../../../../graphql/operations/message";
import { useMutation } from "@apollo/client";
import { ObjectId } from "bson";
import { SendMessageArguments } from "../../../../../../backend/src/utils/types";
import { MessagesData } from "@/utils/types";

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
      // Clear state
      setMessageBody("");

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

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
        <InputGroup size="md">
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
          <InputRightElement
            backgroundColor="brand.100"
            width="5rem"
            borderEndRadius={3}
          >
            <Button
              h="1.75rem"
              size="lg"
              type="submit"
              backgroundColor="brand.100"
              _focus={{
                boxShadow: "none",
              }}
              isDisabled={messageBody.length <= 0}
            >
              <AiOutlineSend size={20} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
};

export default MessageInput;
