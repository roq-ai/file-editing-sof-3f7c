import { UserInterface } from 'interfaces/user';
import { FileInterface } from 'interfaces/file';
import { GetQueryInterface } from 'interfaces';

export interface PermissionInterface {
  id?: string;
  user_id?: string;
  file_id?: string;
  can_edit: boolean;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  file?: FileInterface;
  _count?: {};
}

export interface PermissionGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  file_id?: string;
}
