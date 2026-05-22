import { useRef, useState } from "react";
import { useRestoreDatabaseMutation } from "../../state/features/admin/auth/authApiSlice";

export default function RestoreButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreDatabase] = useRestoreDatabaseMutation();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".json")) {
      alert("الرجاء تحديد ملف JSON صحيح");
      return;
    }

    try {
      setIsRestoring(true);

      // Read the file
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);

      console.log(
        "Restoring backup with collections:",
        Object.keys(backupData),
      );

      // Call the restore mutation
      const response = await restoreDatabase(backupData).unwrap();

      console.log("Restore response:", response);

      alert(
        `تم استرجاع البيانات بنجاح\nإجمالي المستندات: ${response.totalDocuments}`,
      );

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error restoring database:", error);
      alert("فشل في استرجاع البيانات. الرجاء المحاولة لاحقاً.");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={handleButtonClick}
          disabled={isRestoring}
          className="rounded bg-blue-500 px-6 py-3 font-bold text-white transition disabled:bg-gray-400 hover:bg-blue-600"
        >
          {isRestoring
            ? "جاري استرجاع البيانات..."
            : "استرجاع النسخة الاحتياطية"}
        </button>
      </div>
    </>
  );
}
