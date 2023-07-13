import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({
    session,
    reloadSession
}) => {
    return (
        <Center height="100vh" border="1px solid red">
            <Stack>
                {session ? (
                    <Text>Create a Username</Text>
                ):(
                    <>
                        <Text fontSize="3xl">MessngerQL</Text>
                        <Button onClick={()=>signIn('google')}>Continue with Google</Button>
                    </>
                )}
            </Stack>
        </Center>
    );
};

export default Auth;
