import React from "react";
import "./Instagram.css";
import insta1 from "../../../assets/instagram/instagram1-1.png";
import insta2 from "../../../assets/instagram/instagram2-1.png";
import insta3 from "../../../assets/instagram/instagram3-2-194x300.png";
import insta4 from "../../../assets/instagram/instagram4-2.png";
import insta5 from "../../../assets/instagram/instagram5-2.png";
import { FaInstagram } from "react-icons/fa6";

const Instagram = () => {
  const instaImgs = [insta1, insta2, insta3, insta4, insta5];
  return (
    <section id="connect" className="container pt-14 mb-24">
      <div className="flex items-end justify-between">
        <h3
          style={{ fontFamily: "var(--italiana)" }}
          className="text-4xl text-black font-bold tracking-wider"
        >
          Follow Us On Instagram
        </h3>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "var(--poppins)" }}
          className="text-lg underline"
        >
          <h5>OUR INSTAGRAM</h5>
        </a>
      </div>

      <div className="grid grid-cols-5 gap-x-5 mt-8">
        {instaImgs.map((img) => (
          <div
            key={img}
            className="relative insta-img-con overflow-hidden rounded-xl"
          >
            <img src={img} alt="" className="w-full h-full rounded-xl" />
            <div className="insta-img-overlay w-full h-full bg-[#00000066] absolute top-0 left-0 right-0 rounded-xl flex justify-center items-center cursor-pointer opacity-0 hover:opacity-100 transition-all duration-500 ease-in-out">
              <FaInstagram className="text-4xl text-white font-bold" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Instagram;
