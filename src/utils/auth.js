// Simple authentication utility functions
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID for users
export const generateUserId = () => {
  return uuidv4();
};

// Login function - simple email/password validation
export const loginUser = async (email, password) => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};

// Register function - create new user
export const registerUser = async (email, password, username) => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    
    // Create new user
    const newUser = {
      uid: generateUserId(),
      email,
      password,
      username,
      displayName: username,
      createdAt: new Date().toISOString()
    };
    
    // Add to users list
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: 'Registration failed' };
  }
};
        
// Logout function
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return { success: true };
};
       
// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};
       
// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find and update user
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.uid === uid) {
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      }
      
      return { success: true, user: users[userIndex] };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: 'Update failed' };
  }
};

// Change password
export const changePassword = async (uid, currentPassword, newPassword) => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex !== -1) {
      // Verify current password
      if (users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true };
      } else {
        return { success: false, error: 'Current password is incorrect' };
      }
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: 'Password change failed' };
  }
};
