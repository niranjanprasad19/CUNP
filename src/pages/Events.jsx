import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, X, Calendar as CalIcon, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Events() {
    const { userRole } = useAuth();
    const [events, setEvents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    // New Event Form
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [regLink, setRegLink] = useState('');

    useEffect(() => {
        // Mock Events
        setEvents([
            { id: '1', title: 'HackNova 2026', description: 'The biggest 48-hour hackathon in the region.', date: '2026-03-20T09:00', location: 'Main Auditorium', regLink: '#' },
            { id: '2', title: 'Freshers Night 2026', description: 'Music, dance, and celebration.', date: '2026-08-15T18:00', location: 'College Ground', regLink: '#' },
            { id: '3', title: 'Tech Symposium', description: 'Workshops on AI, Blockchain, and IoT.', date: '2026-04-10T10:00', location: 'Seminar Hall', regLink: '#' },
            { id: '4', title: 'Cultural Fest', description: 'A week of art, culture, and diversity.', date: '2026-05-01T09:00', location: 'Campus Wide', regLink: '#' },
            { id: '5', title: 'Sports Meet', description: 'Inter-college sports championship.', date: '2026-11-20T08:00', location: 'Sports Complex', regLink: '#' }
        ]);
    }, []);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        // ... (existing add logic simplified or removed for demo, but keeping the function structure)
        alert("Event creation disabled in demo");
        setShowAddModal(false);
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="fade-in">Campus Events</h1>
                    <p className="fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
                        Don't miss out on upcoming activities.
                    </p>
                </div>

                {(userRole === 'admin' || userRole === 'rep') && (
                    <button onClick={() => setShowAddModal(true)} className="btn-primary fade-in" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={18} /> Add Event
                    </button>
                )}
            </div>

            {/* Timeline Layout */}
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute', left: '19px', top: '0', bottom: '0', width: '2px',
                    background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), transparent)'
                }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ position: 'relative' }}
                        >
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: '-46px', top: '24px', width: '14px', height: '14px',
                                borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--accent-primary)',
                                boxShadow: '0 0 10px var(--accent-primary)'
                            }}></div>

                            <div className="glass-panel" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '22px' }}>{event.title}</h3>
                                    {event.date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
                                            <CalIcon size={14} />
                                            <span>{new Date(event.date).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>{event.description}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        <MapPin size={16} /> {event.location || 'TBA'}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="btn-secondary"
                                        style={{ fontSize: '14px', padding: '8px 16px' }}
                                    >
                                        Register Now / Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

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
                        style={{ width: '500px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white' }}><X size={24} /></button>
                        <h3 style={{ marginBottom: '24px' }}>Schedule New Event</h3>
                        <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required />
                            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
                            <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
                            <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required rows={4} />
                            <input placeholder="Google Form Registration Link" value={regLink} onChange={e => setRegLink(e.target.value)} required />
                            <button type="submit" className="btn-primary">Publish Event</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
