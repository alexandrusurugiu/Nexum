<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            
            <div class="mb-8 d-flex flex-column flex-sm-row justify-space-between align-sm-end">
                <div>
                    <h1 class="text-h3 font-weight-black cloud-text">Coșul tău</h1>
                    <p class="text-body-1 cloud-text opacity-80 mt-2 mb-0">
                        Revizuiește produsele înainte de a plasa comanda.
                    </p>
                </div>

                <v-btn 
                    v-if="cartStore.items.length > 0"
                    color="#ef4444" 
                    variant="tonal" 
                    class="rounded-lg font-weight-bold mt-4 mt-sm-0 px-6 transition-all" 
                    prepend-icon="mdi-delete-sweep-outline"
                    @click="handleClearCart"
                >
                    Golește Coșul
                </v-btn>
            </div>

            <v-row v-if="cartStore.items.length === 0">
                <v-col cols="12">
                    <div class="text-center py-16 cart-panel rounded-xl w-100">
                        <v-icon size="80" color="rgba(243, 244, 246, 0.1)" class="mb-4">mdi-cart-outline</v-icon>
                        <h2 class="cloud-text opacity-80">Coșul tău este gol</h2>
                        <v-btn color="#10B981" variant="tonal" class="mt-6 font-weight-bold" to="/home">
                            Înapoi la cumpărături
                        </v-btn>
                    </div>
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col cols="12" md="8">
                    
                    <v-card 
                        v-for="item in cartStore.items" 
                        :key="item.id" 
                        class="cart-item-card mb-4 rounded-xl d-flex flex-column flex-sm-row overflow-hidden" 
                        elevation="5"
                    >
                        <div class="cart-img-box d-flex align-center justify-center pa-4 flex-shrink-0">
                            <v-img :src="item.image" max-width="140" max-height="120" contain class="product-img"></v-img>
                        </div>
                        
                        <div class="cart-details pa-4 flex-grow-1 d-flex flex-column justify-center" style="min-width: 0;">
                            <span class="text-caption cyan-text font-weight-bold text-truncate" style="letter-spacing: 1px;">{{ item.brand }}</span>
                            <h3 class="text-h6 cloud-text font-weight-bold line-clamp-2 my-1" style="line-height: 1.3;" :title="item.name"> {{ item.name }} </h3>
                            <div class="text-h5 cyan-text font-weight-black mt-auto">{{ item.price }} Lei</div>
                        </div>

                        <div class="cart-actions pa-4 d-flex flex-row flex-sm-column align-center justify-space-between justify-sm-center flex-shrink-0"> 
                            <div class="d-flex align-center quantity-controls pa-1 rounded-lg mb-sm-4">
                                <v-btn icon size="small" variant="text" color="var(--text-main)" @click="cartStore.removeFromCart(item.id)">
                                    <v-icon>mdi-minus</v-icon>
                                </v-btn>

                                <span class="cloud-text font-weight-bold px-3 text-h6">{{ item.quantity }}</span>

                                <v-btn icon size="small" variant="text" color="var(--text-main)" @click="cartStore.addToCart(item)">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </div>

                            <v-btn icon color="#ef4444" variant="tonal" class="rounded-lg mt-0 mt-sm-auto align-self-end align-self-sm-center" @click="cartStore.removeFromCart(item.id, true)" title="Șterge produsul">
                                <v-icon>mdi-delete-outline</v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card class="cart-panel pa-6 rounded-xl" elevation="10" style="position: sticky; top: 100px;">
                        <h3 class="text-h5 font-weight-bold cloud-text mb-6">Sumar Comandă</h3>
                        
                        <div class="d-flex justify-space-between mb-4 cloud-text opacity-80">
                            <span>Produse ({{ cartStore.cartCount }}):</span>
                            <span>{{ cartStore.cartTotal }} Lei</span>
                        </div>
                        <div class="d-flex justify-space-between mb-6 cloud-text opacity-80">
                            <span>Transport:</span>
                            <span class="cyan-text font-weight-bold">Gratuit</span>
                        </div>

                        <v-divider class="border-opacity-25 mb-6" color="#10B981"></v-divider>

                        <div class="d-flex justify-space-between mb-6">
                            <span class="text-h6 cloud-text font-weight-bold">Total:</span>
                            <span class="text-h4 cyan-text font-weight-black">{{ cartStore.cartTotal }} Lei</span>
                        </div>

                        <v-btn block size="x-large" class="rounded-lg font-weight-bold premium-btn" @click="checkout">
                            Finalizează Comanda
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useCartStore } from '../stores/cartStore';
    import AppHeader from '../components/AppHeader.vue';

    const cartStore = useCartStore();

    onMounted(() => {
        cartStore.fetchCart();
    });

    const checkout = () => {
        alert("Modulul de plată urmează să fie implementat!");
    };

    const handleClearCart = () => {
        if(confirm("Ești sigur că vrei să ștergi absolut toate produsele din coș?")) {
            cartStore.clearCart();
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
    
    .cart-panel {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
    }
    
    .cart-item-card {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
        min-height: 160px; 
    }

    .cart-img-box {
        width: 100%;
        min-height: 140px;
        background-color: #F3F4F6 !important;
        box-shadow: inset -5px 0 15px rgba(0, 0, 0, 0.03);
    }

    @media (min-width: 600px) {
        .cart-img-box {
            width: 180px; 
            height: auto;
        }
        .cart-actions {
            min-width: 130px;
            border-left: 1px solid var(--border-light);
        }
    }

    .product-img {
        mix-blend-mode: multiply; 
        filter: contrast(1.05);
    }

    .quantity-controls { 
        background-color: var(--bg-panel); 
        border: 1px solid rgba(243, 244, 246, 0.1);
    }

    .premium-btn {
        background-color: #10B981 !important; 
        color: var(--bg-main) !important; 
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.3s ease;
    }

    .premium-btn:hover {
        background-color: #059669 !important;
        color: var(--text-main) !important;
        transform: translateY(-2px); 
        box-shadow: 0 12px 25px rgba(16, 185, 129, 0.25) !important;
    }

    .transition-all {
        transition: all 0.3s ease;
    }

    .line-clamp-2 {
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical; 
        overflow: hidden;
        min-height: 3rem;
    }
</style>