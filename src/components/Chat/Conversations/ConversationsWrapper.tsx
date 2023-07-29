import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "@/utils/types";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

  const router = useRouter();
  const {
    query: { conversationID },
  } = router;

  const onViewConversation = async (conversationID: string) => {
    router.push({ query: { conversationID } });
  };

  const subscribeToNewConversation = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        },
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;

        // Check if the new conversation already exists in the list
        const isConversationExists = prev.conversations.some(
          (conversation) => conversation.id === newConversation.id,
        );
        if (!isConversationExists) {
          return Object.assign({}, prev, {
            conversations: [newConversation, ...prev.conversations],
          });
        }
        return prev;
      },
    });
  };
  //
  useEffect(() => {
    subscribeToNewConversation();
  }, []);

  console.log("QUERY DATA", conversationsData?.conversations);

  return (
    <Box
      display={{ base: conversationID ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};
export default ConversationsWrapper;
