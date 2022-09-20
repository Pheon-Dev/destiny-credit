import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable, Protected, TitleText } from "../../components";
import { Group, LoadingOverlay } from "@mantine/core";

const ProductsList = () => {
  try {
  const { data: products, status } = trpc.useQuery(["products.products"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {products && <ProductsTable products={products} />}
      {status === "success" && !products && (
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
