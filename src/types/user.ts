export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
