import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadProfiles(firebaseUser.uid);
      } else {
        setUser(null);
        setProfiles([]);
        setActiveProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Load profiles from Firestore
  const loadProfiles = async (uid) => {
    try {
      const profilesRef = collection(db, "users", uid, "profiles");
      const snapshot = await getDocs(profilesRef);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProfiles(list);

      // Restore active profile from localStorage
      const savedId = localStorage.getItem("activeProfileId");
      if (savedId) {
        const found = list.find((p) => p.id === savedId);
        if (found) setActiveProfile(found);
      }
    } catch (err) {
      console.error("Failed to load profiles:", err);
    }
  };

  // Create default profile on first signup
  const createDefaultProfile = async (uid, displayName) => {
    const profileId = "default";
    const profileData = {
      name: displayName || "User",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      isKids: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", uid, "profiles", profileId), profileData);
    await setDoc(doc(db, "users", uid), { email: auth.currentUser?.email }, { merge: true });
    return { id: profileId, ...profileData };
  };

  // Auth methods
  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    const profile = await createDefaultProfile(cred.user.uid, name || email.split("@")[0]);
    setProfiles([profile]);
    setActiveProfile(profile);
    localStorage.setItem("activeProfileId", profile.id);
    return cred;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    // Check if user has profiles
    const profilesRef = collection(db, "users", cred.user.uid, "profiles");
    const snapshot = await getDocs(profilesRef);
    if (snapshot.empty) {
      const profile = await createDefaultProfile(
        cred.user.uid,
        cred.user.displayName || cred.user.email?.split("@")[0]
      );
      setProfiles([profile]);
      setActiveProfile(profile);
      localStorage.setItem("activeProfileId", profile.id);
    }
    return cred;
  };

  const logout = async () => {
    localStorage.removeItem("activeProfileId");
    setActiveProfile(null);
    setProfiles([]);
    await signOut(auth);
  };

  // Profile methods
  const selectProfile = (profile) => {
    setActiveProfile(profile);
    localStorage.setItem("activeProfileId", profile.id);
  };

  const addProfile = async (name, isKids = false) => {
    if (!user) return;
    const profileId = `profile_${Date.now()}`;
    const profileData = {
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileId}`,
      isKids,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", user.uid, "profiles", profileId), profileData);
    const newProfile = { id: profileId, ...profileData };
    setProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  };

  const value = {
    user,
    profiles,
    activeProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    selectProfile,
    addProfile,
    loadProfiles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
