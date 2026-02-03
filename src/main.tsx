import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

// Masters
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import SubCategory from "./Pages/SubCategory";
import Units from "./Pages/Units";
import Tax from "./Pages/Tax";
import Customers from "./Pages/Customers";
import Vendors from "./Pages/Vendors";
import Shop from "./Pages/Shop";
import Variant from "./Pages/Variant";

// Sales
import Sales from "./Pages/Sales";
import Invoices from "./Pages/Invoices";
import SalesReturn from "./Pages/SalesReturn";
import Receipts from "./Pages/Receipts";

// Purchase
import Purchase from "./Pages/Purchase";
import PurchaseReturn from "./Pages/PurchaseReturn";

// Stock
import Stock from "./Pages/Stock";
import StockMovement from "./Pages/StockMovement";

// Accounts
import Payments from "./Pages/Payments";
import Transactions from "./Pages/Transactions";

// Expenses
import Expenses from "./Pages/Expenses";
import ExpenseCategories from "./Pages/ExpenseCategories";

// Users
import User from "./Pages/User";
import Roles from "./Pages/Roles";
import Permissions from "./Pages/Permissions";

// Auth Guard
import PrivateRoute from "./Components/PrivateRoute";

// Router setup
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, // login page is public
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App /> {/* All children routes will be protected */}
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/sub-categories",
        element: <SubCategory />,
      },
      {
        path: "/units",
        element: <Units />,
      },
      {
        path: "/taxes",
        element: <Tax />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/vendors",
        element: <Vendors />,
      },
      {
        path: "/shops",
        element: <Shop />,
      },
      {
        path: "/variants",
        element: <Variant />,
      },
      {
        path: "/sales",
        element: <Sales />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/sales-return",
        element: <SalesReturn />,
      },
      {
        path: "/receipts",
        element: <Receipts />,
      },
      {
        path: "/purchase",
        element: <Purchase />,
      },
      {
        path: "/purchase-return",
        element: <PurchaseReturn />,
      },
      {
        path: "/stock",
        element: <Stock />,
      },
      {
        path: "/stock-movement",
        element: <StockMovement />,
      },
      {
        path: "/payments",
        element: <Payments />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/expenses",
        element: <Expenses />,
      },
      {
        path: "/expense-categories",
        element: <ExpenseCategories />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/permissions",
        element: <Permissions />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
