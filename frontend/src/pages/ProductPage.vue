<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-10">
            <div v-if="isLoading" class="text-center py-16">
                <v-progress-circular indeterminate color="#10B981" size="64"></v-progress-circular>
            </div>

            <div v-else-if="!product" class="text-center py-16">
                <v-icon size="100" color="var(--border-light)" class="mb-4">mdi-package-variant-closed</v-icon>
                <h2 class="cloud-text opacity-80">Produsul nu a fost găsit.</h2>
                <v-btn color="#10B981" variant="tonal" class="mt-6 rounded-lg font-weight-bold" to="/home">
                    Înapoi la Magazin
                </v-btn>
            </div>

            <div v-else>
                <div class="mb-6 d-flex align-center cloud-text opacity-70 text-body-2 text-uppercase font-weight-bold" style="letter-spacing: 1px;">
                    <span class="cursor-pointer hover-cyan" @click="router.push('/home')">Acasă</span>
                    <v-icon size="small" class="mx-2">mdi-chevron-right</v-icon>
                    <span class="cursor-pointer hover-cyan" @click="router.back()">Magazin</span>
                    <v-icon size="small" class="mx-2">mdi-chevron-right</v-icon>
                    <span class="cyan-text text-truncate" style="max-width: 200px;">{{ product.brand }}</span>
                </div>

                <v-row>
                    <v-col cols="12" md="6" lg="5">
                        <v-card class="product-image-panel rounded-xl pa-8 text-center d-flex align-center justify-center h-100" elevation="5" style="min-height: 400px;">
                            <v-img :src="product.specs?.image || product.image" max-height="400" contain class="product-img"></v-img>
                            
                            <v-chip v-if="product.discount" color="#059669" class="discount-badge font-weight-black text-h6 px-4 py-6 rounded-lg" size="x-large">
                                -{{ product.discount }}%
                            </v-chip>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6" lg="7" class="pl-md-8 pt-6 pt-md-0 d-flex flex-column">
                        <v-chip color="#10B981" variant="outlined" size="small" class="mb-4 font-weight-bold align-self-start text-uppercase" style="letter-spacing: 1px;">
                            {{ product.brand }}
                        </v-chip>
                        
                        <h1 class="text-h4 text-md-h3 font-weight-black cloud-text mb-4" style="line-height: 1.2;">
                            {{ product.name }}
                        </h1>

                        <div class="d-flex align-center mb-6">
                            <v-icon color="warning" class="mr-1">mdi-star</v-icon>
                            <v-icon color="warning" class="mr-1">mdi-star</v-icon>
                            <v-icon color="warning" class="mr-1">mdi-star</v-icon>
                            <v-icon color="warning" class="mr-1">mdi-star</v-icon>
                            <v-icon color="warning" class="mr-3">mdi-star-half-full</v-icon>
                            <span class="cloud-text opacity-70 text-body-2">(4.8 / 5 din 124 recenzii)</span>
                        </div>

                        <div class="price-box pa-6 rounded-xl mb-8 d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
                            <div>
                                <div v-if="product.oldPrice" class="text-decoration-line-through text-body-1 cloud-text opacity-50 mb-1">
                                    {{ product.oldPrice }} Lei
                                </div>
                                <div class="text-h3 font-weight-black cyan-text">
                                    {{ product.price }} <span class="text-h5 font-weight-bold">Lei</span>
                                </div>
                                <div class="text-caption cloud-text opacity-70 mt-1 d-flex align-center">
                                    <v-icon color="#10B981" size="small" class="mr-1">mdi-check-circle</v-icon> În stoc furnizor
                                </div>
                            </div>

                            <v-btn 
                                color="#10B981" 
                                size="x-large" 
                                class="rounded-lg premium-btn font-weight-black text-uppercase px-8 flex-grow-1 flex-sm-grow-0 h-100 py-4"
                                @click="addToCart"
                            >
                                <v-icon start size="large" class="mr-2">mdi-cart-plus</v-icon>
                                Adaugă în coș
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-10">
                    <v-col cols="12">
                        <v-card class="product-panel rounded-xl pa-6 pa-md-10" elevation="5">
                            <h2 class="text-h4 font-weight-black cloud-text mb-8 d-flex align-center">
                                <v-icon color="#10B981" size="large" class="mr-3">mdi-list-box-outline</v-icon>
                                Specificații Tehnice
                            </h2>

                            <div class="specs-table rounded-lg overflow-hidden">
                                <div v-for="(value, key, index) in filteredFullSpecs" :key="key" 
                                     class="spec-row d-flex pa-4" 
                                     :class="{ 'bg-row-alt': index % 2 !== 0 }">
                                    <div class="spec-label cloud-text opacity-70 font-weight-bold text-uppercase w-50 w-md-30 pr-4">
                                        {{ formatSpecLabel(key) }}
                                    </div>
                                    <div class="spec-value cloud-text font-weight-medium w-50 w-md-70">
                                        {{ value }}
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import AppHeader from '../components/AppHeader.vue';
    import { useCartStore } from '../stores/cartStore';
    import axios from 'axios';

    const route = useRoute();
    const router = useRouter();
    const cartStore = useCartStore();
    const product = ref(null);
    const isLoading = ref(true);

    const specLabels = {
        socket: 'Socket', 
        memory: 'Capacitate', 
        memory_type: 'Tip Memorie', 
        type: 'Tip',
        cores: 'Nuclee', 
        threads: 'Fire execuție', 
        frequency: 'Frecvență', 
        putere: 'Putere (W)',
        format: 'Format', 
        resolution: 'Rezoluție', 
        refreshRate: 'Rată de Refresh',
        cpu: 'Procesor', 
        gpu: 'Placă Video', 
        ram: 'Memorie RAM', 
        storage: 'Stocare',
        display: 'Ecran', 
        weight: 'Greutate', 
        connectivity: 'Conectivitate',
        lighting: 'Iluminare', 
        dpi: 'DPI', 
        techType: 'Tehnologie', 
        switches: 'Switch-uri'
    };

    const formatSpecLabel = (key) => {
        return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    onMounted(async () => {
        const productId = route.params.id; 

        try {
            const response = await axios.get(`http://localhost:5000/server/products/${productId}`);
            
            if (response.data.success) {
                product.value = response.data.product;
            }
        } catch (error) {
            console.error("Produsul nu a fost găsit.");
        } finally {
            isLoading.value = false;
        }
    });

    const addToCart = () => {
        if (product.value) {
            cartStore.addToCart(product.value);
        }
    };

    const filteredFullSpecs = computed(() => {
        if (!product.value?.specs) {
            return {};
        }

        const result = {};

        for (const [key, value] of Object.entries(product.value.specs)) {
            if (key !== 'image' && key !== 'image2' && value && value !== 'N/A') {
                result[key] = value;
            }
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

    .opacity-70 { 
        opacity: 0.7; 
    }

    .opacity-50 { 
        opacity: 0.5; 
    }

    .cursor-pointer { 
        cursor: pointer; 
    }

    .hover-cyan:hover { 
        color: #10B981 !important; 
        transition: 0.2s ease;
    }

    .product-image-panel {
        background-color: #FFFFFF !important;
        border: 1px solid var(--border-light);
        position: relative;
    }

    .product-panel {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
        position: relative;
    }

    .specs-table {
        background-color: var(--bg-panel);
        border: 1px solid var(--border-light);
    }
    
    .bg-row-alt {
        background-color: rgba(16, 185, 129, 0.03); 
    }

    .spec-row {
        border-bottom: 1px solid var(--border-light); 
    }
    
    .spec-row:last-child {
        border-bottom: none;
    }

    .w-30 { 
        width: 30%; 
    }

    .w-70 { 
        width: 70%; 
    }

    .product-img {
        transition: transform 0.5s ease;
        filter: contrast(1.05);
    }

    .product-img:hover {
        transform: scale(1.05);
    }

    .discount-badge {
        position: absolute;
        top: 20px;
        left: 20px;
        box-shadow: 0 10px 20px rgba(5, 150, 105, 0.4);
    }

    .price-box {
        background-color: var(--bg-main);
        border: 1px solid var(--border-light);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .premium-btn {
        color: var(--bg-main) !important; 
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease;
    }
    
    .premium-btn:hover {
        background-color: #059669 !important;
        transform: translateY(-2px); 
        box-shadow: 0 12px 25px rgba(16, 185, 129, 0.25) !important;
    }
</style>