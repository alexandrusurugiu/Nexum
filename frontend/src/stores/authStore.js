import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('nexum_user')) || null);
    const isLoading = ref(false);
    const errorMsg = ref('');

    const isAuthenticated = computed(() => user.value !== null);

    const login = async (email, password) => {
        isLoading.value = true;
        errorMsg.value = '';
        try {
            const response = await axios.post('http://localhost:5000/server/auth/login', { email, password });
            if (response.data.success) {
                user.value = response.data.user;
                localStorage.setItem('nexum_user', JSON.stringify(user.value));
                return true;
            }
        } catch (error) {
            errorMsg.value = error.response?.data?.message || "Eroare la logare.";
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (name, email, password) => {
        isLoading.value = true;
        errorMsg.value = '';
        try {
            const response = await axios.post('http://localhost:5000/server/auth/register', { name, email, password });
            if (response.data.success) {
                user.value = response.data.user;
                localStorage.setItem('nexum_user', JSON.stringify(user.value));
                return true;
            }
        } catch (error) {
            errorMsg.value = error.response?.data?.message || "Eroare la înregistrare.";
            return false;
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

    const logout = () => {
        user.value = null;
        localStorage.removeItem('nexum_user');
    };

    return { user, isAuthenticated, isLoading, errorMsg, login, register, logout, updateProfile };
});