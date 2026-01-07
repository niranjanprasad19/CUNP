import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit2, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
    const { currentUser, userRole, subscribedClubs } = useAuth();
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: '',
        branch: '',
        year: '',
        rollNumber: ''
    });

    const handleEditClick = () => {
        setEditForm({
            displayName: currentUser?.displayName || '',
            branch: currentUser?.branch || '',
            year: currentUser?.year || '',
            rollNumber: currentUser?.rollNumber || ''
        });
        setShowEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentUser?.uid && !currentUser.uid.startsWith('demo-')) {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                    displayName: editForm.displayName,
                    branch: editForm.branch,
                    year: Number(editForm.year),
                    rollNumber: editForm.rollNumber
                });
                // Context will auto-update due to onSnapshot
            } else {
                alert("Demo users cannot persist updates.");
            }
            setShowEdit(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="page-container">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="fade-in">My Profile</h1>
                <button onClick={handleEditClick} className="btn-secondary fade-in" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Edit2 size={16} /> Edit Profile
                </button>
            </header>

            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
                <motion.section
                    className="glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {currentUser?.displayName?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 style={{ marginBottom: '8px' }}>{currentUser?.displayName || 'User'}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                padding: '4px 12px',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '12px',
                                textTransform: 'uppercase'
                            }}>
                                {userRole}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Roll Number</label>
                            <p>{currentUser?.rollNumber || 'N/A'}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Year</label>
                            <p>{currentUser?.year || 'N/A'}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Branch</label>
                            <p>{currentUser?.branch || 'N/A'}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Joined</label>
                            <p>{
                                currentUser?.createdAt?.toDate ?
                                    currentUser.createdAt.toDate().toLocaleDateString() :
                                    (currentUser?.createdAt?.toLocaleDateString ? currentUser.createdAt.toLocaleDateString() : 'Just now')
                            }</p>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ padding: '24px' }}
                >
                    <h3 style={{ marginBottom: '16px' }}>My Subscribed Clubs</h3>
                    {subscribedClubs.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {subscribedClubs.map(club => (
                                <div key={club.id} style={{
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.5)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <h4 style={{ marginBottom: '4px' }}>{club.name}</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{club.category}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>You haven't joined any clubs yet.</p>
                    )}
                </motion.section>
            </div>
            {/* Edit Profile Modal */}
            {showEdit && (
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
                            onClick={() => setShowEdit(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '24px' }}>Edit Profile</h3>
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Full Name</label>
                                <input
                                    value={editForm.displayName}
                                    onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Roll Number</label>
                                <input
                                    value={editForm.rollNumber}
                                    onChange={e => setEditForm({ ...editForm, rollNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Branch</label>
                                <input
                                    value={editForm.branch}
                                    onChange={e => setEditForm({ ...editForm, branch: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Year (1-4)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="4"
                                    value={editForm.year}
                                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    </motion.div>
                </div>
            )
            }
        </div >
    );
}
