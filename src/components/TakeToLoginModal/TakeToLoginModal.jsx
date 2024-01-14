import { useLocation, useNavigate } from "react-router-dom";

const TakeToLoginModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <dialog
      id="takeToLoginModal"
      className="goToLoginmodal modal"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="modal-action">
        <form method="dialog" className="modal-box text-center p-8">
          <h3 className="font-bold text-2xl">Are you not logged in?</h3>
          <p className="pt-6">
            Please <span className="font-bold">Login</span> or{" "}
            <span className="font-bold">Sign Up</span> to add products to Cart
            and Wishlist.
          </p>
          <div className="modal-action mt-8">
            <form method="dialog">
              <button
                className="btn btn-neutral mr-4 text-white"
                onClick={handleCloseModal}
              >
                Continue To Login
              </button>
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default TakeToLoginModal;
