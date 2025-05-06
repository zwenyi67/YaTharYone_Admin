import { t } from "i18next";
import FormHeader from "@/components/common/FormHeader";
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Package, Truck, Utensils, Users, LayoutGrid, UserCheck } from "lucide-react";
import { useState } from "react";
import api from "@/api";
import { Badge } from "@/components/ui/badge";


const DashboardView = () => {

  const [tab] = useState("all");

  // Fetch data based on the selected tab
  const { data } = api.dashboard.getOverallStaticData.useQuery(tab, {
    queryKey: ["getOrders", tab],
    enabled: true,
  });

  const overviewStaticMetrics = [
    { title: 'Total Inventories', count: data?.inventory_items, icon: Package },
    { title: 'Total Suppliers', count: data?.suppliers, icon: Truck },
    { title: 'Total Menu Items', count: data?.menu_items, icon: Utensils },
    { title: 'Total Employees', count: data?.employees, icon: Users },
    { title: 'Total Tables', count: data?.tables, icon: LayoutGrid },
    { title: 'Total Customers', count: data?.customers, icon: UserCheck },
  ];

  const purchaseDataCard = [
    { label: "This Month", value: data?.this_month_purchase_total, color: "bg-blue-100", textColor: "text-blue-600" },
    { label: "Last Month", value: data?.last_month_purhcase_total, color: "bg-yellow-100", textColor: "text-yellow-600" },
    { label: "All Time", value: data?.all_month_purhcase_total, color: "bg-green-100", textColor: "text-green-600" },
  ]

  const revenueDataCard = [
    { label: "This Month", value: data?.this_month_revenue, color: "bg-blue-100", textColor: "text-blue-600" },
    { label: "Last Month", value: data?.last_month_revenue, color: "bg-yellow-100", textColor: "text-yellow-600" },
    { label: "All Time", value: data?.all_time_revenue, color: "bg-green-100", textColor: "text-green-600" },
  ]

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

          {/* Row 2: Revenue Detail Data (Chart View) */}

          <div className="mb-3 mt-5">
            <h2 className="text-secondary font-semibold text-xl">Revenue Data</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {revenueDataCard.map((card, idx) => (
              <div key={idx} className={`rounded-2xl shadow-md p-6 ${card.color}`}>
                <div className="text-sm font-semibold text-gray-500">{card.label} Revenue</div>
                <div className={`text-2xl font-bold mt-2 ${card.textColor}`}>
                  ${(card.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
          {/* Line Chart */}
          <Card className="shadow-md p-4 mb-6">
            <CardContent>
              <h4 className="text-lg font-bold mb-2">Monthly Revenue Data </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.monthly_revenue_chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#003fbe" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Row 3: Purchased Detail Data (Chart View) */}

          <div className="mb-3 mt-5">
            <h2 className="text-secondary font-semibold text-xl">Purchase Data</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {purchaseDataCard.map((card, idx) => (
              <div key={idx} className={`rounded-2xl shadow-md p-6 ${card.color}`}>
                <div className="text-sm font-semibold text-gray-500">{card.label} Purchase</div>
                <div className={`text-2xl font-bold mt-2 ${card.textColor}`}>
                  ${(card.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
          {/* Line Chart */}
          <Card className="shadow-md p-4 mb-6">
            <CardContent>
              <h4 className="text-lg font-bold mb-2">Monthly Purchase Data </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.monthly_purchase_chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#003fbe" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Row 4 Top Menu Data */}
          <div className="mb-3 mt-5">
            <h2 className="text-secondary font-semibold text-xl">Top Sale Menu Data</h2>
          </div>
          <Card className="col-span-2">
            <CardContent className="grid gap-6 md:grid-cols-1">

              {/* List Section */}
              <div className="space-y-4">
                {data?.top_menu_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant="outline">{item.percentage}%</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>{item.sold} sold</span>
                        <span>${item.revenue}</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-secondary rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>




        </div>
      </section>
    </>
  );
};


export default DashboardView;
