import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput = ({ session, conversationId }: MessageInputProps) => {
  const [messageBody, setMessageBody] = useState("");

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    } catch (error: any) {
      console.log("On Send Message Error", error);
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => {}}>
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
