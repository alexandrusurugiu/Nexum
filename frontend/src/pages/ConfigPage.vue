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
                <v-icon :color="currentStep === index ? '#10B981' : (selectedBuild[step.id] ? '#059669' : 'rgba(245,246,250,0.5)')" class="mr-2">
                  {{ step.icon }}
                </v-icon>
                <span class="font-weight-bold" :class="currentStep === index ? 'cyan-text' : 'cloud-text opacity-80'">
                  {{ step.name }}
                </span>
                <v-icon v-if="selectedBuild[step.id]" color="#059669" size="small" class="ml-2">mdi-check-circle</v-icon>
              </div>
            </div>
          </v-card>

          <h2 class="text-h5 font-weight-bold cloud-text mb-4">Alege {{ steps[currentStep].name }}</h2>
          
          <v-alert v-if="currentAvailableParts.length === 0" color="warning" variant="tonal" class="rounded-xl mt-4">
            <v-icon start>mdi-alert-circle</v-icon>
            Nu există componente compatibile cu restul sistemului tău în această categorie. Te rugăm să verifici alegerile anterioare.
          </v-alert>

          <v-row v-else>
            <v-col v-for="part in currentAvailableParts" :key="part.id" cols="12" sm="6" lg="4">
              <v-card 
                class="product-card h-100 d-flex flex-column rounded-xl cursor-pointer" 
                :class="{'selected-card border-cyan': selectedBuild[steps[currentStep].id]?.id === part.id}"
                elevation="0"
                @click="selectPart(steps[currentStep].id, part)"
              >
                <div class="img-container pa-4 text-center relative">
                  <v-img :src="part.image" height="150" contain class="product-img mx-auto"></v-img>
                </div>
                
                <v-card-text class="flex-grow-1 pt-4">
                  <span class="text-caption text-uppercase font-weight-bold cyan-text" style="letter-spacing: 1px;">{{ part.brand }}</span>
                  <h3 class="text-subtitle-1 font-weight-bold cloud-text mt-1 mb-2 line-clamp-2">{{ part.name }}</h3>
                  <div class="cloud-text opacity-50 text-caption">{{ part.shortSpec }}</div>
                </v-card-text>

                <v-card-actions class="pa-4 pt-0 d-flex justify-space-between align-end">
                  <div class="text-h6 font-weight-black cloud-text">{{ part.price }} <span class="text-body-2 cyan-text">Lei</span></div>
                  <v-btn 
                    :color="selectedBuild[steps[currentStep].id]?.id === part.id ? '#10B981' : '#059669'" 
                    variant="tonal" class="rounded-lg font-weight-bold"
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

              <v-divider class="border-opacity-25 mb-4" color="#10B981"></v-divider>

              <div v-if="totalWattage > 0" class="mb-5">
                <div class="d-flex justify-space-between align-end mb-2">
                  <div class="d-flex align-center">
                    <v-icon color="#f1c40f" size="small" class="mr-2 opacity-80">mdi-lightning-bolt</v-icon>
                    <span class="text-caption cloud-text opacity-80 text-uppercase font-weight-bold" style="letter-spacing: 1px;">Consum Energie</span>
                  </div>
                  <div class="text-right" style="line-height: 1;">
                    <span class="text-h6 font-weight-black" :class="isPsuWeak ? 'text-red-lighten-1' : 'cloud-text'">{{ totalWattage }}W</span>
                    <span v-if="selectedBuild.psu" class="text-caption cloud-text opacity-50 font-weight-medium"> / {{ selectedBuild.psu.psuWattage }}W</span>
                  </div>
                </div>
                
                <v-progress-linear
                  v-if="selectedBuild.psu"
                  :model-value="(totalWattage / selectedBuild.psu.psuWattage) * 100"
                  :color="isPsuWeak ? '#ff4757' : '#10B981'"
                  height="6"
                  rounded
                  bg-color="rgba(245, 246, 250, 0.05)"
                ></v-progress-linear>
              </div>

              <div class="mb-6 pa-3 rounded-lg transition-all d-flex align-center" :class="compatibilityStatus.colorClass">
                <v-icon :icon="compatibilityStatus.icon" class="mr-2"></v-icon>
                <span class="font-weight-bold text-body-2">{{ compatibilityStatus.message }}</span>
              </div>

              <div class="d-flex justify-space-between align-end mb-6">
                <span class="text-h6 cloud-text opacity-80">Total:</span>
                <span class="text-h4 font-weight-black cloud-text">{{ totalPrice }} <span class="text-h6 cyan-text">Lei</span></span>
              </div>

              <v-btn 
                block 
                size="x-large" 
                class="font-weight-bold rounded-lg" 
                :class="isPsuWeak ? 'bg-grey-darken-3 text-grey-lighten-1' : 'electric-btn'"
                :disabled="isPsuWeak"
                @click="addBuildToCart"
              >
                <v-icon start>{{ isPsuWeak ? 'mdi-power-plug-off' : 'mdi-cart-plus' }}</v-icon> 
                {{ isPsuWeak ? 'Alege o sursă mai puternică' : 'Adaugă Configurația' }}
              </v-btn>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import AppHeader from '../components/AppHeader.vue';
  import { useConfiguratorStore } from '../stores/configStore';
  import { useCartStore } from '../stores/cartStore';

  const configuratorStore = useConfiguratorStore();
  const cartStore = useCartStore();
  const { allParts } = storeToRefs(configuratorStore);

  onMounted(() => {
    configuratorStore.fetchParts();
  });

  const steps = [
    { id: 'cpu', name: 'Procesor', icon: 'mdi-cpu-64-bit' },
    { id: 'mb', name: 'Placă de Bază', icon: 'mdi-developer-board' },
    { id: 'ram', name: 'Memorie RAM', icon: 'mdi-memory' },
    { id: 'gpu', name: 'Placă Video', icon: 'mdi-expansion-card-variant' },
    { id: 'storage', name: 'Stocare', icon: 'mdi-harddisk' },
    { id: 'psu', name: 'Sursă', icon: 'mdi-power-plug' },
    { id: 'case', name: 'Carcasă', icon: 'mdi-desktop-tower' }
  ];

  const currentStep = ref(0);
  const selectedBuild = ref({}); 

  const groupedParts = computed(() => {
    const groups = { 
      cpu: [], mb: [], ram: [], gpu: [], storage: [], psu: [], case: [] 
    };
    
    allParts.value.forEach(p => {
      const getNum = (str) => str ? parseInt(str.replace(/[^0-9]/g, '')) : 0;
      
      let shortDesc = '';
      if (p.category === 'procesoare') shortDesc = `${p.specs?.cores || ''} Nuclee, ${p.specs?.frequency || ''}`;
      else if (p.category === 'placi_de_baza') shortDesc = `Socket ${p.specs?.socket}, ${p.specs?.memory_support || p.specs?.memory_type || 'DDR4/DDR5'}`;
      else if (p.category === 'memorie_ram') shortDesc = `${p.specs?.memory || p.specs?.capacity}, ${p.specs?.memory_type || ''}`;
      else if (p.category === 'placi_video') shortDesc = `${p.specs?.memory}, ${p.specs?.memory_type || ''}`;
      else if (p.category === 'stocare') shortDesc = `${p.specs?.capacity || p.specs?.memory}, ${p.specs?.type || ''}`;
      else if (p.category === 'surse') shortDesc = `${p.specs?.putere || 'N/A'}, ${p.specs?.certificare || ''}`;
      else if (p.category === 'carcase') shortDesc = `${p.specs?.format || 'N/A'}, ${p.specs?.sidePanel || ''}`;

      const formattedPart = {
        ...p,
        image: p.specs?.image || p.image || '',
        socket: p.specs?.socket,
        ramType: p.specs?.memory_type || p.specs?.memory_support || '',
        wattage: getNum(p.specs?.tdp) || getNum(p.specs?.consum) || 45, 
        psuWattage: getNum(p.specs?.putere) || 650, 
        shortSpec: shortDesc
      };

      if (p.category === 'procesoare') groups.cpu.push(formattedPart);
      else if (p.category === 'placi_de_baza') groups.mb.push(formattedPart);
      else if (p.category === 'memorie_ram') groups.ram.push(formattedPart);
      else if (p.category === 'placi_video') groups.gpu.push(formattedPart);
      else if (p.category === 'stocare') groups.storage.push(formattedPart);
      else if (p.category === 'surse') groups.psu.push(formattedPart);
      else if (p.category === 'carcase') groups.case.push(formattedPart);
    });
    
    return groups;
  });

  const isFormatCompatible = (mbFormat, caseSupportStr) => {
    if (!mbFormat || !caseSupportStr) return true; 
    
    let mb = mbFormat.toLowerCase().replace(/[^a-z]/g, ''); 
    if (mb.includes('micro') || mb === 'matx') mb = 'microatx';
    else if (mb.includes('mini') || mb === 'mitx') mb = 'miniitx';
    else if (mb.includes('extended') || mb === 'eatx') mb = 'eatx';
    else if (mb === 'atx') mb = 'atx';

    const supports = caseSupportStr.toLowerCase().split(',').map(s => {
        let form = s.replace(/[^a-z]/g, '');
        if (form.includes('micro') || form === 'matx') return 'microatx';
        if (form.includes('mini') || form === 'mitx') return 'miniitx';
        if (form.includes('extended') || form === 'eatx') return 'eatx';
        if (form === 'atx') return 'atx';
        return form;
    });

    return supports.includes(mb);
  };

  const checkCompatibility = (part) => {
    const category = steps[currentStep.value].id;
    
    if (category === 'mb' && selectedBuild.value.cpu) {
      if (part.socket && selectedBuild.value.cpu.socket && !part.socket.includes(selectedBuild.value.cpu.socket)) {
        return { isCompatible: false };
      }
    }
    if (category === 'cpu' && selectedBuild.value.mb) {
      if (part.socket && selectedBuild.value.mb.socket && !selectedBuild.value.mb.socket.includes(part.socket)) {
        return { isCompatible: false };
      }
    }

    if (category === 'ram' && selectedBuild.value.mb) {
      if (part.ramType && selectedBuild.value.mb.ramType && !selectedBuild.value.mb.ramType.includes(part.ramType)) {
        return { isCompatible: false };
      }
    }
    if (category === 'mb' && selectedBuild.value.ram) {
      if (part.ramType && selectedBuild.value.ram.ramType && !part.ramType.includes(selectedBuild.value.ram.ramType)) {
        return { isCompatible: false };
      }
    }

    if (category === 'case' && selectedBuild.value.mb) {
      const mbFormat = selectedBuild.value.mb.specs?.type || selectedBuild.value.mb.specs?.format; 
      const caseSupport = part.specs?.motherboardSupport; 
      
      if (mbFormat && caseSupport && !isFormatCompatible(mbFormat, caseSupport)) {
         return { isCompatible: false };
      }
    }
    if (category === 'mb' && selectedBuild.value.case) {
      const mbFormat = part.specs?.type || part.specs?.format; 
      const caseSupport = selectedBuild.value.case.specs?.motherboardSupport; 
      
      if (mbFormat && caseSupport && !isFormatCompatible(mbFormat, caseSupport)) {
         return { isCompatible: false };
      }
    }

    return { isCompatible: true };
  };

  const currentAvailableParts = computed(() => {
    const currentCategory = steps[currentStep.value].id;
    const parts = groupedParts.value[currentCategory] || [];
    
    return parts.filter(part => checkCompatibility(part).isCompatible);
  });

  const selectPart = (categoryId, part) => {
    selectedBuild.value[categoryId] = part;
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    }
  };

  const totalPrice = computed(() => {
    let total = 0;
    Object.values(selectedBuild.value).forEach(part => {
      total += part.price;
    });
    return total.toLocaleString('ro-RO'); 
  });

  const totalWattage = computed(() => {
    let watts = 0;
    Object.values(selectedBuild.value).forEach(part => {
      watts += (part.wattage || 0);
    });

    return watts > 0 ? watts + 75 : 0;
  });

  const isPsuWeak = computed(() => {
    return selectedBuild.value.psu && totalWattage.value > selectedBuild.value.psu.psuWattage;
  });

  const compatibilityStatus = computed(() => {
    const buildKeys = Object.keys(selectedBuild.value);
    
    if (buildKeys.length === 0) {
      return { message: 'Sistem Gol', icon: 'mdi-information', colorClass: 'bg-glass-neutral cloud-text' };
    }

    if (isPsuWeak.value) {
      return { message: 'Pericol: Sursă prea slabă!', icon: 'mdi-alert-octagon', colorClass: 'bg-glass-error text-white border-error shadow-error' };
    }

    if (buildKeys.length === steps.length) {
      return { message: 'Sistem Complet & Compatibil!', icon: 'mdi-check-decagram', colorClass: 'bg-glass-success text-white' };
    }

    return { message: 'Se asamblează. Toate bune.', icon: 'mdi-wrench', colorClass: 'bg-glass-cyan cyan-text' };
  });

  const addBuildToCart = () => {
    const parts = Object.values(selectedBuild.value);
    if(parts.length > 0) {
      parts.forEach(part => {
          cartStore.addToCart(part);
      });
      alert(`Am adăugat ${parts.length} componente în coșul tău!`);
    }
  };
</script>

<style scoped>
  .nexum-bg { 
    background-color: #121212 !important; 
  }

  .cloud-text { 
    color: #F3F4F6 !important; 
  }

  .cyan-text { 
    color: #10B981 !important; 
  }

  .opacity-50 { 
    opacity: 0.5; 
  }

  .opacity-80 { 
    opacity: 0.8; 
  }

  .cursor-pointer { 
    cursor: pointer; 
  }

  .relative { 
    position: relative; 
  }

  .absolute-top-right { 
    position: absolute; 
    top: 10px; 
    right: 10px; 
    z-index: 2;
  }

  .whitespace-nowrap { 
    white-space: nowrap; 
  }

  .category-wrapper {
    background-color: #1E1E1E;
    border-top: 2px solid #10B981;
  }

  .hide-scrollbar::-webkit-scrollbar { 
    display: none; 
  }

  .step-item {
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .step-item:hover { 
    background: rgba(245, 246, 250, 0.05); 
  }

  .active-step { 
    background: rgba(16, 185, 129, 0.1) !important; 
    border: 1px solid rgba(16, 185, 129, 0.3); 
  }

  .product-card {
    background-color: #1E1E1E !important; 
    border: 1px solid rgba(245, 246, 250, 0.05);
    transition: all 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-5px); 
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
  }

  .selected-card {
    border-color: #10B981 !important;
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2) !important;
  }

  .img-container { 
    background-color: rgba(30, 39, 46, 0.5); 
    border-bottom: 1px solid rgba(245, 246, 250, 0.05); 
  }

  .sticky-summary {
    position: sticky;
    top: 100px; 
  }

  .summary-card {
    background-color: #1E1E1E !important;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .transition-all {
    transition: all 0.3s ease;
  }

  .bg-glass-neutral { 
    background: rgba(245, 246, 250, 0.05); 
    border: 1px solid transparent;
  }

  .bg-glass-cyan {
    background: rgba(16, 185, 129, 0.1); 
    border: 1px solid rgba(16, 185, 129, 0.3); 
  }

  .bg-glass-error { 
    background: rgba(255, 71, 87, 0.15); 
  }

  .bg-glass-success { 
    background: rgba(46, 213, 115, 0.2); 
    border: 1px solid rgba(46, 213, 115, 0.5); 
  }

  .border-error {
    border: 1px solid #ff4757 !important;
  }

  .shadow-error {
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.3);
  }

  .electric-btn {
    background: linear-gradient(45deg, #059669, #10B981) !important; 
    color: #F3F4F6 !important;
    letter-spacing: 1px; 
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .electric-btn:hover {
    transform: translateY(-2px); 
    box-shadow: 0 8px 20px -5px rgba(16, 185, 129, 0.6) !important;
  }
</style>