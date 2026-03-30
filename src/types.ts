export interface Laptop {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: 'disponible' | 'en-uso' | 'mantenimiento';
  currentUser: string | null;
  assignedIntern: string | null;
  biometricSerial: string | null;
  assignedAt: string | null;
  defaultBiometric?: string | null;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pasante {
  id: string;
  name: string;
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

export interface Assignment {
  id: string;
  laptopId: string;
  userName: string;
  assignedIntern: string | null;
  biometricSerial: string | null;
  assignedAt: string;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'public' | 'admin';

export interface LaptopRequest {
  id: string;
  applicantName: string;
  lawyerName: string;
  reason: string;
  requestedLaptopId: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
  updatedAt: string;
}