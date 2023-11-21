export interface FlashI {
  type: 'success' | 'error' | undefined;
  children: React.ReactNode;
}

export interface BurgerI {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MemberI {
  id: number;
  user_id: number;
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  pseudo: string;
  description: string;
  availability: boolean;
  picture: string;
  is_active: boolean;
  projects: ProjectI[];
  project: ProjectI[];
  tags: TagI[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MembersI {
  members: MemberI[];
}

export interface ProjectI {
  id: number;
  title?: string;
  description?: string;
  availability?: boolean;
  user?: MemberI[];
  user_id?: number;
  user_pseudo?: string;
  users?: MemberI[];
  tags?: TagI[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectsI {
  projects: ProjectI[];
}

export interface TagI {
  tag_id: number;
  tag_name: string;
  id: number;
  name: string;
  tag_createdAt: Date;
  tag_updatedAt: Date;
}

//* Utiliser dans Signin par exemple pour l'affichage des technos
export interface TagSelectedI {
  id: number | string;
  name: string;
  value: string;
  label: string;
  path: string;
}
