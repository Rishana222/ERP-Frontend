import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Divider } from "antd";
import {
  ShoppingOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "axios";

interface Stats {
  products: number;
  sales: number;
  purchases: number;
  vendors: number;
  customers: number;
  expenses: number;
}

// For line chart data
interface TrendData {
  month: string;
  sales: number;
  purchases: number;
}

// Pie chart data type
interface PieData {
  name: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    sales: 0,
    purchases: 0,
    vendors: 0,
    customers: 0,
    expenses: 0,
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);

  // Fetch stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, sales, purchases, vendors, customers, expenses] =
          await Promise.all([
            axios.get("/api/products"),
            axios.get("/api/sales"),
            axios.get("/api/purchases"),
            axios.get("/api/vendors"),
            axios.get("/api/customers"),
            axios.get("/api/expenses"),
          ]);

        setStats({
          products: products.data.length,
          sales: sales.data.length,
          purchases: purchases.data.length,
          vendors: vendors.data.length,
          customers: customers.data.length,
          expenses: expenses.data.length,
        });

        // Example trend data: last 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        setTrendData(
          months.map((month, idx) => ({
            month,
            sales: Math.floor(Math.random() * 1000),
            purchases: Math.floor(Math.random() * 500),
          }))
        );

        // Example pie data: distribution of categories
        setPieData([
          { name: "Electronics", value: 400 },
          { name: "Furniture", value: 300 },
          { name: "Clothing", value: 300 },
          { name: "Other", value: 200 },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { title: "Products", count: stats.products, icon: <ShoppingOutlined />, color: "#1890ff" },
    { title: "Sales", count: stats.sales, icon: <DollarCircleOutlined />, color: "#52c41a" },
    { title: "Purchases", count: stats.purchases, icon: <ShoppingCartOutlined />, color: "#faad14" },
    { title: "Vendors", count: stats.vendors, icon: <TeamOutlined />, color: "#13c2c2" },
    { title: "Customers", count: stats.customers, icon: <UserOutlined />, color: "#eb2f96" },
    { title: "Expenses", count: stats.expenses, icon: <MoneyCollectOutlined />, color: "#722ed1" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ padding: 24 }}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} md={8} lg={6} key={card.title}>
            <Card
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Statistic title={card.title} value={card.count} prefix={card.icon} valueStyle={{ color: card.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Line Chart: Sales & Purchases Trends */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Sales & Purchases Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#52c41a" strokeWidth={2} />
                <Line type="monotone" dataKey="purchases" stroke="#faad14" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart: Category Distribution */}
        <Col xs={24} md={8}>
          <Card title="Category Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
