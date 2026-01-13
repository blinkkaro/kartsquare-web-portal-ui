import {
  CreateStory,
  Story,
  StoriesListResponse,
  UpdateStory,
  ViewerResponse,
} from "./stories.interface";
import { APIENDPOINT } from "./apiEndPoint";
import { verifyDocumentService } from "../auth/verifyDocument.service";
import api from "../api";

class StoriesService {
  async createStory(story: CreateStory): Promise<Story> {
    try {
      const media_url = await verifyDocumentService.uploadImages([story.media]);

      const response = await api.post<Story>(APIENDPOINT.CREATE_STORY, {
        ...story,
        media_url: media_url[0],
      });
      console.log("Create Story Response:", response);
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
      const response = await api.get<StoriesListResponse>(
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
      const response = await api.delete<Story>(APIENDPOINT.DELETE_STORY(id));
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
      const response = await api.put<Story>(
        APIENDPOINT.UPDATE_STORY(id),
        story
      );
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
      const response = await api.post(APIENDPOINT.VIEW_STORY(id));
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
      const response = await api.get<ViewerResponse>(
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
