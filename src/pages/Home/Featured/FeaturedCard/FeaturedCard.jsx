import React from "react";

const FeaturedCard = ({ product }) => {
  const { img, name, price, discountPrice } = product;
  return (
    <div
      className="h-[90px] flex justify-start items-center gap-3 pr-2 cursor-pointer"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <img
        src={img}
        alt={name}
        className="h-full bg-[#f8f8f8] w-[30%] rounded-md"
      />
      <div className="w-[70%] space-y-2">
        <h5 className="hover:text-[var(--pink-gold)] transition-all duration-200 ease-out">
          {name}
        </h5>
        <div>
          <h5 className="text-slate-600">${price}</h5>
          {discountPrice && (
            <h6 className="line-through text-gray-300">{discountPrice}</h6>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
