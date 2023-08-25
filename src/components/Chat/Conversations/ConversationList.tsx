import { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import ConversationItem from "./ConverationItem";
import { useRouter } from "next/router";
import { Participant } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "next-auth/react";

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
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : "",
            );
          },
        }),
        {
          loading: "Deleting Conversations!!!",
          success: "Conversartion Deleted!!!",
          error: "Something Went Wrong!!!",
        },
      );
    } catch (error) {
      console.log("ON DELETE ERROR", error);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
  );

  return (
    <Box
      width={{ base: "100%", md: "370px", sm: "100%" }}
      position="relative"
      height="100%"
      overflow="hidden"
    >
      <Box
        py={2}
        px={4}
        mb={4}
        width="100%"
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
            onDeleteConversation={onDeleteConversation}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationID}
          />
        );
      })}
      <Box position="absolute" bottom={0} left={0} width="100%" px={8}>
        <Button
          leftIcon={<BiLogOut />}
          width="100%"
          onClick={() =>
            signOut({
              callbackUrl:
                typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                  ? process.env.NEXT_PUBLIC_BASE_URL
                  : "/",
            })
          }
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};
export default ConversationList;
