import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { EmptyTable, PaymentsTable, Protected } from "../../components";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "payments";

  return (
    <Protected>
      <Suspense
        fallback={check === "" && <EmptyTable call={call} status={status} />}>
        {check && (
          <PaymentsTable call={call} email={email} status={status} />
        )}
      </Suspense>
    </Protected>
  );
};

export default Page;
