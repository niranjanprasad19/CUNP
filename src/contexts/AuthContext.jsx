import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'student', 'rep', 'admin'
    const [loading, setLoading] = useState(true);

    // Sign up with Email/Pass
    async function signup(email, password, rollNumber, additionalData) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document
        try {
            // Race condition: if Firestore takes too long (e.g. 5s), assume connection/rules issue
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Database operation timed out. Check if Firestore is enabled in Console.")), 5000));

            await Promise.race([
                setDoc(doc(db, "users", user.uid), {
                    email,
                    rollNumber,
                    role: 'student', // Default role
                    ...additionalData,
                    createdAt: new Date()
                }),
                timeoutPromise
            ]);
        } catch (dbError) {
            console.error("Firestore Error (proceeding in Demo Mode):", dbError);
            alert("Database is currently unreachable. You are logged in via 'Demo Mode'.");
        }

        return user;
    }

    // Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Google Login
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user doc exists, if not create it
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                email: user.email,
                role: 'student',
                createdAt: new Date()
            });
        }

        return user;
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Realtime listener for user profile
                unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUserRole(userData.role);
                        setCurrentUser({ ...user, ...userData });
                    } else {
                        // Fallback if doc doesn't exist yet
                        setCurrentUser(user);
                        setUserRole(null);
                    }
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setCurrentUser(user);
                });
            } else {
                if (unsubscribeDoc) unsubscribeDoc();
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => {
            if (unsubscribeAuth) unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const [subscribedClubs, setSubscribedClubs] = useState([]);

    const subscribeToClub = (club) => {
        setSubscribedClubs(prev => {
            if (prev.find(c => c.id === club.id)) return prev;
            return [...prev, club];
        });
    };

    const unsubscribeFromClub = (clubId) => {
        setSubscribedClubs(prev => prev.filter(c => c.id !== clubId));
    };

    const loginAsDemo = (role) => {
        setCurrentUser({ uid: `demo-${role}`, email: `${role}@cunp.com`, displayName: `Demo ${role}`, year: 4, branch: 'CSE', rollNumber: '2022CS001' });
        setUserRole(role);
    };

    const value = {
        currentUser,
        userRole,
        subscribedClubs,
        signup,
        login,
        googleLogin,
        logout,
        subscribeToClub,
        unsubscribeFromClub,
        loginAsDemo
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
