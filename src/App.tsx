import { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown, Space, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from './store/authSlice';
import type { RootState } from './store';
import logo from './assets/eeee.png';
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
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const { user } = useSelector((state: RootState) => state.auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  const userMenuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontWeight: "bold",
            gap: "10px",
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
                { key: "/receipts", label: "Receipts" },
              ],
            },
            {
              key: "purchase",
              icon: <ShoppingOutlined />,
              label: "Purchase",
              children: [
                { key: "/purchase", label: "New Purchase" },
                { key: "/purchase-return", label: "Purchase Return" },
                { key: "/payments", label: "Vendor Payments" },
              ],
            },
            {
              key: "stock",
              icon: <DatabaseOutlined />,
              label: "Inventory",
              children: [
                { key: "/stock", label: "Stock Overview" },
                { key: "/stock-movement", label: "Stock History" },
              ],
            },
            {
              key: "accounts",
              icon: <BankOutlined />,
              label: "Accounts",
              children: [
                { key: "/payments", label: "Payments" },
                { key: "/transactions", label: "Transactions" },
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

      <Layout>
        <Header style={{
          padding: '0 24px 0 0',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />


          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer', padding: '0 8px' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user?.name || 'Admin'}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
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