import React, { useEffect, useState } from "react";
import { client } from "../client";

const CreateMember = () => {
  const [data, setData] = useState("");

  useEffect(() => {
      const query = '*[_type == "member"]';

      client.fetch(query).then((data: any) => {
          setData(data);
        })
    }, [])
  return (
    <div className="ml-[15rem]">
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
};

export default CreateMember;
