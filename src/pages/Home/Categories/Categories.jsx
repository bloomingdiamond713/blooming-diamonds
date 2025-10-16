import React, { useEffect, useState } from "react";
import "./Categories.css";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import axios from "axios";
import CategoryCard from "./CategoryCard/CategoryCard";
import Slider from "react-slick";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((error) => console.error(error));
  }, []);

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          initialSlide: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="pt-24 mb-16" id="categories">
      <SectionTitle title={"Shop By Categories"} />

      {/* categories */}
      <Slider
        {...settings}
        className="w-full md:px-0 md:w-[85%] md:mx-auto mt-12 h-[300px] items-center"
      >
        {Array.isArray(categories) && categories.map((category, counter) => (
          <CategoryCard
            counter={counter + 1}
            key={category._id}
            category={category}
          />
        ))}
      </Slider>
    </section>
  );
};

export default Categories;
