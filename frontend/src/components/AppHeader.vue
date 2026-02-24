<template>
    <v-app-bar color="#1E272E" height="80" extension-height="50" elevation="10" class="border-0">
        
        <div class="d-flex w-100 align-center px-4">
            <v-app-bar-title class="font-weight-black text-h4 cloud-text mr-10" style="cursor: pointer; flex: 0 0 auto; background: transparent;" @click="navigateToHome">
            NEXUM
            </v-app-bar-title>

            <v-text-field
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                @focus="searchQuery.trim() !== '' ? showDropdown = true : false"
                placeholder="Caută procesoare, plăci video, laptopuri..."
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                flat
                bg-color="rgba(245, 246, 250, 0.08)"
                color="#00CEC9"
                base-color="rgba(245, 246, 250, 0.5)"
                density="comfortable"
                hide-details
                rounded="pill"
                class="search-bar mx-auto"
                max-width="600"
                clearable
                @click:clear="clearSearch"
            >
                <v-menu v-model="showDropdown" activator="parent" location="bottom" :offset="10" transition="slide-y-transition" :close-on-content-click="false">
                    <v-card class="live-search-panel rounded-xl overflow-hidden" elevation="15" width="600" max-height="450">
                        
                        <div v-if="isSearching" class="pa-6 text-center">
                            <v-progress-circular indeterminate color="#00CEC9" size="40"></v-progress-circular>
                            <div class="text-caption cloud-text opacity-50 mt-2">Căutăm produsele...</div>
                        </div>

                        <div v-else-if="liveResults.length === 0 && searchQuery" class="pa-6 text-center">
                            <v-icon size="40" color="rgba(245, 246, 250, 0.2)" class="mb-2">mdi-magnify-close</v-icon>
                            <div class="text-body-2 cloud-text opacity-80">Nu am găsit rezultate pentru "{{ searchQuery }}"</div>
                        </div>

                        <v-list v-else bg-color="transparent" class="pa-2">
                            <v-list-item
                                v-for="product in liveResults.slice(0, 5)"
                                :key="product.id"
                                class="live-search-item rounded-lg mb-1 pa-3"
                                @click="goToExactProduct(product)"
                            >
                                <template v-slot:prepend>
                                    <div class="search-img-wrapper mr-4">
                                        <v-img :src="product.specs?.image || product.image" width="40" height="40" contain></v-img>
                                    </div>
                                </template>
                                
                                <v-list-item-title class="font-weight-bold cloud-text text-body-2 line-clamp-1">
                                    {{ product.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="cyan-text font-weight-bold mt-1">
                                    {{ product.price }} Lei
                                </v-list-item-subtitle>
                            </v-list-item>

                            <div v-if="liveResults.length > 0" class="px-2 pt-2 pb-1 mt-2" style="border-top: 1px solid rgba(0, 206, 201, 0.2);">
                                <v-btn block variant="text" color="#00CEC9" class="font-weight-bold" @click="handleSearch">
                                    Vezi toate cele {{ liveResults.length }} rezultate
                                </v-btn>
                            </div>
                        </v-list>

                    </v-card>
                </v-menu>
            </v-text-field>

            <v-spacer></v-spacer>

            <div class="d-flex align-center mr-2">
                <v-btn icon="mdi-information-outline" class="cloud-text opacity-80 hover-cyan" title="Despre Nexum"></v-btn>
                <v-btn icon="mdi-cog-outline" class="cloud-text opacity-80 hover-cyan" title="Setări" @click="goToSettings"></v-btn>
                
                <v-divider vertical class="mx-3 border-opacity-50" color="#F5F6FA" style="height: 50px;"></v-divider>

                <v-btn icon class="cloud-text hover-cyan" @click="goToProfile" title="Contul Meu">
                    <v-icon size="large">mdi-account-circle-outline</v-icon>
                </v-btn>
                
                <v-btn icon class="cloud-text ml-2" @click="goToCart" title="Cosul tău">
                    <v-badge :content="cartStore.cartCount" :model-value="cartStore.cartCount > 0" color="#0984E3" text-color="#F5F6FA" floating>
                        <v-icon size="large">mdi-cart-outline</v-icon>
                    </v-badge>
                </v-btn>
            </div>
        </div>

        <template v-slot:extension>
            <div class="w-100 h-100 d-flex align-end category-wrapper">
                <v-tabs :model-value="route.path" :mandatory="false" color="#00CEC9" align-tabs="center" class="w-100 cloud-text font-weight-medium">
                    <v-tab value="/componente" to="/componente">Componente PC</v-tab>
                    <v-tab value="/periferice" to="/periferice">Periferice</v-tab>
                    <v-tab value="/monitoare" to="/monitoare">Monitoare</v-tab>
                    <v-tab value="/laptopuri" to="/laptopuri">Laptopuri</v-tab>
                    
                    <v-tab value="/configurator" to="/configurator" class="cyan-text font-weight-black electric-glow-bg rounded-t-lg">
                        Configurator
                    </v-tab>
                </v-tabs>
            </div>
        </template>
        
    </v-app-bar>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useCartStore } from '../stores/cartStore';
    import axios from 'axios';

    const router = useRouter();
    const route = useRoute();
    const cartStore = useCartStore();
    
    // Variabile pentru Live Search
    const searchQuery = ref('');
    const showDropdown = ref(false);
    const liveResults = ref([]);
    const isSearching = ref(false);
    let debounceTimer = null;

    onMounted(() => {
        cartStore.fetchCart();
    });

    defineProps({
        cartCount: { type: Number, default: 0 }
    });

    // Urmărim ce tastează utilizatorul
    watch(searchQuery, (newVal) => {
        if (!newVal || newVal.trim() === '') {
            showDropdown.value = false;
            liveResults.value = [];
            return;
        }

        showDropdown.value = true;
        isSearching.value = true;

        // Anulăm cererea anterioară dacă utilizatorul încă tastează
        clearTimeout(debounceTimer);
        
        // Așteptăm 400ms după ultima apăsare de tastă pentru a trimite request-ul
        debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get(`http://localhost:5000/server/search?q=${encodeURIComponent(newVal)}`);
                if (response.data.success) {
                    liveResults.value = response.data.data;
                }
            } catch (error) {
                console.error("Eroare live search:", error);
            } finally {
                isSearching.value = false;
            }
        }, 400); 
    });

    function clearSearch() {
        searchQuery.value = '';
        showDropdown.value = false;
        liveResults.value = [];
    }

    // Navigare completă spre Search Page
    function handleSearch() {
        if (searchQuery.value && searchQuery.value.trim() !== '') {
            showDropdown.value = false;
            router.push({ path: '/search', query: { q: searchQuery.value } });
        }
    }

    // Când dă click fix pe un rezultat din meniul live
    function goToExactProduct(product) {
        showDropdown.value = false;
        searchQuery.value = product.name; // Îi completăm bara cu numele produsului
        router.push({ path: '/search', query: { q: product.name } });
    }

    function navigateToHome() { router.push('/home'); }
    function goToCart() { router.push('/cart'); }
    function goToProfile() { router.push('/profil'); }
    function goToSettings() { router.push('/setari'); }
</script>

<style scoped>
    .category-wrapper {
        background-color: #253038;
        border-top: 2px solid #00CEC9;
        border-bottom: 1px solid rgba(245, 246, 250, 0.05);
    }

    .cloud-text { color: #F5F6FA !important; }
    .cyan-text { color: #00CEC9 !important; }
    .opacity-80 { opacity: 0.8; }

    .hover-cyan { transition: color 0.3s ease; }
    .hover-cyan:hover { color: #00CEC9 !important; }

    .search-bar :deep(.v-field) {
        border: 1px solid rgba(245, 246, 250, 0.1); 
        transition: all 0.3s ease;
    }
    .search-bar :deep(.v-field--focused) {
        border-color: #00CEC9; 
        box-shadow: 0 0 15px rgba(0, 206, 201, 0.15);
        background-color: rgba(30, 39, 46, 0.9) !important;
    }
    .search-bar :deep(.v-field__input) { color: #F5F6FA !important; }

    .electric-glow-bg { background: rgba(9, 132, 227, 0.15); }

    /* Stiluri Noi pentru Dropdown Live Search */
    .live-search-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(0, 206, 201, 0.3);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
    }

    .live-search-item {
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .live-search-item:hover {
        background-color: rgba(0, 206, 201, 0.1) !important;
    }

    .search-img-wrapper {
        background: #F5F6FA;
        border-radius: 8px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .line-clamp-1 {
        display: -webkit-box; 
        -webkit-line-clamp: 1; 
        -webkit-box-orient: vertical; 
        overflow: hidden;
    }
</style>