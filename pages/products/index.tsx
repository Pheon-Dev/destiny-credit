import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable, Protected, TitleText } from "../../components";
import { Group, LoadingOverlay } from "@mantine/core";

const ProductsList = () => {
  try {
  const { data: products, status } = trpc.products.products.useQuery();

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {products && <ProductsTable products={products} />}
      {products?.length === 0 && (
        <Group position="center">
        <TitleText title="No Created Products" />
        </Group>
      )}
    </Protected>
  );
  } catch (error) {
    console.log(error);
    return (
      <Protected>
        <TitleText title="No Created Products" />
      </Protected>
    );
  }
};

const Page = () => {
  return <ProductsList />;
};

export default Page;
