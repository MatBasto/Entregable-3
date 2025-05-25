import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { createClient } from "@supabase/supabase-js";

// Configuración Supabase
const supabaseUrl = "https://hksxaaphqkzlaegfucmo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrc3hhYXBocWt6bGFlZ2Z1Y21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzA0MjcsImV4cCI6MjA2MzY0NjQyN30.Up5MQ3JslFIKpw3QGqJ6W76AB4aWMyOLBTeoqMrEvHw";

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider supabase={supabase}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
