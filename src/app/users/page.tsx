import { Toaster } from "react-hot-toast";
import UserManagementTable from "./components/UserManagementTable";

const Page = () => {
  return (
    <div>
      <UserManagementTable />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Page;
