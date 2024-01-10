import React, { useEffect, useState } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import useFilterProducts from "../../../hooks/useFilterProducts";
import { FiSearch } from "react-icons/fi";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Pagination } from "react-pagination-bar";

const Shop = () => {
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

  // filter products
  const { getUniqueProducts, allProducts } = useFilterProducts();
  const filterCategories = getUniqueProducts("category");
  const filterSizes = getUniqueProducts("size");
  const filterCarates = getUniqueProducts("carate");
  console.log(filterSizes);

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
                  className="flex items-center gap-3 text-gray-500"
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
              <FiSearch className="absolute top-4 left-2 text-xl" />
              <input
                type="text"
                name=""
                id=""
                placeholder="Search..."
                className="border border-black outline-none ps-9 pe-2 py-3 text-lg w-full"
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
          <div className="grid grid-cols-3 gap-y-20">
            {allProducts
              ?.slice(
                (currentPage - 1) * pageProductLimit,
                currentPage * pageProductLimit
              )
              .map((product) => (
                <ProductCard key={product.id} cardData={product} />
              ))}
          </div>
          <div className="mx-auto">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={pageProductLimit}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              totalItems={allProducts?.length}
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
