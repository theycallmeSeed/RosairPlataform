import { createBrowserRouter } from "react-router-dom";

import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminProductReviewPage from "@/pages/AdminProductReviewPage";
import AgentApprovalPage from "@/pages/AgentApprovalPage";
import AgentDashboardPage from "@/pages/AgentDashboardPage";
import AgentNewProductPage from "@/pages/AgentNewProductPage";
import AnalyticsDashboardPage from "@/pages/AnalyticsDashboardPage";
import BuyerDashboardPage from "@/pages/BuyerDashboardPage";
import CartPage from "@/pages/CartPage";
import CatalogPage from "@/pages/CatalogPage";
import CheckoutConfirmationPage from "@/pages/CheckoutConfirmationPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MarketplacePage from "@/pages/MarketplacePage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";

export const router = createBrowserRouter([
  {
    // Homepage IS the Marketplace (business.md §6) — no separate landing page.
    path: "/",
    element: <MarketplacePage />,
  },
  {
    // The full, filterable "shop everything" catalog — reached from search/category clicks.
    path: "/marketplace",
    element: <CatalogPage />,
  },
  {
    path: "/product/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/checkout/confirmation",
    element: <CheckoutConfirmationPage />,
  },
  {
    path: "/orders/:id",
    element: <OrderTrackingPage />,
  },
  {
    path: "/agent",
    element: <AgentDashboardPage />,
  },
  {
    path: "/agent/new-product",
    element: <AgentNewProductPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
  {
    path: "/admin/products",
    element: <AdminProductReviewPage />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrdersPage />,
  },
  {
    path: "/admin/agents",
    element: <AgentApprovalPage />,
  },
  {
    path: "/analytics",
    element: <AnalyticsDashboardPage />,
  },
  {
    path: "/buyer",
    element: <BuyerDashboardPage />,
  },
]);
