import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "./context/QueryClientProvider";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider>
    <App />
  </QueryClientProvider>
);
