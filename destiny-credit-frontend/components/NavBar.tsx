import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  BsFileBarGraph,
  BsFileCheck,
  BsFilePlus,
  BsPersonPlus,
  BsPlus,
} from "react-icons/bs";
import { AiOutlineHome, AiOutlineUsergroupAdd } from "react-icons/ai";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { IoMdLogOut } from "react-icons/io";

const Divider = () => <hr className="sidebar-hr" />;

const Navbar = () => {
  return (
    <div className="fixed p-1 hide-scrollbar top-0 left-0 h-screen w-18 flex flex-col bg-white dark:bg-gray-900 shadow-lg justify-between">
      <div>
        <Link href="/">
          <div className="sidebar-icon group">
            <AiOutlineHome size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">Home</span>
          </div>
        </Link>
        <Divider />
        <Link href="/loan/create-loan">
          <div className="sidebar-icon group">
            <BsPlus size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">New Loan</span>
          </div>
        </Link>
        <Link href="/member/create-member">
          <div className="sidebar-icon group">
            <BsPersonPlus size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">New Member</span>
          </div>
        </Link>
        <Link href="/group/create-group">
          <div className="sidebar-icon group">
            <AiOutlineUsergroupAdd size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">New Group</span>
          </div>
        </Link>
        <Link href="/loan/new-product">
          <div className="sidebar-icon group">
            <BsFilePlus size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">New Product</span>
          </div>
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/loan">
          <div className="sidebar-icon group">
            <BsFileCheck size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">All Loans</span>
          </div>
        </Link>
        <Link href="/report/general-report">
          <div className="sidebar-icon group">
            <BsFileBarGraph size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">Report</span>
          </div>
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/loan/disbursements">
          <div className="sidebar-icon group">
            <GiPayMoney size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">Disbursements</span>
          </div>
        </Link>
        <Link href="/loan/payments">
          <div className="sidebar-icon group">
            <GiReceiveMoney size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">Payments</span>
          </div>
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/sign-in">
          <div className="sidebar-icon group">
            <IoMdLogOut size="24" />
            <span className="sidebar-tooltip group-hover:scale-100">Sign Out</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
