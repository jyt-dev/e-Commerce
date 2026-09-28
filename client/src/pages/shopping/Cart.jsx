import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, reduceQuantity, addToCart } from "@/features/shopping/cartThunk";
import { Minus, Plus, Trash2, ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartData, isLoading } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId)).unwrap()
            .then(() => toast.success("Item removed"))
            .catch(() => toast.error("Failed to remove item"));
    };

    const handleReduce = (productId, currQty) => {
        if (currQty <= 1) {
            handleRemove(productId);
            return;
        }
        dispatch(reduceQuantity({ productId, quantity: 1 })).unwrap()
            .then(() => dispatch(fetchCart()))
            .catch((err) => toast.error(err?.error || err?.message || "Failed to reduce quantity"));
    };

    const handleAdd = (productId) => {
        dispatch(addToCart({ productId, quantity: 1 })).unwrap()
            .then(() => dispatch(fetchCart()))
            .catch((err) => toast.error(err?.error || err?.message || "Failed to increase quantity"));
    };

    const getDeliveryDate = (id) => {
        const sum = id ? id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
        const daysToAdd = (sum % 7) + 1;
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const cartItems = cartData?.items || [];
    const subtotal = cartItems.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0);
    
    const finalTotal = subtotal;

    if (isLoading && !cartData) {
        return <div className="flex justify-center p-10 text-gray-500 font-sans tracking-tight">Loading cart...</div>;
    }

    return (
        <div className="min-h-[85vh] bg-[#fdfdfd] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
            <div className="max-w-[1000px] mx-auto">
                
                <div className="flex items-center justify-center mb-10 text-xs font-medium text-gray-400 gap-2 sm:gap-4 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-black">
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">1</div>
                        Cart
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">2</div>
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

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-6">
                        <ShoppingBag className="w-20 h-20 opacity-20 text-gray-400" />
                        <p className="text-lg text-gray-500 font-medium tracking-tight">Your cart is empty.</p>
                        <button 
                            className="bg-[#c2f359] text-gray-900 font-bold px-10 py-3 rounded-full hover:bg-[#b0df4c] transition-colors uppercase tracking-tight text-[13px]"
                            onClick={() => navigate("/products")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        {/* Left Column - Cart Items */}
                        <div className="flex-1">
                            <div className="flex flex-col gap-6">
                                {cartItems.map((item) => {
                                    return (
                                        <div key={item._id || item.productId?._id} className="flex flex-row items-center gap-4 sm:gap-6 pb-6 border-b border-gray-100 last:border-b-0">
                                            {/* Image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-sm shrink-0 flex items-center justify-center p-2">
                                                <img 
                                                    src={item.productId?.images?.[0] || "/placeholder.svg"} 
                                                    alt={item.productId?.name}
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-between self-stretch py-1">
                                                {/* Title & Price Row */}
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="font-semibold text-[14px] text-black leading-tight tracking-tight">
                                                            {item.productId?.name}
                                                        </h3>
                                                        <p className="text-[12px] text-gray-400 mt-1 tracking-tight">
                                                            Deliverable by <span className="font-semibold text-gray-500">{getDeliveryDate(item.productId?._id)}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="font-bold text-[14px] text-black tracking-tight">₹{item.productId?.price?.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Controls Row */}
                                                <div className="flex justify-between items-center mt-auto pt-2 sm:mt-0 sm:pt-0">
                                                    <div className="flex items-center border border-gray-100 rounded-full bg-gray-50/50 h-[30px] px-1">
                                                        <button 
                                                            className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                            onClick={() => handleReduce(item.productId?._id, item.quantity)}
                                                        >
                                                            <Minus className="w-[11px] h-[11px]" strokeWidth={2.5} />
                                                        </button>
                                                        <span className="w-5 text-center text-[12px] font-bold text-black">{item.quantity}</span>
                                                        <button 
                                                            className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                            onClick={() => handleAdd(item.productId?._id)}
                                                        >
                                                            <Plus className="w-[11px] h-[11px]" strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-400">
                                                        <button className="hover:text-red-500 transition-colors cursor-pointer">
                                                            <Heart className="w-4 h-4" strokeWidth={1.5} />
                                                        </button>
                                                        <button className="hover:text-black transition-colors cursor-pointer" onClick={() => handleRemove(item.productId?._id)}>
                                                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Right Column - Order Summary */}
                        <div className="w-full lg:w-[320px] shrink-0">
                            <h2 className="text-[13px] font-bold uppercase tracking-tight mb-5 text-black">Order Summary</h2>
                            
                            <div className="flex flex-col text-[12px] font-medium text-gray-500 border-b border-gray-100 mb-6">
                                <button className="flex justify-between items-center py-3.5 border-b border-gray-100 hover:text-black transition-colors text-left">
                                    <span>Order special instructions</span>
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button className="flex justify-between items-center py-3.5 hover:text-black transition-colors text-left">
                                    <span>Estimate Shipping</span>
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3.5 text-[12px] font-medium text-gray-500 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-black tracking-tight">Subtotal</span>
                                    <span className="font-bold text-black tracking-tight">₹{subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6 border-t border-gray-100 pt-5">
                                <span className="font-bold text-black text-[13px] tracking-tight">Total</span>
                                <span className="font-bold text-black text-[15px] tracking-tight">₹{finalTotal.toFixed(2)}</span>
                            </div>

                            <button 
                                onClick={() => navigate("/checkout")}
                                className="w-full bg-[#c2f359] text-black h-[46px] rounded-full text-[12px] font-bold uppercase tracking-wider hover:bg-[#b0df4c] transition-colors shadow-sm"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
