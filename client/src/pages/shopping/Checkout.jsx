import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { toast } from "sonner";
import { createNewOrder, createPaymentOrder, verifyPayment } from "../../features/shopping/orderThunk";
import { fetchAddresses } from "../../features/shopping/addressThunk";
import { fetchCart } from "../../features/shopping/cartThunk";
import { loadRazorpayScript } from "../../lib/utils";
import { IndianRupee, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isLoading: isOrderLoading } = useSelector((state) => state.orders);
    const { addressList, isLoading: isAddressLoading } = useSelector((state) => state.addresses || { addressList: [], isLoading: false });
    const { cartData, isLoading: isCartLoading } = useSelector(state => state.cart);
    
    const [selectedAddressId, setSelectedAddressId] = useState("");

    useEffect(() => {
        dispatch(fetchAddresses());
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (addressList && addressList.length > 0 && !selectedAddressId) {
            const defaultAddr = addressList.find(addr => addr.isDefault) || addressList[0];
            setSelectedAddressId(defaultAddr._id);
        }
    }, [addressList, selectedAddressId]);

    const handlePayment = async () => {
        if (!selectedAddressId) {
            return toast.error("Please select a delivery address");
        }

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            return toast.error("Failed to load Razorpay SDK. Check your connection.");
        }

        try {
            const orderRes = await dispatch(createNewOrder({ 
                shippingAddress: selectedAddressId,
                paymentMethod: "UPI"
            })).unwrap();
            
            const orderId = orderRes.data.order._id;

            const paymentRes = await dispatch(createPaymentOrder(orderId)).unwrap();
            const { amount, currency, razorpayOrderId, key } = paymentRes.data;

            const options = {
                key: key,
                amount: amount,
                currency: currency,
                order_id: razorpayOrderId,
                name: "SynXShop",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        await dispatch(verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })).unwrap();
                        
                        toast.success("Payment successful!");
                        navigate("/account/orders"); 
                    } catch (error) {
                        toast.error(error?.message || "Payment verification failed");
                    }
                },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled by user");
                        navigate("/account/orders");
                    }
                },
                theme: { color: "#042f2e" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            toast.error(error?.message || "Something went wrong during checkout");
        }
    };

    const cartItems = cartData?.items || [];
    const subtotal = cartItems.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0);
    const discount = 0; 
    const delivery = subtotal > 0 ? 29.99 : 0;
    const tax = subtotal > 0 ? 39.99 : 0;
    const finalTotal = subtotal + discount + delivery + tax;

    const selectedAddress = addressList?.find(addr => addr._id === selectedAddressId);

    if (isCartLoading && !cartData) {
        return <div className="flex justify-center p-20 text-gray-500">Loading checkout...</div>;
    }

    return ( 
        <div className="min-h-screen bg-white py-8 px-4 md:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* Stepper */}
                <div className="flex items-center justify-center mb-10 text-xs font-medium text-gray-400 gap-2 sm:gap-4 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-black cursor-pointer hover:text-gray-700 transition-colors" onClick={() => navigate("/cart")}>
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold"><Check className="w-3 h-3"/></div>
                        Cart
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <div className="flex items-center gap-1.5 text-black">
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">2</div>
                        Order Summary
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">3</div>
                        Payment
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">4</div>
                        Confirmation
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* LEFT COLUMN */}
                    <div className="flex-1 flex flex-col gap-8">
                        
                        {/* Address Selection */}
                        <div className="border-b border-gray-100 pb-8">
                            <h2 className="font-semibold text-gray-900 text-base mb-4">Delivery Address</h2>
                            
                            {isAddressLoading ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : selectedAddress ? (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{selectedAddress.name || "Name Not Provided"}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{selectedAddress.house}, {selectedAddress.landmark}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}</p>
                                        <p className="text-sm text-gray-600 mt-0.5">Phone: <span className="font-medium text-gray-800">{selectedAddress.phone}</span></p>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => navigate("/account/addresses")}>
                                        Change / Add New
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    <p className="mb-3">No delivery address found.</p>
                                    <Button variant="outline" size="sm" onClick={() => navigate("/account/addresses")}>
                                        Add Delivery Address
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="pb-8">
                            <h2 className="font-semibold text-gray-900 text-base mb-4">Cart Items ({cartItems.length})</h2>
                            <div className="flex flex-col gap-4">
                                {cartItems.map((item) => (
                                    <div key={item.productId?._id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded flex items-center justify-center p-1 relative shrink-0">
                                            <img src={item.productId?.images?.[0] || "/placeholder.svg"} className="max-w-full max-h-full object-contain" />
                                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[9px] font-bold border border-white">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.productId?.name}</p>
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm flex items-center shrink-0">
                                            <IndianRupee className="w-3 h-3"/>
                                            {(item.productId?.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full lg:w-[360px]">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 sticky top-24">
                            <h2 className="font-semibold text-gray-900 text-base mb-4">Order Summary</h2>
                            
                            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5"/>{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span className="font-medium text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5"/>{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="font-medium text-gray-900 flex items-center"><IndianRupee className="w-3.5 h-3.5"/>{delivery.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between text-base font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="flex items-center"><IndianRupee className="w-4 h-4"/>{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handlePayment}
                                disabled={isOrderLoading || !selectedAddressId || cartItems.length === 0}
                                className="w-full bg-[#c2f359] text-black h-[46px] rounded-full text-[12px] font-bold uppercase tracking-wider hover:bg-[#b0df4c] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isOrderLoading ? "Processing..." : (
                                    <>
                                        Proceed to Pay | <IndianRupee className="w-3.5 h-3.5 -mr-1" />{finalTotal.toFixed(2)}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;