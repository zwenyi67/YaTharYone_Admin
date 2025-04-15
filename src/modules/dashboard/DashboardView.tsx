import { t } from "i18next";
import FormHeader from "@/components/common/FormHeader";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Package, Truck, Utensils, Users, LayoutGrid, UserCheck } from "lucide-react";
import { useState } from "react";
import api from "@/api";

const subTabOverallStaticData = ["all", "active", "inactive"];

const salesData = [
  { month: 'Jan', sales: 400 },
  { month: 'Feb', sales: 300 },
  { month: 'Mar', sales: 500 },
  { month: 'Apr', sales: 200 },
];

const topSellingItems = [
  { rank: 1, name: 'Cheeseburger', sold: 50, revenue: '$500' },
  { rank: 2, name: 'Spaghetti', sold: 40, revenue: '$450' },
];

const wasteData = [
  { item: 'Tissue', quantity: 20, reason: 'Damaged' },
  { item: 'Plate', quantity: 5, reason: 'Broken' },
];

const employees = [
  { name: 'John', shift: '10 AM - 6 PM', role: 'Chef', status: 'Present' },
  { name: 'Sarah', shift: '12 PM - 8 PM', role: 'Waiter', status: 'Absent' },
];

const reservations = [
  { customer: 'Alice', table: 4, time: '7 PM', status: 'Confirmed' },
  { customer: 'Bob', table: 2, time: '8 PM', status: 'Pending' },
];

const inventory = [
  { name: 'Tomatoes', quantity: '5 kg', status: 'Low Stock' },
  { name: 'Chicken', quantity: '2 kg', status: 'Out of Stock' },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
};

const revenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 15000 },
  { name: "Mar", revenue: 18000 },
  { name: "Apr", revenue: 20000 },
  { name: "May", revenue: 24000 },
];

const orderTypeData = [
  { name: "Dine-in", value: 400 },
  { name: "Takeaway", value: 300 },
  { name: "Delivery", value: 500 },
];

const topDishesData = [
  { name: "Pizza", sales: 150 },
  { name: "Burger", sales: 120 },
  { name: "Pasta", sales: 90 },
];

const lowStockAlerts = [
  { item: "Tomatoes", quantity: "5 kg" },
  { item: "Chicken", quantity: "2 kg" },
  { item: "Cheese", quantity: "1 kg" },
];

const paymentMethodsData = [
  { name: "Cash", value: 5000 },
  { name: "Card", value: 7000 },
  { name: "Digital Wallet", value: 4000 },
];

const DashboardView = () => {

  const [tab, setTab] = useState("all");

  // Fetch data based on the selected tab
  const { data } = api.dashboard.getOverallStaticData.useQuery(tab, {
    queryKey: ["getOrders", tab],
    enabled: true,
  });

  const overviewStaticMetrics = [
    { title: 'Total Inventory Items', count: data?.inventory_items, icon: Package },
    { title: 'Total Suppliers', count: data?.suppliers, icon: Truck },
    { title: 'Total Menu Items', count: data?.menu_items, icon: Utensils },
    { title: 'Total Employees', count: data?.employees, icon: Users },
    { title: 'Total Tables', count: data?.tables, icon: LayoutGrid },
    { title: 'Total Customers', count: data?.customers, icon: UserCheck },
  ];

  const handleTabClick = (status: any) => {
    setTab(status); // Update the tab state
  };
  return (
    <>
      <section className="m-4">
        <FormHeader
          title={t("title.dashboard")}
        />
        <div className="p-6 bg-white rounded-lg">

          {/* Row 1: Overview Metrics (Card View) */}
          <div className="mb-3">
            <h2 className="text-secondary font-semibold text-xl">Overall Static Data</h2>
          </div>
          <div className="mb-3 flex space-x-4 mb-4">
            {subTabOverallStaticData.map((status) => (
              <button
                key={status}
                onClick={() => handleTabClick(status)}
                className={`px-4 py-2 rounded ${tab === status
                  ? "bg-secondary text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                {t(`fields.dashboard.subTab.${status}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-5">
            {overviewStaticMetrics.map((metric, idx) => (
              <Card key={idx} className="flex items-center p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg">
                <div className="mr-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 p-3 text-white">
                  {/* Use the provided icon, or fallback to a default icon */}
                  {metric.icon ? <metric.icon className="h-6 w-6" /> : <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 108 8 8.009 8.009 0 00-8-8zm1 12H9v-2h2zm0-4H9V6h2z" /></svg>}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{metric.count}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Row 2: Order & Sales Analytics (Chart Views) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Sales (Last 4 Months)</h2>
              <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-sm text-muted-foreground"
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="sales"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                </BarChart>
              </ChartContainer>
            </Card>
            {/* Orders by Time Chart Placeholder */}
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Orders by Time</h2>
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Chart Placeholder
              </div>
            </Card>
          </div>

          <div>
            {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {["Total Revenue", "Total Orders", "Total Customers", "Low Stock Alerts"].map((title, index) => (
          <Card key={index} className="shadow-md p-4">
            <CardContent>
              <h4 className="text-gray-600">{title}</h4>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 5000)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Revenue Trend */}
      <Card className="shadow-md p-4">
        <CardContent>
          <h4 className="text-lg font-bold mb-2">Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#003fbe" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Order Type Breakdown */}
      <Card className="shadow-md p-4">
        <CardContent>
          <h4 className="text-lg font-bold mb-2">Order Type Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={orderTypeData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                {orderTypeData.map((entry, index) => (
                  <Cell key={`${entry}-${index}`} fill={["#f87171", "#60a5fa", "#34d399"][index % 3]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Low Stock Alerts */}
      <Card className="shadow-md p-4">
        <CardContent>
          <h4 className="text-lg font-bold mb-2">Low Stock Alerts</h4>
          <ul>
            {lowStockAlerts.map((item, index) => (
              <li key={index} className="text-red-600">{item.item}: {item.quantity}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card className="shadow-md p-4">
        <CardContent>
          <h4 className="text-lg font-bold mb-2">Payment Methods</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={paymentMethodsData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`${entry}-${index}`} fill={["#fbbf24", "#3b82f6", "#10b981"][index % 3]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Top Selling Dishes */}
      <Card className="shadow-md p-4">
        <CardContent>
          <h4 className="text-lg font-bold mb-2">Top Selling Dishes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topDishesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
          </div>

          {/* Row 3: Top Selling & Low-Selling Items (Tables) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Top Selling Items</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Item Name</th>
                    <th className="px-4 py-2">Sold</th>
                    <th className="px-4 py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingItems.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{item.rank}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.sold}</td>
                      <td className="px-4 py-2">{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Low Selling Items</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Item Name</th>
                    <th className="px-4 py-2">Sold</th>
                    <th className="px-4 py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">Vegan Salad</td>
                    <td className="px-4 py-2">5</td>
                    <td className="px-4 py-2">$20</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Lemon Tart</td>
                    <td className="px-4 py-2">7</td>
                    <td className="px-4 py-2">$30</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* Row 4: Waste Control Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Waste Control Summary</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteData.map((waste, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{waste.item}</td>
                      <td className="px-4 py-2">{waste.quantity}</td>
                      <td className="px-4 py-2">{waste.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Waste Trend</h2>
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Chart Placeholder
              </div>
            </Card>
          </div>

          {/* Row 5: Employee & Reservations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Overview */}
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Employee Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <h3 className="text-sm font-medium">Total Employees</h3>
                  <p className="mt-2 font-bold">15</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-sm font-medium">Active Staff Today</h3>
                  <p className="mt-2 font-bold">12</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-sm font-medium">Absent Employees</h3>
                  <p className="mt-2 font-bold">3</p>
                </Card>
              </div>
              <table className="mt-4 min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Shift</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.shift}</td>
                      <td className="px-4 py-2">{emp.role}</td>
                      <td className="px-4 py-2">{emp.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            {/* Reservations & Calendar */}
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Reservations</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Table</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{res.customer}</td>
                      <td className="px-4 py-2">{res.table}</td>
                      <td className="px-4 py-2">{res.time}</td>
                      <td className="px-4 py-2">{res.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Calendar />
              </div>
            </Card>
          </div>

          {/* Row 6: Customer Insights & Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Customer Feedback Ratings</h2>
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Pie Chart Placeholder
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Recent Customer Feedback</h2>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <p className="font-medium">Mark</p>
                  <p className="text-sm text-muted-foreground">⭐⭐⭐⭐ - Loved the service!</p>
                </li>
                <li className="border-b pb-2">
                  <p className="font-medium">Amy</p>
                  <p className="text-sm text-muted-foreground">⭐⭐ - Food was cold.</p>
                </li>
              </ul>
            </Card>
          </div>

          {/* Row 7: Inventory & Stock Control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Low Stock Items</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Available Quantity</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((inv, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{inv.name}</td>
                      <td className="px-4 py-2">{inv.quantity}</td>
                      <td className="px-4 py-2">{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Inventory Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <h3 className="text-sm font-medium">Total Stock Items</h3>
                  <p className="mt-2 font-bold">50</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-sm font-medium">Items Running Low</h3>
                  <p className="mt-2 font-bold">5</p>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};


export default DashboardView;
