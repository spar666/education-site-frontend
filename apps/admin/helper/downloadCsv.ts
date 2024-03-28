import axios from "axios";
import { getCookie } from "cookies-next";

export const downloadExcelSheet = async (name: string) => {
  const downloadUrl = `${process.env.NEXT_PUBLIC_ADMIN_DOWNLOAD_URL}/${name}/download`; // Update the file extension as needed
  const token = getCookie("accessToken");
  try {
    const response = await axios.get(downloadUrl, {
      responseType: "blob", // Specify that the response is a binary blob (Excel sheet)
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header with the token
      },
    });
    // Create a blob URL for the Excel sheet
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${name}.csv`; // Specify the desired filename with the .csv extension
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    // Clean up the temporary elements
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading Excel sheet:", error);
  }
};
