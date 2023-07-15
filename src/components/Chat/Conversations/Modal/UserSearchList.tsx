import { SearchedUser } from "@/utils/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";

interface UserSearchListProps {
    users: Array<SearchedUser>
}

const UserSearchList: React.FC<UserSearchListProps> = ({users}) => {
    return (
        <>
            {users.length === 0 ? (
                <Flex mt={6} justify="center">
                    <Text>No users found</Text>
                </Flex>
            ):(
                <Stack mt={6}>
                    {users.map(user => (
                        <Stack 
                            direction="row" 
                            key={user.id} 
                            align="center" 
                            spacing={4} 
                            py={2} 
                            px={4} 
                            borderRadius={4}
                            _hover={{bg:"whiteAlpha.200"}}>
                                <Avatar />
                                <Flex justify="space-between" align="center" width="100%">
                                    <Text color="whiteAlpha.700">{user.username}</Text>
                                    <Button 
                                        border="1px solid #000000" 
                                        _hover={{bg:"brand.100"}}
                                        onClick={()=>{}}
                                    >
                                        Select
                                    </Button>
                                </Flex>
                            </Stack>
                    ))}
                </Stack>
            )}
        </>
    );
};

export default UserSearchList;
