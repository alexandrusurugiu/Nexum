<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Coșul tău</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Revizuiește produsele înainte de a plasa comanda.
                </p>
            </div>

            <v-row>
                <v-col cols="12" md="8">
                    <div v-if="cartStore.items.length === 0" class="text-center py-16 cart-panel rounded-xl">
                        <v-icon size="80" color="rgba(245, 246, 250, 0.2)" class="mb-4">mdi-cart-outline</v-icon>
                        <h2 class="cloud-text opacity-80">Coșul tău este gol</h2>
                        <v-btn color="#00CEC9" variant="tonal" class="mt-6" to="/home">Înapoi la cumpărături</v-btn>
                    </div>

                    <v-card v-else v-for="item in cartStore.items" :key="item.id" class="cart-panel mb-4 pa-4 rounded-xl d-flex align-center flex-wrap" elevation="5">
                        <v-img :src="item.image" max-width="100" height="100" contain class="rounded-lg mr-4 bg-black opacity-80"></v-img>
                        
                        <div class="flex-grow-1 min-w-200">
                            <span class="text-caption cyan-text font-weight-bold">{{ item.brand }}</span>
                            <h3 class="text-h6 cloud-text font-weight-bold line-clamp-1">{{ item.name }}</h3>
                            <div class="text-h6 cyan-text font-weight-black mt-2">{{ item.price }} Lei</div>
                        </div>

                        <div class="d-flex align-center mr-4 mt-4 mt-sm-0 bg-dark-blue pa-1 rounded-lg border-cyan">
                            <v-btn icon size="small" variant="text" color="#F5F6FA" @click="cartStore.removeFromCart(item.id)">
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <span class="cloud-text font-weight-bold px-4 text-h6">{{ item.quantity }}</span>
                            <v-btn icon size="small" variant="text" color="#F5F6FA" @click="cartStore.addToCart(item)">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </div>

                        <v-btn icon color="error" variant="tonal" class="mt-4 mt-sm-0 rounded-lg" @click="cartStore.removeFromCart(item.id, true)" title="Șterge produsul">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4" v-if="cartStore.items.length > 0">
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

                        <v-divider class="border-opacity-25 mb-6" color="#00CEC9"></v-divider>

                        <div class="d-flex justify-space-between mb-6">
                            <span class="text-h6 cloud-text font-weight-bold">Total:</span>
                            <span class="text-h4 cyan-text font-weight-black">{{ cartStore.cartTotal }} Lei</span>
                        </div>

                        <v-btn block color="#0984E3" size="x-large" class="rounded-lg font-weight-bold neon-btn" @click="checkout">
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

    .min-w-200 { 
        min-width: 200px; 
    }
    
    .cart-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
    }
    
    .bg-dark-blue { 
        background-color: rgba(30, 39, 46, 0.8); 
    }

    .border-cyan { 
        border: 1px solid rgba(0, 206, 201, 0.3); 
    }

    .neon-btn {
        box-shadow: 0 0 15px rgba(9, 132, 227, 0.5);
        transition: all 0.3s ease;
    }

    .neon-btn:hover {
        box-shadow: 0 0 25px rgba(9, 132, 227, 0.8);
        transform: translateY(-2px);
    }

    .line-clamp-1 {
        display: -webkit-box; 
        -webkit-line-clamp: 1; 
        -webkit-box-orient: vertical; 
        overflow: hidden;
    }
</style>