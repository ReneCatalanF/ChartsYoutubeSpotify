import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AuthServide";
import { useAppDispatch } from '../store/hooks';
import { setLoading, setError } from '../store/slices/authSlice';
import { FormattedMessage, useIntl } from 'react-intl';
import hamburgLogo from '../images/armysbeyondsystem.jpg';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [localError, setLocalError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const intl = useIntl();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError('');
        setSuccess('');
        dispatch(setError(null));
        dispatch(setLoading(true));

        try {
            await authService.signUp(email, password);
            setSuccess(intl.formatMessage({ id: 'register.successMessage' }));
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error: any) {
            setLocalError(error.message);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <img src={hamburgLogo} alt="Logo" className="w-24 h-24 rounded-full border-2 border-bts-purple shadow-lg" />
            </div>
            
            <form onSubmit={handleRegister} className="bg-bts-dark/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-bts-purple/20">
                <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-bts-purple-light to-bts-accent bg-clip-text text-transparent">
                    <FormattedMessage id="register.title" />
                </h2>
                <div className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder={intl.formatMessage({ id: 'register.placeholder.email' })}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl transition-all"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder={intl.formatMessage({ id: 'register.placeholder.password' })}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl transition-all"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full mt-8 bg-bts-purple text-white py-3 rounded-xl hover:bg-bts-purple/80 shadow-lg shadow-bts-purple/30 text-lg uppercase tracking-widest font-bold"
                >
                    <FormattedMessage id="register.button.register" />
                </button>
                {localError && (
                    <div className="mt-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {localError}
                    </div>
                )}
                {success && (
                    <div className="mt-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">
                        {success}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;
