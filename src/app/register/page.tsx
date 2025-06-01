import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TopBarOtherScreens from "../components/TopBarOtheScreens";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <TopBarOtherScreens />
      <RegistrationForm />
    </ProtectedRoute>
  );
};

export default Page;
