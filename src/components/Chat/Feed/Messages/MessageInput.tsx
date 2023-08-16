import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput = ({ session, conversationId }: MessageInputProps) => {
  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => {}}></form>
    </Box>
  );
};

export default MessageInput;
