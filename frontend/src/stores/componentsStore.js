import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useComponentsStore = defineStore('components', () => {
  const allComponents = ref([]);
  const isLoading = ref(false);

  const fetchComponents = async () => {
    if (allComponents.value.length > 0) return; 

    isLoading.value = true;
    try {
      const response = await axios.get('http://localhost:5000/server/components');
      
      if (response.data.success) {
        allComponents.value = response.data.data;
      }
    } catch (error) {
      console.error("Eroare la preluarea componentelor cu Axios:", error.message);
    } finally {
      isLoading.value = false;
    }
  };

  return { allComponents, isLoading, fetchComponents };
});