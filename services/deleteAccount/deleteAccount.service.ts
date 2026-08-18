import { POST } from "../api";
import { DeleteAccountRequestInterface } from "./deleteAccount.interface";
import { APIENDPOINTS } from "./apiEndPoints";

class DeleteAccountService {
  async submitRequest(data: DeleteAccountRequestInterface) {
    try {
      const response = await POST(
        APIENDPOINTS.DELETE_ACCOUNT_REQUEST,
        data,
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new DeleteAccountService();
