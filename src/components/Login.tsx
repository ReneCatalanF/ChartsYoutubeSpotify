import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthServide';
import { useAppDispatch } from '../store/hooks';
import { setLoading, setError } from '../store/slices/authSlice';
import { FormattedMessage, useIntl } from 'react-intl';
import hamburgLogo from '../images/armysbeyondsystem.jpg';

export const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setLocalError] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const intl = useIntl();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError('');
        dispatch(setError(null));
        dispatch(setLoading(true));

        try {
            await authService.signIn(email, password);
            navigate('/');
        } catch (error: any) {
            setLocalError(error.message);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
            <div className="mb-8 animate-bounce-slow">
                <img src={hamburgLogo} alt="Logo" className="w-32 h-32 rounded-full border-4 border-bts-purple shadow-2xl shadow-bts-purple/40" />
            </div>
            
            <form onSubmit={handleLogin} className="bg-bts-dark/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-bts-purple/20">
                <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-bts-purple-light to-bts-accent bg-clip-text text-transparent">
                    <FormattedMessage id="login.title" />
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder={intl.formatMessage({ id: 'login.placeholder.email' })}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl focus:ring-2 focus:ring-bts-purple transition-all"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder={intl.formatMessage({ id: 'login.placeholder.password' })}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl focus:ring-2 focus:ring-bts-purple transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-8 bg-bts-purple text-white py-3 rounded-xl hover:bg-bts-purple/80 shadow-lg shadow-bts-purple/30 text-lg uppercase tracking-widest font-bold"
                >
                    <FormattedMessage id="login.button.login" />
                </button>
                
                {error && (
                    <div className="mt-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};
