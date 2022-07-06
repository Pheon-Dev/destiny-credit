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
import { IoMdLogOut } from 'react-icons/io';

type IconProps = {
  icon: any;
  text: string;
};

const NavBarIcon = ({ icon, text }: IconProps) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

const Navbar = () => {
  return (
    <div className="fixed p-1 hide-scrollbar top-0 left-0 h-screen w-18 flex flex-col bg-white dark:bg-gray-900 shadow-lg justify-between">
      <div>
        <Link href="/">
          <NavBarIcon icon={<AiOutlineHome size="24" />} text="Home" />
        </Link>
        <Divider />
        <Link href="/loan/create-loan">
          <NavBarIcon icon={<BsPlus size="24" />} text="New Loan" />
        </Link>
        <Link href="/member/create-member">
          <NavBarIcon icon={<BsPersonPlus size="24" />} text="New Member" />
        </Link>
        <Link href="/group/create-group">
          <NavBarIcon
            icon={<AiOutlineUsergroupAdd size="24" />}
            text="New Group"
          />
        </Link>
        <Link href="/loan/new-product">
          <NavBarIcon icon={<BsFilePlus size="24" />} text="New Product" />
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/loan">
          <NavBarIcon icon={<BsFileCheck size="24" />} text="All Loans" />
        </Link>
        <Link href="/report/general-report">
          <NavBarIcon icon={<BsFileBarGraph size="24" />} text="Report" />
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/loan/disbursements">
          <NavBarIcon icon={<GiPayMoney size="24" />} text="Disbursements" />
        </Link>
        <Link href="/loan/payments">
          <NavBarIcon icon={<GiReceiveMoney size="24" />} text="Payments" />
        </Link>
      </div>
      <div>
        <Divider />
        <Link href="/sign-in">
          <NavBarIcon icon={<IoMdLogOut size="24" />} text="Sign Out" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
