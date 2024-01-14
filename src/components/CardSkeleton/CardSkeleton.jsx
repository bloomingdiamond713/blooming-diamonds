import React from "react";

const CardSkeleton = ({ height, width }) => {
  return (
    <div className="flex flex-col gap-4 mx-auto" style={{ width: width }}>
      <div className="skeleton w-full" style={{ height: height }}></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
};

export default CardSkeleton;
