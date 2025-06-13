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
            console.log('Auth state changed. User:', user);
            if (user) {
                // Se houver um usuário logado, buscar seus dados no Firestore
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Combinar os dados do Firebase Auth com os dados do Firestore
                    setCurrentUser({
                        ...user,
                        ...docSnap.data()
                    });
                } else {
                    // Se o documento não existir (o que não deveria acontecer após o signup),
                    // apenas usar o objeto user padrão do Firebase Auth
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    console.log('AuthContext - Current User State:', currentUser);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 