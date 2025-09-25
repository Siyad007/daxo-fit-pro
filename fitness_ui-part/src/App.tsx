import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/UI/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SetupGoalsPage from './pages/SetupGoalsPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import MealsPage from './pages/MealsPage';
import FoodDatabasePage from './pages/FoodDatabasePage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FitnessProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route path="setup-goals" element={
                <ProtectedRoute>
                  <SetupGoalsPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="goals" element={
                <ProtectedRoute>
                  <GoalsPage />
                </ProtectedRoute>
              } />
              <Route path="meals" element={
                <ProtectedRoute>
                  <MealsPage />
                </ProtectedRoute>
              } />
              <Route path="foods" element={
                <ProtectedRoute>
                  <FoodDatabasePage />
                </ProtectedRoute>
              } />
              <Route path="recommendations" element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              } />
              <Route path="progress" element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </FitnessProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;