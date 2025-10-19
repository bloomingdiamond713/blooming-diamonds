import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Inlined CategoryCard component
const CategoryCard = ({ category }) => {
  const { categoryName, categoryPic } = category;

  return (
    <Link to={`/shop`} state={{ category: categoryName }} className="category-card-link">
      <div className="text-center">
        <img
          src={categoryPic}
          alt={categoryName}
          className="category-card-image"
        />
        <h1 className="font-semibold mt-4 text-gray-800">
          {categoryName}
        </h1>
      </div>
    </Link>
  );
};

// Inlined SectionTitle component
const SectionTitle = ({ title }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mt-2"></div>
    </div>
);


const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // FIX: Replaced import.meta.env with the direct URL to resolve build warnings.
    const apiUrl = `https://blooming-diamonds-bmbn.onrender.com/api/categories`;
    axios
      .get(apiUrl)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  return (
    <>
      <style>{`
        /* Inlined CSS from Categories.css and for the new slider replacement */
        .categories-slider-container {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: 1rem; /* For scrollbar visibility */
          scrollbar-width: thin; /* For Firefox */
        }
        .categories-slider-container::-webkit-scrollbar {
          height: 8px;
        }
        .categories-slider-container::-webkit-scrollbar-thumb {
          background-color: #dbdbdb;
          border-radius: 10px;
        }
        .category-card-link {
          flex: 0 0 20%; /* Shows 5 items by default */
          padding: 0 15px;
          text-decoration: none;
          color: inherit;
        }
        .category-card-image {
            display: block;
            margin: auto;
            border-radius: 50%;
            width: 100%;
            max-width: 220px;
            height: 220px;
            object-fit: cover;
            transition: transform 0.2s ease-out;
            background-color: #f6f6f6;
        }
        .category-card-link:hover .category-card-image {
            transform: scale(1.05);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
            .category-card-link {
                flex: 0 0 25%; /* Shows 4 items */
            }
        }
        @media (max-width: 768px) {
            .category-card-link {
                flex: 0 0 33.33%; /* Shows 3 items */
            }
        }
         @media (max-width: 480px) {
            .category-card-link {
                flex: 0 0 50%; /* Shows 2 items */
            }
        }
      `}</style>
      <section className="pt-24 mb-16" id="categories">
        <SectionTitle title={"Shop By Categories"} />

        {/* FIX: Replaced react-slick Slider with a native horizontally scrolling container.
          This removes the external dependency and resolves the build error.
        */}
        <div className="w-full md:w-[85%] mx-auto mt-12">
            <div className="categories-slider-container">
                {categories.length > 0 ? (
                    categories.map((category, counter) => (
                        <CategoryCard
                            counter={counter + 1}
                            key={category._id}
                            category={category}
                        />
                    ))
                ) : (
                    // Optional: Show skeleton loaders while categories are loading
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="category-card-link">
                           <div className="text-center">
                                <div className="bg-gray-200 rounded-full mx-auto animate-pulse" style={{width: '220px', height: '220px'}}></div>
                                <div className="bg-gray-200 h-6 w-3/4 mx-auto mt-4 rounded animate-pulse"></div>
                           </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </section>
    </>
  );
};

export default Categories;

