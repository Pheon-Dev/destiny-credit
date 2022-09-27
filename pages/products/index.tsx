import React from "react";
import { trpc } from "../../utils/trpc";
import {
  EmptyTable,
  ProductsTable,
  Protected,
} from "../../components";
import { NextPage } from "next";

const ProductsList = () => {
  const { data: products, fetchStatus } = trpc.products.products.useQuery();

  return (
    <Protected>
      <div style={{ position: "relative" }}>
        {products && <ProductsTable products={products} />}
        {!products && <EmptyTable call="products" status={fetchStatus} />}
      </div>
    </Protected>
  );
};

const Page: NextPage = () => {
  return <ProductsList />;
};

export default Page;
