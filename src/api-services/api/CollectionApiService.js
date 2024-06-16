import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class CollectionApiService {
  static async getCollections(language) {
    const result = await CommonCall(`${URL_API}collection?language=${language}`);
    return result;
  }
}
