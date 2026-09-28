import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { IndianRupee, ShoppingBag, PackageOpen, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProductsBySeller } from "@/features/seller/productSlice";

// MOCK DATA for Phase 1
const revenueData = [
  { name: "Mon", total: 12000 },
  { name: "Tue", total: 18000 },
  { name: "Wed", total: 15000 },
  { name: "Thu", total: 25000 },
  { name: "Fri", total: 22000 },
  { name: "Sat", total: 35000 },
  { name: "Sun", total: 28000 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Accessories", value: 300 },
  { name: "Home", value: 200 },
];
const COLORS = ["#0d9488", "#14b8a6", "#5eead4", "#042f2e"];

const recentOrders = [
  { id: "#ORD-8923", customer: "Rahul S.", amount: "₹4,250", status: "Delivered" },
  { id: "#ORD-8924", customer: "Priya M.", amount: "₹12,999", status: "Shipped" },
  { id: "#ORD-8925", customer: "Ankit K.", amount: "₹850", status: "Pending" },
  { id: "#ORD-8926", customer: "Neha R.", amount: "₹2,100", status: "Pending" },
  { id: "#ORD-8927", customer: "Vikram B.", amount: "₹34,500", status: "Shipped" },
];

function SellerDashboard() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.sellerProducts);

  useEffect(() => {
    // Fetch real product count
    dispatch(getProductsBySeller());
  }, [dispatch]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-950">Overview</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-950">₹1,55,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-950">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last week</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <PackageOpen className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            {/* Real Data Here */}
            <div className="text-2xl font-bold text-teal-950">{productList?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Live in store</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-950">₹2,840</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-teal-950">Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0d9488' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-teal-950">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-teal-950">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-teal-700">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge 
                        variant={order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"}
                        className={
                            order.status === "Delivered" ? "bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200" :
                            order.status === "Shipped" ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" :
                            "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                        }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerDashboard;
