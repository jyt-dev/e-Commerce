import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '@/features/shopping/orderThunk';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SpinnerCustom } from '@/components/ui/spinner';

export default function OrderHistory() {
    const dispatch = useDispatch();
    const { orderList, isLoading } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'default';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    if (isLoading && orderList.length === 0) {
        return <div className="flex justify-center p-8"><SpinnerCustom /></div>;
    }

    if (orderList.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    You have not placed any orders yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Your Order History</h3>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell className="font-medium text-xs">{order._id}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>₹{order.totalAmount?.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(order.orderStatus)}>
                                        {order.orderStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {order.paymentStatus === 'Paid' ? (
                                        <Badge variant="success">Paid</Badge>
                                    ) : (
                                        <Badge variant="secondary">{order.paymentStatus || 'Pending'}</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
