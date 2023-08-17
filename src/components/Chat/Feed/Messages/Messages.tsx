import { Flex } from "@chakra-ui/react";
import React from "react";

interface MessagesProps {}

const Messages: React.FC<MessagesProps> = () => {
  return <Flex direction="column" justify="flex-end" overflow="hidden"></Flex>;
};

export default Messages;
