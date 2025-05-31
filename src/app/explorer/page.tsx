import React from "react";
import FileExplorer from "./FileExplorer";
import { Toaster } from "react-hot-toast";

const Page = () => {
  return (
    <div>
      <FileExplorer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Page;
