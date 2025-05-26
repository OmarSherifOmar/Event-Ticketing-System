import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const API_URL = "http://localhost:5000/api/v1/users/events/analytics";

function EventAnalyticsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!data.length) return <div>No analytics data available.</div>;

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "2rem auto" }}>
      <h3>Event Ticket Booking Analytics</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={v => `${v.toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="bookedPercentage" fill="#6e8efb" name="Booked %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventAnalyticsChart;