import React, { useState } from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import useAuthContext from "../../hooks/useAuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { signIn, signInGoogle } = useAuthContext();
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";

  // react hook form settings
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // form submit
  const onSubmit = (data) => {
    setLoginLoading(true);
    const { email, password } = data;

    signIn(email, password)
      .then((res) => {
        console.log(res.user);
        toast.success(`Authenticated as ${res.user?.email}`);
        reset(); // reset the form
        setLoginLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => setLoginError(error?.code));
  };

  // sign in with google
  const handleGoogleSignIn = () => {
    signInGoogle()
      .then((res) => {
        console.log(res.user);
        toast.success(`Authenticated as ${res.user?.email}`);
        navigate(from, { replace: true });
      })
      .catch((error) => setLoginError(error?.code));
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

      {/* error notification */}
      {loginError && (
        <div
          role="alert"
          className="alert alert-error mb-8 rounded-lg text-white "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {loginError.replace("auth/", "")}</span>
        </div>
      )}

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
            disabled={loginLoading}
          >
            {loginLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Log In"
            )}
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
        <div
          className="text-lg text-[var(--pink-gold)] bg-black p-4 rounded-full cursor-pointer hover:text-black hover:bg-[--pink-gold] transition-all duration-300"
          onClick={handleGoogleSignIn}
        >
          <FaGoogle />
        </div>
      </div>
    </div>
  );
};

export default Login;
