import { PermissionInterface } from 'interfaces/permission';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface FileInterface {
  id?: string;
  name: string;
  content: string;
  header: string;
  delimiter: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  permission?: PermissionInterface[];
  company?: CompanyInterface;
  _count?: {
    permission?: number;
  };
}

export interface FileGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  content?: string;
  header?: string;
  delimiter?: string;
  company_id?: string;
}
