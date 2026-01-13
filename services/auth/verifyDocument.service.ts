import api from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";
import { Doc, ImageUploadApiResponse } from "./auth.interface";

class VerifyDocumentService {
  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await api.post<ImageUploadApiResponse>(
        API_ENDPOINTS.UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      if (response.data && response.data.urls) {
        return response.data.urls;
      } else {
        throw new Error("Image upload response is not in the expected format.");
      }
    } catch (error) {
      console.error("Upload Images Error:", error);
      throw new Error("Failed to upload document images. Please try again.");
    }
  }

  async verifyDoc(
    aadharNumber: string,
    frontImageFile: File,
    backImageFile: File,
    profilePicFile: File,
    policeVerificationFile?: File | null
  ) {
    try {
      const filesToUpload: File[] = [
        frontImageFile,
        backImageFile,
        profilePicFile,
      ];

      if (policeVerificationFile) {
        filesToUpload.push(policeVerificationFile);
      }

      const uploadedUrls = await this.uploadImages(filesToUpload);

      if (uploadedUrls.length < 3) {
        throw new Error("Image upload did not return the required URLs.");
      }

      const verificationPayload: Doc = {
        aadharNumber,
        frontImageUrl: uploadedUrls[0],
        backImageUrl: uploadedUrls[1],
        profilePicUrl: uploadedUrls[2],
        policeVerificationUrl: policeVerificationFile ? uploadedUrls[3] : "",
      };

      const response = await api.post(
        API_ENDPOINTS.VERIFY_DOC,
        verificationPayload
      );
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to verify document");
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to Verify User";
      throw new Error(errorMessage);
    }
  }
}

export const verifyDocumentService = new VerifyDocumentService();
