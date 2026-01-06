import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login, signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                // Handle file upload here or later
                if (!file) {
                    // In a real implementation we would enforce this
                }
                await signup(email, password, rollNumber, {
                    // In real app, upload file to storage and get URL
                    // idCardUrl: url 
                });
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        try {
            await googleLogin();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ width: '400px', padding: '40px' }}
            >
                <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '28px' }}>
                    {isLogin ? 'Welcome Back' : 'Join CUNP'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Roll Number"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>Upload College ID</label>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>OR</div>

                <button onClick={handleGoogle} className="btn-secondary" style={{ width: '100%' }}>
                    Continue with Google
                </button>

                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
}
