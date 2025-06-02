import { FaRegFilePdf, FaFileZipper, FaWindows } from "react-icons/fa6";
import {
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeDocx,
  BsFiletypeXlsx,
  BsFiletypePptx,
  BsFiletypeTxt,
  BsFiletypeCsv,
} from "react-icons/bs";
import { LuFileVideo2 } from "react-icons/lu";
import { MdOutlineAudiotrack } from "react-icons/md";
import { FileText } from "lucide-react";
import { Folder } from "lucide-react";

interface Props {
  name: string;
  isDirectory: boolean;
  className?: string;
}

export const getFileIcon = ({
  name,
  isDirectory,
  className = "h-5 w-5 mr-2",
}: Props) => {
  if (isDirectory) return <Folder className={`text-amber-500 ${className}`} />;

  const ext = name.split(".").pop()?.toLowerCase();

  const iconMap: { [key: string]: JSX.Element } = {
    pdf: <FaRegFilePdf className={`text-red-500 ${className}`} />,
    docx: <BsFiletypeDocx className={`text-blue-700 ${className}`} />,
    xlsx: <BsFiletypeXlsx className={`text-green-600 ${className}`} />,
    xls: <BsFiletypeXlsx className={`text-green-600 ${className}`} />, // Added for Excel files
    pptx: <BsFiletypePptx className={`text-orange-600 ${className}`} />,
    txt: <BsFiletypeTxt className={`text-gray-500 ${className}`} />,
    csv: <BsFiletypeCsv className={`text-teal-600 ${className}`} />,
    jpg: <BsFiletypeJpg className={`text-pink-500 ${className}`} />,
    jpeg: <BsFiletypeJpg className={`text-pink-500 ${className}`} />,
    png: <BsFiletypePng className={`text-pink-500 ${className}`} />,
    zip: <FaFileZipper className={`text-yellow-600 ${className}`} />,
    rar: <FaFileZipper className={`text-yellow-600 ${className}`} />,
    mp3: <MdOutlineAudiotrack className={`text-purple-600 ${className}`} />,
    wav: <MdOutlineAudiotrack className={`text-purple-600 ${className}`} />,
    flac: <MdOutlineAudiotrack className={`text-purple-600 ${className}`} />,
    aac: <MdOutlineAudiotrack className={`text-purple-600 ${className}`} />,
    ogg: <MdOutlineAudiotrack className={`text-purple-600 ${className}`} />,
    mp4: <LuFileVideo2 className={`text-blue-400 ${className}`} />,
    mov: <LuFileVideo2 className={`text-blue-400 ${className}`} />,
    avi: <LuFileVideo2 className={`text-blue-400 ${className}`} />,
    mkv: <LuFileVideo2 className={`text-blue-400 ${className}`} />,
    exe: <FaWindows className={`text-gray-700 ${className}`} />,
    msi: <FileText className={`text-gray-700 ${className}`} />,
    dmg: <FileText className={`text-gray-700 ${className}`} />,
  };

  return (
    iconMap[ext || ""] || <FileText className={`text-gray-500 ${className}`} />
  );
};
