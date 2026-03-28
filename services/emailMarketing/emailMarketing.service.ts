import { ApiResponse, GET, POST, PUT } from "../api";
import { EMAIL_MARKETING_API_ENDPOINTS } from "./apiEndPoints";
import { SmtpSettings, VendorCampaign, VendorCampaignDetail, CreateCampaignDTO, EmailMarketingDashboardStats } from "./emailMarketing.interface";

class EmailMarketingService {
  async getSmtpSettings(): Promise<ApiResponse<SmtpSettings>> {
    const res = await GET<any>(EMAIL_MARKETING_API_ENDPOINTS.SMTP_SETTINGS);
    if (res.data) {
      res.data = {
        ...res.data,
        fromEmail: res.data.from_email,
        fromName: res.data.from_name
      };
    }
    return res as ApiResponse<SmtpSettings>;
  }

  async saveSmtpSettings(data: SmtpSettings): Promise<any> {
    const payload = {
      ...data,
      from_email: data.fromEmail,
      from_name: data.fromName
    };
    return await POST(EMAIL_MARKETING_API_ENDPOINTS.SMTP_SETTINGS, payload);
  }

  async testSmtpConnection(data: SmtpSettings): Promise<any> {
    const payload = {
      ...data,
      from_email: data.fromEmail,
      from_name: data.fromName
    };
    return await POST(`${EMAIL_MARKETING_API_ENDPOINTS.SMTP_SETTINGS}/test`, payload);
  }

  async getCampaigns(): Promise<ApiResponse<VendorCampaign[]>> {
    const res = await GET<any>(EMAIL_MARKETING_API_ENDPOINTS.CAMPAIGNS);
    if (res.data) {
      res.data = res.data.map((campaign: any) => ({
        ...campaign,
        createdAt: campaign.created_at || campaign.createdAt,
        totalRecipients: campaign.total_recipients || campaign.totalRecipients || 0,
        sentCount: campaign.sent_count || campaign.sentCount || 0,
        failedCount: campaign.failed_count || campaign.failedCount || 0,
      }));
    }
    return res as ApiResponse<VendorCampaign[]>;
  }

  async createCampaign(data: CreateCampaignDTO): Promise<ApiResponse<VendorCampaign>> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("subject", data.subject);
    formData.append("body", data.bodyHtml);
    formData.append("file", data.csvFile);
    
    if (data.scheduleTime) {
      formData.append("scheduled_at", data.scheduleTime);
    }

    return await POST<VendorCampaign>(EMAIL_MARKETING_API_ENDPOINTS.CAMPAIGNS, formData);
  }

  async getCampaignDetails(id: string | number): Promise<ApiResponse<VendorCampaignDetail>> {
    const res = await GET<any>(EMAIL_MARKETING_API_ENDPOINTS.CAMPAIGN_DETAILS(id));
    if (res.data) {
      res.data = {
        ...res.data,
        createdAt: res.data.created_at || res.data.createdAt,
        totalRecipients: res.data.total_recipients || res.data.totalRecipients || 0,
        sentCount: res.data.sent_count || res.data.sentCount || 0,
        failedCount: res.data.failed_count || res.data.failedCount || 0,
        bodyHtml: res.data.body || res.data.bodyHtml,
      };
    }
    return res as ApiResponse<VendorCampaignDetail>;
  }

  async startCampaign(id: string | number): Promise<any> {
    return await POST(EMAIL_MARKETING_API_ENDPOINTS.START_CAMPAIGN(id), {});
  }

  async unsubscribe(email: string): Promise<any> {
    return await GET(EMAIL_MARKETING_API_ENDPOINTS.UNSUBSCRIBE, { email }, false);
  }
}

export const emailMarketingService = new EmailMarketingService();
