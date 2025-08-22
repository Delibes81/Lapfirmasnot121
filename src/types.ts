export interface Laptop {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface BiometricDevice {
  id: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'public' | 'admin';