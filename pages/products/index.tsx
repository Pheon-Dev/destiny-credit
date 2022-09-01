import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductsTable } from "../../components";
import { Group, LoadingOverlay, Text } from "@mantine/core";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState(true);

  async function fetchProducts() {
    let subscription = true;

    if (subscription) {
      const res = await axios.request({
        method: "GET",
        url: "/api/products",
      });

      const data = res.data.products;
      setProducts(data);
      products.length === 0 && setLoad(false);
    }

    return () => {
      subscription = false;
    };
  }

  useEffect(() => {
    fetchProducts();
  }, [products]);

  return (
    <>
      {(products.length > 0 && <ProductsTable products={products} />) || (
        <LoadingOverlay
          overlayBlur={2}
          onClick={() => setLoad((prev) => !prev)}
          visible={load}
        />
      )}
      {products.length === 0 && (
        <Group position="center">
          <Text>No Registered products</Text>
        </Group>
      )}
    </>
  );
};

const Page = () => {
    return <ProductsList />
  }

export default Page;
