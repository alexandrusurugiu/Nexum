<template>
    <v-app class="nexum-bg">
        <AppHeader></AppHeader>

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Laptopuri</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Stații de lucru mobile, ultrabook-uri premium și laptopuri de gaming de top.
                </p>
            </div>

            <v-row>
                <v-col cols="12" md="3" lg="2">
                    <v-card class="filter-panel pa-5 rounded-xl" elevation="10">
                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Utilizare</h3>
                        
                        <v-list bg-color="transparent" class="pa-0 mb-6">
                            <v-list-item
                                v-for="cat in categories"
                                :key="cat.id"
                                @click="activeCategory = cat.id"
                                :class="['category-item mb-2 rounded-lg', { 'active-category': activeCategory === cat.id }]"
                                :prepend-icon="cat.icon"
                            >
                                <v-list-item-title class="font-weight-medium">{{ cat.name }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        
                        <v-divider class="border-opacity-25 mb-6" color="#10B981"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-2">Buget (Lei)</h3>

                        <div class="d-flex justify-space-between cloud-text opacity-80 text-caption font-weight-bold mb-4">
                            <span>{{ priceRange[0] }}</span>
                            <span>{{ priceRange[1] }}</span>
                        </div>

                        <v-range-slider
                            v-model="priceRange"
                            :min="1000"
                            :max="30000"  :step="100"
                            color="#10B981"
                            track-color="rgba(245, 246, 250, 0.1)"
                            track-fill-color="#10B981"
                            thumb-size="18"
                            class="neon-slider mt-2 mb-6">
                            <template v-slot:thumb="{ modelValue }">
                                <div class="neon-thumb elevation-5"></div>
                            </template>
                        </v-range-slider>

                        <v-divider class="border-opacity-25 mb-6" color="#10B981"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Filtre</h3>

                        <v-expansion-panels variant="accordion" multiple class="custom-expansion-panels" bg-color="transparent">
                            <v-expansion-panel v-if="availableFilters.brands.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Producător
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="brand in availableFilters.brands" :key="brand" v-model="selectedFilters.brands" :label="brand" :value="brand" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.cpuSeries.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Serie Procesor
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="serie in availableFilters.cpuSeries" :key="serie" v-model="selectedFilters.cpuSeries" :label="serie" :value="serie" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.cpuModels.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Model Procesor
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="model in availableFilters.cpuModels" :key="model" v-model="selectedFilters.cpuModels" :label="model" :value="model" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.gpuSeries.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Serie Placă Video
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="serie in availableFilters.gpuSeries" :key="serie" v-model="selectedFilters.gpuSeries" :label="serie" :value="serie" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.gpuModels.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Model Placă Video
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="model in availableFilters.gpuModels" :key="model" v-model="selectedFilters.gpuModels" :label="model" :value="model" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.rams.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Memorie RAM
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="ram in availableFilters.rams" :key="ram" v-model="selectedFilters.rams" :label="ram" :value="ram" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.storages.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">
                                    Capacitate Stocare
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="storage in availableFilters.storages" :key="storage" v-model="selectedFilters.storages" :label="storage" :value="storage" color="#10B981" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                            Afișare <span class="cyan-text font-weight-bold">{{ filteredLaptops.length }}</span> laptopuri
                        </div>
                        
                        <div class="d-flex align-center" style="width: 250px;">
                            <span class="cloud-text opacity-80 mr-3 text-body-2">Sortează:</span>
                            <v-select
                                v-model="sortOption" :items="sortOptions" variant="outlined" density="compact" hide-details
                                bg-color="var(--bg-main)" color="#10B981"
                                class="custom-select"
                            ></v-select>
                        </div>
                    </div>

                    <div v-if="filteredLaptops.length === 0" class="text-center py-16">
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-laptop-off</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun laptop nu corespunde filtrelor</h2>
                        <p class="cyan-text mt-2" style="cursor: pointer;" @click="resetFilters">Resetează toate filtrele</p>
                    </div>

                    <v-row v-else>
                        <v-col v-for="laptop in filteredLaptops" :key="laptop.id" cols="12" sm="6" md="6" lg="4" xl="3">
                            <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                                <v-chip v-if="laptop.discount" color="#059669" class="discount-badge font-weight-bold" size="small">
                                -{{ laptop.discount }}%
                                </v-chip>

                                <div class="img-container pa-4 text-center">
                                    <v-img :src="laptop.specs.image" height="200" contain class="product-img mx-auto"></v-img>
                                </div>
                                
                                <v-card-text class="flex-grow-1 pt-4">
                                    <span class="text-caption text-uppercase font-weight-bold" style="color: #10B981; letter-spacing: 1px;">
                                        {{ laptop.brand }}
                                    </span>

                                    <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                                        {{ laptop.name }}
                                    </h3>
                                    
                                    <div class="quick-specs">
                                        <template v-for="(value, key) in laptop.specs" :key="key">
                                            <div v-if="key !== 'image'" class="d-flex align-center mb-1">
                                                <v-icon size="small" color="#10B981" class="mr-2 opacity-80">mdi-circle-small</v-icon>
                                                <span class="cloud-text opacity-80 text-body-2 text-truncate">
                                                    <strong class="cyan-text" style="opacity: 0.9;">{{ formatSpecLabel(key) }}:</strong> {{ value }}
                                                </span>
                                            </div>
                                        </template>
                                    </div>
                                </v-card-text>

                                <v-card-actions class="pa-4 pt-0 d-flex justify-space-between align-end">
                                    <div>
                                        <div v-if="laptop.oldPrice" class="text-decoration-line-through text-caption cloud-text opacity-50 mb-n1">
                                        {{ laptop.oldPrice }} Lei
                                        </div>

                                        <div class="text-h5 font-weight-black cloud-text">
                                        {{ laptop.price }} <span class="text-body-1 cyan-text font-weight-bold">Lei</span>
                                        </div>
                                    </div>

                                    <v-btn icon color="#059669" variant="tonal" class="cart-btn rounded-lg" @click="cartStore.addToCart(laptop)" title="Adaugă în coș">
                                        <v-icon>mdi-cart-plus</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import AppHeader from '../components/AppHeader.vue';
    import { useLaptopsStore } from '../stores/laptopsStore';
    import { storeToRefs } from 'pinia';
    import { useCartStore } from '../stores/cartStore';

    const cartStore = useCartStore();
    const laptopsStore = useLaptopsStore();
    const { allLaptops, isLoading } = storeToRefs(laptopsStore);
    const activeCategory = ref('gaming');
    const sortOption = ref('popular');
    const priceRange = ref([1000, 30000]);
    const selectedFilters = ref({
        brands: [],
        cpuSeries: [],
        cpuModels: [],
        gpuSeries: [],
        gpuModels: [],
        rams: [],
        storages: []
    });

    watch(activeCategory, () => {
        resetFilters();
    });

    const resetFilters = () => {
        priceRange.value = [1000, 30000];
        selectedFilters.value = { 
            brands: [], 
            cpuSeries: [], 
            cpuModels: [], 
            gpuSeries: [], 
            gpuModels: [], 
            rams: [], 
            storages: [] 
        };
    };

    const formatSpecLabel = (key) => {
        return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    onMounted(() => {
        laptopsStore.fetchLaptops();
    });

    const categories = [
        { id: 'gaming', name: 'Gaming', icon: 'mdi-controller' },
        { id: 'ultrabook', name: 'Ultrabook', icon: 'mdi-laptop' },
        { id: 'creator', name: 'Creator', icon: 'mdi-palette-outline' },
        { id: 'office', name: 'Home & Office', icon: 'mdi-briefcase-outline' }
    ];

    const sortOptions = [
        { title: 'Recomandate', value: 'popular' },
        { title: 'Preț: Crescător', value: 'price_asc' },
        { title: 'Preț: Descrescător', value: 'price_desc' }
    ];

    const specLabels = {
        cpu: 'Procesor',
        ram: 'Memorie RAM',
        storage: 'Stocare',
        gpu: 'Placă Video',
        display: 'Ecran'
    };

    const getCpuSeries = (cpu) => {
        if (!cpu) return null;
        if (cpu.includes('Core i9')) return 'Intel Core i9';
        if (cpu.includes('Core i7')) return 'Intel Core i7';
        if (cpu.includes('Core i5')) return 'Intel Core i5';
        if (cpu.includes('Core i3')) return 'Intel Core i3';
        if (cpu.includes('Core Ultra 9')) return 'Intel Core Ultra 9';
        if (cpu.includes('Core Ultra 7')) return 'Intel Core Ultra 7';
        if (cpu.includes('Ryzen 9')) return 'AMD Ryzen 9';
        if (cpu.includes('Ryzen 7')) return 'AMD Ryzen 7';
        if (cpu.includes('Ryzen 5')) return 'AMD Ryzen 5';
        if (cpu.includes('Apple M3')) return 'Apple M3';
        if (cpu.includes('Apple M2')) return 'Apple M2';
        if (cpu.includes('Apple M1')) return 'Apple M1';
        return cpu.split(' ').slice(0, 2).join(' '); 
    };

    const getCpuModel = (cpu) => {
        if (!cpu) {
            return null;
        }

        return cpu.replace('Intel ', '').replace('AMD ', '');
    };

    const getGpuSeries = (gpu) => {
        if (!gpu) return null;
        if (gpu.includes('RTX 40')) return 'GeForce RTX 40 Series';
        if (gpu.includes('RTX 30')) return 'GeForce RTX 30 Series';
        if (gpu.includes('RX 7')) return 'Radeon RX 7000 Series';
        if (gpu.includes('RX 6')) return 'Radeon RX 6000 Series';
        if (gpu.includes('Arc')) return 'Intel Arc Series';
        if (gpu.includes('Iris Xe')) return 'Intel Iris Xe';
        if (gpu.includes('Apple')) return 'Apple Silicon GPU';
        if (gpu.includes('Radeon Graphics')) return 'AMD Radeon Graphics';
        if (gpu.includes('UHD Graphics')) return 'Intel UHD Graphics';
        return gpu; 
    };

    const getGpuModel = (gpu) => {
        if (!gpu) {
            return null;
        }

        return gpu.replace('NVIDIA GeForce ', '').replace('AMD ', '').replace('Intel ', '');
    };

    const getSubCategory = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('gaming')) return 'gaming';
        if (lowerName.includes('macbook pro') || lowerName.includes('xps') || lowerName.includes('zenbook') || lowerName.includes('spectre')) return 'creator';
        if (lowerName.includes('macbook air') || lowerName.includes('slim') || lowerName.includes('thin')) return 'ultrabook';
        return 'office'; 
    };

    const availableFilters = computed(() => {
        const currentProducts = allLaptops.value.filter(p => p.category === 'laptopuri' && getSubCategory(p.name) === activeCategory.value);
        
        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            cpuSeries: [...new Set(currentProducts.map(p => getCpuSeries(p.specs?.cpu)).filter(Boolean))].sort(),
            cpuModels: [...new Set(currentProducts.map(p => getCpuModel(p.specs?.cpu)).filter(Boolean))].sort(),
            gpuSeries: [...new Set(currentProducts.map(p => getGpuSeries(p.specs?.gpu)).filter(Boolean))].sort(),
            gpuModels: [...new Set(currentProducts.map(p => getGpuModel(p.specs?.gpu)).filter(Boolean))].sort(),
            rams: [...new Set(currentProducts.map(p => p.specs?.ram?.split(' ')[0]).filter(Boolean))], 
            storages: [...new Set(currentProducts.map(p => p.specs?.storage).filter(Boolean))]
        };
    });

    const filteredLaptops = computed(() => {
        let result = allLaptops.value.filter(p => p.category === 'laptopuri' && getSubCategory(p.name) === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        const f = selectedFilters.value;

        if (f.brands.length > 0) result = result.filter(p => f.brands.includes(p.brand));
        
        if (f.cpuSeries.length > 0) result = result.filter(p => f.cpuSeries.includes(getCpuSeries(p.specs?.cpu)));
        if (f.cpuModels.length > 0) result = result.filter(p => f.cpuModels.includes(getCpuModel(p.specs?.cpu)));
        
        if (f.gpuSeries.length > 0) result = result.filter(p => f.gpuSeries.includes(getGpuSeries(p.specs?.gpu)));
        if (f.gpuModels.length > 0) result = result.filter(p => f.gpuModels.includes(getGpuModel(p.specs?.gpu)));

        if (f.rams.length > 0) result = result.filter(p => f.rams.some(ramFilter => p.specs?.ram?.includes(ramFilter)));
        if (f.storages.length > 0) result = result.filter(p => f.storages.includes(p.specs?.storage));
        
        if (sortOption.value === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption.value === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        }
        
        return result;
    });
</script>

<style scoped>
    .nexum-bg { 
        background-color: var(--bg-main) !important; 
    }

    .cloud-text { 
        color: var(--text-main) !important; 
    }

    .cyan-text { 
        color: #10B981 !important;
    }

    .opacity-80 { 
        opacity: 0.8; 
    }

    .filter-panel {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
    }

    .category-item {
        color: var(--text-main) !important;
        transition: all 0.3s ease;
        opacity: 0.7;
    }

    .category-item:hover {
        opacity: 1;
        background-color: var(--border-light) !important;
    }

    .active-category {
        opacity: 1;
        color: #10B981 !important;
        background: rgba(16, 185, 129, 0.1) !important;
        border-left: 4px solid #10B981;
    }

    .neon-slider :deep(.v-slider-track__fill) {
        background: linear-gradient(90deg, #059669, #10B981) !important; 
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); 
    }

    .neon-slider :deep(.v-slider-track__background) { 
        opacity: 0.2 !important; 
    }

    .neon-thumb {
        width: 18px; 
        height: 18px; 
        border-radius: 50%; 
        background-color: var(--bg-main); 
        border: 3px solid #10B981; 
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.8); 
        transition: all 0.3s ease;
    }

    .neon-slider :deep(.v-slider-thumb--pressed) .neon-thumb {
        box-shadow: 0 0 20px rgba(16, 185, 129, 1); 
        transform: scale(1.2);
    }

    .custom-checkbox :deep(.v-label) {
        color: var(--text-main) !important; 
        opacity: 0.85; 
        font-size: 0.9rem;
    }

    .custom-checkbox :deep(.v-selection-control__input > .v-icon) { 
        opacity: 0.7; 
    }

    .custom-checkbox :deep(.v-selection-control--dirty .v-selection-control__input > .v-icon) {
        opacity: 1; 
        filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5));
    }

    .sort-bar {
        background-color: var(--bg-panel); 
        border: 1px solid var(--border-light);
    }

    .custom-select :deep(.v-field) { 
        border-radius: 10px; 
    }

    .custom-select :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .product-card {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
        border-radius: 24px !important;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-10px);
        border-color: rgba(16, 185, 129, 0.4);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
    }

    .img-container {
        background-color: #F3F4F6 !important; 
        margin: 12px 12px 0 12px; 
        padding: 20px;
        border-radius: 16px;
        position: relative;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05); 
    }

    .product-img {
        transition: all 0.5s ease;
        mix-blend-mode: multiply; 
        filter: contrast(1.05);
    }

    .product-card:hover .product-img {
        transform: scale(1.15) translateY(-5px);
    }

    .product-card .v-card-text {
        padding-top: 24px !important;
    }
    
    .discount-badge {
        position: absolute; 
        top: 16px; 
        right: 16px; 
        z-index: 2;
        box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4);
    }

    .line-clamp-2 {
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical;  
        overflow: hidden; 
        min-height: 3rem;
    }

    .quick-specs { 
        border-top: 1px solid rgba(245, 246, 250, 0.1); 
        padding-top: 12px; 
    }

    .cart-btn {
        background-color: rgba(5, 150, 105, 0.1) !important;
        transition: all 0.3s ease;
    }

    .cart-btn:hover {
        background-color: #059669 !important;
        color: var(--text-main) !important;
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 5px 15px rgba(5, 150, 105, 0.4);
    }
</style>