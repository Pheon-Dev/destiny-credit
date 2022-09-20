import { Box, Button, Card, Group } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { TitleText } from "../../components";

const ErrorPage = () => {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    let sub = true;
    if (sub) {
      if (status === "unauthenticated") router.push("/");
    }
    return () => {
      sub = false;
    };
  }, [status, router]);

  return (
    <>
      <Card
        sx={{ maxWidth: 360 }}
        mx="auto"
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ marginTop: "200px" }}
      >
        <Card.Section>
          <Box p="lg">
            <form>
              <TitleText title="Sign In Error" />
              <Group mt="xl">
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Back Home
                </Button>
              </Group>
            </form>
          </Box>
        </Card.Section>
      </Card>
    </>
  );
};

const Page = () => {
  return <ErrorPage />;
};

export default Page;
