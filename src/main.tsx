import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";

// Pages
import App from "./App";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import SubCategory from "./Pages/SubCategory";
import Units from "./Pages/Units";
import Tax from "./Pages/Tax";
import Customers from "./Pages/Customers";
import Vendors from "./Pages/Vendors";
import Shop from "./Pages/Shop";
import Variant from "./Pages/Variant";
import Sales from "./Pages/Sales";
import Invoices from "./Pages/Invoices";
import SalesReturn from "./Pages/SalesReturn";
import Receipts from "./Pages/Receipts";
import Purchase from "./Pages/Purchase";
import PurchaseReturn from "./Pages/PurchaseReturn";
import Stock from "./Pages/Stock";
import StockMovement from "./Pages/StockMovement";
import Payments from "./Pages/Payments";
import Transactions from "./Pages/Transactions";
import Expenses from "./Pages/Expenses";
import ExpenseCategories from "./Pages/ExpenseCategories";
import User from "./Pages/User";
import Roles from "./Pages/Roles";
import Permissions from "./Pages/Permissions";

// Auth Guards
import { PrivateRoute, LoginProtect } from "./Components/PrivateRoute";

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LoginProtect>
        <Login />
      </LoginProtect>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "categories", element: <Categories /> },
      { path: "sub-categories", element: <SubCategory /> },
      { path: "units", element: <Units /> },
      { path: "taxes", element: <Tax /> },
      { path: "customers", element: <Customers /> },
      { path: "vendors", element: <Vendors /> },
      { path: "shops", element: <Shop /> },
      { path: "variants", element: <Variant /> },
      { path: "sales", element: <Sales /> },
      { path: "invoices", element: <Invoices /> },
      { path: "sales-return", element: <SalesReturn /> },
      { path: "receipts", element: <Receipts /> },
      { path: "purchase", element: <Purchase /> },
      { path: "purchase-return", element: <PurchaseReturn /> },
      { path: "stock", element: <Stock /> },
      { path: "stock-movement", element: <StockMovement /> },
      { path: "payments", element: <Payments /> },
      { path: "transactions", element: <Transactions /> },
      { path: "expenses", element: <Expenses /> },
      { path: "expense-categories", element: <ExpenseCategories /> },
      { path: "user", element: <User /> },
      { path: "roles", element: <Roles /> },
      { path: "permissions", element: <Permissions /> },
    ],
  },
]);

const queryClient = new QueryClient();
const theme = {
  token: {
  
    colorPrimary: "#00264d", 
    
    
    colorBgLayout: "#F0F2F5",     
    colorBgContainer: " #e6e6e6",   

   
    colorText: "#1F2937",         
    colorTextSecondary: "#4B5563", 
    colorTextHeading: "#111827",   
    
    
    colorBorder: "#D1D5DB",
    colorBorderSecondary: "#E5E7EB",

    borderRadius: 4,              
    fontSize: 14,
  },

  components: {
    Input: {
      colorBgContainer: "#FFFFFF",
      colorText: "#1F2937",
      colorTextPlaceholder: "#9CA3AF",
      colorBorder: "#D1D5DB",
      activeBorderColor: "#0056D2",
      hoverBorderColor: "#9CA3AF",
    },

 
    Select: {
      colorBgContainer: "#FFFFFF",
      colorText: "#1F2937",
      optionSelectedBg: "#E6F0FF", 
      optionActiveBg: "#F3F4F6",
    },


    Form: {
      labelColor: "#374151",      
      labelFontSize: 14,
      verticalLabelPadding: "0 0 6px",
    },


   Table: {
      headerBg: "#00264d",        
      headerColor: "#FFFFFF",     
      headerSortActiveBg: "#0056D2",
      headerBorderRadius: 4,
      borderColor: "#999999",
    },
  
    Empty: {
      colorTextDescription: "#6B7280", 
    },

  
    Modal: {
      contentBg: "#FFFFFF",
      headerBg: "#FFFFFF",
      titleColor: "#111827",
    },


    Button: {
      fontWeight: 500,
      controlHeight: 36,
    },
  },
};


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
