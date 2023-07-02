import axios from 'axios';
import queryString from 'query-string';
import { FileInterface, FileGetQueryInterface } from 'interfaces/file';
import { GetQueryInterface } from '../../interfaces';

export const getFiles = async (query?: FileGetQueryInterface) => {
  const response = await axios.get(`/api/files${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFile = async (file: FileInterface) => {
  const response = await axios.post('/api/files', file);
  return response.data;
};

export const updateFileById = async (id: string, file: FileInterface) => {
  const response = await axios.put(`/api/files/${id}`, file);
  return response.data;
};

export const getFileById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/files/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFileById = async (id: string) => {
  const response = await axios.delete(`/api/files/${id}`);
  return response.data;
};
