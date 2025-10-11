import { useLocation } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Payment = () => {
    const location = useLocation();
    const [axiosSecure] = useAxiosSecure();
    
    // Get total price from the navigation state, passed from the cart page
    const totalPrice = location.state?.price || 0;

    const handlePhonePePayment = async () => {
        if (totalPrice <= 0) {
            alert("Amount must be greater than zero.");
            return;
        }

        try {
            const { data } = await axiosSecure.post('/api/phonepe/pay', {
                amount: totalPrice
            });

            if (data.success) {
                const redirectUrl = data.data.instrumentResponse.redirectInfo.url;
                // Redirect the user to the PhonePe payment page
                window.location.href = redirectUrl;
            } else {
                alert(`Payment initiation failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error initiating PhonePe payment:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-3xl font-bold mb-8">Confirm Your Payment</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
                <p className="text-xl mb-6">Total Amount: <span className="font-bold">₹{totalPrice.toFixed(2)}</span></p>
                <button 
                    onClick={handlePhonePePayment} 
                    className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg w-full hover:bg-purple-700 transition-colors"
                >
                    Pay with PhonePe
                </button>
            </div>
        </div>
    );
};

export default Payment;