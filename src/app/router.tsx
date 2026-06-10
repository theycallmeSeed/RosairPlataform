import { createBrowserRouter } from "react-router-dom";

import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminQuotesPage from "@/pages/AdminQuotesPage";
import AgentApprovalPage from "@/pages/AgentApprovalPage";
import AgentDashboardPage from "@/pages/AgentDashboardPage";
import AgentNewProductPage from "@/pages/AgentNewProductPage";
import AnalyticsDashboardPage from "@/pages/AnalyticsDashboardPage";
import BuyerDashboardPage from "@/pages/BuyerDashboardPage";
import LandingPage from "@/pages/LandingPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import QuoteRequestSuccessPage from "@/pages/QuoteRequestSuccessPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/product/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "/quote/success",
    element: <QuoteRequestSuccessPage />,
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
    path: "/admin/quotes",
    element: <AdminQuotesPage />,
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
