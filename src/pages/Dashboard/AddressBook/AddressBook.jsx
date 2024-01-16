import React, { useEffect, useState } from "react";
import "./AddressBook.css";
import useUserInfo from "../../../hooks/useUserInfo";
import { useForm } from "react-hook-form";
import { City, Country, State } from "country-state-city";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";

const AddressBook = () => {
  // react hook form props
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [userFromDB, , refetch] = useUserInfo();
  const [shippingAdd, setShippingAdd] = useState(null);

  // check if user's db contains shipping add
  useEffect(() => {
    if (userFromDB?.shippingAddress) {
      setShippingAdd(userFromDB.shippingAddress);
    } else {
      setShippingAdd(null);
    }
  }, [userFromDB]);

  // country, state, city settings from country,state,city api
  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [countryCode, setCountryCode] = useState(countryData[0]?.isoCode);
  const [stateCode, setStateCode] = useState(
    stateData.length && stateData[0]?.isoCode
  );

  useEffect(() => {
    setStateData(State.getStatesOfCountry(countryCode));
  }, [countryCode]);

  useEffect(() => {
    stateData && setStateCode(stateData[0]?.isoCode);
  }, [stateData]);

  useEffect(() => {
    const cities = City.getCitiesOfState(countryCode, stateCode);

    if (cities.length) {
      setCityData(cities);
    } else {
      const allCities = City.getCitiesOfCountry(countryCode);
      const citiesOfState = allCities.filter(
        (city) => city.stateCode == stateCode
      );
      setCityData(citiesOfState);
    }
  }, [stateCode, countryCode]);

  // set default values for the form
  useEffect(() => {
    let defaultValues = {};
    defaultValues.firstName = userFromDB?.name?.split(" ")[0];
    defaultValues.lastName =
      userFromDB?.name?.split(" ")[userFromDB?.name?.split(" ")?.length - 1];

    reset({ ...defaultValues });
  }, [userFromDB, reset]);

  // react hook form data
  const onSubmit = (data) => {
    data.state = State.getStateByCodeAndCountry(data.state, data.country).name;
    data.country = Country.getCountryByCode(data.country).name;

    // post the data to user db
    axios
      .patch(
        `http://localhost:5000/users/shipping-address?email=${data.email}`,
        data
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success("Shipping address added successfully");
          refetch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // delete address
  const handleDeleteAddress = () => {
    axios
      .patch(
        `http://localhost:5000/users/delete-address?email=${userFromDB?.email}`
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="pb-4 border-b space-y-2">
        <h1 className="text-2xl font-semibold">Address Book</h1>
        <p>
          The following addresses will be used on the checkout page by default.
        </p>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-medium mb-6">Shipping Address</h4>
        {shippingAdd ? (
          <div className="border-2 border-gray-200 rounded-xl shadow p-4 w-fit">
            <div className="text-lg space-y-3 ">
              <p>
                Name:{" "}
                <span className="font-bold">
                  {shippingAdd.firstName + " " + shippingAdd.lastName}
                </span>
              </p>
              <p>
                Email: <span className="font-bold">{shippingAdd.email}</span>
              </p>
              <p>
                Phone:{" "}
                <span className="font-bold">+{shippingAdd.mobileNumber}</span>
              </p>
              <p>
                City:{" "}
                <span className="font-bold">
                  {shippingAdd.streetAddress}, {shippingAdd.city}
                </span>
              </p>
              <p>
                State: <span className="font-bold">{shippingAdd.state}</span>
              </p>
              <p>
                Country:{" "}
                <span className="font-bold">{shippingAdd.country}</span>
              </p>
            </div>

            <button
              className="btn btn-outline btn-wide mt-8"
              onClick={handleDeleteAddress}
            >
              <FaPencil /> Edit
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="address-form">
              <div>
                <p>First Name *</p>
                <input
                  type="text"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && (
                  <span className="text-red-400">First Name is required</span>
                )}
              </div>

              <div>
                <p>Last Name *</p>
                <input
                  type="text"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <span className="text-red-400">Last Name is required</span>
                )}
              </div>

              <div>
                <p>Email *</p>
                <input
                  type="text"
                  readOnly
                  {...register("email", { required: true })}
                  defaultValue={userFromDB?.email}
                />
              </div>

              <div>
                <p>Mobile Number *</p>
                <input
                  type="number"
                  {...register("mobileNumber", { required: true })}
                  placeholder="Enter mobile number with country code(e.g +880)"
                />
                {errors.mobileNumber && (
                  <span className="text-red-400">
                    Mobile Number is required
                  </span>
                )}
              </div>

              <div>
                <p>Street Address *</p>
                <input
                  type="text"
                  {...register("streetAddress", { required: true })}
                />
                {errors.streetAddress && (
                  <span className="text-red-400">
                    Street Address is required
                  </span>
                )}
              </div>

              <div>
                <p>Country *</p>
                <select
                  {...register("country", {
                    required: true,
                  })}
                  onChange={(e) => setCountryCode(e.target.value)}
                  defaultValue={countryCode}
                >
                  {countryData?.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <span className="text-red-400">Country is required</span>
                )}
              </div>

              <div>
                <p>State/Province/Division/District *</p>
                <select
                  {...register("state", {
                    required: true,
                  })}
                  onChange={(e) => setStateCode(e.target.value)}
                  defaultValue={stateCode}
                >
                  {stateData?.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span className="text-red-400">
                    State/Province is required
                  </span>
                )}
              </div>

              <div>
                <p>City/Town/District *</p>
                {cityData?.length ? (
                  <select
                    {...register("city", { required: true })}
                    defaultValue={cityData[0].name}
                  >
                    {cityData.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    {...register("city", { required: true })}
                  />
                )}
                {errors.state && (
                  <span className="text-red-400">
                    State/Province is required
                  </span>
                )}
              </div>

              <div>
                <p>Zip/Postal Code *</p>
                <input
                  type="number"
                  {...register("postalCode", { required: true })}
                />
                {errors.postalCode && (
                  <span className="text-red-400">
                    Zip/Postal Code is required
                  </span>
                )}
              </div>

              <button type="submit" className="btn btn-outline btn-wide">
                Add
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
