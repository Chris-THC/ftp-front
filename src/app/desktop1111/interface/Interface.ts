export interface Children {
  name: string;
  fullPath: string;
  timestamp: string;
  children: Children[];
  directory: boolean;
  file: boolean;
}

export interface File {
  name: string;
  fullPath: string;
  timestamp: string;
  children: Children[];
  directory: boolean;
  file: boolean;
  position?: { x: number; y: number }; // Añadimos position aquí
}
