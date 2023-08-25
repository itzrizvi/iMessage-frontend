import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import ConversationItem from "./ConverationItem";
import { useRouter } from "next/router";
import { Participant } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined,
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  //   const [] = useMutation();
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const onDeleteConversation = async (conversationId: string) => {
    try {
    } catch (error) {
      console.log("ON DELETE ERROR", error);
      toast.error("Something Went Wrong!!!");
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
  );

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

      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p: Participant) => p.user.id === userId,
        );
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage,
              )
            }
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationID}
          />
        );
      })}
    </Box>
  );
};
export default ConversationList;
