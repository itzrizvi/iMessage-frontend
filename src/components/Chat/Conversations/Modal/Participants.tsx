import { SearchedUser } from "@/utils/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { HiTrash } from 'react-icons/hi';

interface ParticipantsProps {
    participants: Array<SearchedUser>;
    removeParticipants: (userID: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipants }) => {
    return (
        <Flex mt={8} gap='10px'>
            {participants.map(participant => (
                <Stack direction='row' key={participant.id} align='center' bg='whiteAlpha.200' borderRadius={4} p={2}>
                    <Text>{participant.username}</Text>
                    <HiTrash size={20} cursor='pointer' color="rgb(131 16 55)" onClick={() => removeParticipants(participant.id)} title="Remove User"/>
                </Stack>
            ))}
        </Flex>
    );
};

export default Participants;
