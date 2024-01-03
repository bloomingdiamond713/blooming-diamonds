import React from "react";
import "./Home.css";
import Hero from "./Hero/Hero";
import MarqueeSection from "./MarqueeSection/MarqueeSection";

const Home = () => {
  return (
    <div id="home">
      <Hero />
      <MarqueeSection />
    </div>
  );
};

export default Home;
