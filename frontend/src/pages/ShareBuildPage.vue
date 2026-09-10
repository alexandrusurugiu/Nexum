<template>
    <v-app :theme="themeStore.isDark ? 'dark' : 'light'" class="nexum-bg" :class="!themeStore.isDark ? 'light-mode' : ''">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div v-if="isLoading" class="text-center py-16">
                <v-progress-circular indeterminate color="#10B981" size="60"></v-progress-circular>
                <h2 class="cloud-text mt-4">Căutăm sistemul...</h2>
            </div>

            <div v-else-if="error" class="text-center py-16">
                <v-icon size="80" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
                <h2 class="cloud-text text-h4 font-weight-bold mb-4">Sistem Negăsit</h2>
                <p class="cloud-text opacity-70 mb-8">{{ error }}</p>
                <v-btn color="#10B981" variant="tonal" to="/configurator" size="large">Mergi la Configurator</v-btn>
            </div>

            <v-row v-else justify="center">
                <v-col cols="12" md="10" lg="8">
                    <v-card class="bg-panel rounded-xl pa-6 pa-md-10" elevation="10" style="border: 1px solid rgba(16, 185, 129, 0.3);">
                        
                        <div class="text-center mb-10">
                        <v-chip color="info" variant="tonal" class="mb-4 font-weight-bold">
                            <v-icon start>mdi-share-variant</v-icon> Sistem Distribuit
                        </v-chip>
                        <h1 class="text-h3 font-weight-black cloud-text mb-2">{{ sharedBuild.name }}</h1>
                        <p class="cloud-text opacity-70">Acesta este un sistem personalizat creat pe Nexum.</p>
                        </div>

                        <div class="products-list mb-10">
                            <div v-for="(item, index) in sharedBuild.items" :key="index" class="d-flex align-center justify-space-between pa-4 product-row rounded-lg mb-2" style="background: rgba(243, 244, 246, 0.03); border: 1px solid var(--border-light);">
                                <div class="d-flex align-center">
                                    <div class="img-wrapper mr-4 rounded-lg pa-2 bg-white d-flex align-center justify-center" style="width: 70px; height: 70px;">
                                        <v-img :src="item.image" contain class="mix-blend-multiply"></v-img>
                                    </div>

                                    <div>
                                        <div class="text-caption cyan-text font-weight-bold text-uppercase">{{ item.brand }}</div>
                                        <div class="cloud-text font-weight-bold text-h6 line-clamp-1">{{ item.name }}</div>
                                    </div>
                                </div>

                                <div class="text-right ml-4">
                                    <div class="cloud-text opacity-70 text-caption">x{{ item.quantity }} buc</div>
                                    <div class="cloud-text font-weight-black whitespace-nowrap">{{ item.price }} Lei</div>
                                </div>
                            </div>
                        </div>

                        <v-divider class="mb-6 border-opacity-25" color="#10B981"></v-divider>

                        <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
                            <div class="text-center text-sm-left mb-6 mb-sm-0">
                                <div class="cloud-text opacity-70 text-subtitle-1">Total Sistem</div>
                                <div class="cyan-text text-h3 font-weight-black">{{ sharedBuild.total }} Lei</div>
                            </div>
                        
                            <v-btn color="#10B981" size="x-large" class="rounded-lg font-weight-bold text-white shadow-btn" prepend-icon="mdi-cart-plus" @click="addAllToCart">
                                Adaugă tot în coș
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-snackbar v-model="showSnackbar" :timeout="3500" :color="snackbarColor" elevation="10" rounded="pill">
                <div class="d-flex align-center font-weight-bold text-white">
                    <v-icon start class="mr-2">{{ snackbarIcon }}</v-icon>
                    {{ snackbarMessage }}
                </div>
                <template v-slot:actions>
                    <v-btn icon="mdi-close" variant="text" color="white" @click="showSnackbar = false"></v-btn>
                </template>
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import AppHeader from '../components/AppHeader.vue';
    import { useCartStore } from '../stores/cartStore';
    import { useThemeStore } from '../stores/themeStore';

    const route = useRoute();
    const router = useRouter();
    const themeStore = useThemeStore();
    const cartStore = useCartStore();
    const isLoading = ref(true);
    const error = ref(null);
    const sharedBuild = ref(null);
    const showSnackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('#10B981');
    const snackbarIcon = ref('mdi-check-circle-outline');

    const triggerSnackbar = (message, type = 'success') => {
        snackbarMessage.value = message;
        if (type === 'success') {
            snackbarColor.value = '#10B981';
            snackbarIcon.value = 'mdi-check-circle-outline';
        } else if (type === 'error') {
            snackbarColor.value = '#EF4444';
            snackbarIcon.value = 'mdi-alert-circle-outline';
        } else if (type === 'info') {
            snackbarColor.value = '#3B82F6';
            snackbarIcon.value = 'mdi-information-outline';
        }
        showSnackbar.value = true;
    };

    onMounted(async () => {
        const code = route.params.code; 
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/wishlist/code/${code}`);
        
        if (response.data.success) {
            sharedBuild.value = response.data.data;
        }
        } catch (err) {
            error.value = "Acest cod de share nu este valid sau sistemul a fost șters.";
        } finally {
            isLoading.value = false;
        }
    });

    const addAllToCart = () => {
        sharedBuild.value.items.forEach(item => {
            cartStore.addToCart(item);
        });

        triggerSnackbar("Sistemul a fost adăugat în coș!", "success");
        router.push('/cart');
    };
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

    .bg-panel { 
        background-color: var(--bg-panel) !important; 
    }

    .opacity-70 { 
        opacity: 0.7; 
    }

    .whitespace-nowrap { 
        white-space: nowrap; 
    }

    .mix-blend-multiply { 
        mix-blend-mode: multiply; 
        filter: contrast(1.1); 
    }

    .line-clamp-1 { 
        display: -webkit-box; 
        -webkit-line-clamp: 1; 
        -webkit-box-orient: vertical; 
        overflow: hidden; 
    }
    
    .shadow-btn {
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .shadow-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5) !important;
    }
</style>