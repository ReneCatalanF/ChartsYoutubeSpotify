export type Role = 'admin' | 'user';

export interface IAuthService {
    signIn(email: string, password: string): Promise<any>;
    signUp(email: string, password: string): Promise<any>;
    signOut(): Promise<void>;
    onAuthStateChanged(callback: (user: any) => void): () => void;
}
