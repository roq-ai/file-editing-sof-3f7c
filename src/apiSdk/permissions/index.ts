import axios from 'axios';
import queryString from 'query-string';
import { PermissionInterface, PermissionGetQueryInterface } from 'interfaces/permission';
import { GetQueryInterface } from '../../interfaces';

export const getPermissions = async (query?: PermissionGetQueryInterface) => {
  const response = await axios.get(`/api/permissions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPermission = async (permission: PermissionInterface) => {
  const response = await axios.post('/api/permissions', permission);
  return response.data;
};

export const updatePermissionById = async (id: string, permission: PermissionInterface) => {
  const response = await axios.put(`/api/permissions/${id}`, permission);
  return response.data;
};

export const getPermissionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/permissions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePermissionById = async (id: string) => {
  const response = await axios.delete(`/api/permissions/${id}`);
  return response.data;
};
