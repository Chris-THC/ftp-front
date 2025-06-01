import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TopBarOtherScreens from "../components/TopBarOtheScreens";
import { Toaster } from "react-hot-toast";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <TopBarOtherScreens />
      <RegistrationForm />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
};

export default Page;
