import { compressImages } from "@/lib/media/compressImage";
import { errorMessage } from "@/lib/http/errorMessage";
import api, { POST } from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";
import { type Doc, type ImageUploadApiResponse } from "./auth.interface";

class VerifyDocumentService {
  async uploadImages(files: File[]): Promise<string[]> {
    try {
      // Photos are shrunk before upload (see lib/media/compressImage); PDFs and videos pass through.
      const prepared = await compressImages(files);
      const formData = new FormData();
      prepared.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await api.post<ImageUploadApiResponse>(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.urls) {
        return response.data.urls;
      } else {
        throw new Error("Image upload response is not in the expected format.");
      }
    } catch (error) {
      console.error("Upload Images Error:", error);
      const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
        ?.response;
      if (response?.status === 413) {
        throw new Error("That file is too large to upload. Please choose a smaller file.");
      }
      // The backend's reason (wrong file type, too many files) is more useful than a generic line.
      const message = response?.data?.message;
      if (response?.status === 400 && typeof message === "string" && message) {
        throw new Error(message);
      }
      throw new Error("Upload failed. Please check your connection and try again.");
    }
  }

  async verifyDoc(
    aadharNumber: string,
    frontImageFile: File,
    backImageFile: File,
    profilePicFile: File,
    policeVerificationFile?: File | null,
  ) {
    try {
      const filesToUpload: File[] = [frontImageFile, backImageFile, profilePicFile];

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
        profilePic: uploadedUrls[2],
        policeVerification: policeVerificationFile ? uploadedUrls[3] : "",
      };

      const response = await POST(API_ENDPOINTS.VERIFY_DOC, verificationPayload, {}, true);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to verify document");
      }

      return response;
    } catch (error) {
      throw new Error(errorMessage(error, "Failed to Verify User"));
    }
  }
}

export const verifyDocumentService = new VerifyDocumentService();
