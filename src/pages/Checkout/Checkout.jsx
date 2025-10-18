import React, { useState, useContext, useEffect, createContext } from "react";
import { Link, useLocation, useNavigate, MemoryRouter, Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { toast, Toaster } from "react-hot-toast";
import { auth } from '@/firebase/firebase.config.js';


// Inlined dependencies and context to resolve compilation errors
export const AuthContext = createContext(null);

// --- Inlined from react-icons/fa6 ---
const FaPencil = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M421.7 220.3L182.4 459.7c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6L409.1 186.4c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6zM472.3 52.3L441.7 21.7c-18.7-18.7-49.1-18.7-67.9 0L316.5 79c-6.2 6.2-6.2 16.4 0 22.6l11.3 11.3c6.2 6.2 16.4 6.2 22.6 0L408 55.7c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6L242.3 289.3c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6L408 55.7c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6L242.3 289.3c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6L408 55.7c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6L242.3 289.3c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6L408 55.7c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6L242.3 289.3c-6.2 6.2-16.4 6.2-22.6 0l-11.3-11.3c-6.2-6.2-6.2-16.4 0-22.6L408 55.7c6.2-6.2 16.4-6.2 22.6 0l11.3 11.3c6.2 6.2 6.2 16.4 0 22.6z"></path>
  </svg>
);

const CustomHelmet = ({ title }) => {
  useEffect(() => {
    document.title = `${title} - Blooming Diamonds`;
  }, [title]);
  return null;
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

const useAxiosSecure = (navigate) => {
  const auth = useAuthContext();
  const axiosSecure = axios.create({
    baseURL: "http://localhost:3001/",
  });

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (auth && error.response && (error.response.status === 401 || error.response.status === 403)) {
          await auth.logOut();
          if (navigate) {
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
        axiosSecure.interceptors.request.eject(requestInterceptor);
        axiosSecure.interceptors.response.eject(responseInterceptor);
    }

  }, [auth, navigate, axiosSecure]);

  return [axiosSecure];
};

const useUserInfo = (navigate) => {
  const { user, loading } = useAuthContext() || {};
  const [axiosSecure] = useAxiosSecure(navigate);
  const { data: userFromDB, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      if (!user?.email) return null;
      // Mocked response for demonstration
      return {
        shippingAddress: {
          firstName: "Guest",
          lastName: "User",
        },
      };
    },
  });
  return [userFromDB, isUserLoading];
};

const useCart = (navigate) => {
  const { user } = useAuthContext() || {};
  const [axiosSecure] = useAxiosSecure(navigate);

  const { data: cartData = [], refetch } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      if (!user?.email) return [];
      // Mocked response for demonstration
      return [
        { _id: "1", name: "Diamond Ring", quantity: 1, price: 1200, img: "https://placehold.co/100x100/png?text=Item" },
        { _id: "2", name: "Sapphire Necklace", quantity: 1, price: 1800, img: "https://placehold.co/100x100/png?text=Item" },
      ];
    },
  });

  const cartSubtotal = cartData.reduce(
    (total, item) => {
      total.subtotal += item.price * item.quantity;
      return total;
    },
    { subtotal: 0 }
  );

  return { cartData, refetch, cartSubtotal };
};

const CheckoutComponent = () => {
  const navigate = useNavigate();
  const [userFromDB] = useUserInfo(navigate);
  const { cartData, cartSubtotal } = useCart(navigate);

  const handlePlaceOrder = () => {
    toast.error("This feature is not available yet.");
  };

  return (
    <div className="container mb-20" style={{ fontFamily: "var(--poppins)" }}>
      <CustomHelmet title="Checkout" />
      <Toaster/>
      <div className="text-sm breadcrumbs ml-6">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/checkout">Checkout</Link>
          </li>
        </ul>
      </div>

      <section className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start gap-6 gap-y-9 md:gap-y-0 pt-10 px-6 md:px-0">
        <div className="flex-grow">
          <div>
            <h1 className="text-xl font-semibold mb-5">
              Shipping/Billing Address
            </h1>
            {userFromDB?.shippingAddress ? (
              <div className="border-2 border-gray-200 rounded-xl shadow p-4 w-fit">
                <div className="text-lg space-y-3 ">
                  <p>
                    Name:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.firstName +
                        " " +
                        userFromDB?.shippingAddress.lastName}
                    </span>
                  </p>
                  <Link to="/dashboard/myAddress">
                    <button className="btn btn-outline btn-wide mt-8">
                      <FaPencil /> Edit Address
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p>You have not added a shipping or billing address yet!</p>
                <Link to="/dashboard/myAddress">
                  <button className="btn btn-outline btn-wide mt-6">
                    ADD ADDRESS
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h1 className="text-xl font-semibold mb-4">Payment Method</h1>
            <div className="mt-8">
              <div className="p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-cod"
                    className="radio radio-primary"
                    value={"cod"}
                    checked={true}
                    readOnly
                  />
                  <label htmlFor="radio-pay-cod" className="font-bold">
                    Cash On Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-lg p-6 w-full md:w-[35%]">
          <div>
            <h6 className="text-lg font-semibold">Your order(s)</h6>
            <div className="my-4 space-y-4">
              {cartData?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 w-full shadow rounded-lg"
                >
                  <img src={item.img} alt={item.name} className="w-[25%]" />
                  <div className="flex-grow space-y-2">
                    <h4 className="text-lg font-medium">
                      {item.name}{" "}
                      <span className="font-bold">x {item.quantity}</span>
                    </h4>
                    <p className="font-bold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between items-center font-bold text-lg">
            <h5>Total</h5>
            <h5>${cartSubtotal?.subtotal.toFixed(2)}</h5>
          </div>
          <div className="divider"></div>

          <button
            className="btn btn-block btn-neutral text-white mt-4"
            disabled={!userFromDB?.shippingAddress}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </section>
    </div>
  );
};


const queryClient = new QueryClient();

const mockAuthContextValue = {
    user: {
        displayName: "Guest User",
        email: "guest@example.com"
    },
    loading: false,
    logOut: async () => console.log("Logged out"),
};

const Checkout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={mockAuthContextValue}>
                <MemoryRouter initialEntries={['/checkout']}>
                    <Routes>
                        <Route path="*" element={<CheckoutComponent />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    )
};


export default Checkout;

