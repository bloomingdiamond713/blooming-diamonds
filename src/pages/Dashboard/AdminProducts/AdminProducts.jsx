import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Pagination } from "react-pagination-bar";
import useSearchedProducts from "../../../hooks/useSearchedProducts";

const AdminProducts = () => {
  const [products, isProductsLoading, refetch] = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState(products || []);
  const [searchText, setSearchText] = useState("");
  const [searchedProducts, isSearchLoading] = useSearchedProducts(searchText);

  useEffect(() => {
    if (searchedProducts.length) {
      setDisplayedProducts(searchedProducts);
    } else {
      setDisplayedProducts(products);
    }
  }, [searchedProducts, products]);

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 10;

  return (
    <div className="px-4">
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminProducts">Manage Products</Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-bold text-3xl"
          style={{ fontFamily: "var(--italiana)" }}
        >
          Products
        </h2>
      </div>

      <div className="p-4 shadow mt-10 border rounded-lg">
        <header className="flex justify-between items-stretch">
          <div className="w-[30%]">
            <input
              type="text"
              name="searchInput"
              placeholder="🔎 Search by product name"
              className="text-sm px-3 h-[50px] w-full border border-black outline-none rounded"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Link to="/dashboard/adminAddProducts" className="w-[15%]">
            <button className="btn btn-neutral text-white border-none rounded w-full">
              Add Product
            </button>
          </Link>
        </header>

        {isProductsLoading || isSearchLoading ? (
          <div className="text-center w-full my-10">
            <span className="loading loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto mt-8 pb-5">
            <table className="table table-zebra border-t">
              {/* head */}
              <thead>
                <tr className="text-black font-bold">
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts
                  ?.slice(
                    (currentPage - 1) * pageProductLimit,
                    currentPage * pageProductLimit
                  )
                  .map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 bg-slate-300">
                              <img src={product.img} alt={product.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        {product.stock > 10 ? (
                          <span className="bg-[#def2d0] text-[#4c7a2d] px-2 rounded">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <>
                            {product.stock > 0 ? (
                              <span className="bg-[#f9f1c8] text-[#6a5c10] px-2 rounded">
                                {product.stock} Low in stock
                              </span>
                            ) : (
                              <span className="bg-[#c15656] text-[#ad2c2c] px-2 rounded">
                                Out of stock
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td>{product.sold}</td>
                      <td>${product.discountPrice || product.price}</td>
                      <td className="space-x-2">
                        <div className="tooltip" data-tip="Edit">
                          <button className="bg-[var(--pink-gold)] text-white rounded-lg w-[32px] h-[32px]">
                            <FiEdit2 className="text-lg block mx-auto" />
                          </button>
                        </div>

                        <div className="tooltip" data-tip="Delete">
                          <button className="bg-red-400 text-white rounded-lg w-[32px] h-[32px]">
                            <FiTrash2 className="text-lg block mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="text-xs mt-3">
              Showing {currentPage > 1 ? currentPage - 1 : currentPage}
              {currentPage > 1 && displayedProducts?.length > 10 && "1"} to{" "}
              {Math.ceil(displayedProducts?.length / 10) === currentPage
                ? displayedProducts?.length % 10 !== 0
                  ? (currentPage - 1) * 10 + (displayedProducts?.length % 10)
                  : currentPage * 10
                : currentPage * 10}{" "}
              of {displayedProducts?.length}
            </p>
            <Pagination
              currentPage={currentPage}
              totalItems={displayedProducts?.length}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              itemsPerPage={pageProductLimit}
              pageNeighbours={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
