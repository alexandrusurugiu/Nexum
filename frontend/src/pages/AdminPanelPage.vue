<template>
    <v-app :theme="themeStore.isDark ? 'dark' : 'light'" class="nexum-bg" :class="!themeStore.isDark ? 'light-mode' : ''">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-10">
            <div class="mb-8 d-flex flex-column flex-sm-row justify-space-between align-sm-center">
                <h1 class="text-h3 font-weight-black cloud-text mb-4 mb-sm-0">Panou <span class="cyan-text">Admin</span></h1>
                <v-btn color="#10B981" class="font-weight-bold" prepend-icon="mdi-plus" @click="openModal('add')">
                    Adaugă Produs
                </v-btn>
            </div>

            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-select 
                        v-model="selectedCollection" 
                        :items="collections" 
                        label="Alege categoria de produse"
                        variant="outlined" 
                        color="#10B981"
                        class="custom-select"
                        @update:modelValue="loadProducts"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>

            <v-card class="rounded-xl pa-4 bg-panel" elevation="5">
                <v-progress-linear v-if="isLoading" indeterminate color="#10B981"></v-progress-linear>
                
                <template v-else>
                    <v-table v-if="selectedCollection !== 'Comenzi'" style="background: transparent;">
                        <thead>
                            <tr>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Imagine</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Nume Produs</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Brand</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Preț</th>
                                <th class="text-center cloud-text opacity-80 font-weight-bold">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id" class="product-row">
                                <td class="py-2">
                                    <v-card class="bg-white d-flex align-center justify-center rounded-lg" width="50" height="50" elevation="0" style="border: 1px solid var(--border-light);">
                                        <v-img :src="product.image || product.specs?.image" width="40" height="40" contain class="product-img"></v-img>
                                    </v-card>
                                </td>
                                <td class="cloud-text font-weight-medium">{{ product.name }}</td>
                                <td class="cloud-text">{{ product.brand }}</td>
                                <td class="cyan-text font-weight-bold">{{ product.price }} Lei</td>
                                <td class="text-center">
                                    <v-btn icon="mdi-pencil" size="small" variant="tonal" color="warning" class="mr-2 rounded-lg" @click="openModal('edit', product)"></v-btn>
                                    <v-btn icon="mdi-delete" size="small" variant="tonal" color="error" class="rounded-lg" @click="deleteProduct(product.id)"></v-btn>
                                </td>
                            </tr>
                            <tr v-if="products.length === 0">
                                <td colspan="5" class="text-center py-6 cloud-text opacity-70">Niciun produs găsit în această categorie.</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-table v-if="selectedCollection === 'Comenzi'" style="background: transparent;">
                        <thead>
                            <tr>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">ID Comandă</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Data</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Client / Contact</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold">Total</th>
                                <th class="text-left cloud-text opacity-80 font-weight-bold" style="min-width: 180px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id" class="product-row">
                                
                                <td class="cloud-text font-weight-bold text-caption">#{{ order.orderNumber || order.id.substring(0,8).toUpperCase() }}</td>
                                
                                <td class="cloud-text opacity-80 text-body-2">{{ new Date(order.createdAt).toLocaleDateString('ro-RO') }}</td>
                                <td>
                                    <div class="cloud-text font-weight-medium">{{ order.contactInfo?.name }}</div>
                                    <div class="cloud-text opacity-70 text-caption">{{ order.contactInfo?.phone }}</div>
                                </td>
                                <td class="cyan-text font-weight-bold">{{ order.summary?.total }} Lei</td>
                                <td>
                                    <v-select 
                                        v-model="order.status"
                                        :items="['În procesare', 'Confirmată', 'Expediată', 'Livrată', 'Anulată']"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        color="#10B981"
                                        class="custom-select mt-1 mb-1"
                                        @update:modelValue="updateOrderStatus(order.id, order.status)" 
                                    ></v-select>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </template>
            </v-card>

            <AdminProductModal 
                v-model="isModalOpen" 
                :mode="modalMode" 
                :product="selectedProduct" 
                :api-endpoint="currentApiEndpoint"
                @saved="handleProductSaved"
            />

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
    import { ref, computed, onMounted } from 'vue';
    import axios from 'axios';
    import AppHeader from '../components/AppHeader.vue';
    import AdminProductModal from '../components/AdminProductModal.vue';
    import { useComponentsStore } from '../stores/componentsStore';
    import { useLaptopsStore } from '../stores/laptopsStore';
    import { useMonitorsStore } from '../stores/monitorsStore';
    import { usePeripheralsStore } from '../stores/peripheralsStore';
    import { useThemeStore } from '../stores/themeStore';

    const componentsStore = useComponentsStore();
    const laptopsStore = useLaptopsStore();
    const monitorsStore = useMonitorsStore();
    const peripheralsStore = usePeripheralsStore();
    const collections = ['Componente', 'Laptopuri', 'Monitoare', 'Periferice', 'Comenzi'];
    const orders = ref([]);
    const selectedCollection = ref('Componente');
    const products = ref([]);
    const isLoading = ref(false);
    const isModalOpen = ref(false);
    const modalMode = ref('add');
    const selectedProduct = ref(null);
    const showSnackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('#10B981');
    const snackbarIcon = ref('mdi-check-circle-outline');
    const themeStore = useThemeStore();

    const triggerSnackbar = (message, type = 'success') => {
        snackbarMessage.value = message;
        if (type === 'success') {
            snackbarColor.value = '#10B981';
            snackbarIcon.value = 'mdi-check-circle-outline';
        } else if (type === 'error') {
            snackbarColor.value = '#EF4444';
            snackbarIcon.value = 'mdi-alert-circle-outline';
        }
        showSnackbar.value = true;
    };

    const currentApiEndpoint = computed(() => {
        switch (selectedCollection.value) {
            case 'Componente': return 'components';
            case 'Laptopuri': return 'laptops';
            case 'Monitoare': return 'monitors';
            case 'Periferice': return 'peripherals';
            default: return 'components';
        }
    });

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/server/orders/${orderId}/status`, { 
                status: newStatus 
            });
            triggerSnackbar(`Statusul comenzii a fost schimbat în "${newStatus}"!`, "success");
        } catch (e) {
            console.error(e);
            triggerSnackbar("A apărut o eroare la salvarea statusului.", "error");
            loadProducts(); 
        }
    };

    const loadProducts = async () => {
        isLoading.value = true;
        try {
            if (selectedCollection.value === 'Comenzi') {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/server/orders/all`);
                orders.value = response.data.orders || response.data.data || [];
            } 
            else if (selectedCollection.value === 'Componente') {
                await componentsStore.fetchComponents();
                products.value = [...componentsStore.allComponents];
            } else if (selectedCollection.value === 'Laptopuri') {
                await laptopsStore.fetchLaptops();
                products.value = [...laptopsStore.allLaptops];
            } else if (selectedCollection.value === 'Monitoare') {
                await monitorsStore.fetchMonitors();
                products.value = [...monitorsStore.allMonitors];
            } else if (selectedCollection.value === 'Periferice') {
                await peripheralsStore.fetchPeripherals();
                products.value = [...peripheralsStore.allPeripherals];
            }
        } catch (e) {
            console.error("Eroare la încărcare date", e);
            triggerSnackbar("A apărut o eroare la încărcarea datelor.", "error");
        } finally {
            isLoading.value = false;
        }
    };

    const openModal = (mode, product = null) => {
        modalMode.value = mode;
        selectedProduct.value = product;
        isModalOpen.value = true;
    };

    const handleProductSaved = (savedProduct) => {
        if (modalMode.value === 'add') {
            products.value.push(savedProduct);
        } else {
            const index = products.value.findIndex(p => p.id === savedProduct.id);
            if (index !== -1) {
                products.value[index] = { ...products.value[index], ...savedProduct };
            }
        }
        syncStore();
        triggerSnackbar("Produsul a fost salvat cu succes!", "success");
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/server/${currentApiEndpoint.value}/${id}`);
            products.value = products.value.filter(p => p.id !== id);
            syncStore();
            triggerSnackbar("Produsul a fost șters definitiv!", "success");
        } catch (e) {
            console.error(e);
            triggerSnackbar("A apărut o eroare la ștergerea produsului.", "error");
        }
    };

    const syncStore = () => {
        if (selectedCollection.value === 'Componente') {
            componentsStore.allComponents = products.value;
        } else if (selectedCollection.value === 'Laptopuri') {
            laptopsStore.allLaptops = products.value;
        } else if (selectedCollection.value === 'Monitoare') {
            monitorsStore.allMonitors = products.value;
        } else if (selectedCollection.value === 'Periferice') {
            peripheralsStore.allPeripherals = products.value;
        }
    };

    onMounted(() => {
        loadProducts();
    });
</script>

<style scoped>
    .nexum-bg { 
        background-color: var(--bg-main) !important; 
    }

    .bg-panel { 
        background-color: var(--bg-panel) !important; 
        border: 1px solid var(--border-light); 
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

    .custom-select :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .custom-select :deep(.v-label) { 
        color: var(--text-main) !important; 
        opacity: 0.7; 
    }

    .custom-select :deep(.v-select__selection-text) { 
        color: var(--text-main) !important; 
    }

    .custom-select :deep(.v-field:not(.v-field--focused) .v-field__outline) {
        color: var(--text-main) !important;
        opacity: 0.35 !important; 
    }
    
    .custom-select :deep(.v-field:hover:not(.v-field--focused) .v-field__outline) {
        opacity: 0.55 !important;
    }

    .product-row { 
        transition: background-color 0.2s ease; 
        border-bottom: 1px solid var(--border-light); 
    }

    .product-row:hover { 
        background-color: rgba(16, 185, 129, 0.05); 
    }

    .product-img { 
        mix-blend-mode: multiply; 
        filter: contrast(1.1); 
    }
</style>