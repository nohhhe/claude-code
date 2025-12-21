export enum FlowIntensity {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  HEAVY = 'HEAVY',
  SPOTTING = 'SPOTTING',
}

export interface User {
  id: number;
  email: string;
  name: string;
  birthDate?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Cycle {
  id: number;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  periodLength?: number;
  flowIntensity?: FlowIntensity;
  symptoms: string[];
  notes?: string;
}

export interface CreateCycleRequest {
  startDate: string;
  endDate?: string;
  flowIntensity?: FlowIntensity;
  symptoms: string[];
  notes?: string;
}

export interface UpdateCycleRequest {
  startDate?: string;
  endDate?: string;
  flowIntensity?: FlowIntensity;
  symptoms?: string[];
  notes?: string;
}

export interface CycleStats {
  averageCycleLength?: number;
  averagePeriodLength?: number;
  nextPredictedStartDate?: string;
  totalCycles: number;
  commonSymptoms: Record<string, number>;
}
