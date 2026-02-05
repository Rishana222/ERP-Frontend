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
    colorPrimary: "#38BDF8",

    // 🌑 lighter darks
    colorBgLayout: "#0F172A",     // was #020617
    colorBgContainer: "#1E293B",  // was #111827

    colorText: "#E5E7EB",
    colorTextHeading: "#38BDF8",
    colorIcon: "#94A3B8",
    colorIconHover: "#38BDF8",

    borderRadius: 10,
    fontSize: 14,
  },

  components: {
    // 📦 Modal / Form container
    Modal: {
      contentBg: "#0F172A",   // lighter dark
      headerBg: "#0F172A",
      titleColor: "#38BDF8",
    },

    // 🧾 Form labels
    Form: {
      labelColor: "#E5E7EB",
      labelRequiredMarkColor: "#EF4444",
    },

    // 📝 Inputs (still light for contrast)
    Input: {
      colorBgContainer: "#F8FAFC",   // soft white (not pure)
      colorText: "#0F172A",
      colorTextPlaceholder: "#64748B",
      colorBorder: "#CBD5E1",
      activeBorderColor: "#38BDF8",
    },

    // 🔽 Select
    Select: {
      colorBgContainer: "#F8FAFC",
      colorText: "#0F172A",
      colorBorder: "#CBD5E1",
      optionSelectedBg: "#E0F2FE",
      optionActiveBg: "#F1F5F9",
    },

    // 📊 Table header (lighter dark)
    Table: {
      headerBg: "#1E293B",
      headerColor: "#E5E7EB",
      rowHoverBg: "#334155",
      borderColor: "#334155",
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
