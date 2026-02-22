<template>
  <v-app class="nexum-bg">
    <AppHeader></AppHeader>

    <v-main class="pb-16 px-4 px-md-10 mt-16">
      
      <div class="mb-8 d-flex justify-space-between align-end">
        <div>
          <h1 class="text-h3 font-weight-black cloud-text">Configurator <span class="cyan-text">Sistem</span></h1>
          <p class="text-body-1 cloud-text opacity-80 mt-2">
            Construiește-ți setup-ul perfect. Verificăm noi compatibilitatea pentru tine.
          </p>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="8" lg="9">
          
          <v-card class="pa-4 rounded-xl mb-6 category-wrapper" elevation="10">
            <div class="d-flex overflow-x-auto hide-scrollbar">
              <div 
                v-for="(step, index) in steps" 
                :key="step.id"
                @click="currentStep = index"
                class="step-item d-flex align-center px-4 py-2 mx-1 rounded-lg"
                :class="{ 'active-step': currentStep === index, 'completed-step': selectedBuild[step.id] }"
              >
                <v-icon :color="currentStep === index ? '#00CEC9' : (selectedBuild[step.id] ? '#0984E3' : 'rgba(245,246,250,0.5)')" class="mr-2">
                  {{ step.icon }}
                </v-icon>
                <span class="font-weight-bold" :class="currentStep === index ? 'cyan-text' : 'cloud-text opacity-80'">
                  {{ step.name }}
                </span>
                <v-icon v-if="selectedBuild[step.id]" color="#0984E3" size="small" class="ml-2">mdi-check-circle</v-icon>
              </div>
            </div>
          </v-card>

          <h2 class="text-h5 font-weight-bold cloud-text mb-4">Alege {{ steps[currentStep].name }}</h2>
          
          <v-row>
            <v-col v-for="part in currentAvailableParts" :key="part.id" cols="12" sm="6" lg="4">
              <v-card 
                class="product-card h-100 d-flex flex-column rounded-xl cursor-pointer" 
                :class="{'selected-card border-cyan': selectedBuild[steps[currentStep].id]?.id === part.id}"
                elevation="0"
                @click="selectPart(steps[currentStep].id, part)"
              >
                <div class="img-container pa-4 text-center relative">
                  <v-chip 
                    v-if="!checkCompatibility(part).isCompatible" 
                    color="error" size="small" class="absolute-top-right font-weight-bold"
                  >
                    Incompatibil
                  </v-chip>
                  <v-img :src="part.image" height="150" contain class="product-img mx-auto" :class="{'opacity-50': !checkCompatibility(part).isCompatible}"></v-img>
                </div>
                
                <v-card-text class="flex-grow-1 pt-4">
                  <span class="text-caption text-uppercase font-weight-bold cyan-text" style="letter-spacing: 1px;">{{ part.brand }}</span>
                  <h3 class="text-subtitle-1 font-weight-bold cloud-text mt-1 mb-2 line-clamp-2">{{ part.name }}</h3>
                  <div class="cloud-text opacity-50 text-caption">{{ part.shortSpec }}</div>
                </v-card-text>

                <v-card-actions class="pa-4 pt-0 d-flex justify-space-between align-end">
                  <div class="text-h6 font-weight-black cloud-text">{{ part.price }} <span class="text-body-2 cyan-text">Lei</span></div>
                  <v-btn 
                    :color="selectedBuild[steps[currentStep].id]?.id === part.id ? '#00CEC9' : '#0984E3'" 
                    variant="tonal" class="rounded-lg font-weight-bold"
                    :disabled="!checkCompatibility(part).isCompatible"
                  >
                    {{ selectedBuild[steps[currentStep].id]?.id === part.id ? 'Selectat' : 'Alege' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

        </v-col>

        <v-col cols="12" md="4" lg="3">
          <div class="sticky-summary">
            <v-card class="summary-card pa-5 rounded-xl" elevation="10">
              <h3 class="text-h5 font-weight-black cloud-text mb-4">Sistemul Tău</h3>
              
              <div class="build-list mb-6">
                <div v-for="step in steps" :key="'summary-'+step.id" class="mb-3">
                  <div class="text-caption cyan-text text-uppercase font-weight-bold">{{ step.name }}</div>
                  <div v-if="selectedBuild[step.id]" class="d-flex justify-space-between align-start mt-1">
                    <span class="cloud-text text-body-2 font-weight-medium pr-2">{{ selectedBuild[step.id].name }}</span>
                    <span class="cloud-text text-body-2 font-weight-bold whitespace-nowrap">{{ selectedBuild[step.id].price }} Lei</span>
                  </div>
                  <div v-else class="cloud-text opacity-50 text-body-2 mt-1 font-italic">Neselectat</div>
                </div>
              </div>

              <v-divider class="border-opacity-25 mb-4" color="#00CEC9"></v-divider>

              <div class="mb-4 pa-3 rounded-lg" :class="compatibilityStatus.colorClass">
                <div class="d-flex align-center">
                  <v-icon :icon="compatibilityStatus.icon" class="mr-2"></v-icon>
                  <span class="font-weight-bold text-body-2">{{ compatibilityStatus.message }}</span>
                </div>
                <div v-if="totalWattage > 0" class="mt-2 text-caption opacity-80">
                  Consum estimat: <strong>{{ totalWattage }}W</strong>
                </div>
              </div>

              <div class="d-flex justify-space-between align-end mb-6">
                <span class="text-h6 cloud-text opacity-80">Total:</span>
                <span class="text-h4 font-weight-black cloud-text">{{ totalPrice }} <span class="text-h6 cyan-text">Lei</span></span>
              </div>

              <v-btn block size="x-large" class="electric-btn font-weight-bold rounded-lg" @click="addBuildToCart">
                <v-icon start>mdi-cart-plus</v-icon> Adaugă Configurația
              </v-btn>
            </v-card>
          </div>
        </v-col>

      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';

const cartCount = ref(0);

// Definim pașii configuratorului
const steps = [
  { id: 'cpu', name: 'Procesor', icon: 'mdi-cpu-64-bit' },
  { id: 'mb', name: 'Placă de Bază', icon: 'mdi-developer-board' },
  { id: 'ram', name: 'Memorie RAM', icon: 'mdi-memory' },
  { id: 'gpu', name: 'Placă Video', icon: 'mdi-expansion-card-variant' },
  { id: 'storage', name: 'Stocare', icon: 'mdi-harddisk' },
  { id: 'psu', name: 'Sursă', icon: 'mdi-power-plug' }
];

const currentStep = ref(0);
const selectedBuild = ref({}); // Aici stocăm ce piese a ales utilizatorul

// Baza de date (Mock) pentru piese, cu atribute tehnice pentru compatibilitate
const allParts = {
  cpu: [
    { id: 'c1', brand: 'AMD', name: 'Ryzen 7 7800X3D', price: 1950, socket: 'AM5', wattage: 120, shortSpec: '8 Cores, 3D V-Cache', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&w=300&q=80' },
    { id: 'c2', brand: 'INTEL', name: 'Core i9-14900K', price: 2850, socket: 'LGA1700', wattage: 253, shortSpec: '24 Cores, up to 6.0GHz', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&w=300&q=80' }
  ],
  mb: [
    { id: 'm1', brand: 'ASUS', name: 'ROG STRIX B650E-F', price: 1420, socket: 'AM5', ramType: 'DDR5', wattage: 40, shortSpec: 'AM5, DDR5, PCIe 5.0', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&w=300&q=80' },
    { id: 'm2', brand: 'MSI', name: 'MAG Z790 TOMAHAWK', price: 1350, socket: 'LGA1700', ramType: 'DDR5', wattage: 40, shortSpec: 'LGA1700, DDR5, Wi-Fi 6E', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&w=300&q=80' }
  ],
  ram: [
    { id: 'r1', brand: 'CORSAIR', name: 'Dominator 32GB 6000MHz', price: 850, ramType: 'DDR5', wattage: 10, shortSpec: '2x16GB, DDR5, RGB', image: 'https://images.unsplash.com/photo-1562976540-1502f75a6109?ixlib=rb-4.0.3&w=300&q=80' },
    { id: 'r2', brand: 'KINGSTON', name: 'Fury Beast 16GB 3200MHz', price: 250, ramType: 'DDR4', wattage: 5, shortSpec: '2x8GB, DDR4', image: 'https://images.unsplash.com/photo-1562976540-1502f75a6109?ixlib=rb-4.0.3&w=300&q=80' }
  ],
  gpu: [
    { id: 'g1', brand: 'NVIDIA', name: 'RTX 4080 SUPER', price: 5299, wattage: 320, shortSpec: '16GB GDDR6X', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&w=300&q=80' },
    { id: 'g2', brand: 'AMD', name: 'Radeon RX 7800 XT', price: 2799, wattage: 263, shortSpec: '16GB GDDR6', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&w=300&q=80' }
  ],
  storage: [
    { id: 's1', brand: 'SAMSUNG', name: '990 PRO 2TB', price: 899, wattage: 8, shortSpec: 'NVMe M.2 Gen4', image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?ixlib=rb-4.0.3&w=300&q=80' }
  ],
  psu: [
    { id: 'p1', brand: 'CORSAIR', name: 'RM850x 50W', price: 750, psuWattage: 850, wattage: 0, shortSpec: '80+ Gold, Full Modular', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&w=300&q=80' },
    { id: 'p2', brand: 'SEASONIC', name: 'Focus GX-1000W', price: 950, psuWattage: 1000, wattage: 0, shortSpec: '80+ Gold, ATX 3.0', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&w=300&q=80' }
  ]
};

// Returnează piesele disponibile pentru pasul curent
const currentAvailableParts = computed(() => {
  const currentCategory = steps[currentStep.value].id;
  return allParts[currentCategory] || [];
});

// Funcția de selectare a unei piese
const selectPart = (categoryId, part) => {
  if (!checkCompatibility(part).isCompatible) return; // Blochează selecția dacă e incompatibil
  
  selectedBuild.value[categoryId] = part;
  // Trece automat la pasul următor dacă nu e la final
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

// ==========================================
// MOTORUL DE COMPATIBILITATE (SMART CHECK)
// ==========================================
const checkCompatibility = (part) => {
  const category = steps[currentStep.value].id;
  
  // 1. Verificare Socket (Placă de bază vs Procesor)
  if (category === 'mb' && selectedBuild.value.cpu) {
    if (part.socket !== selectedBuild.value.cpu.socket) {
      return { isCompatible: false, reason: `Necesită socket ${selectedBuild.value.cpu.socket}` };
    }
  }
  if (category === 'cpu' && selectedBuild.value.mb) {
    if (part.socket !== selectedBuild.value.mb.socket) {
      return { isCompatible: false, reason: `Placa de bază are socket ${selectedBuild.value.mb.socket}` };
    }
  }

  // 2. Verificare RAM (DDR4 vs DDR5)
  if (category === 'ram' && selectedBuild.value.mb) {
    if (part.ramType !== selectedBuild.value.mb.ramType) {
      return { isCompatible: false, reason: `Placa de bază suportă doar ${selectedBuild.value.mb.ramType}` };
    }
  }

  return { isCompatible: true };
};

// Calculează costul total
const totalPrice = computed(() => {
  let total = 0;
  Object.values(selectedBuild.value).forEach(part => {
    total += part.price;
  });
  // Formatare cu punct (ex: 5.200)
  return total.toLocaleString('ro-RO'); 
});

// Calculează consumul de energie estimat
const totalWattage = computed(() => {
  let watts = 0;
  Object.values(selectedBuild.value).forEach(part => {
    watts += (part.wattage || 0);
  });
  return watts > 0 ? watts + 50 : 0; // Adăugăm 50W marjă de eroare pentru ventilatoare etc.
});

// Statusul general al sistemului afișat în panoul din dreapta
const compatibilityStatus = computed(() => {
  const buildKeys = Object.keys(selectedBuild.value);
  if (buildKeys.length === 0) {
    return { message: 'Sistem Gol', icon: 'mdi-information', colorClass: 'bg-glass-neutral text-cloud' };
  }

  // Verificăm dacă sursa (PSU) este suficient de puternică
  if (selectedBuild.value.psu && totalWattage.value > selectedBuild.value.psu.psuWattage) {
    return { message: 'Avertisment: Sursă prea slabă!', icon: 'mdi-alert', colorClass: 'bg-glass-error text-white' };
  }

  if (buildKeys.length === steps.length) {
    return { message: 'Sistem Complet & Compatibil!', icon: 'mdi-check-decagram', colorClass: 'bg-glass-success text-white' };
  }

  return { message: 'Se asamblează. Toate bune.', icon: 'mdi-wrench', colorClass: 'bg-glass-cyan cyan-text' };
});

const addBuildToCart = () => {
  const partsCount = Object.keys(selectedBuild.value).length;
  if(partsCount > 0) {
    cartCount.value += partsCount; // Adăugăm în coș numărul de piese alese
    alert('Sistemul a fost adăugat în coș!');
  }
};
</script>

<style scoped>
.nexum-bg { background-color: #1E272E !important; }
.cloud-text { color: #F5F6FA !important; }
.cyan-text { color: #00CEC9 !important; }
.opacity-50 { opacity: 0.5; }
.opacity-80 { opacity: 0.8; }
.cursor-pointer { cursor: pointer; }
.relative { position: relative; }
.absolute-top-right { position: absolute; top: 10px; right: 10px; z-index: 2;}
.whitespace-nowrap { white-space: nowrap; }

.category-wrapper {
  background-color: #253038;
  border-top: 2px solid #00CEC9;
}

/* Bara de pași (Steper) */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.step-item {
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.step-item:hover { background: rgba(245, 246, 250, 0.05); }
.active-step { background: rgba(0, 206, 201, 0.1) !important; border: 1px solid rgba(0, 206, 201, 0.3); }

/* Cardul de produs */
.product-card {
  background-color: #253038 !important; border: 1px solid rgba(245, 246, 250, 0.05);
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px); border-color: rgba(0, 206, 201, 0.3);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5) !important;
}
.selected-card {
  border-color: #00CEC9 !important;
  box-shadow: 0 0 15px rgba(0, 206, 201, 0.2) !important;
}
.img-container { background-color: rgba(30, 39, 46, 0.5); border-bottom: 1px solid rgba(245, 246, 250, 0.05); }

/* Panoul din dreapta (Sticky) */
.sticky-summary {
  position: sticky;
  top: 100px; /* Stă la 100px de sus când dai scroll */
}
.summary-card {
  background-color: #253038 !important;
  border: 1px solid rgba(0, 206, 201, 0.2);
}

/* Status Colors (Glassmorphism) */
.bg-glass-neutral { background: rgba(245, 246, 250, 0.05); }
.bg-glass-cyan { background: rgba(0, 206, 201, 0.1); border: 1px solid rgba(0, 206, 201, 0.3); }
.bg-glass-error { background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.5); }
.bg-glass-success { background: rgba(46, 213, 115, 0.2); border: 1px solid rgba(46, 213, 115, 0.5); }

.electric-btn {
  background: linear-gradient(45deg, #0984E3, #00CEC9) !important; color: #F5F6FA !important;
  letter-spacing: 1px; transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.electric-btn:hover {
  transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(0, 206, 201, 0.6) !important;
}
</style>