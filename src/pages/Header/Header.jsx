import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "/logo1.svg";
import { FiPhone } from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa6";
import Textra from "react-textra";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const [stickyNav, setStickyNav] = useState("");
  const [navNotifications, setNavNotifications] = useState([
    "ub-jewellers",
    "uzzal",
    "All week from 9 am to 5 pm",
    "shuvo",
  ]);

  // to close drawer(on mobile devices) upon link click
  const handleLinkClicked = () => {
    document.getElementById("my-drawer-3").click();
  };

  // change nav-style on scroll
  const changeNavStyle = () => {
    window.scrollY > 2 ? setStickyNav("sticky-nav") : setStickyNav("");
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavStyle);
    return () => {
      window.removeEventListener("scroll", changeNavStyle);
    };
  }, []);

  return (
    <div className="relative">
      {/* upper navbar */}
      <div
        className="hidden md:flex justify-between items-center container py-3"
        style={{ fontFamily: "var(--montserrat)" }}
      >
        <div className="w-[75%] upper-nav-left">
          <div className="flex items-center gap-3 font-semibold">
            <FiPhone className="text-lg" />
            <a href="tel:+8801306734299" className="text-sm">
              (+880) 13067-34299
            </a>
          </div>
          <Textra
            effect="topDown"
            stopDuration={2000}
            data={navNotifications}
            className="text-sm text-black"
          />
        </div>
        <div className="w-[25%] flex justify-end items-center gap-3 upper-nav-right">
          <FaFacebookF className="text-xl" />
          <FaYoutube className="text-xl" />
          <FaInstagram className="text-xl" />
          <FaLinkedin className="text-xl" />
          <FaPinterest className="text-xl" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav>
        <div className="drawer">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Sticky Navbar visible on scroll*/}
            <div
              className={`w-full navbar opacity-0 fixed top-0 left-0 bg-white ${stickyNav}`}
            >
              <div className="md:container">
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="my-drawer-3"
                    aria-label="open sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-6 h-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="flex-1 px-2 mx-2">Navbar Title</div>
                <div className="flex-none hidden lg:block">
                  <ul className="menu menu-horizontal">
                    {/* Navbar menu content here */}
                    <Link
                      activeClass="active"
                      to="something"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Something
                    </Link>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Navbar non sticky */}
            <div className={`w-full navbar bg-white mb-5 z-[1000]`}>
              <div className="md:container">
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="my-drawer-3"
                    aria-label="open sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-6 h-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="flex-none px-2 mx-2">
                  <RouterLink to="/">
                    <img src={logo} alt="logo" className="w-[170px] h-[90px]" />
                  </RouterLink>
                </div>
                <div className="flex-1 hidden lg:block ms-4">
                  <ul className="menu menu-horizontal space-x-8">
                    {/* Navbar menu content here */}
                    <Link
                      activeClass="active"
                      to="hero"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Home
                    </Link>
                    <Link
                      activeClass="active"
                      to="Shop"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Shop
                    </Link>
                    <Link
                      activeClass="active"
                      to="categories"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Categories
                    </Link>
                    <Link
                      activeClass="active"
                      to="products"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Products
                    </Link>
                    <Link
                      activeClass="active"
                      to="reviews"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Reviews
                    </Link>
                    <Link
                      activeClass="active"
                      to="connect"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={1000}
                    >
                      Connect Us
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200">
              {/* Sidebar content here */}
              <Link
                to="something"
                spy={true}
                smooth={true}
                offset={-70}
                duration={1000}
                onClick={handleLinkClicked}
              >
                Something2
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      {/* Navigation Bar End */}
    </div>
  );
};

export default Header;
