import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Briefcase, Building, ExternalLink, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Placements() {
    const { userRole, currentUser } = useAuth();
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [eligibility, setEligibility] = useState('4th Year');
    const [deadline, setDeadline] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            const q = query(collection(db, "placements"), orderBy("deadline", "asc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (data.length === 0) throw new Error("Empty");
            setPlacements(data);
        } catch (e) {
            setPlacements([
                { id: '1', company: 'Google', role: 'Software Engineer', eligibility: '4th Year', deadline: '2026-02-01', link: '#' },
                { id: '2', company: 'Amazon', role: 'SDE Intern', eligibility: '3rd Year', deadline: '2026-02-15', link: '#' }
            ]);
        }
    };

    const handleAddPlacement = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "placements"), {
                company, role, eligibility, deadline, link,
                createdAt: new Date()
            });
            setShowAddModal(false);
            fetchPlacements();
        } catch (err) { alert("Error"); }
    };

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="fade-in">Placement Cell</h1>
                    <p className="fade-in" style={{ animationDelay: '0.1s', color: 'var(--text-secondary)' }}>
                        Career opportunities for 3rd and 4th year students.
                    </p>
                </div>

                {(userRole === 'admin' || userRole === 'rep') && (
                    <button onClick={() => setShowAddModal(true)} className="btn-primary fade-in" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={18} /> Post Job
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {placements.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel"
                        style={{ padding: '24px', borderTop: '4px solid var(--accent-secondary)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{job.role}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                    <Building size={16} /> {job.company}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '11px', fontWeight: 'bold',
                                padding: '4px 8px', borderRadius: '4px',
                                background: job.eligibility.includes('3') ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 191, 0, 0.1)',
                                color: job.eligibility.includes('3') ? 'var(--success)' : 'var(--warning)'
                            }}>
                                {job.eligibility}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                        </div>

                        <button
                            onClick={() => {
                                const year = currentUser?.year || 1; // Default to 1 if not set
                                if (year < 3) {
                                    alert(`You are in year ${year}. Placements are only for 3rd and 4th year students.`);
                                } else {
                                    navigate(`/placements/${job.id}`);
                                }
                            }}
                            className="btn-secondary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            Apply Now <ExternalLink size={16} />
                        </button>
                    </motion.div>
                ))}
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
                        style={{ width: '400px', padding: '32px', position: 'relative' }}
                    >
                        <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white' }}><X size={24} /></button>
                        <h3 style={{ marginBottom: '24px' }}>Post Opportunity</h3>
                        <form onSubmit={handleAddPlacement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} required />
                            <input placeholder="Role / Title" value={role} onChange={e => setRole(e.target.value)} required />
                            <select value={eligibility} onChange={e => setEligibility(e.target.value)}>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                                <option>3rd & 4th Year</option>
                            </select>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Application Deadline</label>
                            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                            <input placeholder="Application Link" value={link} onChange={e => setLink(e.target.value)} required />
                            <button type="submit" className="btn-primary">Post Job</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
