import React from "react";
import { Helmet } from "react-helmet-async";

const CustomHelmet = ({ title }) => {
  return (
    <Helmet>
      {/* This ternary operator provides a default title if the 'title' prop is not provided, 
        preventing the app from crashing.
      */}
      <title>
        {title ? `${title} :: Blooming Diamonds` : "Blooming Diamonds"}
      </title>
    </Helmet>
  );
};

export default CustomHelmet;