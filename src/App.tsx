import { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/Screenshot__49_-removebg-preview.png';
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
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>

        <div
          style={{
            height: 64,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            gap: '10px',
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: '90px', width: 'auto', marginTop: '25px' }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          style={{ marginTop: '60px', border: 'none' }}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: '/',
              icon: <DesktopOutlined />,
              label: 'Dashboard',
            },

            {
              key: 'masters',
              icon: <AppstoreOutlined />,
              label: 'Masters',
              children: [
                { key: '/products', label: 'Products' },
                { key: '/categories', label: 'Categories' },
                { key: '/units', label: 'Units' },
                { key: '/taxes', label: 'Taxes' },
                { key: '/customers', label: 'Customers' },
                { key: '/vendors', label: 'Vendors' },
              ],
            },

            {
              key: 'sales',
              icon: <ShoppingCartOutlined />,
              label: 'Sales',
              children: [
                { key: '/sales', label: 'Sales' },
                { key: '/invoices', label: 'Invoices' },
                { key: '/sales-return', label: 'Sales Return' },
                { key: '/receipts', label: 'Receipts' },
                { key: '/customers', label: 'Customer' },
              ],
            },

            {
              key: 'purchase',
              icon: <ShoppingOutlined />,
              label: 'Purchase',
              children: [
                { key: '/purchase', label: 'Purchase' },
                { key: '/purchase-return', label: 'Purchase Return' },
                { key: '/payments', label: 'Payments' },
                { key: '/vendors', label: 'Vendors' },
              ],
            },

            {
              key: 'stock',
              icon: <DatabaseOutlined />,
              label: 'Stock',
              children: [
                { key: '/stock', label: 'Stock List' },
                { key: '/stock-movement', label: 'Stock Movement' },
              ],
            },

            {
              key: 'accounts',
              icon: <BankOutlined />,
              label: 'Accounts',
              children: [
                { key: '/payments', label: 'Payments' },
                { key: '/transactions', label: 'Transactions' },
              ],
            },

            {
              key: 'expenses',
              icon: <DollarOutlined />,
              label: 'Expenses',
              children: [
                { key: '/expenses', label: 'Expenses' },
                { key: '/expense-categories', label: 'Expense Categories' },
              ],
            },

            {
              key: 'users',
              icon: <UserOutlined />,
              label: 'Users & Roles',
              children: [
                { key: '/user', label: 'Users' },
                { key: '/roles', label: 'Roles & Permissions' },
              ],
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0 }}>
          <Button
            type="primary"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
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
