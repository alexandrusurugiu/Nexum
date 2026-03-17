import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const usePeripheralsStore = defineStore('peripherals', () => {
  const allPeripherals = ref([]);
  const isLoading = ref(false);

  const fetchPeripherals = async () => {
    if (allPeripherals.value.length > 0) return; 

    isLoading.value = true;
    try {
      const response = await axios.get('${import.meta.env.VITE_API_URL}/server/peripherals');
      
      if (response.data.success) {
        allPeripherals.value = response.data.data;
      }
    } catch (error) {
      console.error("Eroare la preluarea perifericelor cu Axios:", error.message);
    } finally {
      isLoading.value = false;
    }
  };

  return { allPeripherals, isLoading, fetchPeripherals };
});