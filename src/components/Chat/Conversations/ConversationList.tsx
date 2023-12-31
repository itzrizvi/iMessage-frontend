import { useState } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/ConversationModal";
import ConversationItem from "./ConverationItem";
import { useRouter } from "next/router";
import { ConversationPopulated } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "next-auth/react";
import useSound from "use-sound";
import deleteSound from "../../../assets/sounds/trashNotificationSound.mp3";
import { FaUserSecret } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

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
  const [playDeleteSound] = useSound(deleteSound);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const router = useRouter();
  const {
    user: { id: userId, image: profileImage, username, email },
  } = session;

  const onDeleteConversation = async (
    conversationId: string,
    selfId: string,
  ) => {
    console.log();
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
            if (selfId === userId) {
              playDeleteSound();
            }
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
        py={4}
        px={4}
        mb={4}
        width="100%"
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
      >
        <Image
          src={`${profileImage}`}
          display="block"
          margin="auto"
          alt="Profile Image"
          alignSelf="center"
          boxSize="80px"
          borderRadius="full"
        />
        <Box
          display="flex"
          alignItems="baseline"
          gap="10px"
          justifyContent="center"
        >
          <FaUserSecret />
          <Text mt={4} color="whiteAlpha.800" fontWeight={500}>
            {username}
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap="5px"
          justifyContent="center"
        >
          <MdAlternateEmail size="15" />
          <Text
            textAlign="center"
            mt={1}
            fontSize="12px"
            color="whiteAlpha.800"
            fontWeight={500}
            alignSelf="center"
          >
            {email}
          </Text>
        </Box>
      </Box>
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
          (p: any) => p.user.id === userId,
        );
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            session={session}
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
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        px={8}
        py={4}
        bg="blackAlpha.600"
      >
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
