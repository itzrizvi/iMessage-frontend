import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({
    session,
    reloadSession
}) => {
    const [username, setUsername] = useState("");

    const onSubmit = async () => {
        try {
            // Create function
        } catch (error) {
            console.error("onSubmit Error", error);
        }
    }
    return (
        <Center height="100vh">
            <Stack spacing={4} align="center">
                {session ? (
                    <>
                        <Text fontSize='3xl'>Create a Username</Text>
                        <Input placeholder="Entera a username" value={username} onChange={(e)=> setUsername(e.target.value)} />
                        <Button width="100%" onClick={onSubmit}>Save</Button>
                    </>
                ):(
                    <>
                        <Text fontSize="3xl">iMessage</Text>
                        <Button onClick={()=>signIn('google')} leftIcon={<Image alt="Google Logo" height='20px' src="/images/googlelogo.png" />}>Continue with Google</Button>
                    </>
                )}
            </Stack>
        </Center>
    );
};

export default Auth;
