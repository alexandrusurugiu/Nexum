import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { auth } from '../firebase'; 
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('nexum_user')) || null);
    const isLoading = ref(false);
    const errorMsg = ref('');
    const tempUser = ref(null);
    const isAuthenticated = computed(() => user.value !== null);

    const toggle2FA = async (isEnabled) => {
        try {
            await axios.put(`http://localhost:5000/server/auth/${user.value.id}/toggle-2fa`, { isEnabled });
            user.value.is2FAEnabled = isEnabled;
            localStorage.setItem('nexum_user', JSON.stringify(user.value));
            
            return true;
        } catch (error) {
            return false;
        }
    };

    const verify2FA = async (code) => {
        isLoading.value = true;
        errorMsg.value = '';

        try {
            const response = await axios.post('http://localhost:5000/server/auth/verify-2fa', {
                uid: tempUser.value.id,
                code: code
            });
            if (response.data.success) {
                user.value = tempUser.value; 
                localStorage.setItem('nexum_user', JSON.stringify(user.value));
                tempUser.value = null;
                
                return true;
            }
        } catch (error) {
            errorMsg.value = error.response?.data?.message || "Cod invalid.";
            
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (name, email, password) => {
        isLoading.value = true;
        errorMsg.value = '';
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            const response = await axios.post('http://localhost:5000/server/auth/sync', {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: name,
                avatar: ''
            });

            if (response.data.success) {
                user.value = response.data.user;
                localStorage.setItem('nexum_user', JSON.stringify(user.value));
                return true;
            }
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                errorMsg.value = "Acest email este deja folosit.";
            } else if (error.code === 'auth/weak-password') {
                errorMsg.value = "Parola trebuie să aibă minim 6 caractere.";
            } else {
                errorMsg.value = "Eroare la înregistrare. Verifică datele introduse.";
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const login = async (email, password) => {
        isLoading.value = true;
        errorMsg.value = '';
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            const response = await axios.post('http://localhost:5000/server/auth/sync', {
                uid: firebaseUser.uid, email: firebaseUser.email, name: '', avatar: ''
            });

            if (response.data.success) {
                const userData = response.data.user;
                
                if (userData.is2FAEnabled) {
                    tempUser.value = userData; 
                    await axios.post('http://localhost:5000/server/auth/send-2fa', { uid: userData.id, email: userData.email });
                    
                    return { success: true, requires2FA: true };
                } else {
                    user.value = userData;
                    localStorage.setItem('nexum_user', JSON.stringify(user.value));
                    
                    return { success: true, requires2FA: false };
                }
            }
        } catch (error) {
            errorMsg.value = "Email sau parolă incorecte.";
            return { success: false };
        } finally {
            isLoading.value = false;
        }
    };

    const updateProfile = async (updates) => {
        isLoading.value = true;
        try {
            const response = await axios.put(`http://localhost:5000/server/auth/${user.value.id}/update`, updates);
            if (response.data.success) {
                user.value = response.data.user;
                localStorage.setItem('nexum_user', JSON.stringify(user.value));
                return true;
            }
        } catch (error) {
            console.error("Eroare update:", error);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Eroare la delogare Firebase:", error);
        }
        user.value = null;
        localStorage.removeItem('nexum_user');
    };

    const changeUserPassword = async (currentPassword, newPassword) => {
        isLoading.value = true;
        errorMsg.value = '';
        
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                throw new Error("Nu ești autentificat.");
            }

            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            
            return { success: true };
        } catch (error) {
            console.error("Eroare la schimbarea parolei:", error);
            let message = "A apărut o eroare la schimbarea parolei.";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "Parola actuală este incorectă.";
            } else if (error.code === 'auth/weak-password') {
                message = "Noua parolă este prea slabă. Alege una mai puternică.";
            }

            return { success: false, message };
        } finally {
            isLoading.value = false;
        }
    };

    return { user, isAuthenticated, isLoading, errorMsg, login, register, logout, updateProfile, changeUserPassword, verify2FA, toggle2FA };
});