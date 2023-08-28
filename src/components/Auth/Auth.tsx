import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "@/utils/types";
import { toast } from "react-hot-toast";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    try {
      const { data } = await createUsername({
        variables: {
          username,
        },
      });
      if (!data?.createUsername) {
        throw new Error();
      }
      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }
      // Reload session to get updated data
      toast.success("Username successfully created!");
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.error("onSubmit Error", error);
    }
  };
  return (
    <Center height="100vh">
      <Stack spacing={4} align="center">
        {session ? (
          <>
            <form onSubmit={onSubmit}>
              <Text fontSize="3xl" mb={3} align="center">
                Create a Username
              </Text>
              <Input
                placeholder="Entera a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                mb={3}
              />
              <Button width="100%" type="submit" isLoading={loading}>
                Save
              </Button>
            </form>
          </>
        ) : (
          <>
            <Text fontSize="3xl">iMessage</Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={
                <Image
                  alt="Google Logo"
                  height="20px"
                  src="/images/googlelogo.png"
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
