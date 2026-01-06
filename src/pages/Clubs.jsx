import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';

export default function Clubs() {
    const { currentUser, userRole } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [subscribedClubs, setSubscribedClubs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Club Form State
    const [newClubName, setNewClubName] = useState('');
    const [newClubDesc, setNewClubDesc] = useState('');

    useEffect(() => {
        fetchClubs();
        fetchUserSubscriptions();
    }, [currentUser]);

    const fetchClubs = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "clubs"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClubs(data);
        } catch (e) {
            console.log("Using dummy club data");
            // Dummy Data
            setClubs([
                { id: '1', name: 'Coding Club', description: 'For the tech enthusiasts.' },
                { id: '2', name: 'Music Society', description: 'Jamming, concerts, and more.' },
                { id: '3', name: 'Robotics', description: 'Building the future, one bot at a time.' }
            ]);
        }
    };

    const fetchUserSubscriptions = async () => {
        if (!currentUser) return;
        try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
                setSubscribedClubs(userDoc.data().subscribedClubs || []);
            }
        } catch (e) {
            console.error("Error fetching subs", e);
        }
    };

    const handleSubscribe = async (clubId, clubName) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        const isSubscribed = subscribedClubs.includes(clubName);

        try {
            if (isSubscribed) {
                await updateDoc(userRef, {
                    subscribedClubs: arrayRemove(clubName)
                });
                setSubscribedClubs(prev => prev.filter(c => c !== clubName));
            } else {
                await updateDoc(userRef, {
                    subscribedClubs: arrayUnion(clubName)
                });
                setSubscribedClubs(prev => [...prev, clubName]);
            }
        } catch (e) {
            alert("Failed to update subscription (Backend might not be connected)");
            // Optimistic update for demo
            if (isSubscribed) {
                setSubscribedClubs(prev => prev.filter(c => c !== clubName));
            } else {
                setSubscribedClubs(prev => [...prev, clubName]);
            }
        }
    };

    const handleAddClub = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "clubs"), {
                name: newClubName,
                description: newClubDesc,
                createdBy: currentUser.uid
            });
            setShowAddModal(false);
            setNewClubName('');
            setNewClubDesc('');
            fetchClubs();
        } catch (err) {
            alert("Error adding club");
        }
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="fade-in">Student Clubs</h1>
                    <p className="fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
                        Find your community and stay updated.
                    </p>
                </div>

                {(userRole === 'admin' || userRole === 'rep') && (
                    <button onClick={() => setShowAddModal(true)} className="btn-primary fade-in" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={18} /> Add Club
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {clubs.map((club, index) => {
                    const isSub = subscribedClubs.includes(club.name);
                    return (
                        <motion.div
                            key={club.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel"
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{club.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{club.description}</p>
                            </div>

                            <button
                                onClick={() => handleSubscribe(club.id, club.name)}
                                className={isSub ? "btn-secondary" : "btn-primary"}
                                style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                {isSub ? <><Check size={16} /> Subscribed (Unsubscribe)</> : 'Subscribe'}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Simple Modal for Adding Club */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel"
                        style={{ width: '400px', padding: '32px', position: 'relative' }}
                    >
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '24px' }}>Create New Club</h3>
                        <form onSubmit={handleAddClub} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                placeholder="Club Name"
                                value={newClubName}
                                onChange={e => setNewClubName(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newClubDesc}
                                onChange={e => setNewClubDesc(e.target.value)}
                                required
                                rows={4}
                            />
                            <button type="submit" className="btn-primary">Create Club</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
