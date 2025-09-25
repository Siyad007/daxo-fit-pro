import api from './api';

export interface ProfileUpdatePayload {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE';
  goal: 'LOSS' | 'MAINTAIN' | 'GAIN';
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'MALE' | 'FEMALE';
  activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE';
  goal?: 'LOSS' | 'MAINTAIN' | 'GAIN';
  dailyCalorieTarget?: number;
}

export const UserService = {
  async getMyProfile(): Promise<UserProfile> {
    const { data } = await api.get('/api/users/me');
    return data;
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
    const { data } = await api.put('/api/users/me/profile', payload);
    return data;
  }
};
