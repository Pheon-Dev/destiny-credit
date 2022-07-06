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
import { HashRouter as Router, NavLink } from "react-router-dom";

type LinkProps = {
  title: string;
  data: any;
};

  const dashboard = [
    {
      name: "Dashboard",
      url: "/",
    },
  ];

const members = [
  {
    name: 'New Member',
    url: '/member/create-member',
  },
  {
    name: 'All Members',
    url: '/member/',
  },
];
const groups = [
  {
    name: 'New Group',
    url: '/group/create-group',
  },
  {
    name: 'All Groups',
    url: '/group/groups',
  },
];
const products = [
  {
    name: 'New Product',
    url: '/loan/new-product',
  },
  {
    name: 'All Products',
    url: '/loan/products',
  },
];

const loans = [
  {
    name: 'New Loan',
    url: '/loan/create-loan',
  },
  {
    name: 'Approvals',
    url: '/loan/approvals',
  },
  {
    name: 'Disbursments',
    url: '/loan/disbursements',
  },
  {
    name: 'Payments',
    url: '/loan/payments',
  },
  {
    name: 'All Loans',
    url: '/loan/',
  },
];
const reports = [
  {
    name: 'PAR Report',
    url: '/report/par-report',
  },
  {
    name: 'Schedules',
    url: '/report/schedule-report',
  },
];

const LinkDropDown = ({ title, data }: LinkProps) => {
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

  const isNotActiveStyle = "dropdown-selection-text";
  const isActiveStyle = "dropdown-selection-text text-cyan-500";

  const SideBarSelection = ({ select }: DropProps) => (
    <div className="dropdown-selection">
      <BsArrowRight size="8" className="text-gray-800 m-2" />
      <h5 className="dropdown-selection-text">{select}</h5>
    </div>
  );

  const SideBarBlock = () => (
    <div className="channel-block">
      <h5 className="channel-block-text">Destiny Credit LTD</h5>
    </div>
  );

  return (
    <div className="dropdown mr-2">
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className="dropdown-header"
      >
        <ChevronIcon expand={expanded} />
        <h5
          className={
            expanded ? "dropdown-header-text-selected" : "dropdown-header-text"
          }
        >
          {title}
        </h5>
        {expanded ? (
          <BsBookmark
            size="12"
            className="text-gray-500 text-opacity-80 my-auto ml-auto"
          />
        ) : (
          <BsBookmarkFill
            size="12"
            className="text-gray-500 text-opacity-80 my-auto ml-auto"
          />
        )}
      </div>
      {expanded &&
        data.slice(0, data.length - 0).map((item: any) => (
          <div key={item.name} className="dropdown-selection">
            <BsArrowRight size="8" className="text-gray-400 m-2" />
            <NavLink
              to={item.url}
              // onClick={handleCloseSideBar}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
            >
              {item.name}
            </NavLink>
          </div>
        ))}
    </div>
  );
};

const SideBar = () => {
  return (
    <div className="w-full h-full mr-0 m-0 ml-12 bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-lg">
      <div className="channel-container">
      <Router>
        <LinkDropDown title="Home" data={dashboard} />
        <LinkDropDown title="Members" data={members} />
        <LinkDropDown title="Groups" data={groups} />
        <LinkDropDown title="Products" data={products} />
        <LinkDropDown title="Loans" data={loans} />
        <LinkDropDown title="Reports" data={reports} />
      </Router>
      </div>
    </div>
  );
};

export default SideBar;
