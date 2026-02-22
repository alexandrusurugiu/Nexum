<template>
    <v-app class="nexum-bg">
        <AppHeader :cartCount="cartCount"></AppHeader>

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Monitoare</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Găsește ecranul perfect pentru gaming competitiv, editare grafică sau productivitate.
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
                            :min="0"
                            :max="10000"
                            :step="50"
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
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Brand</div>
                            <v-checkbox
                                v-for="brand in availableFilters.brands" :key="brand"
                                v-model="selectedFilters.brands" :label="brand" :value="brand"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.resolutions.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Rezoluție</div>
                            <v-checkbox
                                v-for="res in availableFilters.resolutions" :key="res"
                                v-model="selectedFilters.resolutions" :label="res" :value="res"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.refreshRates.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Rată de Refresh</div>
                            <v-checkbox
                                v-for="hz in availableFilters.refreshRates" :key="hz"
                                v-model="selectedFilters.refreshRates" :label="hz" :value="hz"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.panelTypes.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Tehnologie Panou</div>
                            <v-checkbox
                                v-for="panel in availableFilters.panelTypes" :key="panel"
                                v-model="selectedFilters.panelTypes" :label="panel" :value="panel"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.sizes.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Diagonală</div>
                            <v-checkbox
                                v-for="size in availableFilters.sizes" :key="size"
                                v-model="selectedFilters.sizes" :label="size" :value="size"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                        Afișare <span class="cyan-text font-weight-bold">{{ filteredProducts.length }}</span> monitoare
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
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-monitor-off</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun monitor nu corespunde filtrelor</h2>
                        <p class="cyan-text mt-2" style="cursor: pointer;" @click="resetFilters">Resetează toate filtrele</p>
                    </div>

                    <v-row v-else>
                        <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="6" lg="4" xl="3">
                            <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                                <v-chip v-if="product.discount" color="#0984E3" class="discount-badge font-weight-bold" size="small">
                                -{{ product.discount }}%
                                </v-chip>

                                <div class="img-container pa-4 text-center">
                                    <v-img :src="product.image" height="200" contain class="product-img mx-auto"></v-img>
                                </div>
                                
                                <v-card-text class="flex-grow-1 pt-4">
                                    <span class="text-caption text-uppercase font-weight-bold" style="color: #00CEC9; letter-spacing: 1px;">
                                        {{ product.brand }}
                                    </span>

                                    <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                                        {{ product.name }}
                                    </h3>
                                    
                                    <div class="quick-specs">
                                        <div v-for="(spec, index) in product.specs" :key="index" class="d-flex align-center mb-1">
                                            <v-icon size="small" color="#00CEC9" class="mr-2 opacity-80">mdi-circle-small</v-icon>
                                            <span class="cloud-text opacity-80 text-body-2">{{ spec }}</span>
                                        </div>
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

                                    <v-btn icon color="#0984E3" variant="tonal" class="cart-btn rounded-lg" @click="addToCart" title="Adaugă în coș">
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
    import { ref, computed, watch } from 'vue';
    import AppHeader from '../components/AppHeader.vue';

    const cartCount = ref(0);
    const addToCart = () => cartCount.value++;

    const activeCategory = ref('gaming');
    const sortOption = ref('popular');
    const priceRange = ref([0, 10000]);

    const selectedFilters = ref({
        brands: [],
        resolutions: [],
        refreshRates: [],
        panelTypes: [],
        sizes: []
    });

    watch(activeCategory, () => {
        resetFilters();
    });

    const resetFilters = () => {
        priceRange.value = [0, 10000];
        selectedFilters.value = { brands: [], resolutions: [], refreshRates: [], panelTypes: [], sizes: [] };
    };

    const categories = [
        { id: 'gaming', name: 'Gaming', icon: 'mdi-controller' },
        { id: 'pro', name: 'Profesionale', icon: 'mdi-palette-outline' },
        { id: 'ultrawide', name: 'Ultrawide', icon: 'mdi-monitor-screenshot' },
        { id: 'office', name: 'Office / Acasă', icon: 'mdi-briefcase-outline' }
    ];

    const sortOptions = [
        { title: 'Recomandate', value: 'popular' },
        { title: 'Preț: Crescător', value: 'price_asc' },
        { title: 'Preț: Descrescător', value: 'price_desc' }
    ];

    const allProducts = ref([
        {
            id: 1, category: 'gaming', brand: 'ASUS', price: 4899, oldPrice: 5200, discount: 5,
            name: 'Monitor Gaming ASUS ROG Swift OLED PG27AQDM',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Imagine ecran generică
            specs: ['27", 1440p', 'Rată refresh: 240Hz', 'Panou: OLED, 0.03ms'],
            resolution: '1440p', refreshRate: '240Hz', panelType: 'OLED', size: '27"'
        },
        {
            id: 2, category: 'gaming', brand: 'SAMSUNG', price: 2450, oldPrice: 2800, discount: 12,
            name: 'Monitor Gaming Samsung Odyssey G7',
            image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['32" Curbat (1000R), 1440p', 'Rată refresh: 240Hz', 'Panou: VA, 1ms'],
            resolution: '1440p', refreshRate: '240Hz', panelType: 'VA', size: '32"'
        },
        {
            id: 3, category: 'gaming', brand: 'LG', price: 1650, oldPrice: null, discount: null,
            name: 'Monitor Gaming LG UltraGear 27GP850-B',
            image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['27", 1440p', 'Rată refresh: 165Hz', 'Panou: Nano IPS, 1ms'],
            resolution: '1440p', refreshRate: '165Hz', panelType: 'IPS', size: '27"'
        },
        {
            id: 4, category: 'ultrawide', brand: 'ALIENWARE', price: 5499, oldPrice: null, discount: null,
            name: 'Monitor Gaming Alienware AW3423DWF Ultrawide',
            image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['34" Ultrawide (21:9)', 'Rată refresh: 165Hz', 'Panou: QD-OLED'],
            resolution: '1440p Ultrawide', refreshRate: '165Hz', panelType: 'OLED', size: '34"'
        },
        {
            id: 5, category: 'pro', brand: 'DELL', price: 3100, oldPrice: 3400, discount: 8,
            name: 'Monitor Dell UltraSharp U2723QE, USB-C HUB',
            image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['27", 4K UHD (3840 x 2160)', 'Acoperire 98% DCI-P3', 'Panou: IPS Black'],
            resolution: '4K UHD', refreshRate: '60Hz', panelType: 'IPS', size: '27"'
        },
        {
            id: 6, category: 'office', brand: 'AOC', price: 650, oldPrice: 750, discount: 13,
            name: 'Monitor LED AOC 24G2SPU/BK',
            image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['23.8", Full HD (1080p)', 'Rată refresh: 165Hz', 'Panou: IPS'],
            resolution: '1080p (FHD)', refreshRate: '165Hz', panelType: 'IPS', size: '24"'
        }
    ]);

    const availableFilters = computed(() => {
        const currentProducts = allProducts.value.filter(p => p.category === activeCategory.value);
        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            resolutions: [...new Set(currentProducts.map(p => p.resolution).filter(Boolean))],
            refreshRates: [...new Set(currentProducts.map(p => p.refreshRate).filter(Boolean))],
            panelTypes: [...new Set(currentProducts.map(p => p.panelType).filter(Boolean))],
            sizes: [...new Set(currentProducts.map(p => p.size).filter(Boolean))]
        };
    });

    const filteredProducts = computed(() => {
        let result = allProducts.value.filter(p => p.category === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        if (selectedFilters.value.brands.length > 0)
            result = result.filter(p => selectedFilters.value.brands.includes(p.brand));
        
        if (selectedFilters.value.resolutions.length > 0) 
            result = result.filter(p => selectedFilters.value.resolutions.includes(p.resolution));
        
        if (selectedFilters.value.refreshRates.length > 0) 
            result = result.filter(p => selectedFilters.value.refreshRates.includes(p.refreshRate));
        
        if (selectedFilters.value.panelTypes.length > 0) 
            result = result.filter(p => selectedFilters.value.panelTypes.includes(p.panelType));
        
        if (selectedFilters.value.sizes.length > 0) 
            result = result.filter(p => selectedFilters.value.sizes.includes(p.size));
        
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

    .product-card .v-card-text {
        padding-top: 24px !important;
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