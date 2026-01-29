import { BusinessInfoFormData } from "@/components/pages/businessInfo/businessInfoSchema";
import { API_ENDPOINTS } from "./apiEndPoint";
import { verifyDocumentService } from "./verifyDocument.service";
import { POST, GET, PUT } from "../api";
import { itIT } from "@mui/x-date-pickers/locales";
import { IBusinessInfo } from "./auth.interface";

class BusinessInfoService {
  async addBusinessInfo(data: BusinessInfoFormData) {
    try {
      const businessImages = data.business_images as File[];
      const filesToUpload = businessImages.filter(
        (item): item is File => item instanceof File,
      );

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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to Add Business Info";
      throw new Error(errorMessage);
    }
  }
  async getBusinessInfo():Promise<IBusinessInfo> {
    try {
      const response = await GET<IBusinessInfo>(API_ENDPOINTS.GET_BUSINESS_INFO);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to Get Business Info";
      throw new Error(errorMessage);
    }
  }
  async updateBusinessInfo(data: BusinessInfoFormData) {
    try {
      const businessImages = data.business_images as (File | string)[];

      const existingUrls = businessImages.filter(
        (item): item is string => typeof item === "string",
      );

      const filesToUpload = businessImages.filter(
        (item): item is File => item instanceof File,
      );

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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to Update Business Info";
      throw new Error(errorMessage);
    }
  }
}

export const businessInfoService = new BusinessInfoService();
