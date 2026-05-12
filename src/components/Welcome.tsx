import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { FormattedMessage } from 'react-intl';
import hamburgLogo from '../images/armysbeyondsystem.jpg';

const Welcome: React.FC = () => {
    const { user } = useAppSelector(state => state.auth);

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-bts-purple blur-3xl opacity-20 animate-pulse"></div>
                <img 
                    src={hamburgLogo} 
                    alt="Logo" 
                    className="w-48 h-48 rounded-full border-4 border-bts-purple shadow-2xl relative z-10" 
                />
            </div>

            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-bts-purple-light via-bts-accent to-white bg-clip-text text-transparent tracking-tight">
                TRACKER PRO
            </h1>

            <p className="text-xl text-bts-accent/80 max-w-2xl mb-12 leading-relaxed">
                <FormattedMessage id="welcome.message" />
            </p>

            {!user ? (
                <div className="flex gap-6">
                    <Link 
                        to="/login" 
                        className="px-8 py-4 bg-bts-purple text-white rounded-2xl font-bold text-lg hover:bg-bts-purple/80 transition-all shadow-xl shadow-bts-purple/30 uppercase tracking-widest"
                    >
                        <FormattedMessage id="navbar.login" />
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-8 py-4 bg-bts-dark border border-bts-purple/40 text-white rounded-2xl font-bold text-lg hover:bg-bts-purple/10 transition-all uppercase tracking-widest"
                    >
                        <FormattedMessage id="navbar.register" />
                    </Link>
                </div>
            ) : (
                <Link 
                    to="/my-lists" 
                    className="px-10 py-5 bg-gradient-to-r from-bts-purple to-indigo-600 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-bts-purple/40 uppercase tracking-widest"
                >
                    <FormattedMessage id="navbar.myLists" />
                </Link>
            )}
        </div>
    );
};

export default Welcome;
