import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';

const mockJobs = {
    '1': {
        id: '1',
        company: 'Google',
        role: 'Software Engineer',
        location: 'Bangalore, India',
        salary: '₹12 - 20 LPA',
        description: 'We are looking for a Software Engineer to develop the next generation of Google products. You will work on challenging problems in distributed systems, ML, and frontend.',
        requirements: [
            'Proficiency in C++, Java, or Python',
            'Strong understanding of algorithms and data structures',
            'B.Tech in Computer Science or related field',
            'Experience with React/Angular is a plus'
        ],
        deadline: '2026-02-01'
    },
    '2': {
        id: '2',
        company: 'Amazon',
        role: 'SDE Intern',
        location: 'Hyderabad, India',
        salary: '₹80,000 / month',
        description: 'Join Amazon as an SDE Intern and work on large scale systems that power the AWS cloud.',
        requirements: [
            'Currently pursuing B.Tech in CSE/IT (3rd Year)',
            'Knowledge of OOPs concepts',
            'Problem solving skills'
        ],
        deadline: '2026-02-15'
    }
};

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const job = mockJobs[id] || mockJobs['1'];
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const handleApply = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setIsApplied(true);
            setShowApplyModal(false);
        }, 1000);
    };

    return (
        <div className="page-container">
            <button onClick={() => navigate('/placements')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back to Placements
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '0', overflow: 'hidden' }}
            >
                <div style={{ background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', padding: '40px', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
                            {job.company[0]}
                        </div>
                        <div>
                            <h1 style={{ marginBottom: '4px' }}>{job.role}</h1>
                            <p style={{ opacity: 0.9 }}>{job.company}</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
                        <div>
                            <h3 style={{ marginBottom: '16px' }}>Job Description</h3>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                {job.description}
                            </p>

                            <h3 style={{ marginBottom: '16px' }}>Requirements</h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                {job.requirements.map((req, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '12px', color: 'var(--text-secondary)' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '8px' }}></div>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
                                <h3 style={{ marginBottom: '20px' }}>Job Overview</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <MapPin size={20} className="text-accent" />
                                        <div>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Location</p>
                                            <p>{job.location}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <DollarSign size={20} className="text-accent" />
                                        <div>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Salary</p>
                                            <p>{job.salary}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Briefcase size={20} className="text-accent" />
                                        <div>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Type</p>
                                            <p>Full Time</p>
                                        </div>
                                    </div>
                                </div>

                                {isApplied ? (
                                    <div style={{ padding: '16px', background: 'rgba(0,255,127,0.1)', border: '1px solid #00FF7F', borderRadius: '8px', color: '#00FF7F', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={24} />
                                        <span>Application Submitted!</span>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowApplyModal(true)} className="btn-primary" style={{ width: '100%' }}>
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Application Mock Modal */}
            {showApplyModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel"
                        style={{ width: '500px', padding: '32px', position: 'relative', background: 'white', color: 'black' }}
                    >
                        <h2 style={{ marginBottom: '24px' }}>Apply to {job.company}</h2>
                        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>First Name</label>
                                    <input style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Last Name</label>
                                    <input style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Email</label>
                                <input type="email" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Resume / CV Link</label>
                                <input placeholder="Google Drive / LinkedIn" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Why do you want to join us?</label>
                                <textarea rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '4px', cursor: 'pointer' }}>Submit Application</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
