import { POST } from "../api";
import { ContactUsInterface, waitlist_type } from "./contactUs.interface";
import { APIENDPOINTS } from "./apiEndPoints";

class ContactUsService {
  async contactUs(data: ContactUsInterface) {
    try {
      const newData = {
        ...data,
        waitlist_type: waitlist_type.CONTACT_US,
      };
      const response = await POST(APIENDPOINTS.CONTACT_US, newData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ContactUsService();
