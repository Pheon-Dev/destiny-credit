import React, { useState, useEffect } from "react";
import {
  BsArrowRight,
  BsBookmark,
  BsBookmarkFill,
  BsBookmarks,
  BsBookmarksFill,
  BsHash,
} from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";

type LinkProps = {
  name: string;
  url: string;
  title: string;
};

const LinkDropDown = ({ name, url, title }: LinkProps) => {
  const [expanded, setExpanded] = useState(true);

  type ChevProps = {
    expand: boolean;
  };

  type DropProps = {
    select: string;
  };

  const ChevronIcon = ({ expand }: ChevProps) => {
    const chevClass = "text-accent text-opacity-80 my-auto mr-1";

    return expand ? (
      <FaChevronDown size="14" className={chevClass} />
    ) : (
      <FaChevronRight size="14" className={chevClass} />
    );
  };

  const SideBarSelection = ({select}: DropProps) => (
  <div className="dropdown-selection">
  <BsArrowRight size="8" className="text-gray-800 m-2" />
  <h5 className="dropdown-selection-text">{select}</h5>
  </div>
  )

  const SideBarBlock = () => (
  <div className="channel-block">
  <h5 className="channel-block-text">Destiny Credit LTD</h5>
  </div>
  )

  return (
    <div className="dropdown mr-2">
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className="dropdown-header"
      >
        <ChevronIcon expand={expanded} />
        <h5>{title}</h5>
      </div>
    </div>
  );
};

const SideBar = () => {
  return (
  <div className="w-full h-full mr-0 m-0 ml-12 bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-lg">
  <div className="channel-container">
  <LinkDropDown name="Dashboard" url="/" title="Home" />
  </div>
  </div>
  );
};

export default SideBar;
