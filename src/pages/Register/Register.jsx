import React, { useRef, useState } from "react";
import "../Login/Login.css";
import { useForm } from "react-hook-form";
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

const Register = () => {
  const { signUp } = useAuthContext();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fileDragged, setFileDragged] = useState(false);

  // react hook form settings
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { name, email, password, photo } = data;
    console.log(name, email, password, photo);
  };

  //   profile pic file upload
  const inputRef = useRef(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  const handleFileDragOver = (e) => {
    e.preventDefault();
  };
  const handleFileDragEnter = (e) => {
    e.preventDefault();
    setFileDragged(true);
  };
  const handleFileDragLeave = (e) => {
    e.preventDefault();
    setFileDragged(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setFileDragged(false);
    setProfilePicFile(e.dataTransfer.files);
  };

  console.log(errors);

  return (
    <div
      className="container mt-20 mb-24"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <h1
        className="text-6xl font-bold tracking-wide mb-10"
        style={{ fontFamily: "var(--italiana)" }}
      >
        Register
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="loginRegisterForm">
        <div className="w-full auth-input-con">
          <p className="text-gray-600">Full Name *</p>
          <input
            type="name"
            {...register("name", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.name && (
            <span className="text-red-500 mt-1 block">
              Your full name is required
            </span>
          )}
        </div>

        {/* email input */}
        <div className="w-full mt-8 auth-input-con">
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

        {/* password input */}
        <div className="w-full mt-8 relative auth-input-con">
          <p className="text-gray-600">Password *</p>
          <input
            type={showPass ? "text" : "password"}
            {...register("password", { required: true })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />
          {errors.confirmPassword?.message === "unmatched password" && (
            <span className="text-red-500 mt-1 block">
              Your Password do not match
            </span>
          )}

          {errors.password?.message === "" && (
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

        {/* confirm password input */}
        <div className="w-full mt-8 relative auth-input-con">
          <p className="text-gray-600">Confirm Password *</p>
          <input
            type={showConfirmPass ? "text" : "password"}
            {...register("confirmPassword", {
              required: true,
              validate: (val) => {
                if (watch("password") != val) {
                  return "unmatched password";
                }
              },
            })}
            className="text-xl border-0 outline-none border-b-2 border-gray-400 w-full mt-3 pb-2"
          />

          {errors.password?.message === "" && (
            <span className="text-red-500 mt-1 block">
              Confirm Password is required
            </span>
          )}

          {errors.confirmPassword?.message === "unmatched password" && (
            <span className="text-red-500 mt-1 block">
              Your passwords do not match
            </span>
          )}
          <div className="absolute top-10 right-1">
            {showConfirmPass ? (
              <FaRegEyeSlash
                className="text-2xl"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              />
            ) : (
              <FaRegEye
                className="text-2xl"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              />
            )}
          </div>
        </div>

        {/* profile pic input */}
        <div className="w-full mt-8">
          <p className="text-gray-600 mb-5">Profile Pic (optional)</p>
          <input
            type="file"
            {...register("profilePic", { required: false })}
            onChange={(event) => setProfilePicFile(event.target.files)}
            hidden
            defaultValue={""}
            ref={inputRef}
          />

          {!profilePicFile ? (
            <button
              className={`border-2 border-dashed h-[170px] w-[50%] flex justify-center items-center ${
                fileDragged ? "shadow-xl" : ""
              }`}
              onDrop={handleFileDrop}
              onDragEnter={handleFileDragEnter}
              onDragLeave={handleFileDragLeave}
              onDragOver={handleFileDragOver}
              onClick={() => inputRef.current.click()}
            >
              <div className="text-center space-y-4">
                <IoCloudUploadOutline className="text-6xl text-[var(--pink-gold)] block mx-auto" />
                <p className="text-lg">
                  Drag & Drop <br /> or{" "}
                  <span className="text-primary">browse image</span>
                </p>
              </div>
            </button>
          ) : (
            <div className="border-2 border-gray-400 rounded-xl p-4 w-fit flex justify-between items-center gap-6">
              <span>{profilePicFile[0].name}</span>
              <button onClick={() => setProfilePicFile(null)}>
                <IoClose className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* register button */}
        <div className="mt-16 flex items-center gap-3">
          <button
            type="submit"
            className="uppercase text-sm text-white bg-black px-8 py-3 hover:rounded-xl transition-all duration-300"
          >
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="underline">
              Sign In
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

export default Register;
