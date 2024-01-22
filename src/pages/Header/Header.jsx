import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "/logo1light.svg";
import {
  FiPhone,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa6";
import { TfiClose } from "react-icons/tfi";
import Textra from "react-textra";
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import RightSideDrawer from "../../components/RightSideDrawer/RightSideDrawer";
import useAuthContext from "../../hooks/useAuthContext";
import placeholderUserImg from "../../assets/placeholder-user.png";
import toast from "react-hot-toast";
import ProductCard from "../../components/ProductCard/ProductCard";
import Slider from "react-slick";
import useSearchedProducts from "../../hooks/useSearchedProducts";
import axios from "axios";
import useCart from "../../hooks/useCart";

const Header = () => {
  const { user, isAuthLoading, logOut } = useAuthContext();
  const [stickyNav, setStickyNav] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedProducts, isSearchLoading] = useSearchedProducts(searchText);
  const location = useLocation();
  const [navNotifications, setNavNotifications] = useState([]);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const { cartData } = useCart();

  // fetch or update upper nav notifications
  useEffect(() => {
    // un-comment to add new notification(reminder: notification array is in backend)
    // axios.post("http://localhost:5000/nav-notifications", {}).then((res) => {
    //   console.log(res.data);
    // });

    // fetching notifications
    axios
      .get("http://localhost:5000/nav-notifications")
      .then((res) => setNavNotifications(res.data))
      .catch((error) => console.error(error));
  }, []);

  // to close drawer(on mobile devices) upon link click
  const handleLinkClicked = () => {
    document.getElementById("my-drawer-3").click();
  };

  // change nav-style on scroll
  const changeNavStyle = () => {
    if (window.scrollY > 70) {
      setStickyNav("sticky-nav");

      if (
        document.getElementById("not-sticky-nav")?.getAttribute("open") === ""
      ) {
        document.getElementById("not-sticky-nav")?.removeAttribute("open");
        document.getElementById("sticky-nav")?.setAttribute("open", "");
      }
    } else {
      setStickyNav("");

      if (document.getElementById("sticky-nav")?.getAttribute("open") === "") {
        document.getElementById("sticky-nav")?.removeAttribute("open");
        document.getElementById("not-sticky-nav")?.setAttribute("open", "");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavStyle);
    return () => {
      window.removeEventListener("scroll", changeNavStyle);
    };
  }, []);

  // handle search bar
  const [searchBar, setSearchBar] = useState("closed");
  const handleSearchIcon = () => {
    setSearchBar("open");
  };
  useEffect(() => {
    setSearchBar("closed");
  }, [location]);

  // react hashlink router scroll with offest
  const scrollWithOffset = (el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.pageYOffset - 85,
      behavior: "smooth",
    });

  // sign out method
  const handleSignOut = () => {
    logOut()
      .then(() => {
        toast.success("Logout Successful");
      })
      .catch((error) => toast.error(error?.code));
  };

  // slick slider settings for search items
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    adaptiveHeight: true,
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
            data={navNotifications.map((n) => n.notification)}
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
          } transition-all duration-300 ease-in-out pt-2 pb-10`}
        >
          {/* close button */}
          <button
            onClick={() => setSearchBar("closed")}
            className="flex justify-end text-3xl w-full pr-6"
          >
            <TfiClose className="hover:fill-red-400" />
          </button>

          {/* search bar */}
          <div className="w-[80%] mx-auto space-y-5">
            <h5 className="text-sm uppercase font-[500]">
              what are you looking for?
            </h5>

            <div className="header-search-bar relative">
              <FiSearch className="text-3xl absolute -top-1 right-0" />
              <input
                type="text"
                id="search-input-field"
                placeholder="Search"
                onBlur={(e) => setSearchText(e.target.value)}
                onKeyDownCapture={(e) =>
                  e.key === "Enter" && setSearchText(e.target.value)
                }
              />
            </div>
          </div>

          {/* searched products */}
          <div className="mt-5 container searched-products">
            {searchText && (
              <>
                {isSearchLoading ? (
                  <div>
                    <span className="loading loading-spinner loading-lg block mx-auto"></span>
                  </div>
                ) : (
                  <>
                    {searchedProducts?.length ? (
                      <Slider {...settings}>
                        {searchedProducts?.map((product) => (
                          <ProductCard
                            key={product._id}
                            cardData={product}
                            flashSale={true}
                          />
                        ))}
                      </Slider>
                    ) : (
                      <>
                        {searchText !== "" && (
                          <h4 className="text-center text-red-500 text-lg font-medium">
                            No item matched &quot;{searchText}&quot;
                          </h4>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={`h-screen fixed top-0 left-0 right-0 bg-[rgba(0,0,0,.6)] z-[1004] ${
            searchBar === "open" ? "opacity-1 visible" : "opacity-0 invisible"
          } transition-all duration-200 ease-in-out cursor-pointer`}
          onClick={() => setSearchBar("closed")}
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
                  <Link to="/">
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
                    <HashLink
                      to="/#hero"
                      smooth
                      scroll={(el) => scrollWithOffset(el)}
                    >
                      Home
                    </HashLink>
                    <HashLink
                      to="/#categories"
                      smooth
                      scroll={(el) => scrollWithOffset(el)}
                    >
                      Categories
                    </HashLink>
                    <div className="flex items-baseline gap-1">
                      <HashLink
                        smooth
                        scroll={(el) => scrollWithOffset(el)}
                        to="/#flashSale"
                      >
                        Sale
                      </HashLink>
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
                    <HashLink
                      to="/#products"
                      smooth
                      scroll={(el) => scrollWithOffset(el)}
                    >
                      Products
                    </HashLink>
                    <Link to="/Shop">Shop</Link>

                    <HashLink
                      to="/#reviews"
                      smooth
                      scroll={(el) => scrollWithOffset(el)}
                    >
                      Reviews
                    </HashLink>
                    <HashLink
                      to="/#connect"
                      smooth
                      scroll={(el) => scrollWithOffset(el)}
                    >
                      Connect Us
                    </HashLink>
                  </ul>
                </div>

                <div className="w-[25%] flex justify-end items-center space-x-5 text-center">
                  <FiSearch
                    className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out"
                    onClick={handleSearchIcon}
                  />
                  <Link to="/wishlist">
                    <FiHeart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </Link>

                  {!user && (
                    <Link to="/login">
                      <FiUser className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                    </Link>
                  )}

                  <div
                    className="indicator"
                    onClick={() => setShowRightDrawer(true)}
                  >
                    <span className="indicator-item badge bg-[var(--pink-gold)] text-white border-none font-bold">
                      {user ? cartData?.length : 0}
                    </span>
                    <FiShoppingCart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </div>

                  {isAuthLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      {user ? (
                        <details
                          className="dropdown dropdown-end"
                          id="sticky-nav"
                        >
                          <summary className="btn btn-ghost btn-circle avatar transition-all duration-400 ease">
                            <div className="w-10 rounded-full">
                              <img
                                alt={user.displayName || user.email}
                                src={
                                  user.photoURL
                                    ? user.photoURL
                                    : placeholderUserImg
                                }
                              />
                            </div>
                          </summary>
                          <ul className="mt-2 p-2 shadow-xl menu menu-sm dropdown-content z-[1] bg-base-100 rounded-lg w-60 border border-[var(--pink-gold)]">
                            <div className="hover:bg-white text-left email-con">
                              <p className="text-xs mb-1">Signed in as</p>
                              <Link>{user.email}</Link>
                            </div>

                            <div className="py-2 border-b border-gray-300">
                              <li>
                                <Link to="/dashboard/myDashboard">
                                  Dashboard
                                </Link>
                              </li>
                              <li>
                                <Link to="/dashboard/myOrders">My Orders</Link>
                              </li>
                              <li>
                                <Link to="/dashboard/myAddress">
                                  Address Book
                                </Link>
                              </li>
                              <li>
                                <Link to="/dashboard/addReview">
                                  Add Review
                                </Link>
                              </li>
                            </div>

                            <li>
                              <button onClick={handleSignOut}>Sign Out</button>
                            </li>
                          </ul>
                        </details>
                      ) : (
                        ""
                      )}
                    </>
                  )}
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
                  <Link to="/">
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
                    <HashLink to="/#hero" smooth>
                      Home
                    </HashLink>
                    <HashLink to="/#categories" smooth>
                      Categories
                    </HashLink>
                    <div className="flex items-baseline gap-1">
                      <HashLink smooth to="/#flashSale">
                        Sale
                      </HashLink>
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
                    <HashLink to="/#products" smooth>
                      Products
                    </HashLink>
                    <Link to="/Shop">Shop</Link>

                    <HashLink to="/#reviews" smooth>
                      Reviews
                    </HashLink>
                    <HashLink to="/#connect" smooth>
                      Connect Us
                    </HashLink>
                  </ul>
                </div>

                <div className="w-[20%] flex justify-end items-center space-x-5 text-center">
                  <FiSearch
                    className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out"
                    onClick={handleSearchIcon}
                  />
                  <Link to="/wishlist">
                    <FiHeart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </Link>
                  {!user && (
                    <Link to="/login">
                      <FiUser className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                    </Link>
                  )}
                  <div
                    className="indicator"
                    onClick={() => setShowRightDrawer(true)}
                  >
                    <span className="indicator-item badge bg-[var(--pink-gold)] text-white border-none font-bold">
                      {user ? cartData?.length : 0}
                    </span>
                    <FiShoppingCart className="text-2xl cursor-pointer hover:text-[var(--deep-yellow)] transition-colors duration-150 ease-out" />
                  </div>

                  {isAuthLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      {user && (
                        <details
                          className="dropdown dropdown-end"
                          id="not-sticky-nav"
                        >
                          <summary className="btn btn-ghost btn-circle avatar transition-all duration-400 ease">
                            <div className="w-10 rounded-full">
                              <img
                                alt={user.displayName || user.email}
                                src={
                                  user.photoURL
                                    ? user.photoURL
                                    : placeholderUserImg
                                }
                              />
                            </div>
                          </summary>
                          <ul className="mt-2 p-2 shadow-xl menu menu-sm dropdown-content z-[1] bg-base-100 rounded-lg w-60 border border-[var(--pink-gold)]">
                            <div className="hover:bg-white text-left email-con">
                              <p className="text-xs mb-1">Signed in as</p>
                              <Link>{user.email}</Link>
                            </div>

                            <div className="py-2 border-b border-gray-300">
                              <li>
                                <Link to="/dashboard/myDashboard">
                                  Dashboard
                                </Link>
                              </li>
                              <li>
                                <Link to="/dashboard/myOrders">My Orders</Link>
                              </li>
                              <li>
                                <Link to="/dashboard/myAddress">
                                  Address Book
                                </Link>
                              </li>
                              <li>
                                <Link to="/dashboard/addReview">
                                  Add Review
                                </Link>
                              </li>
                            </div>

                            <li>
                              <button onClick={handleSignOut}>Sign Out</button>
                            </li>
                          </ul>
                        </details>
                      )}
                    </>
                  )}
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
              <HashLink to="/#something" onClick={handleLinkClicked}>
                Something2
              </HashLink>
            </ul>
          </div>
        </div>
      </nav>
      {/* Navigation Bar End */}

      {/* right side drawer */}
      <div
        className={`w-[100%] md:w-[30%] bg-white border fixed top-0 right-0 bottom-0 z-[9999] rounded-tl-2xl rounded-bl-2xl ${
          showRightDrawer ? "transform-x-0" : "translate-x-full"
        } transition-all duration-300 ease-in-out  z-[9999]`}
      >
        <div className="relative ">
          <button
            className="text-2xl absolute top-6 right-5"
            onClick={() => setShowRightDrawer(false)}
          >
            <TfiClose />
          </button>
        </div>
        <RightSideDrawer setShowRightDrawer={setShowRightDrawer} />
      </div>
      <div
        className={`h-screen fixed top-0 left-0 right-0 bg-[rgba(0,0,0,.6)] z-[1004] ${
          showRightDrawer ? "opacity-1 visible" : "opacity-0 invisible"
        } transition-all duration-200 ease-in-out cursor-pointer`}
        onClick={() => setShowRightDrawer(false)}
      ></div>
    </div>
  );
};

export default Header;
