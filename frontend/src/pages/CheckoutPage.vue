<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Finalizare <span class="cyan-text">Comandă</span></h1>
            </div>

            <v-row v-if="cartStore.items.length === 0">
                <v-col cols="12" class="text-center py-16">
                    <h2 class="cloud-text opacity-80">Nu ai produse în coș.</h2>
                    <v-btn color="#10B981" class="mt-4" to="/home">Înapoi la cumpărături</v-btn>
                </v-col>
            </v-row>

            <v-row v-else-if="orderPlacedSuccess">
                <v-col cols="12" class="text-center py-16">
                    <v-icon size="100" color="#10B981" class="mb-4 drop-shadow-cyan">mdi-check-decagram</v-icon>
                    <h2 class="text-h3 font-weight-black cloud-text mb-4">Comandă Confirmată!</h2>
                    <p class="text-h6 cloud-text opacity-80 mb-8">Număr comandă: <span class="cyan-text font-weight-bold">{{ generatedOrderNumber }}</span></p>
                    <v-btn color="#10B981" size="x-large" class="rounded-lg font-weight-bold" to="/profil">
                        Vezi Comanda în Profil
                    </v-btn>
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col cols="12" md="7" lg="8">
                    <v-card class="checkout-panel rounded-xl pa-6 pa-md-8 mb-6" elevation="5">
                        
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6 d-flex align-center">
                            <v-icon color="#10B981" class="mr-2">mdi-account-details</v-icon> Date de Contact
                        </h2>
                        
                        <div v-if="!authStore.isAuthenticated" class="mb-6 pa-4 rounded-lg bg-glass-cyan d-flex align-center justify-space-between flex-wrap">
                            <span class="cloud-text text-body-2">Ai deja un cont? Te poți autentifica pentru completare automată.</span>
                            <v-btn variant="outlined" color="#10B981" size="small" class="mt-2 mt-sm-0" to="/profil">Loghează-te</v-btn>
                        </div>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Nume Complet *</div>
                                <v-text-field v-model="form.name" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă Email *</div>
                                <v-text-field v-model="form.email" type="email" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Telefon *</div>
                                <v-text-field v-model="form.phone" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-divider class="border-opacity-25 my-8" color="#10B981"></v-divider>

                        <h2 class="text-h5 font-weight-bold cloud-text mb-6 d-flex align-center">
                            <v-icon color="#10B981" class="mr-2">mdi-map-marker-outline</v-icon> Adresă de Livrare
                        </h2>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Județ *</div>
                                <v-text-field v-model="form.address.county" placeholder="Ex: Ilfov" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Localitate *</div>
                                <v-text-field v-model="form.address.city" placeholder="Ex: București" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="8">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă *</div>
                                <v-text-field v-model="form.address.street" placeholder="Ex: Str. Florilor, Nr. 15, Bl. A, Ap. 3" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Cod Poștal</div>
                                <v-text-field v-model="form.address.zip" placeholder="Ex: 012345" variant="outlined" color="#10B981" base-color="var(--text-main)" class="custom-input"></v-text-field>
                            </v-col>
                        </v-row>

                        <h2 class="text-h5 font-weight-bold cloud-text mb-6 d-flex align-center mt-10">
                            <v-icon color="#10B981" class="mr-2">mdi-truck-delivery</v-icon> Metodă de Livrare
                        </h2>
                        
                        <div class="d-flex flex-column gap-3">
                            <v-card 
                                v-for="courier in couriers" :key="courier.id"
                                class="rounded-lg courier-card cursor-pointer position-relative mb-3"
                                :class="{'active-courier': form.courier === courier.id}"
                                @click="form.courier = courier.id"
                                elevation="0"
                            >
                                <div class="d-flex align-center justify-space-between pa-4">
                                    <div class="flex-grow-1 text-center">
                                        <div class="font-weight-bold cloud-text text-body-1">{{ courier.name }}</div>
                                        <div class="text-caption cloud-text opacity-70 mt-1">{{ courier.desc }}</div>
                                        <div class="font-weight-bold cyan-text mt-2">
                                            {{ courier.price === 0 ? 'Gratuit' : courier.price + ' Lei' }}
                                        </div>
                                    </div>
                                    
                                    <v-icon 
                                        :color="form.courier === courier.id ? '#10B981' : 'transparent'" 
                                        size="28"
                                        class="position-absolute"
                                        style="right: 16px; top: 50%; transform: translateY(-50%);"
                                    >
                                        mdi-check-circle
                                    </v-icon>
                                </div>
                            </v-card>
                        </div>

                        <v-divider class="border-opacity-25 my-8" color="#10B981"></v-divider>

                        <h2 class="text-h5 font-weight-bold cloud-text mb-6 d-flex align-center mt-8">
                            <v-icon color="#10B981" class="mr-2">mdi-credit-card-outline</v-icon> Metodă de Plată
                        </h2>

                        <div class="d-flex flex-column gap-3">
                            <v-card 
                                class="rounded-lg courier-card cursor-pointer position-relative mb-3"
                                :class="{'active-courier': form.paymentMethod === 'ramburs'}"
                                @click="form.paymentMethod = 'ramburs'"
                                elevation="0"
                            >
                                <div class="d-flex align-center justify-space-between pa-4">
                                    <div class="flex-grow-1 text-center">
                                        <v-icon color="#10B981" size="32" class="mb-2">mdi-cash-multiple</v-icon>
                                        <div class="font-weight-bold cloud-text text-body-1">Ramburs la curier</div>
                                        <div class="text-caption cloud-text opacity-70 mt-1">Plătești cash sau cardul direct la livrare.</div>
                                    </div>
                                    
                                    <v-icon 
                                        :color="form.paymentMethod === 'ramburs' ? '#10B981' : 'transparent'" 
                                        size="28"
                                        class="position-absolute"
                                        style="right: 16px; top: 50%; transform: translateY(-50%);"
                                    >
                                        mdi-check-circle
                                    </v-icon>
                                </div>
                            </v-card>

                            <v-card 
                                class="rounded-lg courier-card cursor-pointer position-relative mb-3"
                                :class="{'active-courier': form.paymentMethod === 'card'}"
                                @click="form.paymentMethod = 'card'"
                                elevation="0"
                            >
                                <div class="d-flex align-center justify-space-between pa-4">
                                    <div class="flex-grow-1 text-center">
                                        <v-icon color="#10B981" size="32" class="mb-2">mdi-credit-card</v-icon>
                                        <div class="font-weight-bold cloud-text text-body-1">Plată online cu cardul</div>
                                        <div class="text-caption cloud-text opacity-70 mt-1">Plată securizată (În curând).</div>
                                    </div>
                                    
                                    <v-icon 
                                        :color="form.paymentMethod === 'card' ? '#10B981' : 'transparent'" 
                                        size="28"
                                        class="position-absolute"
                                        style="right: 16px; top: 50%; transform: translateY(-50%);"
                                    >
                                        mdi-check-circle
                                    </v-icon>
                                </div>
                            </v-card>
                        </div>

                        <v-checkbox 
                            v-if="authStore.isAuthenticated" 
                            v-model="form.saveDetails" 
                            label="Salvează aceste date în profilul meu pentru comenzi viitoare." 
                            color="#10B981" 
                            hide-details 
                            class="custom-checkbox mt-4"
                        ></v-checkbox>
                    </v-card>
                </v-col>

                <v-col cols="12" md="5" lg="4">
                    <v-card class="checkout-panel pa-6 rounded-xl" elevation="10" style="position: sticky; top: 100px;">
                        <h3 class="text-h5 font-weight-bold cloud-text mb-6">Sumar Comandă</h3>
                        
                        <div class="summary-items-list mb-4 pr-2">
                            <div v-for="item in cartStore.items" :key="'sum-'+item.id" class="d-flex justify-space-between mb-3">
                                <span class="cloud-text opacity-80 text-body-2 text-truncate mr-2" style="max-width: 70%;" :title="item.name">
                                    {{ item.quantity }}x {{ item.name }}
                                </span>
                                <span class="cloud-text font-weight-bold whitespace-nowrap">
                                    {{ item.price * item.quantity }} Lei
                                </span>
                            </div>
                        </div>

                        <v-divider class="border-opacity-25 mb-4" color="#10B981"></v-divider>

                        <div class="d-flex justify-space-between mb-2 cloud-text opacity-80 text-body-2">
                            <span>Subtotal Produse:</span>
                            <span>{{ cartStore.cartTotal }} Lei</span>
                        </div>
                        <div class="d-flex justify-space-between mb-4 cloud-text opacity-80 text-body-2">
                            <span>Cost Livrare ({{ selectedCourier.name }}):</span>
                            <span>{{ selectedCourier.price === 0 ? 'Gratuit' : selectedCourier.price + ' Lei' }}</span>
                        </div>

                        <v-divider class="border-opacity-25 mb-4" color="#10B981"></v-divider>

                        <div class="d-flex justify-space-between mb-6 align-end">
                            <span class="text-h6 cloud-text font-weight-bold">Total Plată:</span>
                            <span class="text-h4 cyan-text font-weight-black">{{ finalTotal }} Lei</span>
                        </div>

                        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4 text-caption rounded-lg">
                            {{ errorMessage }}
                        </v-alert>

                        <v-btn block size="x-large" class="rounded-lg font-weight-bold premium-btn" @click="placeOrder" :loading="isProcessing">
                            <v-icon start>mdi-check-all</v-icon> Finalizează Comanda
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useCartStore } from '../stores/cartStore';
    import { useAuthStore } from '../stores/authStore';
    import axios from 'axios';
    import AppHeader from '../components/AppHeader.vue';

    const cartStore = useCartStore();
    const authStore = useAuthStore();
    
    const isProcessing = ref(false);
    const errorMessage = ref('');
    const orderPlacedSuccess = ref(false);
    const generatedOrderNumber = ref('');

    const couriers = [
        { id: 'sameday', name: 'Sameday Easybox / Curier', desc: 'Livrare 24-48h', price: 30 },
        { id: 'fan', name: 'FAN Courier', desc: 'Livrare Rapida Standard', price: 25 },
        { id: 'dpd', name: 'DPD România', desc: 'Livrare Economică', price: 18 }
    ];

    const form = ref({
        name: '', 
        email: '', 
        phone: '', 
        address: { 
            county: '', 
            city: '', 
            street: '', 
            zip: '' },
        courier: '', 
        paymentMethod: '',
        saveDetails: true
    });

    onMounted(() => {
        if (authStore.user) {
            form.value.name = authStore.user.name || '';
            form.value.email = authStore.user.email || '';
            form.value.phone = authStore.user.phone || '';
            
            if (typeof authStore.user.address === 'object' && authStore.user.address !== null) {
                form.value.address = { ...authStore.user.address };
            } else if (typeof authStore.user.address === 'string') {
                form.value.address.street = authStore.user.address;
            }
        }
    });

    const selectedCourier = computed(() => {
        return couriers.find(c => c.id === form.value.courier) || couriers[0];
    });

    const finalTotal = computed(() => {
        return cartStore.cartTotal + selectedCourier.value.price;
    });

    const placeOrder = async () => {
        errorMessage.value = '';
        
        if (!form.value.name || !form.value.email || !form.value.phone || !form.value.address.county || !form.value.address.city || !form.value.address.street) {
            errorMessage.value = "Te rugăm să completezi toate câmpurile obligatorii (*).";
            return;
        }

        if (form.value.paymentMethod === 'card') {
            errorMessage.value = "Plata cu cardul este temporar indisponibilă. Te rugăm să alegi plata Ramburs.";
            return;
        }

        if (!form.value.courier) {
             errorMessage.value = "Te rugăm să alegi o metodă de livrare.";
             return;
        }

        if (!form.value.paymentMethod) {
             errorMessage.value = "Te rugăm să alegi o metodă de plată.";
             return;
        }

        isProcessing.value = true;

        try {
            const payload = {
                userId: authStore.user?.id || null,
                contactInfo: {
                    name: form.value.name,
                    email: form.value.email,
                    phone: form.value.phone,
                    saveDetails: form.value.saveDetails
                },
                deliveryInfo: {
                    address: form.value.address,
                    courierId: selectedCourier.value.id,
                    courierName: selectedCourier.value.name
                },
                paymentInfo: {
                    method: form.value.paymentMethod
                },
                items: cartStore.items,
                summary: {
                    subtotal: cartStore.cartTotal,
                    shipping: selectedCourier.value.price,
                    total: finalTotal.value
                }
            };

            const response = await axios.post('http://localhost:5000/server/orders', payload);

            if (response.data.success) {
                if (authStore.user && form.value.saveDetails) {
                    authStore.user.phone = form.value.phone;
                    authStore.user.address = form.value.address;
                    localStorage.setItem('nexum_user', JSON.stringify(authStore.user));
                }

                generatedOrderNumber.value = response.data.orderNumber;
                orderPlacedSuccess.value = true;
                cartStore.clearCart(); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            errorMessage.value = "A apărut o problemă la server. Încearcă din nou.";
        } finally {
            isProcessing.value = false;
        }
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

    .opacity-80 { 
        opacity: 0.8; 
    }

    .opacity-70 { 
        opacity: 0.7; 
    }

    .checkout-panel {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
    }

    .bg-glass-cyan {
        background: rgba(16, 185, 129, 0.1); 
        border: 1px solid rgba(16, 185, 129, 0.3); 
    }

    .custom-input :deep(.v-field) {
        border-radius: 8px;
    }
    
    .custom-input :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .custom-input :deep(.v-field__outline) { 
        opacity: 0.5 !important; 
    }

    .custom-input :deep(input::placeholder), .custom-input :deep(textarea::placeholder) {
        color: var(--text-main) !important;
        opacity: 0.5 !important;
    }

    .courier-group :deep(.v-selection-control-group) {
        flex-direction: column;
    }

    .courier-card {
        background-color: var(--bg-main) !important;
        border: 1px solid var(--border-light);
        transition: all 0.3s ease;
    }

    .courier-card:hover {
        border-color: rgba(16, 185, 129, 0.4);
    }

    .active-courier {
        border-color: #10B981 !important;
        background-color: rgba(16, 185, 129, 0.05) !important;
    }

    .custom-checkbox :deep(.v-label) { 
        color: var(--text-main) !important; 
        opacity: 0.8; 
        font-size: 0.9rem;
    }

    .summary-items-list {
        max-height: 250px;
        overflow-y: auto;
    }

    .summary-items-list::-webkit-scrollbar { 
        width: 4px; 
    }

    .summary-items-list::-webkit-scrollbar-thumb { 
        background: rgba(16, 185, 129, 0.3); 
        border-radius: 10px; 
    }

    .premium-btn {
        background-color: #10B981 !important; 
        color: var(--bg-main) !important; 
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease;
    }
    .premium-btn:hover {
        background-color: #059669 !important;
        transform: translateY(-2px); 
    }

    .drop-shadow-cyan {
        filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6));
    }
</style>