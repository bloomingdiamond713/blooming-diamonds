import React, { useEffect, useState } from "react";
import "./Categories.css";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import axios from "axios";
import CategoryCard from "./CategoryCard/CategoryCard";
import Slider from "react-slick";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  // TODO: load categories data from database
  useEffect(() => {
    axios.get("/categories.json").then((res) => setCategories(res.data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <section className="pt-24" id="categories">
      <SectionTitle title={"Shop By Categories"} />

      {/* categories */}
      <Slider
        {...settings}
        className="w-[85%] mx-auto mt-12 h-[300px] items-center"
      >
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </Slider>
    </section>
  );
};

export default Categories;
