import React, { useEffect, useState } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import useFilterProducts from "../../../hooks/useFilterProducts";
import { FiSearch } from "react-icons/fi";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Pagination } from "react-pagination-bar";
import useProducts from "../../../hooks/useProducts";
import axios from "axios";
import { TfiClose } from "react-icons/tfi";
import { RiEqualizerLine } from "react-icons/ri";
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CustomHelmet from "../../../components/CustomHelmet/CustomHelmet";
import Pace from "pace-js";

const Shop = () => {
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // filters
  const location = useLocation();
  const [products] = useProducts();

  // Initialize state with safe defaults
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [category, setCategory] = useState(location.state?.category || "All");
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(0);
  const [priceSortingOrder, setPriceSortingOrder] = useState("all");
  const [size, setSize] = useState("all");
  const [carate, setCarate] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 9;

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Find max and min prices from the initial products load
  useEffect(() => {
    const prices = products?.map((p) => parseFloat(p.price));
    if (prices && prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMinimumPrice(parseFloat(minPrice));
      setMaximumPrice(parseFloat(maxPrice));
    }
  }, [products]);

  // Main effect for filtering products
  useEffect(() => {
    setFilterLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/products/filter?category=${category}&minPrice=${minimumPrice}&maxPrice=${maximumPrice}&priceOrder=${priceSortingOrder}&size=${size}&carate=${carate}&search=${searchText}`;

    axios
      .get(apiUrl)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFilteredProducts(res.data);
        } else {
          console.error("Filter API did not return an array:", res.data);
          setFilteredProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
        setFilteredProducts([]);
      })
      .finally(() => {
        setFilterLoading(false);
        if (location.state) {
          location.state = {};
        }
      });
  }, [category, minimumPrice, maximumPrice, priceSortingOrder, size, carate, searchText, location]);

  // Show or hide the "Clear Filters" section
  useEffect(() => {
    const shouldShow =
      category.toLowerCase() !== "all" ||
      carate.toLowerCase() !== "all" ||
      size.toLowerCase() !== "all";
    setShowFilters(shouldShow);
  }, [category, carate, size]);

  // Prepare filter options for the sidebar
  const { getUniqueProducts } = useFilterProducts();
  const filterCategories = getUniqueProducts("category");
  const filterSizes = getUniqueProducts("size");
  const filterCarates = getUniqueProducts("carate");
  const [allFilteredCategories, setAllFilteredCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch all possible categories from the backend
  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/categories`;
    axios
      .get(apiUrl)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllCategories(res.data);
        } else {
          console.error("Categories API did not return an array:", res.data);
          setAllCategories([]);
        }
      })
      .catch((e) => {
        console.error("Error fetching categories:", e);
        setAllCategories([]);
      });
  }, []);

    // Combine fetched categories with product counts
  useEffect(() => {
    if (filterCategories && Array.isArray(allCategories)) {
      const allValue = filterCategories.find((cat) => cat.All)?.All || 0;

      const resultArray = allCategories.map((category) => {
        const categoryName = category.categoryName;
        const correspondingValue = filterCategories.find(
          (filterCat) => filterCat[categoryName]
        ) || { [categoryName]: 0 };
        return { [categoryName]: correspondingValue[categoryName] };
      });

      resultArray.unshift({ All: allValue });
      setAllFilteredCategories(resultArray);
    }
  }, [allCategories, filterCategories]);

  const handleLinkClicked = () => {
    document.getElementById("shop-page-drawer")?.click();
  };
  
  // Restart the page loader on navigation to the shop
  useEffect(() => {
    if (location.pathname.includes("shop")) {
      Pace.restart();
    }
  }, [location]);

  return (
    <div
      style={{ fontFamily: "var(--poppins)" }}
      className="md:w-[95%] mx-auto my-1"
    >
      <CustomHelmet title={"Shop"} />
      <div className="text-sm breadcrumbs text-gray-500 ml-5 md:ml-0">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </div>

      <div className="shop-container mt-7">
        {/* Left Side Filters (Drawer for Mobile) */}
        <div className="drawer z-[9999] md:hidden">
          <input id="shop-page-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content"></div>
          <div className="drawer-side">
            <ul className="menu w-full min-h-screen bg-base-100 mobile-navbar py-20">
              <div className="absolute top-5 right-5">
                <TfiClose className="text-3xl" onClick={handleLinkClicked} />
              </div>
              <div className="space-y-14 p-4">
                {/* Mobile Filter Options */}
                <div className="w-full border-2">
                  <select
                    className="select select-bordered w-full h-[55px] rounded-none border-black"
                    onChange={(e) => setPriceSortingOrder(e.target.value)}
                  >
                    <option value="all">All Price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>
                {/* Categories */}
                <div>
                  <h3>Category</h3>
                  <div className="space-y-2 mt-5">
                    {allFilteredCategories?.map((cat) => (
                      <div
                        key={Object.keys(cat)[0]}
                        className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold"
                        onClick={() => setCategory(Object.keys(cat)[0])}
                      >
                        <h5>{Object.keys(cat)[0]}</h5>
                        <span className="text-xs">{Object.values(cat)[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div>
                    <h3>Price</h3>
                    <input type="range" min={499} max={maximumPrice} defaultValue="0" className="range mt-5" onChange={(e) => setMinimumPrice(e.target.value)} />
                    <div className="flex justify-between items-center px-1">
                        <p className="text-sm">Min: ${minimumPrice}</p>
                        <p className="text-sm">Max: ${maximumPrice}</p>
                    </div>
                </div>
                {/* Sizes */}
                 <div>
                  <h3>Size</h3>
                  <div className="space-y-2 mt-5">
                    {filterSizes?.map((s) => (
                      <div
                        key={Object.keys(s)[0]}
                        className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold"
                        onClick={() => setSize(Object.keys(s)[0])}
                      >
                        <h5>{Object.keys(s)[0]}</h5>
                        <span className="text-xs">{Object.values(s)[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Carats */}
                <div>
                  <h3>Carate</h3>
                  <div className="space-y-2 mt-5">
                    {filterCarates?.map((cr) => (
                        <div key={Object.keys(cr)[0]} className="flex items-center gap-3 cursor-pointer hover:text-black hover:font-semibold" onClick={() => setCarate(Object.keys(cr)[0])}>
                            <h5>{Object.keys(cr)[0].toLowerCase() === 'all' ? 'All' : `${Object.keys(cr)[0]}K`}</h5>
                            <span className="text-xs text-gray-500">{Object.values(cr)[0]}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>

        {/* Left Side Filters (Static for Desktop) */}
        <div className="space-y-8 pb-10 hidden md:block shop-lg-left-side">
            {/* Categories */}
            <div>
              <h3>Category</h3>
              <div className="space-y-2 mt-5">
                {allFilteredCategories?.map((cat) => (
                  <div key={Object.keys(cat)[0]} className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold" onClick={() => setCategory(Object.keys(cat)[0])}>
                    <h5>{Object.keys(cat)[0]}</h5>
                    <span className="text-xs">{Object.values(cat)[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Price Range */}
            <div>
                <h3>Price</h3>
                <input type="range" min={499} max={maximumPrice} defaultValue="0" className="range mt-5" onChange={(e) => setMinimumPrice(e.target.value)} />
                <div className="flex justify-between items-center px-1">
                    <p className="text-sm">Min: ${minimumPrice}</p>
                    <p className="text-sm">Max: ${maximumPrice}</p>
                </div>
            </div>
            {/* Sizes */}
            <div>
              <h3>Size</h3>
              <div className="space-y-2 mt-5">
                {filterSizes?.map((s) => (
                  <div key={Object.keys(s)[0]} className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold" onClick={() => setSize(Object.keys(s)[0])}>
                    <h5>{Object.keys(s)[0]}</h5>
                    <span className="text-xs">{Object.values(s)[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Carats */}
            <div>
              <h3>Carate</h3>
              <div className="space-y-2 mt-5">
                {filterCarates?.map((cr) => (
                    <div key={Object.keys(cr)[0]} className="flex items-center gap-3 cursor-pointer hover:text-black hover:font-semibold" onClick={() => setCarate(Object.keys(cr)[0])}>
                        <h5>{Object.keys(cr)[0].toLowerCase() === 'all' ? 'All' : `${Object.keys(cr)[0]}K`}</h5>
                        <span className="text-xs text-gray-500">{Object.values(cr)[0]}</span>
                    </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Side - Products Display */}
        <div className="shop-lg-right-side">
          <div className="flex justify-between items-center px-4">
            <div className="relative w-full md:w-[30%] border">
              <FiSearch className="absolute top-4 right-3 text-xl" />
              <input type="text" placeholder="Search..." className="border border-black outline-none pl-3 py-3 text-lg w-full" onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="hidden md:block w-[30%] border-2">
              <select className="select select-bordered w-full h-[55px] rounded-none border-black" onChange={(e) => setPriceSortingOrder(e.target.value)}>
                <option value="all">All Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>

          <label htmlFor="shop-page-drawer" className="btn btn-outline drawer-button md:hidden ml-4 mt-4">
            <RiEqualizerLine />
            <span>Filters</span>
          </label>

          {showFilters && (
            <div className="mt-4 px-4 py-3 flex items-center gap-6 flex-wrap">
              <button className="text-error flex items-baseline gap-2 hover:text-gray-400" onClick={() => { setCategory("all"); setCarate("all"); setSize("all"); }}>
                <TfiClose className="text-sm" /> Clear Filters
              </button>
              {category.toLowerCase() !== "all" && (<button className="flex items-baseline gap-2 hover:text-gray-400" onClick={() => setCategory("all")}><TfiClose className="text-sm" /> {category}</button>)}
              {size.toLowerCase() !== "all" && (<button className="flex items-baseline gap-2 hover:text-gray-400" onClick={() => setSize("all")}><TfiClose className="text-sm" /> {size}</button>)}
              {carate.toLowerCase() !== "all" && (<button className="flex items-baseline gap-2 hover:text-gray-400" onClick={() => setCarate("all")}><TfiClose className="text-sm" /> {carate}K</button>)}
            </div>
          )}

          {/* Products Grid */}
          {filterLoading ? (
            <div className="w-[90%] md:w-full grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-20 mt-8 mx-auto">
              {[...Array(9)].map((_, idx) => (
                <CardSkeleton key={idx} height={isMobile ? "220px" : "340px"} width="100%" />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-20 mt-8">
                  {filteredProducts
                    .slice((currentPage - 1) * pageProductLimit, currentPage * pageProductLimit)
                    .map((product) => (
                      <ProductCard key={product._id} cardData={product} />
                    ))}
                </div>
              ) : (
                <h4 className="text-center text-red-500 text-xl font-medium mt-8 col-span-full">
                  No products found matching your criteria.
                </h4>
              )}
            </>
          )}

          {/* Pagination */}
          <div className="shop-pagination mx-auto mb-40">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={pageProductLimit}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              totalItems={filteredProducts?.length || 0}
              pageNeighbours={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
