import React from "react";
import { trpc } from "../../utils/trpc";
import { Product } from "@prisma/client";
import { ProductsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const ProductsList = () => {
  const products = trpc.useQuery(["products"]) || [];
  const data = products.data?.map((p: Product) => p);

  return (
    <>
      {data && <ProductsTable products={data} />}
      {products.status === "loading" &&
        <LoadingOverlay
          overlayBlur={2}
          visible={products.status === "loading"}
        />
      }
      {products.status === "success" && products.data.length === 0 && (
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
