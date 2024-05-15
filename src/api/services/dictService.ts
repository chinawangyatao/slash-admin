import apiClient from '@/api/apiClient.ts';
import { ApiResponse } from '#/api.ts';

export enum DictApi {
  DictDataOptionSelect = '/dict-data/option-select',
  DictDataRoleOption = '/role-option',
  DictDataPostOption = '/post-option',
}

const findOptionSelect = (dictType: string) =>
  apiClient.get<ApiResponse>({ url: `${DictApi.DictDataOptionSelect}?dictType=${dictType}` });
const findDictDataRoleOption = () =>
  apiClient.get<ApiResponse>({ url: `${DictApi.DictDataRoleOption}` });

// 职位字典
const findDictDataPostOption = () =>
  apiClient.get<ApiResponse>({ url: `${DictApi.DictDataPostOption}` });

export default {
  findOptionSelect,
  findDictDataRoleOption,
  findDictDataPostOption,
};
