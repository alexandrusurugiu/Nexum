<template>
  <v-app class="nexum-bg">
    <AppHeader></AppHeader>

    <v-main>
      <v-container fluid class="pa-0">
        <v-row no-gutters class="hero-section align-center justify-center">
          <div class="hero-overlay"></div>
            
          <v-col cols="12" md="8" class="z-index-1 px-4 text-center d-flex flex-column align-center">
            <v-chip color="#10B981" variant="outlined" class="mb-6 font-weight-bold px-5 py-3 custom-chip text-body-1">
              <v-icon start icon="mdi-lightning-bolt" color="#10B981"></v-icon> 
              SĂPTĂMÂNA HARDCORE: PÂNĂ LA -25% LA PLĂCI VIDEO
            </v-chip>
              
            <h1 class="text-h3 text-md-h2 font-weight-black cloud-text mb-4">
              Setup-ul tău, <span class="cyan-text">piesă cu piesă</span>
            </h1>
              
            <p class="text-h6 text-md-h5 cloud-text font-weight-light mb-10 opacity-80" style="max-width: 700px;">
              Componente de ultimă generație pentru următorul tău build. Simplu, rapid și mereu compatibil.
            </p>
              
            <v-btn to="/configurator" size="x-large" class="premium-btn font-weight-black px-10 py-6 text-h6 rounded-pill d-flex align-center justify-center">
              CONFIGUREAZĂ-ȚI PROPRIUL PC
              <v-icon end icon="mdi-arrow-right" class="ml-2"></v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <div style="background-color: var(--bg-main);" class="pt-16 pb-16 px-4 px-md-10">
          <div class="d-flex align-center justify-space-between mb-10">
            <div>
              <h2 class="text-h4 font-weight-bold cloud-text">Recomandările noastre bazate pe <span class="cyan-text">selecția</span> ta</h2>
              <div class="title-underline mt-2"></div>
            </div>

            <v-btn variant="text" color="#10B981" class="font-weight-bold text-body-1">
              Vezi toate <v-icon end icon="mdi-chevron-right"></v-icon>
            </v-btn>
          </div>

          <v-row>
            <v-col v-for="product in recommendedProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
              <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                <v-chip v-if="product.discount" color="#059669" class="discount-badge font-weight-bold" size="small">
                  -{{ product.discount }}%
                </v-chip>

                <div class="img-container pa-4 text-center">
                  <v-img :src="product.image" height="200" contain class="product-img mx-auto"></v-img>
                </div>
                  
                <v-card-text class="flex-grow-1 pt-4">
                  <span class="text-caption text-uppercase font-weight-bold" style="color: #10B981; letter-spacing: 1px;">
                    {{ product.brand }}
                  </span>
                  <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                    {{ product.name }}
                  </h3>
                    
                  <div class="quick-specs">
                    <div v-for="(spec, index) in product.specs" :key="index" class="d-flex align-center mb-1">
                      <v-icon size="small" color="#10B981" class="mr-2 opacity-80">mdi-circle-small</v-icon>
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
                    
                  <v-btn icon color="#059669" variant="tonal" class="cart-btn rounded-lg" @click="addToCart" title="Adaugă în coș">
                    <v-icon>mdi-cart-plus</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import AppHeader from '@/components/AppHeader.vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const cartCount = ref(0);
  const addToCart = () => { cartCount.value++; };

  const recommendedProducts = ref([
    {
      id: 1, name: 'Placă Video GIGABYTE GeForce RTX 4080 SUPER WINDFORCE', brand: 'NVIDIA', price: '5.299', oldPrice: '5.899', discount: 10,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
      specs: ['Memorie: 16GB GDDR6X', 'Răcire: 3 Ventilatoare', 'Interfață: PCI Express 4.0']
    },
    {
      id: 2, name: 'Procesor AMD Ryzen 7 7800X3D, 4.2GHz/5.0GHz', brand: 'AMD', price: '1.950', oldPrice: null, discount: null,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      specs: ['Socket: AM5', 'Nuclee: 8 Cores / 16 Threads', 'Tehnologie: 3D V-Cache']
    },
    {
      id: 3, name: 'Placă de bază ASUS ROG STRIX B650E-F GAMING WIFI', brand: 'ASUS', price: '1.420', oldPrice: '1.550', discount: 8,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      specs: ['Socket: AM5', 'Chipset: B650E', 'Format: ATX']
    },
    {
      id: 4, name: 'Memorie Corsair Dominator Platinum RGB 32GB DDR5', brand: 'CORSAIR', price: '850', oldPrice: null, discount: null,
      image: 'https://images.unsplash.com/photo-1562976540-1502f75a6109?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      specs: ['Tip memorie: DDR5', 'Capacitate: 2x 16GB', 'Iluminare: A-RGB']
    }
  ]);
</script>

<style scoped>
  .nexum-bg { 
    background-color: var(--bg-main) !important; 
  }

  .z-index-1 {
    z-index: 1; 
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

  .premium-btn {
    background-color: #10B981 !important;
    color: var(--bg-main) !important; 
    letter-spacing: 1px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) !important;
  }

  .premium-btn:hover {
    transform: translateY(-4px);
    background-color: #059669 !important;
    color: var(--text-main) !important;
    box-shadow: 0 12px 25px rgba(16, 185, 129, 0.3) !important;
  }

  .hero-section {
    position: relative;
    background-image: url('https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
    background-size: cover; 
    background-position: center;
    background-attachment: fixed; 
    height: 75vh;
  }
  
  .hero-overlay {
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    background: radial-gradient(circle at center, rgba(18, 18, 18, 0.6) 0%, var(--bg-main) 100%); 
    z-index: 0;
  }
  
  .custom-chip { 
    backdrop-filter: blur(5px); 
    background: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(16, 185, 129, 0.4) !important;
  }

  .title-underline {
    height: 4px; width: 60px;
    background: #10B981; 
    border-radius: 2px;
  }

  .product-card {
    background-color: var(--bg-panel) !important; 
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .product-card:hover {
    transform: translateY(-8px);
    border-color: rgba(16, 185, 129, 0.4); 
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6) !important;
  }

  .img-container {
    background-color: #F3F4F6 !important;
    border-bottom: 1px solid var(--border-light);
  }

  .product-img {
    transition: transform 0.5s ease;
    mix-blend-mode: screen; 
  }

  .product-card:hover .product-img {
    transform: scale(1.08);
  }

  .discount-badge {
    position: absolute; 
    top: 16px; 
    right: 16px; 
    z-index: 2;
    box-shadow: 0 4px 10px rgba(5, 150, 105, 0.4);
  }

  .line-clamp-2 {
    display: -webkit-box; 
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;  
    overflow: hidden; 
    min-height: 3rem;
  }

  .quick-specs {
    border-top: 1px solid rgba(243, 244, 246, 0.1);
    padding-top: 12px;
  }

  .cart-btn {
    background-color: rgba(5, 150, 105, 0.1) !important;
    transition: all 0.3s ease;
  }
  
  .cart-btn:hover {
    background-color: #059669 !important;
    color: var(--text-main) !important;
    transform: scale(1.1);
  }
</style>