<template>
    <v-app-bar color="#1E272E" height="80" extension-height="50" elevation="10" class="border-0">
        
        <div class="d-flex w-100 align-center px-4">
            <v-app-bar-title class="font-weight-black text-h4 cloud-text mr-10" style="cursor: pointer; flex: 0 0 auto; background: transparent;" @click="navigateToHome">
            NEXUM
            </v-app-bar-title>

            <v-text-field
                v-model="searchQuery"
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
            ></v-text-field>

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
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useCartStore } from '../stores/cartStore';

    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref('');
    const cartStore = useCartStore();

    onMounted(() => {
        cartStore.fetchCart();
    });

    defineProps({
        cartCount: {
            type: Number,
            default: 0
        }
    });

    function navigateToHome() {
        router.push('/home'); 
    }

    function goToCart() {
        router.push('/cart');
    }

    function goToProfile() {
        router.push('/profil');
    }

    function goToSettings() {
        router.push('/setari');
    }
</script>

<style scoped>
    .category-wrapper {
        background-color: #253038;
        border-top: 2px solid #00CEC9;
        border-bottom: 1px solid rgba(245, 246, 250, 0.05);
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

    .hover-cyan { 
        transition: color 0.3s ease; 
    }
    
    .hover-cyan:hover { 
        color: #00CEC9 !important; 
    }

    .search-bar :deep(.v-field) {
        border: 1px solid rgba(245, 246, 250, 0.1); 
        transition: all 0.3s ease;
    }

    .search-bar :deep(.v-field--focused) {
        border-color: #00CEC9; 
        box-shadow: 0 0 15px rgba(0, 206, 201, 0.15);
        background-color: rgba(30, 39, 46, 0.9) !important;
    }
    
    .search-bar :deep(.v-field__input) { 
        color: #F5F6FA !important; 
    }

    .electric-glow-bg {
        background: rgba(9, 132, 227, 0.15); 
    }
</style>