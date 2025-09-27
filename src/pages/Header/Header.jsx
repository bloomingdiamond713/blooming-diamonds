import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/Bloomingdiamondlogo.png"; // <-- Using the new logo
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";
import { RiMenu2Fill } from "react-icons/ri";
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
import useUserInfo from "../../hooks/useUserInfo";

const Header = () => {
  const { user, isAuthLoading, logOut } = useAuthContext();
  const [stickyNav, setStickyNav] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedProducts, isSearchLoading] = useSearchedProducts(searchText);
  const location = useLocation();
  const [navNotifications, setNavNotifications] = useState([]);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const { cartData } = useCart();
  const [userFromDB, isUserLoading] = useUserInfo();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications with a fallback
  useEffect(() => {
    axios
      .get("https://ub-jewellers-server.onrender.com/nav-notifications")
      .then((res) => {
        if (res.data && res.data.length > 0) {
            setNavNotifications(res.data);
        } else {
            setNavNotifications([{ notification: "Flash Sale Going On Till 5th January!" }]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch notifications, using default.", error);
        setNavNotifications([{ notification: "Flash Sale Going On Till 5th January!" }]);
      });
  }, []);

  // Close mobile drawer on link click
  const handleLinkClicked = () => {
    const drawerCheckbox = document.getElementById("my-drawer-3");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
    setIsOpen(false);
  };

  // Handle sticky navigation on scroll
  const changeNavStyle = () => {
    // This scroll value should be roughly the height of the top two bars
    if (window.scrollY > 140) {
      setStickyNav("sticky-nav");
    } else {
      setStickyNav("");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavStyle);
    return () => window.removeEventListener("scroll", changeNavStyle);
  }, []);
  
  // Handle search bar overlay
  const [searchBar, setSearchBar] = useState("closed");
  const handleSearchIcon = () => {
    setSearchBar("open");
  };
  useEffect(() => {
    setSearchBar("closed");
  }, [location]);

  // Handle user sign-out
  const handleSignOut = () => {
    logOut()
      .then(() => toast.success("Logout Successful"))
      .catch((error) => toast.error(error?.code));
  };
  
    // Slick slider settings for search results
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    adaptiveHeight: true,
  };


  useEffect(() => {
    setIsAdmin(userFromDB?.admin || false);
    setIsAdminRoute(userFromDB?.admin && location?.pathname?.includes("admin"));
  }, [userFromDB, location]);

  const adminRoutes = (
    <>
      <li><Link to="/dashboard/adminDashboard">Dashboard</Link></li>
      <li><Link to="/dashboard/adminCategories">Manage Categories</Link></li>
      <li><Link to="/dashboard/adminProducts">Manage Products</Link></li>
      <li><Link to="/dashboard/adminOrders">Manage Orders</Link></li>
      <li><Link to="/dashboard/adminUsers">Manage Users</Link></li>
    </>
  );

  return (
    <div className="header-container">
      {!isAdminRoute && !isUserLoading && (
        <>
          {/* Tier 1: Flash Sale Bar */}
          <div className="flash-sale-bar">
            {navNotifications.length > 0 && (
              <Textra
                effect="topDown"
                stopDuration={2000}
                data={navNotifications.map((n) => n.notification)}
                className="text-sm"
              />
            )}
          </div>
          
          {/* Tier 2: Logo Bar */}
          <div className="logo-bar">
            <Link to="/">
              <img src={logo} alt="Blooming Diamonds Logo" className="logo-img" />
            </Link>
          </div>
          
          {/* Tier 3: Navigation (wrapped in Drawer for mobile) */}
          <div className="drawer">
            <input
              id="my-drawer-3"
              type="checkbox"
              className="drawer-toggle"
              onChange={(e) => setIsOpen(e.target.checked)}
            />
            <div className="drawer-content flex flex-col">
              <nav className={`w-full navbar bg-white z-[1000] ${stickyNav}`}>
                <div className="w-full md:container flex justify-between items-center">
                  {/* Mobile Menu Hamburger */}
                  <div className="flex-none lg:hidden">
                    <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                      <RiMenu2Fill className="text-xl" />
                    </label>
                  </div>
                  
                  {/* Desktop Navigation Links */}
                  <div className="flex-1 hidden lg:flex justify-center">
                       <ul className="menu menu-horizontal space-x-8">
                           <HashLink to="/" smooth>Home</HashLink>
                           <HashLink to="/#categories" smooth>Categories</HashLink>
                           <HashLink to="/#flashSale" smooth>Sale</HashLink>
                           <HashLink to="/#products" smooth>Products</HashLink>
                           <Link to="/shop">Shop</Link>
                           <HashLink to="/#reviews" smooth>Reviews</HashLink>
                           <HashLink to="/#connect" smooth>Connect Us</HashLink>
                       </ul>
                  </div>
                  
                  {/* Utility Icons */}
                  <div className="flex justify-end items-center space-x-4 md:space-x-5 text-center ml-auto">
                    <FiSearch className="text-xl md:text-2xl cursor-pointer" title="Search Products" onClick={handleSearchIcon} />
                    <Link to="/wishlist" title="Wishlist">
                      <FiHeart className="text-xl md:text-2xl cursor-pointer" />
                    </Link>
                    <div className="indicator" onClick={() => setShowRightDrawer(true)} title="Cart">
                      <span className="indicator-item badge badge-sm md:badge-md bg-pink-400 text-white border-none font-bold">
                        {user ? cartData?.length : 0}
                      </span>
                      <FiShoppingCart className="text-xl md:text-2xl cursor-pointer" />
                    </div>
                    {!user && (
                      <Link to="/login" title="Login">
                        <FiUser className="text-xl md:text-2xl cursor-pointer" />
                      </Link>
                    )}
                    {isAuthLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      user && (
                        <details className="dropdown dropdown-end">
                          <summary className="btn btn-ghost btn-circle avatar">
                            <div className="w-9 md:w-10 rounded-full">
                              <img alt={user.displayName || user.email} src={user.photoURL || placeholderUserImg} referrerPolicy="no-referrer" />
                            </div>
                          </summary>
                          <ul className="mt-2 p-2 shadow-xl menu menu-sm dropdown-content z-[1] bg-base-100 rounded-lg w-60 border">
                            <div className="p-2 border-b">
                              <p className="text-xs mb-1">Signed in as</p>
                              <Link to="/dashboard/myDashboard" className="font-bold text-sm break-words">{user.email}</Link>
                            </div>
                            <div className="py-2 border-b">
                              {isAdmin ? adminRoutes : (
                                <>
                                  <li><Link to="/dashboard/myDashboard">Dashboard</Link></li>
                                  <li><Link to="/dashboard/myOrders">My Orders</Link></li>
                                  <li><Link to="/dashboard/myAddress">Address Book</Link></li>
                                  <li><Link to="/dashboard/addReview">Add Review</Link></li>
                                </>
                              )}
                            </div>
                            <li><button onClick={handleSignOut}>Sign Out</button></li>
                          </ul>
                        </details>
                      )
                    )}
                  </div>
                </div>
              </nav>
            </div>
            {/* Mobile Drawer Sidebar */}
            <div className="drawer-side z-[1010]">
              <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu w-full min-h-screen bg-base-100 flex flex-col justify-center items-center space-y-5 relative mobile-navbar">
                <div className={`absolute top-5 right-5 ${isOpen ? "animate-bounce-top" : ""}`}>
                  <TfiClose className="text-3xl" onClick={handleLinkClicked} />
                </div>
                <div className="space-y-8 text-center">
                  <HashLink to="/" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Home</HashLink>
                  <HashLink to="/#categories" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Categories</HashLink>
                  <HashLink to="/#flashsale" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Sale</HashLink>
                  <HashLink to="/#products" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Products</HashLink>
                  <Link to="/shop" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked}>Shop</Link>
                  <HashLink to="/#reviews" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Reviews</HashLink>
                  <HashLink to="/#connect" className={`block ${isOpen ? "animate-slide-left" : ""}`} onClick={handleLinkClicked} smooth>Connect Us</HashLink>
                </div>
              </ul>
            </div>
          </div>

          {/* Search Bar Overlay */}
          <div className={`search-overlay-container ${searchBar === "open" ? "open" : ""}`}>
            <div className="search-content">
               <button onClick={() => setSearchBar("closed")} className="close-search-btn">
                 <TfiClose />
               </button>
               <div className="w-[80%] mx-auto space-y-5">
                 <h5 className="text-sm uppercase font-[500]">what are you looking for?</h5>
                 <div className="header-search-bar relative">
                   <FiSearch className="search-icon" onClick={() => setSearchText(document.getElementById("search-input-field").value)} />
                   {searchText && (
                     <TfiClose className="clear-search-icon" onClick={() => { setSearchText(""); document.getElementById("search-input-field").value = ""; }} />
                   )}
                   <input type="text" id="search-input-field" placeholder="Search" className="pr-10" onKeyDownCapture={(e) => e.key === "Enter" && setSearchText(e.target.value)} />
                 </div>
               </div>
               <div className="mt-5 container searched-products">
                 {/* Search results logic would go here */}
               </div>
            </div>
          </div>
          
          {/* Right Side Cart Drawer */}
          <div className={`right-side-drawer-container ${showRightDrawer ? "open" : ""}`}>
             <div className="drawer-backdrop" onClick={() => setShowRightDrawer(false)}></div>
             <div className="drawer-panel">
                <div className="relative">
                  <button className="text-2xl absolute top-6 right-5" onClick={() => setShowRightDrawer(false)}>
                    <TfiClose />
                  </button>
                </div>
                <RightSideDrawer setShowRightDrawer={setShowRightDrawer} />
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;