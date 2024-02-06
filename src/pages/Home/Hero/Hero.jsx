import React from "react";
import "./Hero.css";
import Slider from "react-slick";
import img1 from "../../../assets/carousel 1.jpg";
import img2 from "../../../assets/carousel 2.jpg";
import img3 from "../../../assets/carousel 3.jpg";
import img4 from "../../../assets/carousel 4.jpg";
import img5 from "../../../assets/carousel 5.jpg";
import img1small from "../../../assets/carousel 1 small.jpg";
import img2small from "../../../assets/carousel 2 small.jpg";
import img3small from "../../../assets/carousel 3 small.jpg";
import img4small from "../../../assets/carousel 4 small.jpg";
import img5small from "../../../assets/carousel 5 small.jpg";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isPortrait = useMediaQuery({ orientation: "portrait" });

  const settings = {
    arrows: false,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "ease",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div id="hero" className="">
      <Slider {...settings}>
        <div className="hero-slide">
          <img src={isMobile && isPortrait ? img1small : img1} alt="Slide 1" />
          <div className="hero-text">
            <h1 className="">Romance</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={isMobile && isPortrait ? img2small : img2} alt="Slide 2" />
          <div className="hero-text">
            <h1 className="">Charms</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={isMobile && isPortrait ? img3small : img3} alt="Slide 3" />
          <div className="hero-text">
            <h1 className="">Pearls</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={isMobile && isPortrait ? img4small : img4} alt="Slide 4" />
          <div className="hero-text">
            <h1 className="">Richstones</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={isMobile && isPortrait ? img5small : img5} alt="Slide 4" />
          <div className="hero-text">
            <h1 className="">Diamonds</h1>
            <Link to={"/shop"}>
              <button>SHOP NOW</button>
            </Link>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Hero;
