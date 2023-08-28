import { useQuery } from "@apollo/client";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { formatUsernames } from "../../../../utils/functions";
import { ConversationsData } from "../../../../utils/types";
import { BiArrowBack } from "react-icons/bi";
interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationsData, any>(
    ConversationOperations.Queries.conversations,
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId,
  );

  return (
    <Stack
      direction="row"
      align="center"
      spacing={{ base: 2, md: 6, lg: 6, sm: 4 }}
      py={5}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      justifyContent={{
        base: "space-between",
        lg: "initial",
        md: "initial",
        sm: "space-between",
      }}
      width="100%"
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
      >
        <BiArrowBack />
      </Button>
      {conversation && !loading && (
        <Stack direction="row" p={{ base: 2, lg: 3, md: 3, sm: 2 }}>
          <Text color="whiteAlpha.600" fontSize="lg" alignSelf="center">
            To:{" "}
          </Text>
          {[
            ...formatUsernames(conversation.participants, userId).split(" "),
          ].map((el, index) => (
            <Text
              fontWeight={600}
              bg="brand.100"
              px={4}
              py={1}
              borderRadius={4}
              m={1}
              key={index}
            >
              {el}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
export default MessagesHeader;
