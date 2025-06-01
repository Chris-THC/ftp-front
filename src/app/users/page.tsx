import { Toaster } from "react-hot-toast";
import UserManagementTable from "./components/UserManagementTable";
import ProtectedRoute from "@/auth/ProtectedRoute";
import TopBarOtherScreens from "../components/TopBarOtheScreens";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <TopBarOtherScreens />
      <UserManagementTable />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
};

export default Page;
