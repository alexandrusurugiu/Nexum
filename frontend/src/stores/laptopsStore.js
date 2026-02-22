import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useLaptopsStore = defineStore('laptops', () => {
  const allLaptops = ref([]);
  const isLoading = ref(false);

  const fetchLaptops = async () => {
    if (allLaptops.value.length > 0) return; 

    isLoading.value = true;
    try {
      const response = await axios.get('http://localhost:5000/server/laptops');
      
      if (response.data.success) {
        allLaptops.value = response.data.data;
      }
    } catch (error) {
      console.error("Eroare la preluarea laptopurilor cu Axios:", error.message);
    } finally {
      isLoading.value = false;
    }
  };

  return { allLaptops, isLoading, fetchLaptops };
});