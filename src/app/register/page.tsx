import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import ProtectedRoute from "@/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <RegistrationForm />
    </ProtectedRoute>
  );
};

export default Page;
