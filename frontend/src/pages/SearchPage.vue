<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-10 text-center">
                <h1 class="text-h3 font-weight-black cloud-text mb-2">
                    Rezultate pentru: <span class="cyan-text">"{{ searchQuery }}"</span>
                </h1>
                <p class="text-body-1 cloud-text opacity-80">
                    Am găsit {{ searchResults.length }} produse care se potrivesc căutării tale.
                </p>
            </div>

            <div v-if="isLoading" class="text-center py-16">
                <v-progress-circular indeterminate color="#00CEC9" size="64"></v-progress-circular>
            </div>

            <div v-else-if="searchResults.length === 0" class="text-center py-16">
                <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-magnify-close</v-icon>
                <h2 class="cloud-text opacity-80">Nu am găsit niciun produs</h2>
                <v-btn color="#00CEC9" variant="tonal" class="mt-6 rounded-lg font-weight-bold" to="/home">
                    Înapoi la Magazin
                </v-btn>
            </div>

            <v-row v-else>
                <v-col v-for="product in searchResults" :key="product.id" cols="12" sm="6" md="4" lg="3">
                    <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                        <v-chip v-if="product.discount" color="#0984E3" class="discount-badge font-weight-bold" size="small">
                            -{{ product.discount }}%
                        </v-chip>

                        <div class="img-container pa-4 text-center">
                            <v-img :src="product.specs?.image || product.image" height="200" contain class="product-img mx-auto"></v-img>
                        </div>
                        
                        <v-card-text class="flex-grow-1 pt-4">
                            <span class="text-caption text-uppercase font-weight-bold" style="color: #00CEC9; letter-spacing: 1px;">
                                {{ product.brand }} <span class="cloud-text opacity-50 mx-1">|</span> {{ formatCategory(product.category) }}
                            </span>
                            
                            <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                                {{ product.name }}
                            </h3>
                            
                            <div class="quick-specs" v-if="product.specs">
                                <template v-for="(value, key) in product.specs" :key="key">
                                    <div v-if="key !== 'image' && key !== 'image2' && value" class="d-flex align-center mb-1">
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
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import AppHeader from '../components/AppHeader.vue';
    import { useCartStore } from '../stores/cartStore';

    const route = useRoute();
    const cartStore = useCartStore();
    const searchQuery = ref('');
    const searchResults = ref([]);
    const isLoading = ref(false);

    const specLabels = {
        socket: 'Socket',
        memory: 'Capacitate',
        memory_type: 'Tip Memorie',
        max_memory: 'Memorie maximă',
        memory_frequency: 'Frecvență',
        type: 'Tip / Format',
        cores: 'Număr nuclee',
        threads: 'Fire de execuție',
        frequency: 'Frecvență',
        boost_frequency: 'Frecvență max',
        tdp: 'Consum (TDP)',
        putere: 'Putere',
        certificare: 'Certificare',
        modular: 'Modularitate',
        format: 'Format',
        motherboardSupport: 'Plăci suportate',
        sidePanel: 'Panou lateral',
        includedFans: 'Ventilatoare',
        refreshRate: 'Refresh Rate',
        panel: 'Tip panou',
        resolution: 'Rezoluție'
    };

    const formatSpecLabel = (key) => {
        return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const formatCategory = (cat) => {
        const categories = {
            'procesoare': 'Procesor',
            'placi_de_baza': 'Placă de Bază',
            'memorie_ram': 'Memorie RAM',
            'placi_video': 'Placă Video',
            'stocare': 'Stocare',
            'surse': 'Sursă',
            'carcase': 'Carcasă',
            'laptopuri': 'Laptop',
            'monitoare': 'Monitor',
            'mousi': 'Mouse',
            'tastaturi': 'Tastatură',
            'casti': 'Căști'
        };
        return categories[cat] || cat;
    };

    const performSearch = async (queryStr) => {
        if (!queryStr) return;
        searchQuery.value = queryStr;
        isLoading.value = true;
        try {
            const response = await axios.get(`http://localhost:5000/server/search?q=${encodeURIComponent(queryStr)}`);
            if (response.data.success) {
                searchResults.value = response.data.data;
            }
        } catch (error) {
            console.error("Eroare la obținerea rezultatelor:", error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        performSearch(route.query.q);
    });

    watch(() => route.query.q, (newQuery) => {
        performSearch(newQuery);
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

    .opacity-50 { 
        opacity: 0.5; 
    }

    .product-card {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
        border-radius: 24px !important;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
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