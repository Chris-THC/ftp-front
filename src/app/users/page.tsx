import React from "react";
import UserManagement from "./components/UserManagement";
import { Toaster } from "react-hot-toast";

const Page = () => {
  return (
    <div>
      <UserManagement />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Page;
