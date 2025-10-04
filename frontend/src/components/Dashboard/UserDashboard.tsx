import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProgress {
  total_sessions: number;
  total_time_spent: number;
  challenges_completed: number;
  lessons_accessed: number;
  code_submissions: number;
  current_streak: number;
  module0_progress: Array<{
    challenge_id: number;
    status: string;
    attempts: number;
    best_score: number;
    xp_earned: number;
    time_to_complete?: number;
    hints_used: number;
    completed_at?: string;
  }>;
}

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/v1/module0/progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name || 'Student'}!</h1>
              <p className="text-gray-600">Level {user?.current_level} • {user?.total_xp} XP</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total XP</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.total_xp || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Challenges Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{progress?.challenges_completed || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-semibold text-gray-900">{progress?.current_streak || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                <p className="text-2xl font-semibold text-gray-900">{user?.badges.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module 0 Progress */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Module 0: Math Adventure Progress</h2>
            <p className="text-gray-600 mt-1">Track your journey through the mathematical challenges</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((challengeId) => {
                const challengeProgress = progress?.module0_progress.find(p => p.challenge_id === challengeId);
                const status = challengeProgress?.status || 'locked';
                
                return (
                  <div
                    key={challengeId}
                    className={`p-4 rounded-lg border-2 ${
                      status === 'completed'
                        ? 'border-green-500 bg-green-50'
                        : status === 'unlocked'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl mb-2 ${
                        status === 'completed' ? 'text-green-600' : 
                        status === 'unlocked' ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {status === 'completed' ? '✅' : 
                         status === 'unlocked' ? '🎯' : '🔒'}
                      </div>
                      <h3 className="font-semibold text-gray-900">Challenge {challengeId}</h3>
                      <p className="text-sm text-gray-600 capitalize">{status}</p>
                      {challengeProgress && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>{challengeProgress.xp_earned} XP</p>
                          {challengeProgress.time_to_complete && (
                            <p>{Math.round(challengeProgress.time_to_complete)}min</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        {user?.badges && user.badges.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Badges</h2>
              <p className="text-gray-600 mt-1">Achievements you've earned</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-3xl mb-2">🏅</div>
                    <p className="text-sm font-medium text-gray-900">{badge.replace('_', ' ').toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};