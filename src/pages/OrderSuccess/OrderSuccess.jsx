import React, { useEffect, useState } from "react";
import "./OrderSuccess.css";
import { useLocation, useNavigate } from "react-router-dom";
import useOrders from "../../hooks/useOrders";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import { Link } from "react-router-dom";
import easyinvoice from "easyinvoice";
import emptyBox from "../../assets/emptybox.jpg";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [orderObj, setOrderObj] = useState({});
  const [orderDate, setOrderDate] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // get specific order by orderId & email for orderSuccess page
  useEffect(() => {
    if (location?.state?.orderStatus === "success") {
      const findOrderById = orders?.find(
        (order) => order.orderId === location?.state?.orderId
      );
      setOrderObj(findOrderById);
    }
  }, [location?.state, orders]);

  useEffect(() => {
    const today = new Date(orderObj?.date);
    const date = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();
    setOrderDate({ date, month, year });
  }, [orderObj]);

  // create invoice
  const handleDownloadInvoice = async () => {
    setInvoiceLoading(true);
    let invoiceData = {
      images: {
        logo: "https://i.ibb.co/BG5NMsk/output.png",
      },
      // Your own data
      sender: {
        company: "UB Jewellers",
        address: "Narayanganj City Corporation",
        zip: "1400",
        city: "Dhaka",
        country: "Bangladesh",
      },
      // Your recipient
      client: {
        address:
          orderObj?.shippingAddress?.streetAddress +
          ", " +
          orderObj?.shippingAddress?.city,
        zip: orderObj?.shippingAddress?.postalCode,
        city: orderObj?.shippingAddress?.state,
        country: orderObj?.shippingAddress?.country,
      },
      information: {
        // Invoice number
        number: orderDate?.year + "." + orderObj?.orderId,
        // Invoice data
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
    if (invoiceData) {
      const result = await easyinvoice.createInvoice(invoiceData);
      easyinvoice.download(`invoice_${orderObj?.orderId}.pdf`, result?.pdf);
    }
    // clear location state
    setInvoiceLoading(false);
    navigate("/", { state: {}, replace: true });
  };

  return (
    <div style={{ fontFamily: "var(--poppins)" }}>
      {location?.state?.orderId ? (
        <div className="container">
          <CustomHelmet title={"Order Success"} />
          <div className="text-sm breadcrumbs text-gray-500">
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
            <p>Thank You! Your order has been received.</p>
          </div>

          <div className="order-info-con my-10 grid grid-cols-2 gap-x-10">
            <div className="left-side">
              <div>
                <h1>Order Details</h1>
                <div className="space-y-1 shadow">
                  <p className="font-medium text-lg">
                    OrderId:{" "}
                    <span className="font-extrabold">#{orderObj?.orderId}</span>
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
                      {orderObj?.shippingAddress?.mobileNumber}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Phone: <span className="font-bold">{orderObj?.email}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Total: <span className="font-bold">${orderObj?.total}</span>
                  </p>
                  <p className="font-medium text-lg">
                    Payment Method:{" "}
                    <span className="font-bold">
                      {orderObj?.paymentMethod === "cod"
                        ? "Cash On Delivery"
                        : "Card"}
                    </span>
                  </p>
                  <p className="font-medium text-lg">
                    Payment Status:{" "}
                    <span className="font-bold">
                      {orderObj?.paymentStatus?.toUpperCase()}
                    </span>
                  </p>
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
                      <td>
                        {orderObj?.paymentMethod === "cod"
                          ? "Cash On Delivery"
                          : "Card"}
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
          <div className="w-[30%] text-center font-bold">
            <img
              src={emptyBox}
              alt=""
              className="w-[80%] block mx-auto mb-10"
            />
            <h5 className="text-error text-xl mb-3">
              Sorry. Seems like no order was made!
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
