import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Onboarding() {
    const navigate = useNavigate();
    const { subscribeToClub } = useAuth();
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        hobbies: [],
        interests: [],
        goals: []
    });

    const clubsData = [
        { id: 1, name: 'Coding Club', category: 'Tech' },
        { id: 2, name: 'Robotics Society', category: 'Tech' },
        { id: 3, name: 'Dance Crew', category: 'Cultural' },
        { id: 4, name: 'Music Society', category: 'Cultural' },
        { id: 5, name: 'Debating Society', category: 'Literary' },
        { id: 6, name: 'Sports Club', category: 'Sports' }
    ];

    const [suggestedClubs, setSuggestedClubs] = useState([]);

    const handleNext = () => {
        if (step === 3) {
            // Generate suggestions based on inputs (Mock logic)
            let suggestions = clubsData.filter(c => Math.random() > 0.5);
            // Ensure at least 3 suggestions
            if (suggestions.length < 3) suggestions = clubsData.slice(0, 3);
            setSuggestedClubs(suggestions);
            setStep(4);
        } else {
            setStep(step + 1);
        }
    };

    const handleFinish = () => {
        navigate('/');
    };

    const toggleSelection = (category, value) => {
        setPreferences(prev => {
            const list = prev[category];
            if (list.includes(value)) {
                return { ...prev, [category]: list.filter(i => i !== value) };
            } else {
                return { ...prev, [category]: [...list, value] };
            }
        });
    };

    const OptionBtn = ({ label, category }) => (
        <button
            className={`btn-secondary ${preferences[category].includes(label) ? 'active-option' : ''}`}
            onClick={() => toggleSelection(category, label)}
            style={{
                background: preferences[category].includes(label) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                color: preferences[category].includes(label) ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '12px 24px',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    padding: '40px',
                    textAlign: 'center'
                }}
            >
                {step === 1 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '24px' }}>Tell us about your hobbies</h2>
                        <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>Pick as many as you like</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
                            <OptionBtn label="Coding" category="hobbies" />
                            <OptionBtn label="Music" category="hobbies" />
                            <OptionBtn label="Sports" category="hobbies" />
                            <OptionBtn label="Reading" category="hobbies" />
                            <OptionBtn label="Gaming" category="hobbies" />
                            <OptionBtn label="Art" category="hobbies" />
                        </div>
                        <button className="btn-primary" onClick={handleNext}>Next</button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '24px' }}>What are you interested in?</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
                            <OptionBtn label="Technology" category="interests" />
                            <OptionBtn label="Management" category="interests" />
                            <OptionBtn label="Public Speaking" category="interests" />
                            <OptionBtn label="Entrepreneurship" category="interests" />
                            <OptionBtn label="Social Service" category="interests" />
                        </div>
                        <button className="btn-primary" onClick={handleNext}>Next</button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '24px' }}>What are your goals?</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
                            <OptionBtn label="Get Placed" category="goals" />
                            <OptionBtn label="Learn New Skills" category="goals" />
                            <OptionBtn label="Make Friends" category="goals" />
                            <OptionBtn label="Have Fun" category="goals" />
                        </div>
                        <button className="btn-primary" onClick={handleNext}>See Suggestions</button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '16px' }}>Recommended Clubs for you</h2>
                        <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>Based on your interests, we think you'll love these!</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
                            {suggestedClubs.map(club => (
                                <div key={club.id} style={{
                                    padding: '16px',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.05)'
                                }}>
                                    <div>
                                        <h4 style={{ marginBottom: '4px' }}>{club.name}</h4>
                                        <span style={{ fontSize: '12px', color: 'var(--accent-primary)' }}>{club.category}</span>
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '8px 16px', fontSize: '12px' }}
                                        onClick={(e) => {
                                            subscribeToClub(club);
                                            e.target.innerText = "Joined";
                                            e.target.disabled = true;
                                            e.target.style.opacity = 0.5;
                                        }}
                                    >
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" onClick={handleFinish}>Go to Dashboard</button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
