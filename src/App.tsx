import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './components/NavBar';
import AdminRoute from './routes/AdminRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './components/Login';
import Register from './components/Register';
import WelcomeComp from './components/Welcome';

// Nuevos componentes de Listas
import PlaylistAdmin from './components/Playlists/PlaylistAdmin';
import PlaylistViewer from './components/Playlists/PlaylistViewer';
import UserAccessManager from './components/Playlists/UserAccessManager';

// Importaciones de Redux
import { useAppDispatch, useAppSelector } from './store/hooks';
import { auth } from './services/FirebaseStorage';
import { setUser, setLoading, setError, fetchUserData } from './store/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseDbService } from './services/FirebaseDatabaseService';

// Internazionalización
import { IntlProvider } from 'react-intl';
import esMessages from './translations/es.json';
import enMessages from './translations/en.json';

const allMessages: { [key: string]: Record<string, string> } = {
  es: esMessages,
  en: enMessages,
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.i18n.locale);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setLoading(true));
      if (firebaseUser) {
        try {
          // Intentamos obtener los datos extendidos
          let userData = await firebaseDbService.getUserData(firebaseUser.uid);
          
          // Si el usuario no existe en la DB (pero sí en Auth), lo creamos proactivamente
          if (!userData) {
            console.log("Creando perfil de usuario faltante en DB...");
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.email?.split('@')[0] || 'Usuario',
              role: 'user', // Por defecto todos son user, el admin lo asignará manualmente
              accessiblePlaylists: []
            };
            await firebaseDbService.saveUser(userData);
          }

          dispatch(setUser(userData));
        } catch (error: any) {
          console.error('Error fetching/creating user data:', error);
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setUser(null));
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <IntlProvider locale={locale} messages={allMessages[locale] || allMessages['es']} defaultLocale="es">
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<WelcomeComp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas de Administrador */}
            <Route path="/admin/playlists" element={<AdminRoute><PlaylistAdmin /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserAccessManager /></AdminRoute>} />
            
            {/* Rutas Protegidas */}
            <Route path="/my-lists" element={<ProtectedRoute><PlaylistViewer /></ProtectedRoute>} />
            
            <Route path="*" element={<WelcomeComp />} />
          </Routes>
        </div>
      </Router>
    </IntlProvider>
  );
};

export default App;
