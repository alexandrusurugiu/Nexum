<template>
    <v-app class="nexum-bg">
        <AppHeader :cartCount="cartCount"></AppHeader>

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <v-row>
                <v-col cols="12" md="3" lg="2">
                    <v-card class="filter-panel pa-5 rounded-xl" elevation="10">
                        
                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Categorii</h3>
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

                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Filtre</h3>

                        <div class="mb-5" v-if="availableFilters.brands.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Producător</div>
                            <v-checkbox
                                v-for="brand in availableFilters.brands" :key="brand"
                                v-model="selectedFilters.brands"
                                :label="brand"
                                :value="brand"
                                color="#00CEC9"
                                density="compact"
                                hide-details
                                class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.sockets.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Socket</div>
                            <v-checkbox
                                v-for="socket in availableFilters.sockets" :key="socket"
                                v-model="selectedFilters.sockets"
                                :label="socket"
                                :value="socket"
                                color="#00CEC9"
                                density="compact"
                                hide-details
                                class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.memory.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Capacitate</div>
                            <v-checkbox
                                v-for="mem in availableFilters.memory" :key="mem"
                                v-model="selectedFilters.memory"
                                :label="mem"
                                :value="mem"
                                color="#00CEC9"
                                density="compact"
                                hide-details
                                class="custom-checkbox"
                            ></v-checkbox>
                        </div>

                        <div class="mb-5" v-if="availableFilters.types.length > 0">
                            <div class="text-subtitle-2 cyan-text font-weight-bold mb-2 text-uppercase" style="letter-spacing: 1px;">Tip / Format</div>
                            <v-checkbox
                                v-for="type in availableFilters.types" :key="type"
                                v-model="selectedFilters.types"
                                :label="type"
                                :value="type"
                                color="#00CEC9"
                                density="compact"
                                hide-details
                                class="custom-checkbox"
                            ></v-checkbox>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                            Afișare <span class="cyan-text font-weight-bold">{{ filteredProducts.length }}</span> produse pentru 
                            <v-chip color="#0984E3" variant="flat" size="small" class="ml-2 font-weight-bold text-uppercase">
                                {{ activeCategoryName }}
                            </v-chip>
                        </div>
                        
                        <div class="d-flex align-center" style="width: 250px;">
                            <span class="cloud-text opacity-80 mr-3 text-body-2">Sortează:</span>
                            <v-select
                                v-model="sortOption"
                                :items="sortOptions"
                                variant="outlined"
                                density="compact"
                                hide-details
                                bg-color="rgba(30, 39, 46, 0.8)"
                                color="#00CEC9"
                                base-color="rgba(245, 246, 250, 0.2)"
                                class="custom-select"
                            ></v-select>
                        </div>
                    </div>

                    <div v-if="filteredProducts.length === 0" class="text-center py-16">
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-package-variant-closed</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun produs corespunde filtrelor</h2>
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
    import { useRouter } from 'vue-router';
    import AppHeader from '../components/AppHeader.vue';

    const cartCount = ref(0);
    const addToCart = () => cartCount.value++;

    const activeCategory = ref('procesoare');
    const sortOption = ref('popular');
    const priceRange = ref([0, 10000]);

    const selectedFilters = ref({
        brands: [],
        sockets: [],
        memory: [],
        types: []
    });

    watch(activeCategory, () => {
        resetFilters();
    });

    const resetFilters = () => {
        priceRange.value = [0, 10000];
        selectedFilters.value = { brands: [], sockets: [], memory: [], types: [] };
    };

    const categories = [
        { id: 'procesoare', name: 'Procesoare', icon: 'mdi-cpu-64-bit' },
        { id: 'placi_video', name: 'Plăci video', icon: 'mdi-expansion-card-variant' },
        { id: 'placi_de_baza', name: 'Plăci de bază', icon: 'mdi-developer-board' },
        { id: 'memorie_ram', name: 'Memorii RAM', icon: 'mdi-memory' },
        { id: 'stocare', name: 'Stocare internă', icon: 'mdi-harddisk' }
    ];

    const activeCategoryName = computed(() => {
        return categories.find(c => c.id === activeCategory.value)?.name || 'Produse';
    });

    const sortOptions = [
        { title: 'Recomandate', value: 'popular' },
        { title: 'Preț: Crescător', value: 'price_asc' },
        { title: 'Preț: Descrescător', value: 'price_desc' }
    ];

    //Produse MOCK pentru testate UI
    const allProducts = ref([
        {
            id: 1, category: 'procesoare', brand: 'AMD', price: 1950, oldPrice: null, discount: null,
            name: 'Procesor AMD Ryzen 7 7800X3D, 4.2GHz/5.0GHz',
            image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Socket: AM5', 'Nuclee: 8 / 16 Threads', 'Tehnologie: 3D V-Cache'],
            socket: 'AM5'
        },
        {
            id: 2, category: 'procesoare', brand: 'INTEL', price: 2850, oldPrice: 3100, discount: 8,
            name: 'Procesor Intel Core i9-14900K, pana la 6.0 GHz',
            image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Socket: LGA 1700', 'Nuclee: 24 (8P+16E)', 'Putere bază: 125W'],
            socket: 'LGA 1700'
        },
        {
            id: 3, category: 'placi_video', brand: 'NVIDIA', price: 5299, oldPrice: 5899, discount: 10,
            name: 'Placă Video GIGABYTE GeForce RTX 4080 SUPER WINDFORCE',
            image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Memorie: 16GB GDDR6X', 'Răcire: 3 Ventilatoare', 'Interfață: PCIe 4.0'],
            memory: '16GB'
        },
        {
            id: 4, category: 'placi_video', brand: 'AMD', price: 4999, oldPrice: null, discount: null,
            name: 'Placă video Sapphire Radeon RX 7900 XTX PULSE',
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Memorie: 24GB GDDR6', 'Lățime de bandă: 384-bit', 'Răcire: 3 Ventilatoare'],
            memory: '24GB'
        },
        {
            id: 5, category: 'placi_de_baza', brand: 'ASUS', price: 1420, oldPrice: 1550, discount: 8,
            name: 'Placă de bază ASUS ROG STRIX B650E-F GAMING WIFI',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Socket: AM5', 'Chipset: B650E', 'Format: ATX'],
            socket: 'AM5', type: 'ATX'
        },
        {
            id: 6, category: 'placi_de_baza', brand: 'MSI', price: 950, oldPrice: null, discount: null,
            name: 'Placă de bază MSI PRO B760M-P DDR4',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Imagine repetată pt demo
            specs: ['Socket: LGA 1700', 'Chipset: B760', 'Format: mATX'],
            socket: 'LGA 1700', type: 'mATX'
        },
        {
            id: 7, category: 'memorie_ram', brand: 'CORSAIR', price: 850, oldPrice: null, discount: null,
            name: 'Memorie Corsair Dominator Platinum RGB 32GB DDR5 6000MHz',
            image: 'https://images.unsplash.com/photo-1562976540-1502f75a6109?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Tip: DDR5', 'Capacitate: 2x 16GB', 'Iluminare: A-RGB'],
            memory: '32GB', type: 'DDR5'
        },
        {
            id: 8, category: 'stocare', brand: 'SAMSUNG', price: 450, oldPrice: 500, discount: 10,
            name: 'Solid State Drive (SSD) Samsung 980 PRO 1TB',
            image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            specs: ['Capacitate: 1TB', 'Interfață: NVMe M.2 PCIe Gen 4', 'Viteză: 7000 MB/s'],
            memory: '1TB', type: 'SSD NVMe'
        }
    ]);

    const availableFilters = computed(() => {
        const currentProducts = allProducts.value.filter(p => p.category === activeCategory.value);
        
        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            sockets: [...new Set(currentProducts.map(p => p.socket).filter(Boolean))],
            memory: [...new Set(currentProducts.map(p => p.memory).filter(Boolean))],
            types: [...new Set(currentProducts.map(p => p.type).filter(Boolean))]
        };
    });

    const filteredProducts = computed(() => {
        let result = allProducts.value.filter(p => p.category === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        if (selectedFilters.value.brands.length > 0) {
            result = result.filter(p => selectedFilters.value.brands.includes(p.brand));
        }
        if (selectedFilters.value.sockets.length > 0) {
            result = result.filter(p => selectedFilters.value.sockets.includes(p.socket));
        }
        if (selectedFilters.value.memory.length > 0) {
            result = result.filter(p => selectedFilters.value.memory.includes(p.memory));
        }
        if (selectedFilters.value.types.length > 0) {
            result = result.filter(p => selectedFilters.value.types.includes(p.type));
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
        width: 18px; height: 18px; 
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