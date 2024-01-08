import React, { useEffect, useState } from "react";
import "./DynamicProduct";
import axios from "axios";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import useDynamicRating from "../../hooks/useDynamicRating";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaCartShopping, FaRegHeart } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiRefund2Line } from "react-icons/ri";

const DynamicProduct = () => {
  // todo: load data from database
  const id = useParams().id;
  const [dynamicProduct, setDynamicProduct] = useState({});

  useEffect(() => {
    axios.get("/products.json").then((res) => {
      const filteredProduct = res.data.filter(
        (data) => data.id === parseInt(id)
      );
      setDynamicProduct(filteredProduct[0]);
    });
  }, [id]);

  const { name, img, category, price, details, review } = dynamicProduct;

  const { averageRating } = useDynamicRating(review);

  // product order quantity
  const [orderQuantity, setOrderQuantity] = useState(0);

  console.log(name);

  return (
    <div className="my-16">
      <div
        className="container border flex justify-between"
        style={{ fontFamily: "var(--poppins)" }}
      >
        {/* left side div */}
        <div className="border w-[40%]">
          <img src={img} alt={name} className="object-fill border" />
        </div>
        {/* right side div */}
        <div className="border w-[58%]">
          {/* upper part*/}
          <div className="flex items-center gap-4">
            <h4 className="uppercase font-bold bg-[#eebfab] px-6 py-2 text-sm text-black">
              {category}
            </h4>
            <StarRatings
              rating={averageRating}
              starDimension="24px"
              starSpacing="4px"
              starRatedColor="#d4647c"
              starEmptyColor="#c7c7c7"
              svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
              svgIconViewBox="0 0 24 24"
            />
            <p className="text-gray-400 pt-1">({review?.length} reviews)</p>
          </div>
          {/* ---------------------- */}
          {/* middle part*/}
          <div className="mt-6">
            <h1
              className="text-4xl font-bold tracking-wide"
              style={{ fontFamily: "var(--italiana)" }}
            >
              {name}
            </h1>
            <div className="flex items-center mt-8 w-[60%] gap-5">
              <div className="w-[35%]">
                <div className="flex items-center justify-between border border-black mt-2 py-2 px-2">
                  <button
                    disabled={orderQuantity === 0}
                    onClick={() =>
                      orderQuantity > 0 && setOrderQuantity(orderQuantity - 1)
                    }
                  >
                    <FaMinus />
                  </button>
                  <span className="font-bold text-lg">{orderQuantity}</span>
                  <button onClick={() => setOrderQuantity(orderQuantity + 1)}>
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div>
                <h4 className="mt-2 px-2 font-bold text-3xl py-2">$ {price}</h4>
              </div>
            </div>
          </div>
          {/* ---------------------- */}
          {/* buttons part */}
          <div className="flex items-center gap-5 mt-6 w-[60%]">
            <button className="btn rounded-none flex-1 bg-[var(--pink-gold)] font-bold">
              <FaCartShopping />
              <span>ADD TO CART</span>
            </button>
            <button className="btn rounded-none flex-1 font-bold text-white bg-black">
              <FaRegHeart />
              SAVE
            </button>
          </div>

          <div className="border rounded-xl px-7 py-6 space-y-4 mt-12 w-[70%]">
            <div className="flex items-center gap-5">
              <LiaShippingFastSolid className="text-3xl" />
              <div>
                <h4 className="font-bold">FREE SHIPPING</h4>
                <p className="text-gray-500 text-sm">
                  Free shipping available only for the weekend
                </p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex items-center gap-5">
              <RiRefund2Line className="text-3xl" />
              <div>
                <h4 className="font-bold">RETURN DELIVERY</h4>
                <p className="text-gray-500 text-sm">
                  Free 30 days Delivery Return on all products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProduct;
