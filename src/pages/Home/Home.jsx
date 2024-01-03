import React from "react";
import "./Home.css";
import Hero from "./Hero/Hero";
import MarqueeSection from "./MarqueeSection/MarqueeSection";
import Categories from "./Categories/Categories";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import FlashSale from "./FlashSale/FlashSale";

const Home = () => {
  return (
    <div id="home">
      <CustomHelmet title={"Home"} />
      <Hero />
      <MarqueeSection />
      <Categories />
      <FlashSale />
    </div>
  );
};

export default Home;
