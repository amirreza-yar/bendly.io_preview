import { db, UserProfile } from '../appDB'
import Dexie from 'dexie'

/**
 * Store user profile data in IndexedDB (non-sensitive data only)
 * This replaces localStorage usage for better security and professionalism
 */
export async function storeUserProfile(userData: {
  _id: string
  email: string
  fullname: string
  phone?: string
  roleId: string
  status: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}): Promise<void> {
  try {
    const userProfile: UserProfile = {
      id: userData._id,
      email: userData.email,
      fullname: userData.fullname,
      phone: userData.phone,
      roleId: userData.roleId,
      status: userData.status,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      lastLogin: userData.lastLogin,
    }

    await db.userProfiles.put(userProfile)
  } catch (error) {
    console.error('Failed to store user profile:', error)
    throw error
  }
}

/**
 * Retrieve user profile data from IndexedDB
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userProfile = await db.userProfiles.get(userId)
    return userProfile || null
  } catch (error) {
    console.error('Failed to get user profile:', error)
    return null
  }
}

/**
 * Get the current authenticated user's ID from IndexedDB
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const userProfiles = await db.userProfiles.toArray()
    // Return the first (and should be only) user profile
    return userProfiles.length > 0 ? userProfiles[0].id : null
  } catch (error) {
    console.error('Failed to get current user ID:', error)
    return null
  }
}

/**
 * Clear user profile data from IndexedDB (logout)
 */
export async function clearUserProfile(): Promise<void> {
  try {
    await db.userProfiles.clear()
  } catch (error) {
    console.error('Failed to clear user profile:', error)
    throw error
  }
}

/**
 * Update user profile data in IndexedDB
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    await db.userProfiles.update(userId, updates)
  } catch (error) {
    console.error('Failed to update user profile:', error)
    throw error
  }
}
