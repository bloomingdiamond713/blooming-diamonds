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
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";

const Shop = () => {
  // filters
  const [products] = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filterLoading, setFilterLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [minimumPrice, setMinimumPrice] = useState(null);
  const [maximumPrice, setMaximumPrice] = useState(null);
  const [priceSortingOrder, setPriceSortingOrder] = useState("all");
  const [size, setSize] = useState("all");
  const [carate, setCarate] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  console.log(category, size, carate);

  // find max and min prices of the products
  useEffect(() => {
    const prices = products?.map((p) => parseFloat(p.price));
    if (prices) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMinimumPrice(parseFloat(minPrice));
      setMaximumPrice(parseFloat(maxPrice));
    }
  }, [products]);

  // filter products by category, price range, price sort, size, carate
  useEffect(() => {
    setFilterLoading(true);
    axios
      .get(
        `http://localhost:5000/products/filter?category=${category}&minPrice=${minimumPrice}&maxPrice=${maximumPrice}&priceOrder=${priceSortingOrder}&size=${size}&carate=${carate}&search=${searchText}`
      )
      .then((res) => {
        setFilteredProducts(res.data);
        setFilterLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setFilterLoading(false);
      });
  }, [
    category,
    minimumPrice,
    maximumPrice,
    priceSortingOrder,
    size,
    carate,
    searchText,
  ]);

  // show filters when category, carate or size changes
  useEffect(() => {
    if (
      category.toLowerCase() !== "all" ||
      carate.toLowerCase() !== "all" ||
      size.toLowerCase() !== "all"
    ) {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }
  }, [category, carate, size]);

  console.log(showFilters);

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 9;

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      right: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // right side filter options
  const { getUniqueProducts } = useFilterProducts();
  const filterCategories = getUniqueProducts("category");
  const filterSizes = getUniqueProducts("size");
  const filterCarates = getUniqueProducts("carate");

  return (
    <div
      style={{ fontFamily: "var(--poppins)" }}
      className="md:w-[95%] mx-auto my-1"
    >
      <div className="text-sm breadcrumbs text-gray-500">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
        </ul>
      </div>

      <div className="shop-container mt-7">
        {/* left side - filters */}
        <div className="space-y-8 pb-10">
          <div>
            <h3>Category</h3>
            <div className="space-y-2 mt-5">
              {filterCategories?.map((category) => (
                <div
                  key={Object.keys(category)[0]}
                  className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold"
                  onClick={() => setCategory(`${Object.keys(category)[0]}`)}
                >
                  <h5 className="text-gray-700">{Object.keys(category)[0]}</h5>
                  <span className="text-xs">
                    {category[Object.keys(category)[0]]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Price</h3>
            <input
              type="range"
              min={499}
              max={maximumPrice}
              defaultValue={"0"}
              className="range mt-5"
              onChange={(e) => {
                setMinimumPrice(e.target.value);
              }}
            />
            <div className="flex justify-between items-center px-1 ">
              <p className="text-sm">Min: {minimumPrice}$</p>
              <p className="text-sm">Max: {maximumPrice}$</p>
            </div>
          </div>

          <div>
            <h3>Size</h3>
            <div className="space-y-2 mt-5">
              {filterSizes?.map((size) => (
                <div
                  key={Object.keys(size)[0]}
                  className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-black hover:font-semibold"
                  onClick={() => setSize(Object.keys(size)[0])}
                >
                  <h5 className="text-gray-700">{Object.keys(size)[0]}</h5>
                  <span className="text-xs">{size[Object.keys(size)[0]]}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Carate</h3>
            <div className="space-y-2 mt-5">
              {filterCarates?.map((carate) => (
                <div
                  key={Object.keys(carate)[0]}
                  className="flex items-center gap-3 cursor-pointer hover:text-black hover:font-semibold"
                  onClick={() => setCarate(Object.keys(carate)[0])}
                >
                  <h5 className="text-gray-700">
                    {Object.keys(carate)[0].toLowerCase() === "all"
                      ? "All"
                      : `${Object.keys(carate)[0].toString()}K`}
                  </h5>
                  <span className="text-xs text-gray-500">
                    {carate[Object.keys(carate)[0]]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* right side - products */}
        <div className="">
          <div className="flex justify-between items-center px-4">
            <div className="relative w-[30%] border">
              <FiSearch className="absolute top-4 right-3 text-xl" />
              <input
                type="text"
                placeholder="Search..."
                className="border border-black outline-none pl-3 py-3 text-lg w-full"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="w-[30%] border-2">
              <select
                className="select select-bordered w-full h-[55px] rounded-none border-black"
                onChange={(e) => setPriceSortingOrder(e.target.value)}
              >
                <option defaultValue={"all"} value={"all"}>
                  All Price
                </option>
                <option value={"asc"}>Low to High</option>
                <option value={"desc"}>High to Low</option>
              </select>
            </div>
          </div>

          {/* display filters */}
          {showFilters && (
            <div className="mt-4 px-4 py-3 flex items-center gap-6 flex-wrap">
              <button
                className="text-error flex items-baseline gap-2 hover:text-gray-400"
                onClick={() => {
                  setCategory("all");
                  setCarate("all");
                  setSize("all");
                }}
              >
                <TfiClose className="text-sm" /> Clear Filters
              </button>

              {category.toLowerCase() !== "all" && (
                <button
                  className="flex items-baseline gap-2 hover:text-gray-400"
                  onClick={() => setCategory("all")}
                >
                  <TfiClose className="text-sm" /> {category}
                </button>
              )}

              {size.toLowerCase() !== "all" && (
                <button
                  className="flex items-baseline gap-2 hover:text-gray-400"
                  onClick={() => setSize("all")}
                >
                  <TfiClose className="text-sm" /> {size}
                </button>
              )}

              {carate.toLowerCase() !== "all" && (
                <button
                  className="flex items-baseline gap-2 hover:text-gray-400"
                  onClick={() => setCarate("all")}
                >
                  <TfiClose className="text-sm" /> {carate}K
                </button>
              )}
            </div>
          )}

          {/* products */}
          {filterLoading ? (
            <div className="grid grid-cols-3 gap-y-20 mt-8">
              {/* iterate empty array of length 9 */}
              {[...Array(9)].map((item, idx) => (
                <CardSkeleton key={idx} height={"340px"} width={"330px"} />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts?.length ? (
                <div className="grid grid-cols-3 gap-y-20 mt-8">
                  {filteredProducts
                    ?.slice(
                      (currentPage - 1) * pageProductLimit,
                      currentPage * pageProductLimit
                    )
                    .map((product) => (
                      <ProductCard key={product._id} cardData={product} />
                    ))}
                </div>
              ) : (
                <h4 className="text-center text-red-500 text-xl font-medium mt-8">
                  No item matched {searchText}
                </h4>
              )}
            </>
          )}

          <div className="mx-auto mb-40">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={pageProductLimit}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              totalItems={filteredProducts?.length}
              pageNeighbours={2}
              withProgressBar={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
