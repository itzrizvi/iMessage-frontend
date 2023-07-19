import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import {
  CreateConversation,
  CreateConversationData,
  SearchUsersData,
  SearchUsersInput,
  SearchedUser,
} from "@/utils/types";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import { toast } from "react-hot-toast";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const {
    user: { id: myID },
  } = session;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversation>(
      ConversationOperations.Mutations.createConversation,
    );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({
      variables: { username },
    });
  };

  const addParticipant = (user: SearchedUser) => {
    const isDuplicateUser = participants.some(
      (participant) => participant.id === user.id,
    );
    if (isDuplicateUser) {
      toast.error("This user already exists in your selection!");
    } else {
      setParticipants((prev) => [...prev, user]);
      setUsername("");
    }
  };

  const removeParticipant = (userID: string) => {
    setParticipants((prev) =>
      prev.filter((prevUser) => prevUser.id !== userID),
    );
  };

  const onCreateConversation = async () => {
    const participantIDs = [
      myID,
      ...participants.map((participant) => participant.id),
    ];
    try {
      const { data } = await createConversation({
        variables: {
          participantIDs,
        },
      });

      if (!data?.createConversation) {
        toast.error("Something went wrong");
        throw new Error("Failed to create conversation");
      }
      const {
        createConversation: { conversationID },
      } = data;
      router.push({ query: { conversationID } });

      // Clear states and close modal
      setParticipants([]);
      setUsername("");
      onClose();

      console.log("HERE IS DATA", data);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  removeParticipants={removeParticipant}
                  participants={participants}
                />
                <Button
                  border="1px solid #000000"
                  _hover={{ bg: "brand.100" }}
                  mt={6}
                  width="100%"
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
