import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase'; // Importa do seu arquivo de config Firebase
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Se for usar Firestore

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, userData) { // userData agora com nome, sobrenome, tipo, cidade
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Salvar dados adicionais no Firestore na coleção 'usuarios'
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
            nome: userData.nome,
            sobrenome: userData.sobrenome,
            email: userData.email,
            tipo: userData.tipo,
            cidade: userData.cidade || '',
            criado_em: new Date(),
            atualizado_em: new Date()
        });
        return userCredential.user;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    // Observa o estado de autenticação do Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (user) {
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = { ...user, ...docSnap.data() };
                    setCurrentUser(userData);
                } else {
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 