import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetBackupUrlQuery } from "../../state/features/admin/auth/authApiSlice";
import { RootState } from "../../state/store/store";
import { API_URL } from "../../state/app/apiSlice";

export default function BackupButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { refetch } = useGetBackupUrlQuery();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleBackupDatabase = async () => {
    try {
      setIsDownloading(true);

      // Refetch to get the latest backup URL and filename with current timestamp
      const { data } = await refetch();

      if (!data) {
        throw new Error("Failed to get backup URL");
      }

      const { url, filename } = data;
      const fullUrl = `${API_URL}${url}`;

      console.log("Backup URL:", fullUrl);
      console.log("Filename:", filename);
      console.log("Token:", token ? "Present" : "Missing");

      // Fetch the actual backup file with authorization header
      const headers: HeadersInit = {
        credentials: "include",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(fullUrl, {
        method: "GET",
        credentials: "include",
        headers,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text.substring(0, 200));
        throw new Error(`Backup failed with status ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      console.log("Blob size:", blob.size);
      console.log("Blob type:", blob.type);

      // Create a download link and trigger the download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error backing up database:", error);
      alert("فشل في حفظ النسخة الاحتياطية. الرجاء المحاولة لاحقاً.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mb-6 flex justify-center">
      <button
        onClick={handleBackupDatabase}
        disabled={isDownloading}
        className="rounded bg-green-500 px-6 py-3 font-bold text-white transition disabled:bg-gray-400 hover:bg-green-600"
      >
        {isDownloading
          ? "جاري عمل النسخة الاحتياطية..."
          : "حفظ النسخة الاحتياطية"}
      </button>
    </div>
  );
}
