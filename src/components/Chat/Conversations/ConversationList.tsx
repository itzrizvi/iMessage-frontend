import { useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import ConversationItem from "./ConverationItem";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  conversationsLoading: Boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  conversationsLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />

      {conversationsLoading ? (
        <Flex align="center" justify="center" height="50vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))
      )}
    </Box>
  );
};
export default ConversationList;
