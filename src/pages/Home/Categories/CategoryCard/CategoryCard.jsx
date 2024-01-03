import React from "react";

const CategoryCard = ({ category }) => {
  const { categoryName, categoryPic } = category;
  return (
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
  );
};

export default CategoryCard;
