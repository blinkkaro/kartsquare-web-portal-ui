import api from "../api";
import { authService } from "../auth/auth.service";
import { APIENDPOINTS } from "./apiEndPoints";
import {
  profileInterface,
  providerPostsInterface,
  providerProfileInterface,
  providerServicesInterface,
} from "./profileInterface";

class ProfileService {
  async getUserProfile(): Promise<profileInterface> {
    try {
      const response = await api.get<profileInterface>(
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
    profile_pic?: string
  ): Promise<profileInterface> {
    try {
      const response = await api.put<profileInterface>(
        APIENDPOINTS.UPDATE_USER_PROFILE,
        {
          first_name,
          last_name,
          bio,
          profile_pic,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserProfile(): Promise<void> {
    try {
      const res = await api.delete(APIENDPOINTS.DELETE_USER_PROFILE);
      if ((res.status = "success")) {
        authService.logout();
      }
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
      const response = await api.get<providerPostsInterface>(
        APIENDPOINTS.GET_PROVIDER_POSTS(id, page, limit || 10)
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProviderServices(
    id: string,
    page?: number,
    limit?: number
  ): Promise<providerServicesInterface> {
    try {
      const response = await api.get<providerServicesInterface>(
        APIENDPOINTS.GET_PROVIDER_SERVICES(id, page, limit || 10)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProviderProfile(id: string): Promise<providerProfileInterface> {
    try {
      const response = await api.get<providerProfileInterface>(
        APIENDPOINTS.GET_PROVIDER_PROFILE(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();
