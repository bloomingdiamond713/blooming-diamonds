import React from "react";
import "./OtherFeatures.css";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiRefund2Line } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const OtherFeatures = () => {
  return (
    <div
      className="bg-[var(--pink-gold)] grid grid-cols-4 gap-x-3 px-16 py-8 mt-32 rounded-t-3xl"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="flex items-center gap-6 border-r-2 border-black">
        <LiaShippingFastSolid className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Free Shipping</h4>
          <p className="text-gray-600">
            Free Shipping worldwide for orders over $130
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 border-r-2 border-black">
        <RiRefund2Line className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Money Guarentee</h4>
          <p className="text-gray-600">
            Replacement within 30 days without any questions
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 border-r-2 border-black">
        <MdOutlinePayment className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">
            Flexible Payment
          </h4>
          <p className="text-gray-600">
            Pay with multiple credit cards without any problems
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <BiSupport className="text-6xl" />
        <div>
          <h4 className="text-xl font-bold mb-2 text-black">Online Support</h4>
          <p className="text-gray-600">
            24 hours a day, 7 days a week continuous support
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherFeatures;
