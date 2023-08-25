import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import {
  ConversationDeletedData,
  ConversationUpdatedData,
  ConversationsData,
} from "@/utils/types";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../backend/src/utils/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "@/components/common/SkeletonLoader";

interface ConversationsWrapperProps {
  session: Session;
}
type ConversationIDType = string;

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const {
    query: { conversationID },
  } = router;

  const conversationIdTyped: ConversationIDType =
    conversationID as ConversationIDType;

  const {
    user: { id: userId },
  } = session;

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const currentlyViewingConversation =
          updatedConversation.id === conversationID;
        if (currentlyViewingConversation) {
          onViewConversation(conversationIdTyped, false);
        }
      },
    },
  );

  useSubscription<ConversationDeletedData>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;

        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId,
            ),
          },
        });
        router.push("/");
      },
    },
  );

  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

  const onViewConversation = async (
    conversationID: string,
    hasSeenLatestMessage: boolean | undefined,
  ) => {
    router.push({ query: { conversationID } });

    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId: conversationID,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationID}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });
          if (!participantsFragment) return;
          const participants = [...participantsFragment.participants];
          const userParticipantIndx = participants.findIndex(
            (p) => p.user.id === userId,
          );
          if (userParticipantIndx === -1) return;
          const userParticipant = participants[userParticipantIndx];

          // Update Participant to show latest message as read
          participants[userParticipantIndx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          // Update Apollo Cache
          cache.writeFragment({
            id: `Conversation:${conversationID}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("ON VIEW ERROR", error);
    }
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

  return (
    <Box
      display={{ base: conversationID ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px", sm: "100%" }}
      flexDirection="column"
      bg="whiteAlpha.50"
      gap={4}
      py={6}
      px={3}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="50px" width="100%" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};
export default ConversationsWrapper;
