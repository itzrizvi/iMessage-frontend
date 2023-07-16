import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface FeedWrapperProps {
    session: Session
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
    const router = useRouter();
    const { conversationID } = router.query;

    return (
        <Flex display={{ base: conversationID ? 'flex':'none', md:'flex' }} width='100%' direction='column'>
            {conversationID ? (
                <Flex>{conversationID}</Flex>
            ):(
                <div>No conversation selected</div>
            )}
        </Flex>
    );
};

export default FeedWrapper;
