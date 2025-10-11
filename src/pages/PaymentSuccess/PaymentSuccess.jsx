import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [axiosSecure] = useAxiosSecure();
    const [status, setStatus] = useState('Verifying Payment...');
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const merchantTransactionId = searchParams.get('merchantTransactionId');

        if (merchantTransactionId) {
            const checkStatus = async () => {
                try {
                    const res = await axiosSecure.get(`/api/phonepe/status/${merchantTransactionId}`);
                    if (res.data.success) {
                        setStatus('Payment Successful!');
                        setDetails(res.data.data);
                    } else {
                        setStatus(`Payment Failed: ${res.data.message}`);
                    }
                } catch (error) {
                    setStatus('Verification Failed');
                }
            };
            // Adding a small delay to allow PhonePe's callback to process
            setTimeout(checkStatus, 3000); 
        } else {
            setStatus('Error: Invalid transaction information.');
        }
    }, [searchParams, axiosSecure]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className={`text-4xl font-bold mb-4 ${status.includes('Successful') ? 'text-green-500' : 'text-red-500'}`}>
                {status}
            </h1>
            {details && (
                <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">Transaction Details</h3>
                    <p><strong>Transaction ID:</strong> {details.transactionId}</p>
                    <p><strong>Amount:</strong> ₹{(details.amount / 100).toFixed(2)}</p>
                </div>
            )}
            <Link to="/shop" className="mt-8 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600">
                Continue Shopping
            </Link>
        </div>
    );
};

export default PaymentSuccess;