import React from "react";
import { ProductsTable, Protected } from "../../components";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Protected>
      <ProductsTable call="products" />
    </Protected>
  );
};

export default Page;
