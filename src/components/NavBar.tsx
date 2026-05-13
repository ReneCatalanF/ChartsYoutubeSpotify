import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/AuthServide';
import { FormattedMessage } from 'react-intl';
import { setLocale } from '../store/slices/i18nSlice';
import hamburgLogo from '../images/armysbeyondsystem.jpg';

export const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const locale = useAppSelector((state) => state.i18n.locale);

    const handleLogout = async () => {
        try {
            await authService.signOut();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleLocale = () => {
        const newLocale = locale === 'es' ? 'en' : 'es';
        dispatch(setLocale(newLocale));
    };

    return (
        <nav className="bg-bts-black/80 backdrop-blur-md p-4 text-white flex justify-between items-center shadow-xl sticky top-0 z-50 border-b border-bts-purple/30">
            <div className="flex gap-8 items-center">
                <Link to="/" className="flex items-center gap-3">
                    <img src={hamburgLogo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-bts-purple" />
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-bts-purple-light to-bts-accent bg-clip-text text-transparent">
                        ChartsBTS
                    </span>
                </Link>
                
                {user && (
                    <div className="flex gap-4">
                        <Link to="/my-lists" className="hover:text-bts-purple-light transition-colors font-medium">
                            <FormattedMessage id="navbar.myLists" />
                        </Link>
                        
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/playlists" className="hover:text-bts-purple-light transition-colors font-medium">
                                    <FormattedMessage id="navbar.allLists" />
                                </Link>
                                <Link to="/admin/users" className="hover:text-bts-purple-light transition-colors font-medium">
                                    <FormattedMessage id="navbar.userRoles" />
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <button 
                    onClick={toggleLocale}
                    className="bg-bts-purple/20 px-3 py-1 rounded-full text-xs hover:bg-bts-purple/40 border border-bts-purple/50 transition-all"
                >
                    {locale}
                </button>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-bts-accent hidden sm:inline">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/80 px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                        >
                            <FormattedMessage id="navbar.logout" />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="hover:text-bts-purple-light py-2 px-4 transition-colors">
                            <FormattedMessage id="navbar.login" />
                        </Link>
                        <Link to="/register" className="bg-bts-purple px-5 py-2 rounded-lg hover:bg-bts-purple/80 transition shadow-lg shadow-bts-purple/30">
                            <FormattedMessage id="navbar.register" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
