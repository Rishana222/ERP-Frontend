import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './Pages/Dashboard';
import Products from './Pages/Products';
import Categories from './Pages/Categories';
import Tax from './Pages/Tax';
import Units from './Pages/Units';
import Customers from './Pages/Customers';
import Vendors from './Pages/Vendors';

import Sales from './Pages/Sales';
import Invoices from './Pages/Invoices';
import SalesReturn from './Pages/SalesReturn';
import Receipts from './Pages/Receipts';

import Purchase from './Pages/Purchase';
import PurchaseReturn from './Pages/PurchaseReturn';

import Stock from './Pages/Stock';
import StockMovement from './Pages/StockMovement';

import Payments from './Pages/Payments';
import Transactions from './Pages/Transactions';

import Expenses from './Pages/Expenses';
import ExpenseCategories from './Pages/ExpenseCategories';

import User from './Pages/User';
import Roles from './Pages/Roles';

import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Dashboard
      {
        path: '/',
        element: <Dashboard />,
      },

      // Masters
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/categories',
        element: <Categories />,
      },
       {
        path: '/units',
        element: <Units />,      // ✅ ADDED
      },
      {
        path: '/taxes',
        element: <Tax />,        // ✅ ADDED
      },
      {
        path: '/customers',
        element: <Customers />,
      },
      {
        path: '/vendors',
        element: <Vendors />,
      },

      // Sales
      {
        path: '/sales',
        element: <Sales />,
      },
      {
        path: '/invoices',
        element: <Invoices />,
      },
      {
        path: '/sales-return',
        element: <SalesReturn />,
      },
      {
        path: '/receipts',
        element: <Receipts />,
      },

      // Purchase
      {
        path: '/purchase',
        element: <Purchase />,
      },
      {
        path: '/purchase-return',
        element: <PurchaseReturn />,
      },

      // Stock
      {
        path: '/stock',
        element: <Stock />,
      },
      {
        path: '/stock-movement',
        element: <StockMovement />,
      },

      // Accounts
      {
        path: '/payments',
        element: <Payments />,
      },
      {
        path: '/transactions',
        element: <Transactions />,
      },

      // Expenses
      {
        path: '/expenses',
        element: <Expenses />,
      },
      {
        path: '/expense-categories',
        element: <ExpenseCategories />,
      },

      // Users
      {
        path: '/user',
        element: <User />,
      },
      {
        path: '/roles',
        element: <Roles />,
      },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#b3b3cc', // `#29293d`-nte kurachoode light aaya version (Buttons-inu)
      colorBgContainer: '#ffffff', 
      borderRadius: 10, // Kurachoode modern aakkan vendi rounding kootti
      fontFamily: "'Inter', sans-serif",
    },
    components: {
      Layout: {
        siderBg: '#29293d', // Sider-nu nee paranja aa exact Deep Slate color
        headerBg: '#ffffff', 
        bodyBg: '#f0f0f5',   // Background-nu oru light slate tint (Grey-ish blue)
      },
      Menu: {
        darkItemBg: '#29293d',
        darkItemSelectedBg: '#4d4d70', // Selected portion
        darkItemSelectedColor: '#ffffff',
      },
    },
  }}
>
      <RouterProvider router={router} />
    </ConfigProvider>
    
  </StrictMode>
);
