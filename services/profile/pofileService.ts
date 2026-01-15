import { DELETE, GET, PUT } from "../api";
import { verifyDocumentService } from "../auth/verifyDocument.service";
import { APIENDPOINTS } from "./apiEndPoints";
import {
  profileInterface,
  providerPostsInterface,
  providerProfileInterface,
} from "./profileInterface";

class ProfileService {
  async getUserProfile(): Promise<profileInterface> {
    try {
      const response = await GET<profileInterface>(
        APIENDPOINTS.GET_USER_PROFILE
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(
    first_name: string,
    last_name: string,
    bio?: string,
    profile_pic?: File | string
  ): Promise<profileInterface> {
    try {
      let pic = "";
      if (
        profile_pic &&
        !profile_pic.toString().startsWith("https://") &&
        profile_pic instanceof File
      ) {
        pic = (await verifyDocumentService.uploadImages([profile_pic]))[0];
      } else if (profile_pic && profile_pic.toString().startsWith("https://")) {
        pic = profile_pic.toString();
      }
      const response = await PUT<profileInterface>(
        APIENDPOINTS.UPDATE_USER_PROFILE,
        {
          first_name,
          last_name,
          bio,
          profile_pic: pic,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserProfile(): Promise<void> {
    try {
      const res = await DELETE(APIENDPOINTS.DELETE_USER_PROFILE);
      // Logic for logout is handled in the hook
    } catch (error) {
      throw error;
    }
  }

  async getProviderPosts(
    id: string,
    page?: number,
    limit?: number
  ): Promise<providerPostsInterface> {
    try {
      const response = await GET<providerPostsInterface>(
        APIENDPOINTS.GET_PROVIDER_POSTS(id, page, limit || 10)
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //   async getProviderServices(
  //     id: string,
  //     page?: number,
  //     limit?: number
  //   ): Promise<providerServicesInterface> {
  //     try {
  //       const response = await api.get<providerServicesInterface>(
  //         APIENDPOINTS.GET_PROVIDER_SERVICES(id, page, limit || 10)
  //       );
  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async getProviderProfile(id: string): Promise<providerProfileInterface> {
  //     try {
  //       const response = await api.get<providerProfileInterface>(
  //         APIENDPOINTS.GET_PROVIDER_PROFILE(id)
  //       );
  //       return response.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}

export const profileService = new ProfileService();
