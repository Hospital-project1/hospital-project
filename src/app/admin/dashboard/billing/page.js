"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import MetricCard from "../../../components/dashboard/ui/MetricCard";
import RevenueChart from "../../../components/dashboard/charts/RevenueChart";

export default function BillingPage() {
  const [billingData, setBillingData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await axios.get("/api/Billing");
        setBillingData(res.data);

        // احسب الإيرادات الشهرية
        const monthlyRevenue = {};

        res.data.forEach((bill) => {
          if (bill.status === "paid") {
            const date = new Date(bill.createdAt);
            
          }
        });

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

      

        setRevenueData(formattedRevenue);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };

    fetchBilling();
  }, []);

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
