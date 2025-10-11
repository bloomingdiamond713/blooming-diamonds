import React, { useEffect, useState } from "react";
import "./OrderSuccess.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useOrders from "../../hooks/useOrders";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import easyinvoice from "easyinvoice";
import emptyBox from "../../assets/emptybox.jpg";
import toast from "react-hot-toast";
import useUserInfo from "../../hooks/useUserInfo";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useCart from "../../hooks/useCart";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tranId } = useParams(); // For PhonePe redirect
  const { orders, refetch: refetchOrders } = useOrders(); // Get refetch function
  const [orderObj, setOrderObj] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { refetch: refetchCart } = useCart();

  // get all orders for admin users
  useEffect(() => {
    if (userFromDB?.admin) {
      axiosSecure
        .get("/admin/orders")
        .then((res) => {
          setAllOrders(res.data);
          // This part is for admin viewing a specific order from their dashboard
          if (location?.state?.orderId) {
             const findOrderById = res.data?.find(
               (order) => order._id === location.state.orderId
             );
             setOrderObj(findOrderById);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [userFromDB, axiosSecure, location?.state?.orderId]);


  // Main logic to determine which order to display
  useEffect(() => {
    // SCENARIO 1: Handle the redirect from PhonePe
    const handlePhonePeCallback = async () => {
      if (tranId) {
        setLoading(true);
        try {
          const statusResponse = await axiosSecure.get(`/api/phonepe/status/${tranId}`);

          if (statusResponse.data.success) {
            const pendingOrderData = JSON.parse(sessionStorage.getItem("pendingOrder"));
            
            if (pendingOrderData) {
              const finalOrderData = {
                ...pendingOrderData,
                paymentStatus: "paid",
                transactionId: tranId,
              };

              const orderResponse = await axiosSecure.post("/orders", finalOrderData);

              if (orderResponse.data.insertedId) {
                await axiosSecure.delete(`/delete-cart-items?email=${userFromDB?.email}`);
                refetchCart();
                refetchOrders(); // Refetch orders to get the latest one
                setOrderObj(finalOrderData);
                toast.success("Payment successful and order placed!");
                sessionStorage.removeItem("pendingOrder");
              } else {
                throw new Error("Failed to save the order.");
              }
            } else {
               // If session storage is empty, maybe the user refreshed.
               // Try to find the order by transactionId.
               const findOrderByTxnId = orders?.find(o => o.transactionId === tranId);
               if (findOrderByTxnId) {
                   setOrderObj(findOrderByTxnId);
               } else {
                   throw new Error("No pending order found and could not find existing order.");
               }
            }
          } else {
            toast.error(statusResponse.data.message || "Payment Failed. Please try again.");
            sessionStorage.removeItem("pendingOrder");
            navigate("/checkout");
          }
        } catch (error) {
          console.error("Error processing PhonePe payment:", error);
          toast.error("An error occurred while confirming your order.");
          sessionStorage.removeItem("pendingOrder");
          navigate("/checkout");
        } finally {
          setLoading(false);
        }
      }
    };

    // SCENARIO 2 & 3: Handle COD/Card or viewing an existing order
    const handleExistingOrder = () => {
        if (!userFromDB?.admin && location?.state?.orderId) {
             const findOrderById = orders?.find(
               (order) => order.orderId === location.state.orderId
             );
             setOrderObj(findOrderById);
        }
        // Admin order viewing is handled in the admin-specific useEffect
        setLoading(false);
    };

    if (tranId) {
      handlePhonePeCallback();
    } else {
      handleExistingOrder();
    }
  }, [tranId, location, orders, allOrders, userFromDB, axiosSecure, navigate, refetchCart, refetchOrders]);

  // Format the order date once orderObj is set
  useEffect(() => {
    if (orderObj?.date) {
      const today = new Date(orderObj.date);
      const date = today.getDate();
      const month = today.toLocaleString("en-US", { month: "long" });
      const year = today.getFullYear();
      setOrderDate({ date, month, year });
    }
  }, [orderObj]);

  // create invoice
  const handleDownloadInvoice = async () => {
    setInvoiceLoading(true);
    let invoiceData = {
      images: {
        logo: "https://i.ibb.co/BG5NMsk/output.png",
      },
      sender: {
        company: "UB Jewellers",
        address: "Narayanganj City Corporation",
        zip: "1400",
        city: "Dhaka",
        country: "Bangladesh",
      },
      client: {
        company: userFromDB?.name,
        address:
          orderObj?.shippingAddress?.streetAddress +
          ", " +
          orderObj?.shippingAddress?.city,
        zip: orderObj?.shippingAddress?.postalCode,
        city: orderObj?.shippingAddress?.state,
        country: orderObj?.shippingAddress?.country,
      },
      information: {
        number:
          orderObj?.orderDetails?.length +
          "" +
          orderObj?.total +
          orderDate?.year,
        date: `${orderDate?.date}-${new Date(orderDate?.date).getMonth() + 1}-${
          orderDate?.year
        }`,
      },
      products: orderObj?.orderDetails?.map((product) => ({
        quantity: product?.quantity,
        description: product?.name,
        price: product?.price,
        "tax-rate": 0,
      })),
      "bottom-notice": "Thanks for shopping with UB Jewellers ❣️",
      settings: {
        currency: "USD",
      },
    };

    try {
      if (invoiceData) {
        const result = await easyinvoice.createInvoice(invoiceData);
        easyinvoice.download(`invoice_${orderObj?.orderId}.pdf`, result?.pdf);
      }
    } catch (error) {
      toast.error("Sorry, our download server is busy. Please try again later");
    }
    setInvoiceLoading(false);
    navigate("/", { state: {}, replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Confirming your order...</h1>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--poppins)" }} className="mb-32">
      {orderObj ? (
        <div className="container">
          <CustomHelmet title={"Order Success"} />
          <div className="text-sm breadcrumbs text-gray-500 ml-6">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to={window.location.href}>Order Success</Link>
              </li>
            </ul>
          </div>

          <div className="border rounded bg-green-600 text-center py-1 text-sm text-gray-100 font-semibold my-3">
            {location?.state?.from?.pathname === "/checkout" || tranId ? (
              <p>Thank You! Your order has been received.</p>
            ) : (
              <p>Thank You! Your order has been {orderObj?.orderStatus}.</p>
            )}
          </div>

          <div className="order-info-con my-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 md:gap-y-0 px-6 md:px-0">
            <div className="left-side">
              <div>
                <h1>Order Details</h1>
                <div className="space-y-1 shadow">
                  <p className="font-medium text-lg">
                    OrderId:{" "}
                    <span className="font-extrabold">#{orderObj?._id || orderObj?.orderId}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Date:{" "}
                    <span className="font-extrabold">
                      {orderDate?.month} {orderDate?.date}, {orderDate?.year}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Ordered By:{" "}
                    <span className="font-bold">{orderObj?.name}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Email:{" "}
                    <span className="font-bold">
                      {orderObj?.email}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Phone: <span className="font-bold">{orderObj?.shippingAddress?.mobileNumber}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Total: <span className="font-bold">${orderObj?.total}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Payment Method:{" "}
                    <span className="font-bold capitalize">
                      {orderObj?.paymentMethod}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Payment Status:{" "}
                    <span className="font-bold">
                      {orderObj?.paymentStatus?.toUpperCase()}
                    </span>
                  </p>
                  {orderObj?.transactionId && (
                    <p className="font-bold text-lg text-success break-all">
                      Transaction ID:{" "}
                      <span className="font-extrabold">
                        {orderObj?.transactionId}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-16">
                <h1>Billing/Shipping Address</h1>
                <div className="space-y-1 shadow">
                  <p className="font-medium text-lg">
                    Street:{" "}
                    <span className="font-extrabold">
                      {orderObj?.shippingAddress?.streetAddress}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    City:{" "}
                    <span className="font-extrabold">
                      {orderObj?.shippingAddress?.city}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    State:{" "}
                    <span className="font-extrabold">
                      {orderObj?.shippingAddress?.state}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Zip/Postal Code:{" "}
                    <span className="font-extrabold">
                      {orderObj?.shippingAddress?.postalCode}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Country:{" "}
                    <span className="font-extrabold">
                      {orderObj?.shippingAddress?.country}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="right-side">
              <div>
                <h1>Order Summary</h1>
                <table className="">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderObj?.orderDetails?.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>${product.price}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={2}>Total</td>
                      <td>${orderObj?.total}</td>
                    </tr>

                    <tr className="font-bold">
                      <td colSpan={2}>Payment Method</td>
                      <td className="capitalize">
                        {orderObj?.paymentMethod}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  className="btn btn-outline btn-neutral btn-block"
                  onClick={handleDownloadInvoice}
                  disabled={invoiceLoading}
                >
                  {invoiceLoading ? (
                    <span className="loading loading-spinner loading-sm text-neutral"></span>
                  ) : (
                    "Download Invoice"
                  )}
                </button>
                <button
                  className="btn btn-neutral btn-block"
                  onClick={() => {
                    navigate("/", { state: {}, replace: true });
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="md:w-[30%] text-center font-bold">
            <img
              src={emptyBox}
              alt="Empty Box"
              className="md:w-[80%] block mx-auto mb-10"
            />
            <h5 className="text-error text-xl mb-3">
              Sorry, it seems like no order was made!
            </h5>
            <Link to="/" className="underline text-blue-500">
              Go back to home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;