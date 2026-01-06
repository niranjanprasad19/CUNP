import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { currentUser, userRole } = useAuth();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(10));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (data.length === 0) throw new Error("No data");
                setAnnouncements(data);
            } catch (e) {
                // Dummy data for MVP demo
                setAnnouncements([
                    { id: 1, title: 'HackNova 2026 Registration Open', club: 'Tech Club', content: 'Register now for the biggest hackathon!', createdAt: new Date() },
                    { id: 2, title: 'Placement Drive: Google', club: 'Placement Cell', content: 'Eligibility: 4th Year CSE.', createdAt: new Date() }
                ]);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="page-container">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="fade-in">Hello, {currentUser?.displayName || 'Student'}</h1>
                <p className="fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
                    Here's what's happening on campus today.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <section>
                    <h3 style={{ marginBottom: '16px' }}>Latest Announcements</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {announcements.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel"
                                style={{ padding: '20px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.club}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(item.createdAt?.seconds * 1000 || item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 style={{ marginBottom: '8px' }}>{item.title}</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onClick={() => { }}>
                            <h4>View Clubs</h4>
                        </div>
                        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer', textAlign: 'center' }} onClick={() => { }}>
                            <h4>Upcoming Events</h4>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
