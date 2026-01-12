import api from "../api";
import { APIENDPOINT } from "./apiEndPoints";
import { AppConfigResponse } from "./appConfigInterface";

class AppConfigServices {
  async getAppTermsAndConditions(): Promise<AppConfigResponse> {
    try {
      const response = await api.get<AppConfigResponse>(
        APIENDPOINT.GET_TERMS_AND_CONDITIONS
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAppPrivacyPolicy(): Promise<AppConfigResponse> {
    try {
      const response = await api.get<AppConfigResponse>(
        APIENDPOINT.GET_PRIVACY_POLICY
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const appConfigService = new AppConfigServices();
