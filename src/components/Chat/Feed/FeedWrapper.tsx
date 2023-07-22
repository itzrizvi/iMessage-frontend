import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationID } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <Flex
      display={{ base: conversationID ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationID && typeof conversationID === "string" ? (
        <Flex
          direction="column"
          justify="space-between"
          overflow="hidden"
          flexGrow={1}
        >
          <MessagesHeader userId={userId} conversationId={conversationID} />
        </Flex>
      ) : (
        <div>No conversation selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
