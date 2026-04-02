import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "mock_worker_1",
    name: "Ritesh Kumar",
    email: "ritesh@gigshield.com",
    role: "worker",
    walletBalance: 120,
    primaryZone: "T. Nagar",
    preferredWorkingHours: { start: "10:00 AM", end: "8:00 PM", shift: "Flexible" },
    avgWeeklyEarnings: 2500,
    lifetimeEarnings: 145000,
    activePolicies: [
      {
        id: "pol_1", // Adding ID for comparison later
        name: "Heavy Rain Protection",
        weeklyPremium: 50,
        maxPayout: 1500,
        subscribedAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // Subscribed 1 day ago
        lockedUntil: Date.now() + (6 * 24 * 60 * 60 * 1000)   // Locked for 6 more days
      }
    ],
    payoutHistory: [
      { id: 1, date: "2026-03-28", trigger: "Heavy Rain Level 3", amount: 450, status: "Credited" },
      { id: 2, date: "2026-03-15", trigger: "Heatwave Alert", amount: 200, status: "Credited" },
      { id: 3, date: "2026-02-10", trigger: "Waterlogging Delay", amount: 300, status: "Credited" }
    ],
    performanceData: [
      { name: 'Week 1', earnings: 2100, protected: 500 },
      { name: 'Week 2', earnings: 2400, protected: 0 },
      { name: 'Week 3', earnings: 2600, protected: 300 },
      { name: 'Week 4', earnings: 2900, protected: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hardcoded user, no loading needed.
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('gigshield_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      setUser(data);
      localStorage.setItem('gigshield_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gigshield_user');
  };

  const subscribePolicy = (policy) => {
     // Check if already subscribed
     if (user.activePolicies.find(p => p.id === policy.id)) return;
     
     const newPolicy = {
       ...policy,
       subscribedAt: Date.now(),
       lockedUntil: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
     };
     
     const updatedUser = { ...user, activePolicies: [...user.activePolicies, newPolicy] };
     setUser(updatedUser);
     localStorage.setItem('gigshield_user', JSON.stringify(updatedUser));
  };

  const unsubscribePolicy = (policyId) => {
     const policy = user.activePolicies.find(p => p.id === policyId);
     if (!policy) return { success: false, message: "Policy not found." };
     
     if (Date.now() < policy.lockedUntil) {
       const unlockDate = new Date(policy.lockedUntil).toLocaleDateString('en-IN', {
         weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
       });
       return { success: false, message: `Locked. To prevent fraud, you can only drop or change this plan after ${unlockDate}.` };
     }

     const updatedUser = { ...user, activePolicies: user.activePolicies.filter(p => p.id !== policyId) };
     setUser(updatedUser);
     localStorage.setItem('gigshield_user', JSON.stringify(updatedUser));
     return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, subscribePolicy, unsubscribePolicy }}>
      {children}
    </AuthContext.Provider>
  );
};
