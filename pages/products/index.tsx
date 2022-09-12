import React from "react";
import { trpc } from "../../utils/trpc";
import { ProductsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const ProductsList = () => {
  const { data: products, status } = trpc.useQuery(["products.products"]);

  return (
    <>
      {products && <ProductsTable products={products} />}
      {status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={status === "loading"}
        />
      }
      {status === "success" && products.length === 0 && (
        <Group position="center">
          <Text>No Created Products</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
    return <ProductsList />
  }

export default Page;
