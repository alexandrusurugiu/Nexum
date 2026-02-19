<template>
    <v-app class="nexum-bg">
        <AppHeader :cartCount="cartCount" />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Periferice</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Echipează-te cu precizie. Tastaturi mecanice, mouși ultra-ușori și căști cu sunet spațial.
                </p>
            </div>

            <v-row>
                <v-col cols="12" md="3" lg="2">
                    <v-card class="filter-panel pa-5 rounded-xl" elevation="10">
                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Echipament</h3>
                        
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
                            :max="2000"
                            :step="20"
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

                        <div class="mb-5" v-if="availableFilters.connectivity.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Conectivitate</div>
                            <v-checkbox
                                v-for="conn in availableFilters.connectivity" :key="conn"
                                v-model="selectedFilters.connectivity" :label="conn" :value="conn"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.techTypes.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Tehnologie</div>
                            <v-checkbox
                                v-for="tech in availableFilters.techTypes" :key="tech"
                                v-model="selectedFilters.techTypes" :label="tech" :value="tech"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.lighting.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Iluminare</div>
                            <v-checkbox
                                v-for="light in availableFilters.lighting" :key="light"
                                v-model="selectedFilters.lighting" :label="light" :value="light"
                                color="#00CEC9" density="compact" hide-details class="custom-checkbox"
                            ></v-checkbox>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                        Afișare <span class="cyan-text font-weight-bold">{{ filteredProducts.length }}</span> produse
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
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-mouse-off</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun periferic nu corespunde filtrelor</h2>
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

    const activeCategory = ref('mousi');
    const sortOption = ref('popular');
    const priceRange = ref([0, 2000]);
    const selectedFilters = ref({
        brands: [],
        connectivity: [],
        techTypes: [],
        lighting: []
    });

    watch(activeCategory, () => {
        resetFilters();
    });

    const resetFilters = () => {
        priceRange.value = [0, 2000];
        selectedFilters.value = { brands: [], connectivity: [], techTypes: [], lighting: [] };
    };

    const categories = [
        { id: 'mousi', name: 'Mouși Gaming', icon: 'mdi-mouse' },
        { id: 'tastaturi', name: 'Tastaturi', icon: 'mdi-keyboard-variant' },
        { id: 'casti', name: 'Căști Audio', icon: 'mdi-headset' },
        { id: 'mousepad', name: 'Mousepad-uri', icon: 'mdi-rectangle-outline' }
    ];

    const sortOptions = [
        { title: 'Recomandate', value: 'popular' },
        { title: 'Preț: Crescător', value: 'price_asc' },
        { title: 'Preț: Descrescător', value: 'price_desc' }
    ];

    //Produse MOCK pentru testate UI
    const allProducts = ref([
        {
            id: 1, category: 'mousi', brand: 'LOGITECH', price: 549, oldPrice: 650, discount: 15,
            name: 'Mouse Gaming Wireless Logitech G PRO X SUPERLIGHT',
            image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Senzor: HERO 25K', 'Greutate: < 63 grame', 'Autonomie: 70 ore'],
            connectivity: 'Wireless', techType: 'Senzor Optic', lighting: 'Fără Iluminare'
        },
        {
            id: 2, category: 'mousi', brand: 'RAZER', price: 799, oldPrice: null, discount: null,
            name: 'Mouse Gaming Razer DeathAdder V3 Pro',
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Senzor: Focus Pro 30K', 'Greutate: 63 grame', 'Switches: Optical Gen-3'],
            connectivity: 'Wireless', techType: 'Senzor Optic', lighting: 'Fără Iluminare'
        },
        {
            id: 3, category: 'mousi', brand: 'RAZER', price: 250, oldPrice: 300, discount: 16,
            name: 'Mouse Gaming Razer Basilisk V3',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Senzor: 26K DPI Optic', 'Rotiță Tilt HyperScroll', '11 Butoane programabile'],
            connectivity: 'Cu Fir', techType: 'Senzor Optic', lighting: 'RGB Chroma'
        },
        {
            id: 4, category: 'tastaturi', brand: 'LOGITECH', price: 950, oldPrice: 1100, discount: 13,
            name: 'Tastatură Gaming Wireless Logitech G915 TKL Lightspeed',
            image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Switch: GL Tactile (Low Profile)', 'Format: Tenkeyless (TKL)', 'Material: Aluminiu'],
            connectivity: 'Wireless', techType: 'Mecanică', lighting: 'RGB Lightsync'
        },
        {
            id: 5, category: 'tastaturi', brand: 'CORSAIR', price: 899, oldPrice: null, discount: null,
            name: 'Tastatură Gaming Corsair K70 MAX RGB Magnetic-Mechanical',
            image: 'https://images.unsplash.com/photo-1511467687858-23d3ce1486d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Switch: Corsair MGX (Magnetic)', 'Actuare ajustabilă: 0.4 - 3.6mm', 'Polling rate: 8000Hz'],
            connectivity: 'Cu Fir', techType: 'Mecanică-Magnetică', lighting: 'RGB Per-Key'
        },
        {
            id: 6, category: 'casti', brand: 'HYPERX', price: 420, oldPrice: 500, discount: 16,
            name: 'Căști Gaming HyperX Cloud III',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Drivere: 53mm', 'Sunet: DTS Headphone:X Spatial Audio', 'Microfon ultra-clar'],
            connectivity: 'Cu Fir', techType: 'Stereo / Spatial', lighting: 'Fără Iluminare'
        },
        {
            id: 7, category: 'casti', brand: 'STEELSERIES', price: 1699, oldPrice: 1850, discount: 8,
            name: 'Căști Gaming Wireless SteelSeries Arctis Nova Pro',
            image: 'https://images.unsplash.com/photo-1599669500515-b3e1dd5652cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Baterii Hot-Swap (Infinte power)', 'Active Noise Cancellation (ANC)', 'Hi-Res Audio'],
            connectivity: 'Wireless', techType: 'Sistem Dual-Audio', lighting: 'Fără Iluminare'
        },
        {
            id: 8, category: 'mousepad', brand: 'STEELSERIES', price: 120, oldPrice: null, discount: null,
            name: 'Mousepad Gaming SteelSeries QcK Heavy XXL',
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Imagine pad generic
            specs: ['Dimensiuni: 900 x 400 mm', 'Grosime: 4mm (Heavy)', 'Material: Micro-woven cloth'],
            connectivity: 'N/A', techType: 'Textil', lighting: 'Fără Iluminare'
        }
    ]);

    const availableFilters = computed(() => {
        const currentProducts = allProducts.value.filter(p => p.category === activeCategory.value);
        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            connectivity: [...new Set(currentProducts.map(p => p.connectivity).filter(c => c && c !== 'N/A'))],
            techTypes: [...new Set(currentProducts.map(p => p.techType).filter(Boolean))],
            lighting: [...new Set(currentProducts.map(p => p.lighting).filter(Boolean))]
        };
    });

    const filteredProducts = computed(() => {
        let result = allProducts.value.filter(p => p.category === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        if (selectedFilters.value.brands.length > 0) {
            result = result.filter(p => selectedFilters.value.brands.includes(p.brand));
        }
        
        if (selectedFilters.value.connectivity.length > 0) {
            result = result.filter(p => selectedFilters.value.connectivity.includes(p.connectivity));
        }

        if (selectedFilters.value.techTypes.length > 0) {
            result = result.filter(p => selectedFilters.value.techTypes.includes(p.techType));
        }

        if (selectedFilters.value.lighting.length > 0) {
            result = result.filter(p => selectedFilters.value.lighting.includes(p.lighting));
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
        transition: all 0.3s ease; 
        position: relative; 
        overflow: hidden;
    }
    
    .product-card:hover {
        transform: translateY(-8px); 
        border-color: rgba(0, 206, 201, 0.5);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 206, 201, 0.1) !important;
    }

    .img-container {
        background-color: rgba(30, 39, 46, 0.5); 
        border-bottom: 1px solid rgba(245, 246, 250, 0.05);
    }

    .product-img { 
        transition: transform 0.5s ease; 
    }

    .product-card:hover .product-img { 
        transform: scale(1.08); 
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
        transition: all 0.3s ease; 
    }

    .cart-btn:hover { 
        background-color: #0984E3 !important; 
        color: #F5F6FA !important; 
        transform: scale(1.1); 
    }
</style>