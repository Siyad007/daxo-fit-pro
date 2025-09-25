import api from './api';

export interface Goal {
  id: number;
  description: string;
  targetWeight: number;
  targetDate: string;
  type: 'LOSS' | 'MAINTAIN' | 'GAIN';
  userId: number;
}

export interface GoalRequest {
  description: string;
  targetWeight: number;
  targetDate: string;
  type: 'LOSS' | 'MAINTAIN' | 'GAIN';
}

export const GoalService = {
  // Add a new goal
  async addGoal(goalData: GoalRequest): Promise<Goal> {
    const { data } = await api.post('/api/goals/add', goalData);
    return data;
  },

  // Get all goals for user
  async getMyGoals(): Promise<Goal[]> {
    const { data } = await api.get('/api/goals');
    return data;
  },

  // Delete a goal
  async deleteGoal(goalId: number): Promise<void> {
    await api.delete(`/api/goals/${goalId}`);
  },

  // Calculate goal progress
  calculateGoalProgress(goal: Goal, currentWeight: number): {
    progress: number;
    remaining: number;
    daysLeft: number;
    isOnTrack: boolean;
  } {
    const totalWeightChange = Math.abs(goal.targetWeight - currentWeight);
    const currentProgress = Math.abs(goal.targetWeight - currentWeight);
    const progress = Math.min((currentProgress / totalWeightChange) * 100, 100);
    
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const isOnTrack = daysLeft > 0 && progress <= (100 - (daysLeft / 30) * 100);
    
    return {
      progress: Math.round(progress),
      remaining: Math.abs(goal.targetWeight - currentWeight),
      daysLeft: Math.max(0, daysLeft),
      isOnTrack
    };
  }
};
