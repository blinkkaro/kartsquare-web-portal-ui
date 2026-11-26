import type { BusinessInfoFormData } from "@/components/pages/businessInfo/businessInfoSchema";
import { errorMessage } from "@/lib/http/errorMessage";
import { POST, GET, PUT } from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";
import { verifyDocumentService } from "./verifyDocument.service";
import type { IBusinessInfo } from "./auth.interface";

/**
 * What an edit sends: only the fields that changed screen collects (the edit form has no category),
 * plus a description. Images may be URLs already uploaded or new files to upload first.
 */
export interface BusinessInfoUpdate {
  business_name?: string;
  description?: string;
  address_id?: string;
  category?: string;
  sub_category?: (string | undefined)[];
  business_images: (File | string)[];
}

class BusinessInfoService {
  async addBusinessInfo(data: BusinessInfoFormData) {
    try {
      const businessImages = data.business_images as File[];
      const filesToUpload = businessImages.filter((item): item is File => item instanceof File);

      let uploadedUrls: string[] = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await verifyDocumentService.uploadImages(filesToUpload);
      }

      const payload = {
        ...data,
        business_images: uploadedUrls,
      };

      const response = await POST(API_ENDPOINTS.ADD_BUSINESS_INFO, payload);
      return response;
    } catch (error) {
      throw new Error(errorMessage(error, "Failed to Add Business Info"));
    }
  }
  async getBusinessInfo(): Promise<IBusinessInfo> {
    try {
      const response = await GET<IBusinessInfo>(API_ENDPOINTS.GET_BUSINESS_INFO);
      return response.data;
    } catch (error) {
      throw new Error(errorMessage(error, "Failed to Get Business Info"));
    }
  }
  async updateBusinessInfo(data: BusinessInfoUpdate) {
    try {
      const businessImages = data.business_images;

      const existingUrls = businessImages.filter(
        (item): item is string => typeof item === "string",
      );

      const filesToUpload = businessImages.filter((item): item is File => item instanceof File);

      let uploadedUrls: string[] = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await verifyDocumentService.uploadImages(filesToUpload);
      }

      const payload = {
        ...data,
        business_images: [...existingUrls, ...uploadedUrls],
      };

      const response = await PUT(API_ENDPOINTS.UPDATE_BUSINESS_INFO, payload);
      return response;
    } catch (error) {
      throw new Error(errorMessage(error, "Failed to Update Business Info"));
    }
  }
}

export const businessInfoService = new BusinessInfoService();
