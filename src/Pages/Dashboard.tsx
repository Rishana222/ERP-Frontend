import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Divider, Spin, message } from "antd";
import {
  ShoppingOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";

interface Stats {
  products: number;
  sales: number;
  purchases: number;
  vendors: number;
  customers: number;
  expenses: number;
  profit: number;
}

interface TrendData {
  month: string;
  sales: number;
  purchases: number;
}

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
    profit: 0,
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState(true);

  // Utility: Generate a consistent color per category name
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 65%, 50%)`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryRes, trendRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:3000/api/dashboard/summary"),
          axios.get("http://localhost:3000/api/dashboard/trend"),
          axios.get("http://localhost:3000/api/dashboard/category"),
        ]);

        if (summaryRes.data.success) {
          const data = summaryRes.data.data;
          setStats({
            products: data.totalProducts,
            sales: data.totalSales,
            purchases: data.totalPurchases,
            vendors: data.totalVendors,
            customers: data.totalCustomers,
            expenses: data.totalExpenses,
            profit: data.profit,
          });
        }

        if (trendRes.data.success) setTrendData(trendRes.data.data);
        if (categoryRes.data.success) setPieData(categoryRes.data.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        message.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Products",
      count: stats.products,
      icon: <ShoppingOutlined />,
      color: "#1890ff",
    },
    {
      title: "Sales",
      count: stats.sales,
      icon: <DollarCircleOutlined />,
      color: "#52c41a",
    },
    {
      title: "Purchases",
      count: stats.purchases,
      icon: <ShoppingCartOutlined />,
      color: "#faad14",
    },
    {
      title: "Vendors",
      count: stats.vendors,
      icon: <TeamOutlined />,
      color: "#13c2c2",
    },
    {
      title: "Customers",
      count: stats.customers,
      icon: <UserOutlined />,
      color: "#eb2f96",
    },
    {
      title: "Expenses",
      count: stats.expenses,
      icon: <MoneyCollectOutlined />,
      color: "#722ed1",
    },
    {
      title: "Profit",
      count: stats.profit,
      icon: <DollarCircleOutlined />,
      color: "#ff4d4f",
    },
  ];

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );

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
              <Statistic
                title={card.title}
                value={card.count}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Sales & Purchases Trend */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Sales & Purchases Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#52c41a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#faad14"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Distribution */}
        <Col xs={24} md={8}>
          <Card title="Category Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={stringToColor(entry.name)} />
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
