"use client";

import { Toaster } from "react-hot-toast";
import DesktopComponent from "./desktop/DesktopComponent";
import ProtectedRoute from "@/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Professor"]}>
      <Toaster position="top-right" reverseOrder={false} />
      <DesktopComponent />
    </ProtectedRoute>
  );
};

export default Page;
