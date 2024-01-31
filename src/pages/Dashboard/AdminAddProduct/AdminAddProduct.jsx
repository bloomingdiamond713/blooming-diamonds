import React, { useEffect, useState } from "react";
import "./AdminAddProduct.css";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import uploadIcon from "../../../assets/image-upload.png";
import axios from "axios";
import useAuthContext from "../../../hooks/useAuthContext";
import Select from "react-select";
import Swal from "sweetalert2";

const AdminAddProduct = () => {
  const { user } = useAuthContext();
  const [productError, setProductError] = useState(null);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const productId = location.state?.id;

  // default tag options
  const tagOptions = [
    { value: "hot", label: "Hot Deal" },
    { value: "flashSale", label: "Flash Sale" },
    { value: "newArrival", label: "New Arrival" },
  ];

  // fetch categories
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/categories")
        .then((res) => setCategories(res.data))
        .catch((e) => console.error(e));
    }
  }, [user]);

  // react hook form settings
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Did you make sure all the data provided is correct?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ef4c53",
      confirmButtonText: "Yes, Publish it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const imgFile = data.productImg[0];
        if (imgFile?.size > 2097152) {
          Swal.fire({
            title: "Image Size Exceeded!",
            text: "Your product image size is more than 2MB.",
            icon: "error",
          });
          return;
        }

        // upload product image to imgbb
        const imgHostingUrl = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGHOSTINGKEY
        }`;

        const formData = new FormData();
        formData.append("image", data.productImg[0]);

        const badges = data.selectedBadges?.map((b) => b.value);

        axios
          .post(imgHostingUrl, formData)
          .then((res) => {
            if (res.data.success) {
              axios
                .post("http://localhost:5000/products", {
                  name: data.name,
                  img: res.data.data.display_url,
                  category: data.category,
                  details: {
                    description: data.description,
                    advantages: data.advantages.split(","),
                  },
                  price: parseFloat(data.price),
                  discountPrice: parseFloat(data.discountPrice) || null,
                  discountPercentage: data.discountPrice
                    ? (
                        ((data.price - data.discountPrice) / data.price) *
                        100
                      ).toFixed(2)
                    : null,
                  size: data.size,
                  stock: parseInt(data.stock),
                  carate: parseInt(data.carate),
                  newArrival:
                    badges?.indexOf("newArrival") !== -1 ? true : false,
                  badge: badges?.indexOf("hot") !== -1 ? "HOT" : false,
                  flashSale: badges?.indexOf("flashSale") !== -1 ? true : false,
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => console.error(error));
            }
          })
          .catch((imgHostingError) => console.error(imgHostingError));
      }
    });
  };

  return (
    <div className="px-4">
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminAddProducts">
                {productId ? "Edit Product" : "Add Products"}
              </Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-bold text-3xl"
          style={{ fontFamily: "var(--italiana)" }}
        >
          {productId ? "Edit Product" : "Add New Products"}
        </h2>
      </div>

      <div>
        {/* error notification */}
        {productError && (
          <div
            role="alert"
            className="alert alert-error mb-8 rounded-lg text-white "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              onClick={() => setProductError(null)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error: {productError}</span>
          </div>
        )}

        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="loginRegisterForm my-10 flex items-start justify-between gap-8 relative"
          >
            <div className="md:w-[65%]">
              <div className="shadow rounded-lg border pb-8">
                <h4 className="font-bold text-lg text-black border-b-2 p-4 mb-8">
                  Basic Information
                </h4>

                {/* Product name input */}
                <div className="w-full auth-input-con px-6">
                  <p className="text-gray-600">Product Name *</p>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
                  />
                  {errors.name && (
                    <span className="text-red-500 mt-1 block">
                      Product name is required
                    </span>
                  )}
                </div>

                {/* description input */}
                <div className="w-full mt-8 auth-input-con px-6">
                  <p className="text-gray-600">Description *</p>
                  <textarea
                    name="description"
                    rows="8"
                    className="w-full border-2 border-gray-400 mt-3 p-4"
                    {...register("description", { required: true })}
                    minLength={100}
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 mt-1 block">
                      Product Description is required
                    </span>
                  )}
                </div>

                {/* advantages input */}
                <div className="w-full mt-8 auth-input-con px-6">
                  <p className="text-gray-600">Advantages *</p>
                  <textarea
                    name="advantages"
                    rows="4"
                    className="w-full border-2 border-gray-400 mt-3 p-4"
                    {...register("advantages", { required: true })}
                    placeholder="Separate each advantage with comma(,)"
                    minLength={30}
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 mt-1 block">
                      Product Advantages is required
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-10 shadow rounded-lg border pb-8">
                <h4 className="font-bold text-lg text-black border-b-2 p-4 mb-8">
                  Pricing
                </h4>

                {/* Product price input */}
                <div className="w-full auth-input-con px-6">
                  <p className="text-gray-600">Price *</p>
                  <input
                    type="number"
                    {...register("price", { required: true })}
                    className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
                  />
                  {errors.price && (
                    <span className="text-red-500 mt-1 block">
                      Product price is required
                    </span>
                  )}
                </div>

                {/* Product price input */}
                <div className="mt-8 px-6">
                  <div className="auth-input-con">
                    <p className="text-gray-600">Discount Price</p>
                    <input
                      type="number"
                      {...register("discountPrice")}
                      className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
                      placeholder="if available"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-[35%]">
              <div className="shadow rounded-lg border pb-8">
                <h4 className="font-bold text-lg text-black border-b-2 p-4 mb-8">
                  Upload Image
                </h4>
                <div>
                  <img src={uploadIcon} alt="" className="block mx-auto mb-1" />
                  <p className="text-center text-xs font-light">
                    Image size must not be more than 2Mb
                  </p>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs mt-4 mx-auto block"
                    accept=".jpg, .jpeg, .png"
                    name="productImg"
                    {...register("productImg", { required: true })}
                  />

                  {errors.productImg && (
                    <span className="text-red-500 mt-1 text-center block">
                      Product image is required
                    </span>
                  )}
                </div>
              </div>

              <div className="shadow rounded-lg border pb-8 mt-8">
                <h4 className="font-bold text-lg text-black border-b-2 p-4 mb-8">
                  Product Details
                </h4>

                <div className="w-full px-6">
                  <p className="text-gray-600 mb-4">Category *</p>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Please select an option" }}
                    render={({ field, fieldState }) => (
                      <>
                        <select
                          {...field}
                          className="border border-gray-300 w-full outline-none rounded py-3 px-2 category-container"
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {categories?.map((c) => (
                            <option value={c.categoryName} key={c._id}>
                              {c.categoryName}
                            </option>
                          ))}
                        </select>
                        {fieldState.error && (
                          <p className="text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="w-full auth-input-con px-6 mt-6 badge-container">
                  <p className="text-gray-600 mb-4">Badges</p>
                  <Controller
                    name="selectedBadges"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={tagOptions}
                        placeholder="Select badges..."
                      />
                    )}
                  />
                </div>
              </div>

              <div className="shadow rounded-lg border pb-8 mt-8">
                <h4 className="font-bold text-lg text-black border-b-2 p-4 mb-8">
                  Product Attributes
                </h4>

                <div className="w-full auth-input-con px-6">
                  <p className="text-gray-600">Stock Quantity *</p>
                  <input
                    type="number"
                    {...register("stock", { required: true })}
                    className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
                  />
                  {errors.stock && (
                    <span className="text-red-500 mt-1 block">
                      Product stock is required
                    </span>
                  )}
                </div>

                <div className="w-full px-6 mt-6">
                  <p className="text-gray-600 mb-4">Size *</p>
                  <Controller
                    name="size"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Please select an option" }}
                    render={({ field, fieldState }) => (
                      <>
                        <select
                          {...field}
                          className="border border-gray-300 w-full outline-none rounded py-3 px-2 category-container"
                        >
                          <option value="" disabled>
                            Select the size
                          </option>
                          <option value="Large">Large</option>
                          <option value="Medium">Medium</option>
                          <option value="Small">Small</option>
                          <option value="Extra Small">Extra Small</option>
                          <option value="Extra Large">Extra Large</option>
                        </select>
                        {fieldState.error && (
                          <p className="text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="w-full px-6 mt-6">
                  <p className="text-gray-600 mb-4">Carate *</p>
                  <Controller
                    name="carate"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Please select an option" }}
                    render={({ field, fieldState }) => (
                      <>
                        <select
                          {...field}
                          className="border border-gray-300 w-full outline-none rounded py-3 px-2 category-container"
                        >
                          <option value="" disabled>
                            Select the carate
                          </option>
                          <option value="8">8K</option>
                          <option value="10">10K</option>
                          <option value="14">14K</option>
                          <option value="18">18K</option>
                          <option value="22">22K</option>
                        </select>
                        {fieldState.error && (
                          <p className="text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn absolute -top-20 right-0 bg-[var(--pink-gold)] text-white font-bold border-0 rounded-none w-[180px] hover:bg-black transition-all duration-300 ease-in-out"
            >
              Publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
