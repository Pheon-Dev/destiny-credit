import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable, Protected, TitleText } from "../../components";
import { Group, LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";

const ProductsList = () => {
  const { data: products, fetchStatus } = trpc.products.products.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        {/* <LoadingOverlay overlayBlur={2} visible={fetchStatus === "fetching"} /> */}
        {products && <ProductsTable products={products} />}
        {!products && (
          <Group position="center">
            <TitleText title="No Created Products" />
          </Group>
        )}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <ProductsList />;
};

export default Page;
