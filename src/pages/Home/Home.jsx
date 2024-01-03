import React from "react";
import "./Home.css";
import Hero from "./Hero/Hero";
import MarqueeSection from "./MarqueeSection/MarqueeSection";
import Categories from "./Categories/Categories";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const Home = () => {
  return (
    <div id="home">
      <CustomHelmet title={"Home"} />
      <Hero />
      <MarqueeSection />
      <Categories />
    </div>
  );
};

export default Home;
