import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable, Protected } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const ProductsList = () => {
  const { data: products, status } = trpc.useQuery(["products.products"]);

  return (
    <Protected>
      <LoadingOverlay overlayBlur={2} visible={status === "loading"} />
      {products && <ProductsTable products={products} />}
      {status === "success" && !products && (
        <Group position="center">
          <Text>No Created Products</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page = () => {
  return <ProductsList />;
};

export default Page;
