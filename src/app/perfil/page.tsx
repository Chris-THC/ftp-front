import React from "react";
import PerfilUser from "./components/PerfilUsur";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TopBarOtherScreens from "../components/TopBarOtheScreens";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Professor", "Student"]}>
      <TopBarOtherScreens />
      <PerfilUser />
    </ProtectedRoute>
  );
};

export default Page;
