export type LaptopStatus = 'disponible' | 'en-uso' | 'mantenimiento';

export interface Laptop {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  biometricReader: boolean;
  biometricSerial?: string;
  status: LaptopStatus;
  currentUser: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  laptopId: string;
  userName: string;
  purpose: string;
  assignedAt: string;
  returnedAt: string | null;
  returnNotes?: string;
}

export type ViewMode = 'public' | 'admin';