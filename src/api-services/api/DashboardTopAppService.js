import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class DashboardTopAppService {
    static async getTopNewApps(page, per_page) {
      const response = await CommonCall(`${URL_API}home/top_release?page=${page}&per_page=${per_page}`);
      return response;
    }
    static async getTopReviewed(page, per_page) {
        const response = await CommonCall(`${URL_API}top_apps/reviews?page=${page}&per_page=${per_page}`);
        return response;
    }
    static async getGrowthRate(page, per_page) {
        const response = await CommonCall(`${URL_API}top_apps/by_growth_rate?page=${page}&per_page=${per_page}`);
        return response;
    }
    static async getInstallationGrowthRate(page, per_page) {
        const response = await CommonCall(`${URL_API}top_apps/installation_growth_rate?page=${page}&per_page=${per_page}`);
        return response;
    }
    
}