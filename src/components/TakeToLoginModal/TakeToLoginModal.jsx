import { Link, useLocation } from "react-router-dom";

const TakeToLoginModal = () => {
  const location = useLocation();
  return (
    <dialog
      id="takeToLoginModal"
      className="goToLoginmodal modal"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="modal-box text-center p-8">
        <h3 className="font-bold text-2xl">Are you not logged in?</h3>
        <p className="pt-6">
          Please{" "}
          <Link
            to="/login"
            className="font-bold underline text-[#95523d]"
            state={{ from: location }}
          >
            Login
          </Link>{" "}
          or{" "}
          <Link
            to="/register"
            className="font-bold underline text-[#95523d]"
            state={{ from: location }}
          >
            Sign Up
          </Link>{" "}
          to add products to Cart and Wishlist.
        </p>
        <div className="modal-action mt-3">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default TakeToLoginModal;
