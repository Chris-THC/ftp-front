import { Toaster } from "react-hot-toast";
import UserManagementTable from "./components/UserManagementTable";
import ProtectedRoute from "@/auth/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <UserManagementTable />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
};

export default Page;
