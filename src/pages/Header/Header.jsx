import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "/logo1light.svg";
import { FiPhone, FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa6";
import { TfiClose } from "react-icons/tfi";
import Textra from "react-textra";
import { Link, scrollSpy } from "react-scroll";

const Header = () => {
  const [stickyNav, setStickyNav] = useState("");
  const [navNotifications, setNavNotifications] = useState([
    "Flash Sale Going On Till 5th January!",
    "Discount up to 35% for first purchase only this month.",
    "Free Shipping! First in Town.",
    "Exclusive prices only for the month",
    "Black Friday Coming. Hurry Up!",
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

  // update react-scroll on component render
  useEffect(() => {
    scrollSpy.update();
  }, []);

  // handle search bar
  const [searchBar, setSearchBar] = useState("closed");
  const handleSearchIcon = () => {
    setSearchBar("open");
  };

  return (
    <div className="relative">
      {/* upper navbar */}
      <div
        className="hidden md:flex justify-between items-center container py-3 z-[1000]"
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
          {/* TODO: Create relevant social media accounts for ub-jewellers */}

          <a
            href="https://www.facebook.com/uzzal.bhowmik01"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebookF className="text-xl" />
          </a>
          <a
            href="https://youtu.be/xuuNZQwhEn4?si=iqIPgbobYcA7EhOD"
            target="_blank"
            rel="noreferrer"
          >
            <FaYoutube className="text-xl" />
          </a>
          <a
            href="https://www.instagram.com/reel/C1UC-rjMkAE/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/uzzal-bhowmik-76973319a/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin className="text-xl" />
          </a>
          <a
            href="https://www.pinterest.com/pin/pick-your-fave-video--745134700851924406/"
            target="_blank"
            rel="noreferrer"
          >
            <FaPinterest className="text-xl" />
          </a>
        </div>
      </div>

      {/* Header Search Bar */}

      <div style={{ fontFamily: "var(--montserrat)" }}>
        <div
          className={`w-full min-h-[300px] fixed top-0 left-0 right-0 bg-white z-[1005]  ${
            searchBar === "open" ? "translate-y-0" : "translate-y-[-100%]"
          } transition-all duration-300 ease-in-out px-7 py-10`}
        >
          {/* close button */}
          <button
            onClick={() => setSearchBar("closed")}
            className="flex justify-end text-3xl w-full"
          >
            <TfiClose className="hover:fill-red-400" />
          </button>

          {/* search bar */}
          <div className="w-[90%] mx-auto space-y-10">
            <h5 className="text-sm uppercase font-[500]">
              what are you looking for?
            </h5>

            <div className="header-search-bar relative">
              <FiSearch className="text-3xl absolute -top-1 left-0" />
              <input type="text" id="search-input-field" placeholder="Search" />
            </div>
          </div>
        </div>
        <div
          className={`h-screen fixed top-0 left-0 right-0 bg-[rgba(0,0,0,.6)] z-[1004] ${
            searchBar === "open" ? "opacity-1 visible" : "opacity-0 invisible"
          } transition-all duration-200 ease-in-out`}
        ></div>
      </div>

      {/* Navigation Bar */}
      <nav>
        <div className="drawer">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Sticky Navbar visible on scroll*/}
            <div
              className={`w-full navbar opacity-0 invisible fixed top-0 left-0 bg-white ${stickyNav} shadow-lg`}
            >
              <div className="md:container text-center">
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
                <div className="w-[25%] px-2 text-center">
                  <Link
                    to="hero"
                    offset={-250}
                    smooth={true}
                    spy={true}
                    duration={1000}
                  >
                    <img
                      src={logo}
                      alt="logo"
                      className="w-[170px] h-[90px] cursor-pointer"
                    />
                  </Link>
                </div>
                <div className="w-[50%] hidden lg:block text-center">
                  <ul className="menu menu-horizontal space-x-8">
                    {/* Navbar menu content here */}
                    <Link
                      activeClass="active"
                      to="hero"
                      spy={true}
                      smooth={true}
                      offset={-50}
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
                      offset={-40}
                      duration={1000}
                    >
                      Categories
                    </Link>
                    <div className="flex items-baseline gap-1">
                      <Link
                        activeClass="active"
                        to="flashSale"
                        spy={true}
                        smooth={true}
                        offset={-100}
                        duration={1000}
                      >
                        Sale
                      </Link>
                      <div
                        className="badge badge-warning text-white rounded-md uppercase font-bold"
                        style={{
                          fontFamily: "var(--montserrat)",
                          fontSize: "10px",
                        }}
                      >
                        Hot
                      </div>
                    </div>
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
                      offset={-100}
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

                <div className="w-[25%] hidden lg:flex justify-end items-center space-x-5 text-center">
                  <FiSearch
                    className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out"
                    onClick={handleSearchIcon}
                  />
                  <FiUser className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  <div className="indicator">
                    <span className="indicator-item badge bg-[var(--pink-gold)] text-white border-none font-bold">
                      0
                    </span>
                    <FiShoppingCart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Navbar non sticky */}
            <div className={`w-full navbar bg-white z-[1000]`}>
              <div className="md:container text-center">
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
                <div className="w-[25%] px-2 text-center">
                  <Link
                    to="hero"
                    offset={-250}
                    smooth={true}
                    spy={true}
                    duration={1000}
                  >
                    <img
                      src={logo}
                      alt="logo"
                      className="w-[170px] h-[90px] cursor-pointer"
                    />
                  </Link>
                </div>
                <div className="w-[55%] hidden lg:block text-center">
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
                    <div className="flex items-baseline gap-1">
                      <Link
                        activeClass="active"
                        to="flashSale"
                        spy={true}
                        smooth={true}
                        offset={-100}
                        duration={1000}
                      >
                        Sale
                      </Link>
                      <div
                        className="badge badge-warning text-white rounded-md uppercase font-bold"
                        style={{
                          fontFamily: "var(--montserrat)",
                          fontSize: "10px",
                        }}
                      >
                        Hot
                      </div>
                    </div>
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

                <div className="w-[20%] hidden lg:flex justify-end items-center space-x-5 text-center">
                  <FiSearch
                    className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out"
                    onClick={handleSearchIcon}
                  />
                  <FiUser className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  <div className="indicator">
                    <span className="indicator-item badge bg-[var(--pink-gold)] text-white border-none font-bold">
                      0
                    </span>
                    <FiShoppingCart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="drawer-side z-[1010]">
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
