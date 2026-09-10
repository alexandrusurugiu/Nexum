import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = ref(localStorage.getItem('nexum-theme') || 'Dark Mode (Implicit)');
    const isDark = computed(() => currentTheme.value === 'Dark Mode (Implicit)');

    watch(currentTheme, (newTheme) => {
        localStorage.setItem('nexum-theme', newTheme);
    });

    return { currentTheme, isDark };
});