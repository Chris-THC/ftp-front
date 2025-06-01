import React from "react";
import PerfilUser from "./components/PerfilUsur";
import ProtectedRoute from "@/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Professor", "Student"]}>
      <PerfilUser />
    </ProtectedRoute>
  );
};

export default Page;
