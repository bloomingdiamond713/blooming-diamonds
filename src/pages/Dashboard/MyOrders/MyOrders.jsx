import React from "react";
import "./MyOrders.css";
import useOrders from "../../../hooks/useOrders";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { orders, totalSpent } = useOrders();

  return (
    <section>
      <div className="pb-6 border-b flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold">Order History</h1>
        </div>
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders?.length}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-[var(--light-brown)]">
              ${totalSpent}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Product(s)</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id} className="order-history-tr">
                <td>#{order.orderId}</td>
                <td>{order.date.slice(0, 10)}</td>
                <td className="space-y-2">
                  {order.orderDetails.map((item, idx) => (
                    <p key={item._id}>
                      {item.name}
                      {idx === order.orderDetails.length - 1 ? "" : ","}
                    </p>
                  ))}
                </td>
                <td>${order.total}</td>
                <td
                  className={`${
                    order.orderStatus === "processing"
                      ? "text-primary"
                      : order.orderStatus === "shipped"
                      ? "text-secondary"
                      : "text-success"
                  } font-medium`}
                >
                  {order.orderStatus
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </td>
                <td>
                  <Link
                    className="underline"
                    to="/order-success"
                    state={{ orderId: order.orderId }}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyOrders;
