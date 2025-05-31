// components/RenameModal.tsx
interface RenameModalProps {
  isOpen: boolean;
  oldName: string;
  newName: string;
  type: "file" | "folder";
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const RenameModal = ({
  isOpen,
  oldName,
  newName,
  type,
  onChange,
  onClose,
  onSubmit,
}: RenameModalProps) => {
  if (!isOpen) return null;

  console.log("Renaming:", oldName, "to:", newName);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Renombrar {type === "file" ? "archivo" : "carpeta"}
        </h2>
        <input
          className="w-full p-2 border rounded"
          value={newName}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Renombrar
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
