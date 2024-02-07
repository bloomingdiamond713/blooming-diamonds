import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category, counter }) => {
  const { categoryName, categoryPic } = category;

  return (
    <Link
      to={`/shop`}
      state={{ category: categoryName }}
      data-aos="fade-up"
      data-aos-delay={`${counter * 180}`}
    >
      <div className="text-center mt-5">
        <img
          src={categoryPic}
          alt={categoryName}
          className="block mx-auto rounded-full w-[90%] h-[220px] hover:scale-105 cursor-pointer transition-all duration-150 ease-out bg-[#f6f6f6]"
        />
        <h1 className="font-[600] mt-4" style={{ fontFamily: "var(--lato)" }}>
          {categoryName}
        </h1>
      </div>
    </Link>
  );
};

export default CategoryCard;
