import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthServide';
import { useAppDispatch } from '../store/hooks';
import { setLoading, setError } from '../store/slices/authSlice';
import { FormattedMessage, useIntl } from 'react-intl';

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
            const userCredential = await authService.signIn(email, password);
            console.log("Usuario autenticado:", userCredential.user);
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setLocalError(error.message);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    <FormattedMessage id="login.title" />
                </h2>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder={intl.formatMessage({ id: 'login.placeholder.email' })}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder={intl.formatMessage({ id: 'login.placeholder.password' })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                    <FormattedMessage id="login.button.login" />
                </button>
                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};