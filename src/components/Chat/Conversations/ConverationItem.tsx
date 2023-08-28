import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { RxDotsVertical } from "react-icons/rx";
import { formatUsernames } from "../../../utils/functions";
import { Session } from "next-auth";
import { ConversationPopulated } from "@/utils/types";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

interface ConversationItemProps {
  userId: string;
  session: Session;
  conversation: ConversationPopulated;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage?: boolean | undefined;
  onDeleteConversation: (conversationId: string, selfId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  session,
  onClick,
  isSelected,
  hasSeenLatestMessage,
  onDeleteConversation,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    user: { id: selfId },
  } = session;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(true);
  };

  return (
    <Stack
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      cursor="pointer"
      borderRadius={4}
      bg={isSelected ? "whiteAlpha.200" : "none"}
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={onClick}
      position="relative"
    >
      <Box position="absolute" right="250px" top="0px" margin="auto">
        <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          <MenuList bg="#2d2d2d">
            <MenuItem
              icon={<MdDeleteOutline fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                onDeleteConversation(conversation.id, selfId);
              }}
              bg="#2d2d2d"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Flex position="absolute" left="-2px">
        {hasSeenLatestMessage === false && (
          <GoDotFill fontSize={18} color="#6B46C1" />
        )}
      </Flex>
      <Avatar />
      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box width="140%" maxWidth="360px">
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                width="90%"
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text
          color="whiteAlpha.700"
          textAlign="right"
          position="absolute"
          right={4}
        >
          {formatRelative(new Date(conversation.updatedAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token: string) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
        <Box
          alignSelf="flex-end"
          style={{
            padding: "5px",
            borderRadius: "50%",
            backgroundColor: "#292929",
            marginTop: "25px",
          }}
          onClick={handleClick}
        >
          <RxDotsVertical />
        </Box>
      </Flex>
    </Stack>
  );
};
export default ConversationItem;
