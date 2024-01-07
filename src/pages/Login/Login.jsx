import React, { useState } from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6";

const Login = () => {
  const [showPass, setShowPass] = useState(false);

  // react hook form settings
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div
      className="container mt-20 mb-24"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <h1
        className="text-6xl font-bold tracking-wide mb-10"
        style={{ fontFamily: "var(--italiana)" }}
      >
        Login
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="w-full auth-input-con">
          <p className="text-gray-600">Email address *</p>
          <input
            type="email"
            {...register("email", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.email && (
            <span className="text-red-500 mt-1 block">Email is required</span>
          )}
        </div>

        <div className="w-full mt-8 relative auth-input-con">
          <p className="text-gray-600">Password *</p>
          <input
            type={showPass ? "text" : "password"}
            {...register("password", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.password && (
            <span className="text-red-500 mt-1 block">
              Password is required
            </span>
          )}
          <div className="absolute top-10 right-1">
            {showPass ? (
              <FaRegEyeSlash
                className="text-2xl"
                onClick={() => setShowPass(!showPass)}
              />
            ) : (
              <FaRegEye
                className="text-2xl"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3">
          <button
            type="submit"
            className="uppercase text-sm text-white bg-black px-8 py-3 hover:rounded-xl transition-all duration-300"
          >
            Log In
          </button>
          <p>
            Don&apos;t have an account?{" "}
            <Link to={"/register"} className="underline">
              Create One
            </Link>
          </p>
        </div>
      </form>

      <div className="flex justify-start items-center mt-7">
        <p className="w-[15%] font-medium">Or, continue with</p>
        <div className="w-full bg-gray-400 h-[1px]"></div>
      </div>

      <div className="flex items-center gap-6 mt-5">
        <div className="text-lg text-[var(--pink-gold)] bg-black p-4 rounded-full cursor-pointer hover:text-black hover:bg-[--pink-gold] transition-all duration-300">
          <FaGoogle />
        </div>
        <div className="text-lg text-[var(--pink-gold)] bg-black p-4 rounded-full cursor-pointer hover:text-black hover:bg-[--pink-gold] transition-all duration-300">
          <FaFacebookF />
        </div>
      </div>
    </div>
  );
};

export default Login;
