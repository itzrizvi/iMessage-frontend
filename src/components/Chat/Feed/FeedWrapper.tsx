import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";
import MessageInput from "./Messages/MessageInput";
import Messages from "./Messages/Messages";
import { MdMarkUnreadChatAlt } from "react-icons/md";

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
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <MessagesHeader userId={userId} conversationId={conversationID} />
            <Messages conversationId={conversationID} userId={userId} />
          </Flex>
          <MessageInput session={session} conversationId={conversationID} />
        </>
      ) : (
        <Box width="100%" height="100%">
          <Center h="100%" color="white">
            <Box
              bg="whiteAlpha.200"
              p={10}
              textAlign="center"
              borderRadius={5}
              boxShadow="2xl"
            >
              <MdMarkUnreadChatAlt
                style={{ display: "inline-flex" }}
                size={80}
                color="#3d84f7"
              />
              <Text fontSize="2xl" fontWeight={500}>
                One step away from start your community!!!
              </Text>
              <Text fontSize="18px" mt={2}>
                Select or create a conversation.
              </Text>
            </Box>
          </Center>
        </Box>
      )}
    </Flex>
  );
};

export default FeedWrapper;
