import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IHttpService {
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
}
