// ── Tipo para crear transacción nueva ────────────────
export interface TransaccionNueva {
  total: number;
  total_amount?: number;
  patient_id?: number;
  doctor_id?: number;
  hospital_id: number;
  product_id: number;
  diagnosis_id: number;
  quantity: number;
  unit_price: number;
  discount_pct?: number;
  discount_amount?: number;
  subtotal?: number;
  tax_pct?: number;
  tax_amount?: number;
  currency?: string;
  payment_method?: string;
  insurance_covered?: number;
  patient_paid?: number;
  status?: string;
  transaction_type?: string;
  transaction_date?: string;
  transaction_code: string;
}
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

export interface DiagnosticoIcd10 {
  diagnosis_id: number;
  code?: string;
  description?: string;
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

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginaParams { page: number; limit: number }
const qs = ({ page, limit }: PaginaParams) => `?page=${page}&limit=${limit}`;

export const doctoresService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Doctor>>(`/doctors${qs(p)}`),
  getById: (id: number) => request<Doctor>(`/doctors/${id}`),
  create: (data: Omit<Doctor, 'doctor_id'>) =>
    request<Doctor>('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Doctor>) =>
    request<Doctor>(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/doctors/${id}`, { method: 'DELETE' }),
};

export const pacientesService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Paciente>>(`/patients${qs(p)}`),
  getById: (id: number) => request<Paciente>(`/patients/${id}`),
  create: (data: Omit<Paciente, 'patient_id' | 'registered_at'>) =>
    request<Paciente>('/patients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Paciente>) =>
    request<Paciente>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/patients/${id}`, { method: 'DELETE' }),
};

export const hospitalesService = {
  getAll: () => request<Hospital[]>('/hospitals'),
  getPaginated: (p: PaginaParams) => request<Paginated<Hospital>>(`/hospitals${qs(p)}`),
  getById: (id: number) => request<Hospital>(`/hospitals/${id}`),
  create: (data: Omit<Hospital, 'hospital_id'>) =>
    request<Hospital>('/hospitals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Hospital>) =>
    request<Hospital>(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/hospitals/${id}`, { method: 'DELETE' }),
};

export const diagnosticosService = {
  getAll: () => request<DiagnosticoIcd10[]>('/icd10-diagnoses'),
  getById: (id: number) => request<DiagnosticoIcd10>(`/icd10-diagnoses/${id}`),
};


export const productosService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Producto>>(`/products${qs(p)}`),
  getById: (id: number) => request<Producto>(`/products/${id}`),
  create: (data: Omit<Producto, 'product_id'>) =>
    request<Producto>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Producto>) =>
    request<Producto>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/products/${id}`, { method: 'DELETE' }),
};

export const transaccionesService = {
  getPaginated: (p: PaginaParams) => request<Paginated<Transaccion>>(`/transactions${qs(p)}`),
  getById: (id: number) => request<Transaccion>(`/transactions/${id}`),
  create: (data: TransaccionNueva) =>
    request<Transaccion>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/transactions/${id}`, { method: 'DELETE' }),
};

export const sintomasService = {
  getAll: () => request<{ symptom_id: number; name: string; zone?: string }[]>('/symptoms-catalog'),
};

// ── Recomendaciones (Algoritmo Apriori) ───────────────
export interface RecomendacionApriori {
  base_id: number;
  producto_base: string;
  recomendado_id: number;
  producto_recomendado: string;
  probabilidad: number;
  veces_juntos: number;
  icono: string;
}

export const recomendacionesService = {
  getAll: () => request<{ data: RecomendacionApriori[]; total: number }>('/recommendations'),
  getApriori: (minSupport: number = 2) =>
    request<{ data: any[]; total: number }>(`/recommendations/apriori?minSupport=${minSupport}`),
  getForProduct: (productId: number) =>
    request<{ data: any[]; total: number }>(`/recommendations/product/${productId}`),
};
