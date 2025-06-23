import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

const queryClinet = new QueryClient();

const googleClientId =
  "96337949620-36lrmcsg5ui4lgmi3sa8227kek1i6gkc.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClinet}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Toaster />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
