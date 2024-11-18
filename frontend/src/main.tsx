import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/landingPage.tsx";
import LoginPage from "./pages/auth/login.tsx";
import RegisterPage from "./pages/auth/register.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExploreLawsPage from "./pages/landing/explore.tsx";
import ChatbotPage from "./pages/chat/chat.tsx";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Law } from "./model/law.tsx";
import { SelectedLawsContext } from "./context/context.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/laws",
    element: <ExploreLawsPage />,
  },
  {
    path: "/chat",
    element: <ChatbotPage />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

const queryClient = new QueryClient();

function MainApp() {
  const [currentSelectedLaws, setCurrentSelectedLaws] = useState<Law[]>([]);
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedLawsContext.Provider
        value={{ currentSelectedLaws, setCurrentSelectedLaws }}
      >
        <RouterProvider router={router} />
        <ToastContainer />
      </SelectedLawsContext.Provider>
    </QueryClientProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
