export interface Laptop {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: 'disponible' | 'en-uso' | 'mantenimiento';
  currentUser: string | null;
  biometricSerial: string | null;
  assignedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BiometricDevice {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lawyer {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'public' | 'admin';