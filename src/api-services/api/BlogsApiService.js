import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class BlogsApiService {
  static async getAllBlogs() {
    const response = await CommonCall(`${URL_API}blogs/all`);
    return response;
  }

  static async getBlogDetail(slug) {
    const response = await CommonCall(`${URL_API}blogs/${slug}`);
    return response;
  }
}
