import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { EmptyTable, ProductsTable, Protected } from "../../components";

const Page: NextPage = () => {
  const { data, status } = useSession();

  const email = `${data?.user?.email}`;
  const check = email.split("@")[1];

  const call = "products";

  return (
    <Protected>
      {check && (
        <ProductsTable call={call} email={email} status={status} />
      )}
      {check === "" && <EmptyTable call={call} status={status} />}
    </Protected>
  );
};

export default Page;
