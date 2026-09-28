import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '@/features/shopping/orderThunk';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SpinnerCustom } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Package, Star } from 'lucide-react';

export default function OrderHistory() {
    const dispatch = useDispatch();
    const { orderList, isLoading } = useSelector(state => state.orders);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'default';
            case 'shipped': return 'warning';
            case 'delivered': return 'success';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    if (isLoading && orderList.length === 0) {
        return <div className="flex justify-center p-8"><SpinnerCustom /></div>;
    }

    const tabs = ['All', 'Shipped', 'Delivered', 'Cancelled'];
    const filteredOrders = activeTab === 'All' 
        ? orderList 
        : orderList.filter(o => o.status?.toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="space-y-6">
            <h3 className="text-[20px] font-semibold tracking-tight text-gray-900">My Orders</h3>
            
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-100 pb-2">
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[14px] font-medium transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {orderList.length === 0 ? (
                <Card className="rounded-sm shadow-none border-gray-200">
                    <CardContent className="p-8 text-center text-[14px] text-gray-500">
                        You have not placed any orders yet.
                    </CardContent>
                </Card>
            ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-[14px] text-gray-500">
                    No orders found for this status.
                </div>
            ) : (
                <div className="flex flex-col md:gap-4 -mx-4 md:mx-0">
                    {filteredOrders.map((order) => {
                        const firstItem = order.orderItems?.[0];
                        const remainingCount = (order.orderItems?.length || 1) - 1;

                        return (
                            <React.Fragment key={order._id}>
                                {/* DESKTOP VIEW */}
                                <Card className="hidden md:block rounded-sm shadow-none border-gray-200 overflow-hidden">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-center px-3 pt-3 pb-1">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <Badge variant={getStatusColor(order.status)} className="rounded-sm text-[12px] px-2 py-0.5 shadow-none uppercase tracking-wider font-semibold">
                                                {order.status}
                                            </Badge>
                                            
                                            {order.paymentStatus === 'SUCCESSFUL' ? (
                                                <Badge variant="success" className="rounded-sm text-[12px] px-2 py-0.5 shadow-none bg-green-100 text-green-800 hover:bg-green-100 uppercase tracking-wider font-semibold">Paid</Badge>
                                            ) : order.paymentStatus === 'FAILED' ? (
                                                <Badge variant="destructive" className="rounded-sm text-[12px] px-2 py-0.5 shadow-none uppercase tracking-wider font-semibold">Payment Failed</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="rounded-sm text-[12px] px-2 py-0.5 shadow-none bg-orange-100 text-orange-800 hover:bg-orange-100 uppercase tracking-wider font-semibold">
                                                    {order.paymentStatus || 'Pending Payment'}
                                                </Badge>
                                            )}
                                        </div>
                                        <button className="flex items-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            Rate & Review Product
                                        </button>
                                    </div>
                                    
                                    {/* Info Row */}
                                    <div className="flex justify-between items-center px-3 pb-2">
                                        <div className="text-[13px] text-gray-500">
                                            {new Date(order.createdAt).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                                            <span className="mx-3 text-gray-300">|</span> 
                                            Order No: {order._id}
                                        </div>
                                        <div className="text-[15px] font-semibold text-gray-900">
                                            Total: ₹{order.totalAmount?.toFixed(2)}
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-100" />
                                    
                                    {/* Products Body */}
                                    <div className="p-3 flex flex-col gap-3 bg-gray-50/30">
                                        {firstItem && (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-12 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                        {firstItem.productId?.images?.[0] ? (
                                                            <img src={firstItem.productId.images[0]} alt="product" className="h-full w-full object-contain mix-blend-multiply" />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[14px] font-medium text-gray-900">
                                                            {firstItem.productId?.name || 'Product Item'}
                                                        </h4>
                                                        <p className="text-[13px] text-gray-500 mt-1">
                                                            ₹{firstItem.price} × {firstItem.quantity}
                                                            {remainingCount > 0 && (
                                                                <span className="ml-2 font-medium text-blue-600">
                                                                    (+ {remainingCount} other {remainingCount === 1 ? 'item' : 'items'})
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="rounded-sm h-8 px-4 text-[13px] font-medium shadow-none border-gray-300 text-gray-700 hover:bg-gray-50">
                                                    Order Details
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* MOBILE VIEW */}
                                <div className="md:hidden flex items-start gap-4 p-4 border-b border-gray-100 bg-white active:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="h-16 w-16 shrink-0 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                                        {firstItem?.productId?.images?.[0] ? (
                                            <img src={firstItem.productId.images[0]} alt="product" className="h-full w-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <Package className="h-6 w-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className={`text-[14px] font-semibold ${order.status === 'DELIVERED' ? 'text-green-700' : order.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {order.status === 'DELIVERED' ? 'Delivered' : 
                                             order.status === 'CANCELLED' ? 'Cancelled' : 
                                             order.status === 'PENDING' ? 'Pending' : order.status}
                                        </h4>
                                        <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                            {firstItem?.productId?.name || 'Product Item'}
                                            {remainingCount > 0 && <span className="text-gray-400 ml-1">(+{remainingCount})</span>}
                                        </p>
                                        
                                        {order.paymentStatus === 'FAILED' ? (
                                            <p className="text-[12px] text-red-500 mt-1 font-medium">
                                                Payment Failed
                                            </p>
                                        ) : order.status === 'DELIVERED' ? (
                                            <div className="flex items-center gap-1 mt-1 text-[12px] text-gray-400">
                                                <Star className="h-3 w-3 fill-current text-gray-300" /> Rate this product
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-col items-end justify-center self-center h-full">
                                        <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
