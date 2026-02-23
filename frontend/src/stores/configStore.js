import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useConfiguratorStore = defineStore('configurator', () => {
    const allParts = ref([]);
    const isLoading = ref(false);

    const fetchParts = async () => {
        if (allParts.value.length > 0) {
            return;
        }
        
        isLoading.value = true;

        try {
            const response = await axios.get('http://localhost:5000/server/config');
            if (response.data.success) {
                allParts.value = response.data.data;
            }
        } catch (error) {
            console.error("Eroare la preluarea pieselor:", error.message);
        } finally {
            isLoading.value = false;
        }
    };

    return { allParts, isLoading, fetchParts };
});