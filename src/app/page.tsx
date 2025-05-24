"use client";

import { Toaster } from "react-hot-toast";
import DesktopComponent from "./desktop/DesktopComponent";

const Page = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <DesktopComponent />
    </div>
  );
};

export default Page;
