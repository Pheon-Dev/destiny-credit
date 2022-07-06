import React, { useState, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

import "../styles/globals.css";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <div className="flex bg-gray-300 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <NavBar />
        <SideBar />
      </div>
      <div className="flex md:hidden flex-row bg-gray-800">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <div className="text-l text-gray-500 flex justify-center ml-auto mr-auto font-bold">
            Destiny Credit LTD
          </div>
          {toggleSidebar !== true ? (
            <HiMenu
              fontSize={24}
              className="cursor-pointer text-gray-500"
              onClick={() => setToggleSidebar(true)}
            />
          ) : (
            <AiOutlineCloseCircle
              fontSize={24}
              className="cursor-pointer text-gray-500"
              onClick={() => setToggleSidebar(false)}
            />
          )}
        </div>
        {toggleSidebar && (
          <>
            <div className="fixed w-3/5 bg-white h-screen shadow-md z-10 animate-slide-in animate-slide-out">
              {/* <NavBar closeToggle={setToggleSidebar} /> */}
              {/* <SideBar closeToggle={setToggleSidebar} /> */}
              <NavBar />
              <SideBar />
            </div>
          </>
        )}
      </div>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
