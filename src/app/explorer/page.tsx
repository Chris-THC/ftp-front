import React from "react";
import FileExplorer from "./FileExplorer";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Professor", "Student"]}>
      <FileExplorer />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
};

export default Page;
