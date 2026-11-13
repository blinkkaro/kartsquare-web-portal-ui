
import { API_ENDPOINT } from './apiEndPoint';
import { IFollow, IFollowResponse } from './followInterface';
import { DELETE, GET, POST } from '../api';

class FollowService {
  async followUser(id: string): Promise<boolean> {
    try {
      const response = await POST(`${API_ENDPOINT.FOLLOW_USER(id)}`, {}, {}, true);
      if (response.status === 'success') return true;
      throw new Error('Failed to follow user');
    } catch (error) {
      throw error;
    }
  }

  async unfollowUser(id: string): Promise<boolean> {
    try {
      const response = await DELETE(
        `${API_ENDPOINT.UNFOLLOW_USER(id)}`,
        {},
        true
      );
      if (response.status === 'success') return true;

      throw new Error('Failed to unfollow user');
    } catch (error) {
      throw error;
    }
  }

  async getFollowers(
    id: string,
    page: number,
    limit: number,
  ): Promise<IFollowResponse> {
    try {
      console.log(id, page, limit);
      const response = await GET<IFollowResponse>(
        `${API_ENDPOINT.GET_FOLLOWERS(id)}?page=${page}&limit=${limit}`,
      );
      if (response.status === 'success') return response.data;
      throw new Error('Failed to get followers list');
    } catch (error) {
      throw error;
    }
  }

  async getFollowing(
    id: string,
    page: number,
    limit: number,
  ): Promise<IFollowResponse> {
    try {
      const response = await GET<IFollowResponse>(
        `${API_ENDPOINT.GET_FOLLOWING(id)}?page=${page}&limit=${limit}`,
      );
      if (response.status === 'success') return response.data;
      throw new Error('Failed to get following list');
    } catch (error) {
      throw error;
    }
  }
}

const followService = new FollowService();
export default followService;
