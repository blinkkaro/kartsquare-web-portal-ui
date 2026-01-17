import api, { GET, POST } from "../api";
import { verifyDocumentService } from "../auth/verifyDocument.service";
import { API_ENDPOINTS } from "./apiEndpoints";
import {
  GetPostsParams,
  GetPostsResponse,
  GetPostComments,
  CreatePostParams,
} from "./postInterfaces";

class PostServices {
  async getPosts({
    limit,
    visibility,
  }: GetPostsParams): Promise<GetPostsResponse> {
    try {
      const response = await GET<GetPostsResponse>(
        `${API_ENDPOINTS.GET_POST}?limit=${limit}&visibility=${visibility}`,
        {},
        false,
      );
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to fetch posts");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async likePost(postId: string): Promise<any> {
    try {
      console.log("postId", postId);
      const response = await POST(`${API_ENDPOINTS.LIKE_POST(postId)}`, {});
      console.log("response", response);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to like post");
      }
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async getPostComments(postId: string): Promise<GetPostComments> {
    try {
      console.log("postId", postId);
      const response = await GET<GetPostComments>(
        `${API_ENDPOINTS.GET_POST_COMMENT(postId)}`,
        {},
        false,
      );
      console.log("response", response);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to get post comments");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addPostComments(
    postId: string,
    comment: string,
  ): Promise<{ commentId: string }> {
    try {
      const response = await POST<{ commentId: string }>(
        `${API_ENDPOINTS.ADD_COMMENT(postId)}`,
        { comment },
        {},
        true,
      );
      console.log("response", response);
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to add post comment");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPost(postData: CreatePostParams) {
    try {
      const media_url = await verifyDocumentService.uploadImages(
        postData.media_urls,
      );
      const response = await POST(
        `${API_ENDPOINTS.CREATE_POST}`,
        { ...postData, media_urls: media_url },
        {},
        true,
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to create post");
      }
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  }
}
export const postServices = new PostServices();
