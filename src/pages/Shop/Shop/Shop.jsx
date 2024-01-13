import React, { useEffect, useState } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import useFilterProducts from "../../../hooks/useFilterProducts";
import { FiSearch } from "react-icons/fi";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Pagination } from "react-pagination-bar";
import useFilterByQuery from "../../../hooks/useSearchedProducts";
import useSearchedProducts from "../../../hooks/useSearchedProducts";
import useProducts from "../../../hooks/useProducts";

const Shop = () => {
  // filters
  const [products, isProductsLoading] = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [searchedProducts, isSearchLoading] = useSearchedProducts(searchText);

  console.log(searchText);
  // set filtered products on search
  useEffect(() => {
    if (searchText !== "") {
      setFilteredProducts(searchedProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [searchedProducts, searchText, products]);

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

  // price range minimum price
  const [minPrice, setMinPrice] = useState(0);

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
                  onClick={() =>
                    setSelectedCategory(`${Object.keys(category)[0]}`)
                  }
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
              min={0}
              max={100}
              defaultValue={"0"}
              className="range mt-5"
              onChange={(e) => {
                setMinPrice(e.target.value);
              }}
            />
            <div className="flex justify-between items-center px-1">
              <p className="text-sm">{minPrice}$</p>
              <p className="text-sm">{100}$</p>
            </div>
          </div>

          <div>
            <h3>Size</h3>
            <div className="space-y-2 mt-5">
              {filterSizes?.map((size) => (
                <div
                  key={Object.keys(size)[0]}
                  className="flex items-center gap-3 text-gray-500"
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
                  className="flex items-center gap-3 "
                >
                  <h5 className="text-gray-700">{Object.keys(carate)[0]}K</h5>
                  <span className="text-xs text-gray-500">
                    {carate[Object.keys(carate)[0]]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* right side - products */}
        <div className="space-y-8">
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
              <select className="select select-bordered w-full h-[55px] rounded-none border-black">
                <option defaultValue={"all"}>All Price</option>
                <option>Low to High</option>
                <option>High to Low</option>
              </select>
            </div>
          </div>

          {/* products */}
          {isProductsLoading || isSearchLoading ? (
            <div>
              <span className="loading loading-spinner loading-lg mx-auto block"></span>
            </div>
          ) : (
            <>
              {filteredProducts?.length ? (
                <div className="grid grid-cols-3 gap-y-20">
                  {filteredProducts
                    ?.slice(
                      (currentPage - 1) * pageProductLimit,
                      currentPage * pageProductLimit
                    )
                    .map((product) => (
                      <ProductCard key={product.id} cardData={product} />
                    ))}
                </div>
              ) : (
                <h4 className="text-center text-red-500 text-xl font-medium">
                  No item matched {searchText}
                </h4>
              )}
            </>
          )}

          <div className="mx-auto">
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
