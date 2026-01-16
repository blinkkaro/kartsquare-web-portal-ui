import {
  CreateStory,
  Story,
  StoriesListResponse,
  UpdateStory,
  ViewerResponse,
} from "./stories.interface";
import { APIENDPOINT } from "./apiEndPoint";
import { verifyDocumentService } from "../auth/verifyDocument.service";
import { DELETE, GET, POST, PUT } from "../api";

class StoriesService {
  async createStory(story: CreateStory): Promise<Story> {
    try {
      const media_url = await verifyDocumentService.uploadImages([story.media]);

      const response = await POST<Story>(APIENDPOINT.CREATE_STORY, {
        ...story,
        media_url: media_url[0],
      });
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStories(page: number, limit: number): Promise<StoriesListResponse> {
    try {
      const response = await GET<StoriesListResponse>(
        APIENDPOINT.GET_STORIES(page, limit)
      );
      console.log("Get Stories Response:", response);
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteStory(id: string): Promise<Story> {
    try {
      const response = await DELETE<Story>(APIENDPOINT.DELETE_STORY(id));
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateStory(id: string, story: UpdateStory): Promise<Story> {
    try {
      const response = await PUT<Story>(APIENDPOINT.UPDATE_STORY(id), story);
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async viewStory(id: string): Promise<boolean> {
    try {
      console.log("View Story ID:", id);
      const response = await POST(APIENDPOINT.VIEW_STORY(id), {}, {}, true);
      console.log("View Story Response:", response);
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getViewerList(id: string): Promise<ViewerResponse> {
    try {
      const response = await GET<ViewerResponse>(
        APIENDPOINT.GET_VIEWER_LIST(id)
      );
      if (response.status !== "success") {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const storiesService = new StoriesService();
