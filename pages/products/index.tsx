import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable, Protected } from "../../components";
import { Group, Text } from "@mantine/core";

const ProductsList = () => {
  const { data: products, status } = trpc.useQuery(["products.products"]);

  return (
    <Protected>
      {products && <ProductsTable products={products} />}
      {status === "success" && products.length === 0 && (
        <Group position="center">
          <Text>No Created Products</Text>
        </Group>
      )}
    </Protected>
  );
};

const Page = () => {
    return <ProductsList />
  }

export default Page;
