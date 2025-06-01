import React from "react";
import FileExplorer from "./FileExplorer";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TopBarOtherScreens from "../components/TopBarOtheScreens";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Professor", "Student"]}>
      <TopBarOtherScreens />
      <FileExplorer />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
};

export default Page;
