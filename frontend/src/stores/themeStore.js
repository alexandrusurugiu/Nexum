import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = ref(localStorage.getItem('nexum_theme') || 'Dark Mode (Implicit)');
    const isDark = ref(true);

    const applyTheme = (themeOption) => {
        let actualTheme = 'dark';
        
        if (themeOption === 'Light Mode') {
            actualTheme = 'light';
            isDark.value = false;
        } 
        else if (themeOption === 'Dark Mode (Implicit)') {
            actualTheme = 'dark';
            isDark.value = true;
        } 
        else if (themeOption === 'Sincronizare cu sistemul') {
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            actualTheme = prefersLight ? 'light' : 'dark';
            isDark.value = !prefersLight;
        }

        document.documentElement.setAttribute('data-theme', actualTheme);
    };

    watch(currentTheme, (newVal) => {
        applyTheme(newVal);
        localStorage.setItem('nexum_theme', newVal);
    }, { immediate: true });

    const toggleTheme = () => {
        currentTheme.value = isDark.value ? 'Light Mode' : 'Dark Mode (Implicit)';
    };

    return { currentTheme, isDark, toggleTheme };
});