import { APIENDPOINT } from "./apiEndPoints";
import { AppConfigResponse } from "./appConfigInterface";
import { GET } from "../api";

class AppConfigServices {
  async getAppTermsAndConditions(): Promise<AppConfigResponse> {
    try {
      const response = await GET<AppConfigResponse>(
        APIENDPOINT.GET_TERMS_AND_CONDITIONS,
        {},
        false
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAppPrivacyPolicy(): Promise<AppConfigResponse> {
    try {
      const response = await GET<AppConfigResponse>(
        APIENDPOINT.GET_PRIVACY_POLICY,
        {},
        false
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const appConfigService = new AppConfigServices();
