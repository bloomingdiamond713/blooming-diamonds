import React, { useEffect, useState } from "react";
import "./Footer.css";
import logo from "../../assets/Bloomingdiamondlogo.png";
import { IoHomeOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div
      className={`bg-[#133831] px-12 pt-16 pb-4 ${
        location?.pathname?.includes("admin") ? "hidden" : "block"
      }`}
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="footer flex flex-col md:flex-row items-start justify-between gap-4 py-10 space-y-10 md:space-y-0">
        <div className="md:w-[31%]">
          <img src={logo} alt="logo" className="w-1/2 mb-4" />
          <p className="text-[#E6DFCD]">
            Find your perfect imperfection, handcrafted with love only from UB
            Jewellery
          </p>
          <img
            src="https://ascella.qodeinteractive.com/wp-content/uploads/2023/03/footer-logo-clients-img-x2.png"
            className="w-[60%] block mt-8 payment-icons"
          />
        </div>

        <div className="md:w-[23%]">
          <h4 className="text-[#E6DFCD]">Contact Us</h4>
          <div className="mt-4 flex items-start gap-4 text-[#E6DFCD]">
            <IoHomeOutline className="text-lg" />
            <p>Door No-CC 62/1276, St. George Church Building, Church Landing Cross Road, Kochi - 682 016.</p>
          </div>
          <div className="mt-2 flex items-start gap-4 text-[#E6DFCD]">
            <IoMailOutline className="text-lg" />
            <p></p>
          </div>
          <div className="mt-2 flex items-start gap-4 text-[#E6DFCD]">
            <IoCallOutline className="text-lg" />
            <p>+91 80757 36391</p>
          </div>
        </div>

        <div className="md:w-[23%]">
          <h4 className="text-[#E6DFCD]">All Departments</h4>
          {Array.isArray(categories) && categories.map((category) => (
            <Link key={category._id} to="#" className="mt-4 text-[#E6DFCD]">
              {category.categoryName}
            </Link>
          ))}
        </div>

        <div className="md:w-[23%]">
          <h4 className="text-[#E6DFCD]">Follow Us</h4>
          <div className="flex items-center justify-between mt-8 gap-5">
            <div className="text-lg text-[#133831] bg-[#E6DFCD] p-3 rounded-full">
            <FaFacebookF />
          </div>
          <div className="text-lg text-[#133831] bg-[#E6DFCD] p-3 rounded-full">
            <FaYoutube />
          </div>
          <div className="text-lg text-[#133831] bg-[#E6DFCD] p-3 rounded-full">
            <FaInstagram />
          </div>
          <div className="text-lg text-[#133831] bg-[#E6DFCD] p-3 rounded-full">
            <FaLinkedin />
          </div>
          <div className="text-lg text-[#133831] bg-[#E6DFCD] p-3 rounded-full">
            <FaPinterest />
          </div>
        </div>
</div>

      </div>
      <div className="divider"></div>

      <div >
        <p className="text-sm font-medium text-gray-500 text-center">
          Copyright &copy; Blooming Diamonds 2025. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
