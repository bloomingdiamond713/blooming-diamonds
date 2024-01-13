import React, { useEffect, useState } from "react";
import "./ProductReviews.css";
import { useParams } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import useDynamicRating from "../../../hooks/useDynamicRating";
import StarRatings from "react-star-ratings";
import { FaRegThumbsUp } from "react-icons/fa";

const ProductReviews = () => {
  const { id } = useParams();
  const [products] = useProducts();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const { averageRating } = useDynamicRating(dynamicProduct?.review);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewsLength, setReviewsLength] = useState(1); // for showing limited reviews in the page

  // todo: load data from database
  useEffect(() => {
    const filter = products?.find((item) => item.id == id); // find product by id
    setDynamicProduct(filter);
  }, [products, id]);

  // show reviews conditionally
  const handleShowReviews = () => {
    setShowAllReviews(!showAllReviews);
  };
  useEffect(() => {
    if (!showAllReviews) {
      setReviewsLength(1);
    } else {
      setReviewsLength(dynamicProduct?.review?.length);
    }
  }, [showAllReviews, dynamicProduct?.review?.length]);

  return (
    <div className="mt-7 mb-32 px-3" id="productReviews">
      <div className="border-2 rounded-xl border-[var(--pink-gold)] flex flex-col items-center p-8 w-[40%] space-y-5 mx-auto">
        <h1 className="text-6xl font-extrabold text-black">{averageRating}</h1>
        <StarRatings
          rating={averageRating}
          starDimension="28px"
          starSpacing="4px"
          starRatedColor="#d4647c"
          starEmptyColor="#c7c7c7"
          svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
          svgIconViewBox="0 0 24 24"
        />
        <p className="text-gray-600 text-lg">Product Rating</p>
      </div>

      {dynamicProduct?.review?.length && (
        <div>
          <h4
            className="text-2xl font-bold mb-10 mt-16"
            style={{ fontFamily: "var(--poppins)" }}
          >
            CUSTOMERS FEEDBACK
          </h4>

          <div className=" pl-10 pr-20 product-reviews-con">
            {dynamicProduct?.review?.slice(0, reviewsLength).map((r) => (
              <div key={r.desc} className="flex items-start gap-4 ">
                <div className="w-[5%]">
                  <img
                    src={r.reviewerImg}
                    alt={r.reviewerName}
                    className=" rounded-full"
                  />
                </div>

                <div className="w-[95%]">
                  <div className="flex items-center gap-4">
                    <h5 className="text-xl text-black font-semibold">
                      {r.reviewerName}
                    </h5>
                    <p className="text-sm text-gray-600">{r.reviewDate}</p>
                  </div>
                  <StarRatings
                    rating={r.rating}
                    starDimension="16px"
                    starSpacing="3px"
                    starRatedColor="#d4647c"
                    starEmptyColor="#c7c7c7"
                    svgIconPath="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7c0.1,0.1,0.3,0.1,0.5,0.1v0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1"
                    svgIconViewBox="0 0 24 24"
                  />

                  <div className="mt-4 space-y-2">
                    <h5 className="text-lg text-black">{r.title}</h5>
                    <p className="text-gray-600">{r.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-2 mt-5 text-gray-700 cursor-pointer">
                    <FaRegThumbsUp />
                    <span>Like</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleShowReviews}
            className={`mx-auto block border-b-2 border-b-black ${
              dynamicProduct?.review?.length === 1 && "hidden"
            }`}
          >
            {showAllReviews ? "Show Less" : "View All Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
