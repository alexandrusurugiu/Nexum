import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMonitorsStore = defineStore('monitors', () => {
  const allMonitors = ref([]);
  const isLoading = ref(false);

  const fetchMonitors = async () => {
    if (allMonitors.value.length > 0) return; 

    isLoading.value = true;
    try {
      const response = await axios.get('http://localhost:5000/server/monitors');
      
      if (response.data.success) {
        allMonitors.value = response.data.data;
      }
    } catch (error) {
      console.error("Eroare la preluarea monitoarelor:", error.message);
    } finally {
      isLoading.value = false;
    }
  };

  return { allMonitors, isLoading, fetchMonitors };
});