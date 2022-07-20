import Link from "next/link";
import { useRouter } from "next/router";
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
import {
  BrowserRouter as Router,
  NavLink,
  useNavigate,
} from "react-router-dom";

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
    name: "New Member",
    url: "/members/create-member/",
  },
  {
    name: "All Members",
    url: "/members/",
  },
];
const groups = [
  {
    name: "New Group",
    url: "/groups/create-group/",
  },
  {
    name: "All Groups",
    url: "/groups/",
  },
];
const products = [
  {
    name: "New Product",
    url: "/products/create-product/",
  },
  {
    name: "All Products",
    url: "/products/",
  },
];

const loans = [
  {
    name: "New Loan",
    url: "/loans/create-loan/",
  },
  {
    name: "Approvals",
    url: "/loans/approvals/",
  },
  {
    name: "Disbursments",
    url: "/loans/disbursements/",
  },
  {
    name: "Payments",
    url: "/loans/payments/",
  },
  {
    name: "All Loans",
    url: "/loans/",
  },
];
const reports = [
  {
    name: "PAR Report",
    url: "/reports/par-report/",
  },
  {
    name: "Schedules",
    url: "/reports/schedule-report/",
  },
];

const LinkDropDown = ({ title, data }: LinkProps) => {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const navigate = useNavigate();

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
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={() => navigate(`${item.url}`)}
            >
              <Link href={item.url} passHref>
                {item.name}
              </Link>
            </NavLink>
          </div>
        ))}
    </div>
  );
};

const SideBar = () => {
  return (
    <div className="w-full h-full mr-0 m-0 ml-14 bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-lg">
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
