import React, { useEffect, useState } from "react";
import "./FlashSale.css";
import flashSaleIcon from "../../../assets/flash sale products images/flashSale.jpg";
import axios from "axios";
import useCountdownTimer from "../../../hooks/useCountDownTimer";
import ProductCard from "../../../components/ProductCard/ProductCard";

const FlashSale = () => {
  // TODO: LOAD DATA FROM DATABASE
  const [flashSaleData, setFlashSaleData] = useState([]);
  useEffect(() => {
    axios.get("/flashSale.json").then((res) => setFlashSaleData(res.data));
  }, []);

  // countdown timer values
  const { days, hours, minutes, seconds } = useCountdownTimer(
    new Date(2024, 0, 10, 12, 0, 0, 0)
  );

  return (
    <div className="mt-32 mb-24 container shadow-xl shadow-gray-300 rounded-xl">
      <div
        className="w-[30%] border text-center px-6 py-10"
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

        <div className="flex justify-between items-center mt-8">
          <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
            <h4 className="text-3xl text-[#f8d340] font-bold">{days}</h4>
            <p className="text-sm">Days</p>
          </div>
          <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
            <h4 className="text-3xl text-[#f8d340] font-bold">{hours}</h4>
            <p className="text-sm">Days</p>
          </div>
          <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
            <h4 className="text-3xl text-[#f8d340] font-bold">{minutes}</h4>
            <p className="text-sm">Minutes</p>
          </div>
          <div className="rounded-lg w-[23%] bg-[#f7f7f7] text-center py-2">
            <h4 className="text-3xl text-[#f8d340] font-bold">{seconds}</h4>
            <p className="text-sm">Seconds</p>
          </div>
        </div>
      </div>

      <div className="w-[75%] border">
        {/* TODO: use _id as the key in the ProductCard */}
        {flashSaleData.map((cardData) => (
          <ProductCard key={cardData.img} cardData={cardData} />
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
