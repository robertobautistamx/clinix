// ══════════════════════════════════════════════════════
//  services/api.ts  —  Clinix API (NestJS backend)
//  Cambia BASE_URL en tu .env: REACT_APP_API_URL=http://localhost:3000
// ══════════════════════════════════════════════════════

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Error en la solicitud');
  }
  return res.json() as Promise<T>;
}

// ── Tipos base ────────────────────────────────────────
export interface Doctor {
  doctor_id: number;
  cedula: string;
  first_name: string;
  last_name: string;
  specialty: string;
  phone?: string;
  email?: string;
  years_exp?: number;
  active: number;
  hospitals_hospital_id: number;
}

export interface Paciente {
  patient_id: number;
  curp: string;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  birth_date: string;
  blood_type?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  email?: string;
  insurance_type?: string;
  insurance_id?: string;
  weight_kg?: number;
  height_cm?: number;
  allergies?: string;
  smoker: number;
  alcohol: number;
  registered_at?: string;
}

export interface Hospital {
  hospital_id: number;
  name: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
}

export interface Producto {
  product_id: number;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export interface Transaccion {
  transaction_id: number;
  total: number;
  created_at: string;
  patient_id?: number;
}

// ── Tipos paginación ──────────────────────────────────
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginaParams { page: number; limit: number }
const qs = ({ page, limit }: PaginaParams) => `?page=${page}&limit=${limit}`;

// ── Servicios ─────────────────────────────────────────
export const doctoresService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Doctor>>(`/doctors${qs(p)}`),
  getById: (id: number) => request<Doctor>(`/doctors/${id}`),
  create: (data: Omit<Doctor, 'doctor_id'>) =>
    request<Doctor>('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Doctor>) =>
    request<Doctor>(`/doctors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/doctors/${id}`, { method: 'DELETE' }),
};

export const pacientesService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Paciente>>(`/patients${qs(p)}`),
  getById: (id: number) => request<Paciente>(`/patients/${id}`),
  create: (data: Omit<Paciente, 'patient_id' | 'registered_at'>) =>
    request<Paciente>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Paciente>) =>
    request<Paciente>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/patients/${id}`, { method: 'DELETE' }),
};

export const hospitalesService = {
  getAll: () => request<Hospital[]>('/hospitals'),
  getPaginated: (p: PaginaParams) => request<Paginated<Hospital>>(`/hospitals${qs(p)}`),
  getById: (id: number) => request<Hospital>(`/hospitals/${id}`),
};


export const productosService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Producto>>(`/products${qs(p)}`),
  getById: (id: number) => request<Producto>(`/products/${id}`),
};

export const transaccionesService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Transaccion>>(`/transactions${qs(p)}`),
  getById: (id: number) => request<Transaccion>(`/transactions/${id}`),
  create: (data: Omit<Transaccion, 'transaction_id' | 'created_at'>) =>
    request<Transaccion>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
};

export const sintomasService = {
  getAll: () => request<{ symptom_id: number; name: string; zone?: string }[]>('/symptoms-catalog'),
};
