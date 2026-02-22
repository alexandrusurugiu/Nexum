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
                        
                        <v-divider class="border-opacity-25 mb-6" color="#00CEC9"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-2">Buget (Lei)</h3>

                        <div class="d-flex justify-space-between cloud-text opacity-80 text-caption font-weight-bold mb-4">
                            <span>{{ priceRange[0] }}</span>
                            <span>{{ priceRange[1] }}</span>
                        </div>

                        <v-range-slider
                            v-model="priceRange"
                            :min="1000"
                            :max="20000"
                            :step="100"
                            color="#00CEC9"
                            track-color="rgba(245, 246, 250, 0.1)"
                            track-fill-color="#00CEC9"
                            thumb-size="18"
                            class="neon-slider mt-2 mb-6"
                            >
                            <template v-slot:thumb="{ modelValue }">
                                <div class="neon-thumb elevation-5"></div>
                            </template>
                        </v-range-slider>

                        <v-divider class="border-opacity-25 mb-6" color="#00CEC9"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Specificații</h3>

                        <div class="mb-5" v-if="availableFilters.brands.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Producător</div>
                            <v-checkbox
                                v-for="brand in availableFilters.brands" :key="brand"
                                v-model="selectedFilters.brands" :label="brand" :value="brand"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.cpus.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Procesor</div>
                            <v-checkbox
                                v-for="cpu in availableFilters.cpus" :key="cpu"
                                v-model="selectedFilters.cpus" :label="cpu" :value="cpu"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.gpus.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Placă Video</div>
                            <v-checkbox
                                v-for="gpu in availableFilters.gpus" :key="gpu"
                                v-model="selectedFilters.gpus" :label="gpu" :value="gpu"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.rams.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Memorie RAM</div>
                            <v-checkbox
                                v-for="ram in availableFilters.rams" :key="ram"
                                v-model="selectedFilters.rams" :label="ram" :value="ram"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.storages.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Capacitate Stocare</div>
                            <v-checkbox
                                v-for="storage in availableFilters.storages" :key="storage"
                                v-model="selectedFilters.storages" :label="storage" :value="storage"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                            Afișare <span class="cyan-text font-weight-bold">{{ filteredProducts.length }}</span> laptopuri
                        </div>
                        
                        <div class="d-flex align-center" style="width: 250px;">
                            <span class="cloud-text opacity-80 mr-3 text-body-2">Sortează:</span>
                            <v-select
                                v-model="sortOption" :items="sortOptions" variant="outlined" density="compact" hide-details
                                bg-color="rgba(30, 39, 46, 0.8)" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)"
                                class="custom-select"
                            ></v-select>
                        </div>
                    </div>

                    <div v-if="filteredProducts.length === 0" class="text-center py-16">
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-laptop-off</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun laptop nu corespunde filtrelor</h2>
                        <p class="cyan-text mt-2" style="cursor: pointer;" @click="resetFilters">Resetează toate filtrele</p>
                    </div>

                    <v-row v-else>
                        <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="6" lg="4" xl="3">
                            <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                                <v-chip v-if="product.discount" color="#0984E3" class="discount-badge font-weight-bold" size="small">
                                -{{ product.discount }}%
                                </v-chip>

                                <div class="img-container pa-4 text-center">
                                    <v-img :src="product.specs.image" height="200" contain class="product-img mx-auto"></v-img>
                                </div>
                                
                                <v-card-text class="flex-grow-1 pt-4">
                                    <span class="text-caption text-uppercase font-weight-bold" style="color: #00CEC9; letter-spacing: 1px;">
                                        {{ product.brand }}
                                    </span>

                                    <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                                        {{ product.name }}
                                    </h3>
                                    
                                    <div class="quick-specs">
                                        <template v-for="(value, key) in component.specs" :key="key">
                                            <div v-if="key !== 'image'" class="d-flex align-center mb-1">
                                                <v-icon size="small" color="#00CEC9" class="mr-2 opacity-80">mdi-circle-small</v-icon>
                                                <span class="cloud-text opacity-80 text-body-2 text-truncate">
                                                    <strong class="cyan-text" style="opacity: 0.9;">{{ formatSpecLabel(key) }}:</strong> {{ value }}
                                                </span>
                                            </div>

                                        </template>
                                    </div>
                                </v-card-text>

                                <v-card-actions class="pa-4 pt-0 d-flex justify-space-between align-end">
                                    <div>
                                        <div v-if="product.oldPrice" class="text-decoration-line-through text-caption cloud-text opacity-50 mb-n1">
                                        {{ product.oldPrice }} Lei
                                        </div>

                                        <div class="text-h5 font-weight-black cloud-text">
                                        {{ product.price }} <span class="text-body-1 cyan-text font-weight-bold">Lei</span>
                                        </div>
                                    </div>

                                    <v-btn icon color="#0984E3" variant="tonal" class="cart-btn rounded-lg" @click="cartStore.addToCart(product)" title="Adaugă în coș">
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
    const priceRange = ref([1000, 20000]);
    const selectedFilters = ref({
        brands: [],
        cpus: [],
        gpus: [],
        rams: [],
        storages: []
    });

    watch(activeCategory, () => {
        resetFilters();
    });

    const resetFilters = () => {
        priceRange.value = [1000, 20000];
        selectedFilters.value = { 
            brands: [], 
            cpus: [], 
            gpus: [], 
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

    const availableFilters = computed(() => {
        const currentProducts = allLaptops.value.filter(p => p.category === activeCategory.value);
        
        const getCpuFamily = (cpuStr) => {
            if(!cpuStr) {
                return null;
            }

            if(cpuStr.includes('Core i9')) {
                return 'Intel Core i9';
            }

            if(cpuStr.includes('Core i7')) {
                return 'Intel Core i7';
            }
            
            if(cpuStr.includes('Core Ultra 7')) {
                return 'Intel Core Ultra 7';
            }
            
            if(cpuStr.includes('Ryzen 9')) {
                return 'AMD Ryzen 9';
            }
            
            if(cpuStr.includes('Ryzen 7')) {
                return 'AMD Ryzen 7';
            }

            if(cpuStr.includes('Ryzen 5')) {
                return 'AMD Ryzen 5';
            }

            if(cpuStr.includes('M3 Max')) {
                return 'Apple M3 Max';
            }

            if(cpuStr.includes('M3')) {
                return 'Apple M3';
            }

            return cpuStr.split(' ')[0] + ' ' + cpuStr.split(' ')[1];
        };

        const getGpuSeries = (gpuStr) => {
            if(!gpuStr) {
                return null;
            }

            if(gpuStr.includes('RTX 4080')) {
                return 'RTX 4080';
            }

            if(gpuStr.includes('RTX 4070')) {
                return 'RTX 4070';
            }

            if(gpuStr.includes('RTX 4060')) {
                return 'RTX 4060';
            }

            if(gpuStr.includes('Arc')) {
                return 'Intel Arc Graphics';
            }

            if(gpuStr.includes('Radeon')) {
                return 'AMD Radeon Graphics';
            }

            if(gpuStr.includes('Apple')) {
                return 'Apple Silicon GPU';
            }

            return gpuStr;
        };

        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            cpus: [...new Set(currentProducts.map(p => getCpuFamily(p.cpu)).filter(Boolean))],
            gpus: [...new Set(currentProducts.map(p => getGpuSeries(p.gpu)).filter(Boolean))],
            rams: [...new Set(currentProducts.map(p => p.ram.split(' ')[0]).filter(Boolean))], 
            storages: [...new Set(currentProducts.map(p => p.storage).filter(Boolean))]
        };
    });

    const filteredProducts = computed(() => {
        let result = allLaptops.value.filter(p => p.category === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        if (selectedFilters.value.brands.length > 0) {
            result = result.filter(p => selectedFilters.value.brands.includes(p.brand));
        }
        
        if (selectedFilters.value.cpus.length > 0) {
            result = result.filter(p => selectedFilters.value.cpus.some(cpuFilter => p.cpu.includes(cpuFilter)));
        }
        
        if (selectedFilters.value.gpus.length > 0) {
            result = result.filter(p => selectedFilters.value.gpus.some(gpuFilter => {
                if(gpuFilter === 'Apple Silicon GPU') {
                    return p.gpu.includes('Apple');
                }

                return p.gpu.includes(gpuFilter);
            }));
        }

        if (selectedFilters.value.rams.length > 0) {
            result = result.filter(p => selectedFilters.value.rams.some(ramFilter => p.ram.includes(ramFilter)));
        }

        if (selectedFilters.value.storages.length > 0) {
            result = result.filter(p => selectedFilters.value.storages.includes(p.storage));
        }
        
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
        background-color: #1E272E !important; 
    }

    .cloud-text { 
        color: #F5F6FA !important; 
    }

    .cyan-text { 
        color: #00CEC9 !important;
    }

    .opacity-80 { 
        opacity: 0.8; 
    }

    .filter-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
    }

    .category-item {
        color: #F5F6FA !important;
        transition: all 0.3s ease;
        opacity: 0.7;
    }

    .category-item:hover {
        opacity: 1;
        background-color: rgba(245, 246, 250, 0.05) !important;
    }

    .active-category {
        opacity: 1;
        color: #00CEC9 !important;
        background: rgba(0, 206, 201, 0.1) !important;
        border-left: 4px solid #00CEC9;
    }

    .neon-slider :deep(.v-slider-track__fill) {
        background: linear-gradient(90deg, #0984E3, #00CEC9) !important; 
        box-shadow: 0 0 10px rgba(0, 206, 201, 0.4); 
    }

    .neon-slider :deep(.v-slider-track__background) { 
        opacity: 0.2 !important; 
    }

    .neon-thumb {
        width: 18px; 
        height: 18px; 
        border-radius: 50%; 
        background-color: #1E272E; 
        border: 3px solid #00CEC9; 
        box-shadow: 0 0 12px rgba(0, 206, 201, 0.8); 
        transition: all 0.3s ease;
    }

    .neon-slider :deep(.v-slider-thumb--pressed) .neon-thumb {
        box-shadow: 0 0 20px rgba(0, 206, 201, 1); 
        transform: scale(1.2);
    }

    .custom-checkbox :deep(.v-label) {
        color: #F5F6FA !important; 
        opacity: 0.85; 
        font-size: 0.9rem;
    }

    .custom-checkbox :deep(.v-selection-control__input > .v-icon) { 
        opacity: 0.7; 
    }

    .custom-checkbox :deep(.v-selection-control--dirty .v-selection-control__input > .v-icon) {
        opacity: 1; 
        filter: drop-shadow(0 0 5px rgba(0, 206, 201, 0.5));
    }

    .sort-bar {
        background-color: #253038; 
        border: 1px solid rgba(245, 246, 250, 0.05);
    }

    .custom-select :deep(.v-field) { 
        border-radius: 10px; 
    }

    .custom-select :deep(.v-field__input) { 
        color: #F5F6FA !important; 
    }

    .product-card {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
        border-radius: 24px !important;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-10px);
        border-color: rgba(0, 206, 201, 0.4);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 206, 201, 0.15) !important;
    }

    .img-container {
        background-color: #F5F6FA; 
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
        box-shadow: 0 4px 10px rgba(9, 132, 227, 0.4);
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
        background-color: rgba(9, 132, 227, 0.1) !important;
        transition: all 0.3s ease;
    }

    .cart-btn:hover {
        background-color: #0984E3 !important;
        color: #F5F6FA !important;
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 5px 15px rgba(9, 132, 227, 0.4);
    }
</style>