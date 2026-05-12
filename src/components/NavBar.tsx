import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/AuthServide';
import { FormattedMessage } from 'react-intl';
import { setLocale } from '../store/slices/i18nSlice';

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
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-lg">
            <div className="flex gap-6 items-center">
                <Link to="/" className="text-xl font-bold text-blue-400">TrackerPro</Link>
                
                {user && (
                    <>
                        <Link to="/my-lists" className="hover:text-blue-300">
                            <FormattedMessage id="navbar.myLists" />
                        </Link>
                        
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/playlists" className="hover:text-blue-300">
                                    <FormattedMessage id="navbar.allLists" />
                                </Link>
                                <Link to="/admin/users" className="hover:text-blue-300">
                                    <FormattedMessage id="navbar.userRoles" />
                                </Link>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <button 
                    onClick={toggleLocale}
                    className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 uppercase"
                >
                    {locale}
                </button>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            <FormattedMessage id="navbar.logout" />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="hover:text-blue-300">
                            <FormattedMessage id="navbar.login" />
                        </Link>
                        <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                            <FormattedMessage id="navbar.register" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
