import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';

export default function Clubs() {
    const { currentUser, userRole, subscribeToClub, unsubscribeFromClub, subscribedClubs } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);

    // New Club Form State
    const [newClubName, setNewClubName] = useState('');
    const [newClubDesc, setNewClubDesc] = useState('');

    useEffect(() => {
        // Mock Data for 10 Test Clubs
        const mockClubs = [
            { id: '1', name: 'Coding Club', description: 'For the tech enthusiasts and code wizards.' },
            { id: '2', name: 'Music Society', description: 'Jamming, concerts, and musical prowess.' },
            { id: '3', name: 'Robotics Club', description: 'Building the future, one bot at a time.' },
            { id: '4', name: 'Debate Club', description: 'Voice your opinion and master the art of argument.' },
            { id: '5', name: 'Photography Club', description: 'Capturing moments that last forever.' },
            { id: '6', name: 'Dance Crew', description: 'Rhythm, beats, and expression through movement.' },
            { id: '7', name: 'Literature Club', description: 'For those who find themselves in books.' },
            { id: '8', name: 'E-Cell', description: 'Fostering the spirit of entrepreneurship.' },
            { id: '9', name: 'Fine Arts', description: 'Scribble, paint, and create masterpieces.' },
            { id: '10', name: 'Sports Committee', description: 'Fitness, games, and team spirit.' }
        ];
        // Only reset if empty to keep edits
        if (clubs.length === 0) setClubs(mockClubs);
    }, []);

    const handleSubscribe = (club) => {
        const isSubscribed = subscribedClubs.find(c => c.id === club.id);
        if (isSubscribed) {
            unsubscribeFromClub(club.id);
        } else {
            subscribeToClub(club);
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
            // fetchClubs(); // removed for demo simplicity
        } catch (err) {
            alert("Error adding club");
        }
    };

    const handleEditClick = (club) => {
        setSelectedClub(club);
        setNewClubName(club.name);
        setNewClubDesc(club.description);
        setShowEditModal(true);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setClubs(prev => prev.map(c => c.id === selectedClub.id ? { ...c, name: newClubName, description: newClubDesc } : c));
        setShowEditModal(false);
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
                    const isSub = subscribedClubs.find(c => c.id === club.id);
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
                                onClick={() => handleSubscribe(club)}
                                className={isSub ? "btn-secondary" : "btn-primary"}
                                style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                {isSub ? <><Check size={16} /> Subscribed (Unsubscribe)</> : 'Subscribe'}
                            </button>

                            {userRole === 'club_admin' && (
                                <button
                                    onClick={() => handleEditClick(club)}
                                    className="btn-secondary"
                                    style={{ marginTop: '8px', fontSize: '12px' }}
                                >
                                    Edit Details
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Simple Modal for Adding Club */}
            {
                showAddModal && (
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
                )
            }

            {/* Edit Modal */}
            {
                showEditModal && (
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
                                onClick={() => setShowEditModal(false)}
                                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white' }}
                            >
                                <X size={24} />
                            </button>

                            <h3 style={{ marginBottom: '24px' }}>Edit Club</h3>
                            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </form>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
}
