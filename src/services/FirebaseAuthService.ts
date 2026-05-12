import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { app } from './FirebaseStorage';
import { firebaseDbService } from './FirebaseDatabaseService';
import { AppUser } from '../entites/entities';

const auth = getAuth(app);

export class FirebaseAuthService {
    async signIn(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async signUp(email: string, password: string) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Al registrarse, creamos el perfil en Realtime Database con rol 'user' por defecto
        const newUser: AppUser = {
            uid: user.uid,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Usuario',
            role: 'user', // Todos los nuevos registros son 'user'
            accessiblePlaylists: []
        };

        await firebaseDbService.saveUser(newUser);
        return userCredential;
    }

    signOut(): Promise<void> {
        return signOut(auth);
    }

    onAuthStateChanged(callback: (user: any) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }
}

export const authService = new FirebaseAuthService();
