import { useState } from "react";
import { Layout, Menu, Button, theme, Dropdown, Space, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "./store/authSlice";
import type { RootState } from "./store";
import logo from "./assets/eeee.png";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DesktopOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  BankOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 1. Get Theme Tokens (Fixes the ReferenceError)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { user } = useSelector((state: RootState) => state.auth);

  // 2. Consistent Width Calculation
  const siderWidth = collapsed ? 80 : 200;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: <span style={{ color: "#9CA3AF" }}>My Profile</span>,
      icon: <UserOutlined style={{ color: "#9CA3AF" }} />,
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar - Fixed Position */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: "10px",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: collapsed ? "70px" : "125px",
              width: "auto",
              marginTop: collapsed ? "12px" : "55px",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          style={{ marginTop: "60px", border: "none" }}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: "/", icon: <DesktopOutlined />, label: "Dashboard" },
            {
              key: "masters",
              icon: <AppstoreOutlined />,
              label: "Masters",
              children: [
                { key: "/products", label: "Products" },
                { key: "/categories", label: "Categories" },
                { key: "/sub-categories", label: "SubCategories" },
                { key: "/units", label: "Units" },
                { key: "/taxes", label: "Taxes" },
                { key: "/customers", label: "Customers" },
                { key: "/vendors", label: "Vendors" },
                { key: "/shops", label: "Shops/Branches" },
                { key: "/variants", label: "Variants" },
              ],
            },
            {
              key: "sales",
              icon: <ShoppingCartOutlined />,
              label: "Sales",
              children: [
                { key: "/sales", label: "New Sale" },
                { key: "/invoices", label: "Invoices" },
                { key: "/sales-return", label: "Sales Return" },
                { key: "/customer-payment", label: "Customer Payments" },
              ],
            },
            {
              key: "purchase",
              icon: <ShoppingOutlined />,
              label: "Purchase",
              children: [
                { key: "/purchase", label: "New Purchase" },
                { key: "/purchase-return", label: "Purchase Return" },
                { key: "/vendor-payments", label: "Vendor Payments" },
              ],
            },
            {
              key: "stock",
              icon: <DatabaseOutlined />,
              label: "Inventory",
              children: [{ key: "/stock-movement", label: "Stock History" }],
            },
            {
              key: "accounts",
              icon: <BankOutlined />,
              label: "Accounts",
              children: [
                { key: "/payments", label: "Customer Ledger" },
                { key: "/transactions", label: "Transactions" },
                { key: "/vendor-ledger", label: "Vendor Ledger" },
                { key: "/Accounts", label: "Accounts" },
              ],
            },
            {
              key: "expenses",
              icon: <DollarOutlined />,
              label: "Expenses",
              children: [
                { key: "/expenses", label: "Expenses" },
                { key: "/expense-categories", label: "Expense Categories" },
              ],
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: "Users & Roles",
              children: [
                { key: "/user", label: "Users" },
                { key: "/roles", label: "Roles " },
                { key: "/permissions", label: "Permissions" },
              ],
            },
          ]}
        />
      </Sider>

      {/* Main Container - Offsets the Fixed Sidebar */}
      <Layout
        style={{
          marginLeft: siderWidth,
          transition: "margin-left 0.2s",
          background: "#f5f5f5",
        }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 1,
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 32, width: 64, height: 64 }}
          />

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: "pointer", padding: "0 8px" }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user?.name || "Admin"}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;