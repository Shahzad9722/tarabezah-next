"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="relative flex items-center bg-[#1c1a2e] p-6 pt-11 pb-6 [box-shadow:0px_4px_4px_0px_#00000040]">
      <Navigation />

      {/* Center - Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Image
            src={"/images/logo.svg"}
            height={36.73}
            width={50}
            alt="logo"
          />
        </Link>
      </div>

      {/* Right Side - Help Icon & Dropdown */}
      <div className="ml-auto flex items-center gap-3 hidden">
        <button className="bg-color-121020 text-white py-2.5 px-2.5 rounded-md">
          <Image
            src={"/images/question.svg"}
            height={22}
            width={22}
            alt="help"
          />
        </button>
        <select className="bg-color-121020 text-white p-2 pr-5 rounded-[4px] w-[262px]">
          {/*  <option value="Table 1">Table 1</option>
          <option value="Table 2">Table 2</option> */}
        </select>
      </div>
    </header>
  );
};

export default Header;
