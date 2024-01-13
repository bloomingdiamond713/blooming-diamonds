import React, { useEffect, useRef, useState } from "react";
import "./FlashSale.css";
import flashSaleIcon from "../../../assets/flash sale products images/flashSale.png";
import ProductCard from "../../../components/ProductCard/ProductCard";
import CountDownTimer from "../../../components/CountDownTimer/CountDownTimer";
import Slider from "react-slick";
import { FaArrowRight } from "react-icons/fa6";
import useProducts from "../../../hooks/useProducts";

const FlashSale = () => {
  // TODO: LOAD DATA FROM DATABASE
  const [products, isProductsLoading] = useProducts();
  const [flashSaleData, setFlashSaleData] = useState([]);
  useEffect(() => {
    const filterFlashProducts = products?.filter((p) => p.flashSale === true);
    setFlashSaleData(filterFlashProducts);
  }, [products]);

  // countdown timer values
  const targetDate = new Date(2024, 0, 10, 12, 0, 0, 0);

  // slick slider settings
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };

  const settings = {
    arrow: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div
      id="flashSale"
      className="mt-32 mb-24 container shadow-xl shadow-gray-300 rounded-xl flex border items-center py-10 gap-8"
    >
      <div
        className="w-[30%] text-center px-6"
        style={{ fontFamily: "var(--montserrat)" }}
      >
        <img
          src={flashSaleIcon}
          alt="flash sale icon"
          className="w-[70%] block mx-auto"
        />
        <h4
          className="mt-6 font-bold text-2xl text-black"
          style={{ fontFamily: "var(--italiana)" }}
        >
          Flash Sale Going On!
        </h4>
        <p className="mt-4 text-gray-500 font-medium">
          🌟 Ready, set, shop! Flash Sale Going On! So Hurry, dive into the
          excitement, and let the savings party begin!💸🚀
        </p>

        <CountDownTimer targetDate={targetDate} />
      </div>

      {isProductsLoading ? (
        <div className="mx-auto">
          <span className="loading loading-spinner loading-lg block mx-auto my-10"></span>
        </div>
      ) : (
        <div className="w-[70%] relative">
          {/* TODO: use _id as the key in the ProductCard */}
          <Slider ref={sliderRef} {...settings}>
            {flashSaleData?.map((cardData, idx) => (
              <ProductCard key={idx + 1} cardData={cardData} flashSale={true} />
            ))}
          </Slider>
          <button
            className="button absolute bottom-1/2 -right-16 translate-x-[-50%] translate-y-[-50%] bg-[#f8da2e] rounded-badge p-5 hover:bg-slate-300 transition-all duration-200"
            onClick={next}
          >
            <FaArrowRight className="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashSale;
