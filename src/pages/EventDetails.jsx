import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

const mockEventDetails = {
    '1': {
        id: '1',
        title: 'HackNova 2026',
        description: 'The biggest 48-hour hackathon in the region. Join us for a weekend of innovation, coding, and fun. Prizes worth $10k up for grabs!',
        date: '2026-03-20T09:00',
        endDate: '2026-03-22T18:00',
        location: 'Main Auditorium & Labs',
        timeline: [
            { time: 'Day 1 - 09:00 AM', title: 'Opening Ceremony', desc: 'Keynote speakers and problem statements released.' },
            { time: 'Day 1 - 11:00 AM', title: 'Hacking Begins', desc: 'Start your engines! Team formation and ideation.' },
            { time: 'Day 1 - 01:00 PM', title: 'Lunch Break', desc: 'Fuel up for the marathon ahead.' },
            { time: 'Day 2 - 10:00 AM', title: 'Mentorship Round 1', desc: 'Industry experts review your progress.' },
            { time: 'Day 3 - 04:00 PM', title: 'Pitching', desc: 'Present your solution to the judges.' }
        ],
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    '2': {
        id: '2',
        title: 'Freshers Night 2026',
        description: 'A night of music, dance, and celebration to welcome the new batch. Dress code: Black tie.',
        date: '2026-08-15T18:00',
        location: 'College Ground',
        timeline: [
            { time: '06:00 PM', title: 'Entry Starts', desc: 'Gates open for all students.' },
            { time: '07:00 PM', title: 'Cultural Performances', desc: 'Dance and music by senior clubs.' },
            { time: '08:30 PM', title: 'Mr. & Ms. Fresher', desc: 'The main event!' },
            { time: '10:00 PM', title: 'DJ Night', desc: 'Dance the night away.' }
        ],
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    '3': {
        id: '3',
        title: 'Tech Symposium',
        description: 'A gathering of tech minds. Workshops on AI, Blockchain, and IoT.',
        date: '2026-04-10T10:00',
        location: 'Seminar Hall',
        timeline: [
            { time: '10:00 AM', title: 'Registration', desc: 'Pick up your badges.' },
            { time: '11:00 AM', title: 'Keynote: Future of AI', desc: 'Speaker form Google Deepmind.' },
            { time: '02:00 PM', title: 'Workshops', desc: 'Hands-on sessions.' }
        ],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
};

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = mockEventDetails[id] || mockEventDetails['1']; // Fallback to 1
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);
    const [isRegistered, setIsRegistered] = React.useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        // Mock API call
        setTimeout(() => {
            setIsRegistered(true);
            setShowRegisterModal(false);
        }, 1000);
    };

    return (
        <div className="page-container">
            <button onClick={() => navigate('/events')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back to Events
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ overflow: 'hidden', padding: 0 }}
            >
                <div style={{ height: '300px', background: `url(${event.image}) center/cover no-repeat`, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}></div>
                    <div style={{ position: 'absolute', bottom: '32px', left: '32px', color: 'white' }}>
                        <h1 style={{ fontSize: '42px', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{event.title}</h1>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '16px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={18} /> {new Date(event.date).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {event.location}</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
                        <div>
                            <h2 style={{ marginBottom: '16px' }}>About the Event</h2>
                            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                {event.description}
                            </p>

                            <h3 style={{ marginBottom: '24px' }}>Event Timeline</h3>
                            <div style={{ borderLeft: '2px solid var(--glass-border)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {event.timeline && event.timeline.map((item, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-31px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                                        <span style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>{item.time}</span>
                                        <h4 style={{ margin: '4px 0', fontSize: '18px' }}>{item.title}</h4>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
                                <h3 style={{ marginBottom: '16px' }}>Registration Details</h3>
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date</p>
                                    <p style={{ fontWeight: '600' }}>{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Venue</p>
                                    <p style={{ fontWeight: '600' }}>{event.location}</p>
                                </div>

                                {isRegistered ? (
                                    <div style={{
                                        padding: '16px',
                                        background: 'rgba(0, 255, 127, 0.1)',
                                        border: '1px solid #00FF7F',
                                        borderRadius: '8px',
                                        color: '#00FF7F',
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}>
                                        Registration Confirmed!
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowRegisterModal(true)}
                                        className="btn-primary"
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                    >
                                        Register Now <ExternalLink size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mock Google Form Modal */}
            {showRegisterModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel"
                        style={{ width: '400px', padding: '0', overflow: 'hidden', background: 'white' }}
                    >
                        <div style={{ height: '8px', background: '#673ab7' }}></div>
                        <div style={{ padding: '24px' }}>
                            <h2 style={{ color: 'black', marginBottom: '8px' }}>Event Registration</h2>
                            <p style={{ color: '#666', fontSize: '12px', marginBottom: '24px' }}>Please fill your details to register for {event.title}</p>

                            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ color: 'black', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                    <input style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', color: 'black' }} required />
                                </div>
                                <div>
                                    <label style={{ color: 'black', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email *</label>
                                    <input type="email" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', color: 'black' }} required />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px' }}>
                                    <button type="button" onClick={() => setShowRegisterModal(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ background: '#673ab7', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
