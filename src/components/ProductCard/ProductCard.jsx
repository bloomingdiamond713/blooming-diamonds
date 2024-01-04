import React from "react";
import "./ProductCard.css";
import useDynamicRating from "../../hooks/useDynamicRating";
import StarRatings from "react-star-ratings";

const ProductCard = ({ cardData, flashSale }) => {
  const { name, img, category, price, review } = cardData;

  const { averageRating } = useDynamicRating(review);

  return (
    <div
      className={`${flashSale && "w-[270px]"}`}
      style={{ fontFamily: "var(--poppins)" }}
    >
      <img
        src={img}
        alt={name}
        className={`w-[100%] ${
          flashSale && "h-[280px]"
        } bg-[#f8faf9] rounded-lg`}
      />
      <div>
        <h3 className="text-lg font-bold text-[#3b3b3b] mt-4">{name}</h3>
        <p className="text-gray-600 mt-1 mb-3">{category}</p>
        <h4 className="text-lg font-bold mb-2">${price}</h4>
        <div className="flex items-center gap-4">
          <StarRatings
            rating={averageRating}
            starDimension="20px"
            starSpacing="4px"
            starRatedColor="#da3e3f"
            starEmptyColor="#c7c7c7"
            svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
            svgIconViewBox="0 0 24 24"
          />
          <p className="text-gray-500">
            {review.length && `(${review.length} reviews)`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
