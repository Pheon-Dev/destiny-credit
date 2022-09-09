import React, { useEffect, useState } from "react";
import axios from "axios";
import { MembersTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [load, setLoad] = useState(true);
  const [loaded, setLoaded] = useState(false);

  async function fetchMembers() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/members",
      });

      const data = res.data.members;
      setMembers(data);
      members.length === 0 && setLoaded(true);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchMembers();
  }, [members]);

  return (
    <>
      {(members.length > 0 && <MembersTable members={members} call="create-loan" />) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {loaded && members.length === 0 && (
        <Group position="center">
          <Text>No Maintained Loans</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
    return <MembersList />
  }

export default Page;
