import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConverationData } from "@/utils/types";

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
  } = useQuery<ConverationData, any>(
    ConversationOperations.Queries.conversations,
  );
  console.log("CONVRSTN DATA", conversationsData);
  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        conversationsLoading={conversationsLoading}
      />
    </Box>
  );
};
export default ConversationsWrapper;
