import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useConfiguratorStore = defineStore('configurator', () => {
    const allParts = ref([]);
    const isLoading = ref(false);

    const currentBuild = ref({
        cpu: null,
        mb: null,
        cooler: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: null
    });

    const buildAnalysis = ref(null);
    const isAnalyzing = ref(false);
    const analysisError = ref(null);

    const fetchParts = async () => {
        if (allParts.value.length > 0) {
            return;
        }
        
        isLoading.value = true;

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/config`);
            if (response.data.success) {
                allParts.value = response.data.data;
            }
        } catch (error) {
            console.error("Eroare la preluarea pieselor:", error.message);
        } finally {
            isLoading.value = false;
        }
    };

    const setComponent = (category, part) => {
        currentBuild.value[category] = part;
    };

    const removeComponent = (category) => {
        currentBuild.value[category] = null;
    };

    const analyzeCurrentBuild = async (selectedGames = [], targetResolution = '1440p (QHD)') => {
        if (!currentBuild.value.cpu || !currentBuild.value.gpu) return;

        isAnalyzing.value = true;
        analysisError.value = null;
        buildAnalysis.value = null;
 
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/analyze-build`, {
                buildComponents: currentBuild.value,
                targetGames: selectedGames,
                targetResolution: targetResolution
            });
            
            buildAnalysis.value = response.data;
        } catch (error) {
            console.error("Eroare la analiza build-ului:", error);
            analysisError.value = error.response?.data?.error || "A apărut o eroare la comunicarea cu AI-ul.";
        } finally {
            isAnalyzing.value = false;
        }
    };

    return { 
        allParts, 
        isLoading, 
        fetchParts,
        currentBuild,
        buildAnalysis,
        isAnalyzing,
        analysisError,
        setComponent,
        removeComponent,
        analyzeCurrentBuild
    };
});