"use client";

import MetricCard from "../../../components/dashboard/ui/MetricCard";
import RevenueChart from "../../../components/dashboard/charts/RevenueChart";

export default function BillingPage() {
  // Static billing data
  const billingData = [
    {
      id: 1,
      totalAmount: 300,
      status: "paid",
      paymentMethod: "Credit Card",
      createdAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 2,
      totalAmount: 300,
      status: "pending",
      paymentMethod: "Paypal",
      createdAt: "2025-02-20T00:00:00Z",
    },
    {
      id: 3,
      totalAmount: 290,
      status: "paid",
      paymentMethod: "Paypal",
      createdAt: "2025-03-10T00:00:00Z",
    },
  ];

  // Manually calculate totals
  const totalRevenue = billingData
    .filter((b) => b.status === "paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalBills = billingData.length;
  const paidBills = billingData.filter((b) => b.status === "paid").length;
  const pendingBills = billingData.filter((b) => b.status === "pending").length;

  const paymentMethods = billingData.reduce((acc, bill) => {
    acc[bill.paymentMethod] = (acc[bill.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  // Static revenue chart data
  const revenueData = [
    { month: "Jan", revenue: 120 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 150 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Billing Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Revenue" value={`JD ${totalRevenue}`} />
        <MetricCard title="Paid Bills" value={paidBills} />
        <MetricCard title="Pending Bills" value={pendingBills} />
      </div>

      <div className="mt-6">
        <RevenueChart data={revenueData} />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Payment Method Stats</h2>
        <ul className="list-disc list-inside">
          {Object.entries(paymentMethods).map(([method, count]) => (
            <li key={method}>
              {method}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}