<template>
  <v-app :theme="themeStore.isDark ? 'dark' : 'light'" class="nexum-bg" :class="!themeStore.isDark ? 'light-mode' : ''">
    <AppHeader></AppHeader>

    <v-main class="pb-16 px-4 px-md-10 mt-16">
      <div class="mb-8 d-flex flex-column flex-md-row justify-space-between align-md-end">
        <div class="mb-4 mb-md-0">
          <h1 class="text-h3 font-weight-black cloud-text">Configurator <span class="cyan-text">Sistem</span></h1>
          <p class="text-body-1 cloud-text opacity-80 mt-2">
            Construiește-ți setup-ul perfect. Verificăm noi compatibilitatea pentru tine.
          </p>
        </div>
        
        <v-btn 
          size="x-large" 
          class="ai-magic-btn font-weight-bold rounded-pill" 
          @click="aiDialog = true"
        >
          <v-icon start size="large">mdi-creation</v-icon>
          Nexum AI Builder
        </v-btn>
      </div>

      <v-dialog v-model="aiDialog" max-width="600" persistent>
        <v-card class="bg-panel rounded-xl ai-dialog-border pa-2">
          <v-card-title class="d-flex justify-space-between align-center pt-4 px-6">
            <div class="d-flex align-center">
              <v-icon color="#10B981" size="32" class="mr-3">mdi-robot-outline</v-icon>
              <h3 class="text-h5 font-weight-black cloud-text m-0">Asistent AI</h3>
            </div>
            <v-btn icon="mdi-close" variant="text" color="var(--text-main)" class="opacity-70" @click="aiDialog = false" :disabled="isGenerating"></v-btn>
          </v-card-title>
          
          <v-card-text class="px-6 py-4">
            <p class="cloud-text opacity-80 mb-6">
              Descrie-mi PC-ul visurilor tale. Specifică bugetul, jocurile preferate, tabăra (AMD/Intel) și preferințele de design. Mă voi ocupa de asamblare și compatibilitate instant!
            </p>

            <v-textarea
              v-model="aiPrompt"
              placeholder="Ex: Vreau un PC de maxim 6000 lei pentru a juca Counter-Strike 2 la minim 240 fps. Prefer procesoare AMD și vreau o carcasă panoramică."
              variant="outlined"
              color="#10B981"
              base-color="var(--border-light)"
              rows="4"
              hide-details
              class="custom-input mb-4"
              :disabled="isGenerating"
            ></v-textarea>
            
            <div v-if="isGenerating" class="d-flex flex-column align-center justify-center py-6 mt-4">
              <v-progress-circular indeterminate color="#10B981" size="50" width="4" class="mb-4"></v-progress-circular>
              <h4 class="cyan-text text-h6 font-weight-bold typing-animation">Analizăm stocul și asamblăm piesele...</h4>
            </div>
          </v-card-text>

          <v-card-actions class="px-6 pb-6 pt-0" v-if="!isGenerating">
            <v-spacer></v-spacer>
            <v-btn variant="text" class="cloud-text opacity-70 font-weight-bold" @click="aiDialog = false">Anulează</v-btn>
            <v-btn color="#10B981" variant="elevated" class="rounded-lg font-weight-bold px-6 ml-3 text-white" @click="generateWithAI" :disabled="!aiPrompt.trim()">
              Generează Sistemul
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
                <v-icon 
                  :color="currentStep === index ? '#10B981' : (selectedBuild[step.id] ? '#059669' : undefined)" 
                  class="mr-2"
                  :class="currentStep !== index && !selectedBuild[step.id] ? 'cloud-text opacity-50' : ''"
                >
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
          
          <v-alert v-if="allCategoryParts.length === 0" color="error" variant="tonal" class="rounded-xl mt-4 border-error">
            <v-icon start>mdi-database-alert</v-icon>
            <strong>Eroare Date:</strong> Nu există nicio componentă salvată / încărcată în categoria "{{ steps[currentStep].name }}". (Verifică dacă au fost aduse din baza de date).
          </v-alert>

          <v-alert v-else-if="currentAvailableParts.length === 0" color="warning" variant="tonal" class="rounded-xl mt-4">
            <v-icon start>mdi-alert-circle</v-icon>
            Avem <strong>{{ allCategoryParts.length }} componente</strong> în magazin pentru această categorie, dar NICIUNA nu se potrivește cu socketul sau specificațiile pieselor alese anterior!
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
                  
                  <div class="d-flex align-center">
                    <v-btn 
                      variant="text" 
                      class="font-weight-bold cloud-text opacity-80 mr-2 text-caption" 
                      @click.stop="goToProduct(part.id)"
                    >
                      Detalii
                    </v-btn>

                    <v-btn 
                      :color="selectedBuild[steps[currentStep].id]?.id === part.id ? '#10B981' : '#059669'" 
                      variant="tonal" class="rounded-lg font-weight-bold"
                    >
                      {{ selectedBuild[steps[currentStep].id]?.id === part.id ? 'Selectat' : 'Alege' }}
                    </v-btn>
                  </div>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <div class="sticky-summary">
            <v-card class="summary-card pa-5 rounded-xl" elevation="10">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h5 font-weight-black cloud-text">Sistemul Tău</h3>
                <v-btn icon="mdi-delete-sweep-outline" variant="text" color="error" title="Golește configurația" @click="selectedBuild = {}"></v-btn>
              </div>
              
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
                    <span class="text-h6 font-weight-black" :class="isPsuWeak ? 'text-error' : 'cloud-text'">{{ totalWattage }}W</span>
                    <span v-if="selectedBuild.psu" class="text-caption cloud-text opacity-50 font-weight-medium"> / {{ selectedBuild.psu.psuWattage }}W</span>
                  </div>
                </div>
                
                <v-progress-linear
                  v-if="selectedBuild.psu"
                  :model-value="(totalWattage / selectedBuild.psu.psuWattage) * 100"
                  :color="isPsuWeak ? 'error' : '#10B981'"
                  height="6"
                  rounded
                  bg-color="var(--border-light)"
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
                {{ isPsuWeak ? 'Sursă prea slabă' : 'Adaugă Configurația' }}
              </v-btn>
            </v-card>
          </div>
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
  import { ref, computed, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import axios from 'axios';
  import AppHeader from '../components/AppHeader.vue';
  import { useComponentsStore } from '../stores/componentsStore';
  import { useCartStore } from '../stores/cartStore';
  import { useRouter } from 'vue-router';
  import { useThemeStore } from '../stores/themeStore';

  const componentsStore = useComponentsStore();
  const router = useRouter();
  const themeStore = useThemeStore();
  const cartStore = useCartStore();
  const { allComponents: allParts } = storeToRefs(componentsStore);
  const aiDialog = ref(false);
  const aiPrompt = ref('');
  const isGenerating = ref(false);
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

  onMounted(() => {
    componentsStore.fetchComponents();
  });

  const goToProduct = (id) => {
    router.push({ path: `/produs/${id}` });
  };

  const calculateWattage = (part) => {
    const getNum = (str) => str ? parseInt(String(str).replace(/[^0-9]/g, '')) : 0;
    const dbWattage = getNum(part.specs?.tdp) || getNum(part.specs?.consum) || 0;

    if (dbWattage > 0) {
      return dbWattage;
    }

    switch (part.category) {
      case 'procesoare': return 105;
      case 'placi_video': return 250;
      case 'placi_de_baza': return 40;
      case 'memorie_ram': return 10;
      case 'stocare': return 8;
      case 'coolere': return 20;
      case 'carcase': return 15;
      case 'surse': return 0;
      default: return 15;
    }
  };

  const steps = [
    { id: 'cpu', name: 'Procesor', icon: 'mdi-cpu-64-bit' },
    { id: 'mb', name: 'Placă de Bază', icon: 'mdi-developer-board' },
    { id: 'cooler', name: 'Cooler', icon: 'mdi-fan' },
    { id: 'ram', name: 'Memorie RAM', icon: 'mdi-memory' },
    { id: 'gpu', name: 'Placă Video', icon: 'mdi-expansion-card-variant' },
    { id: 'storage', name: 'Stocare', icon: 'mdi-harddisk' },
    { id: 'psu', name: 'Sursă', icon: 'mdi-power-plug' },
    { id: 'case', name: 'Carcasă', icon: 'mdi-desktop-tower' }
  ];

  const currentStep = ref(0);
  const selectedBuild = ref({}); 

  const generateWithAI = async () => {
    if (!aiPrompt.value.trim()) {
      return;
    }
    
    isGenerating.value = true;
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/server/ai/ai-build`, { prompt: aiPrompt.value });
      
      if (response.data.success) {
        const aiBuildData = response.data.build;
        selectedBuild.value = {}; 
        
        for (const [category, id] of Object.entries(aiBuildData)) {
          if (id && id !== 'null') {
            const partMatch = allParts.value.find(p => p.id === id);
               
            if (partMatch) {
              const getNum = (str) => str ? parseInt(String(str).replace(/[^0-9]/g, '')) : 0;

              const formattedAIpart = {
                ...partMatch,
                image: partMatch.specs?.image || partMatch.image || '',
                socket: partMatch.specs?.socket || partMatch.socket || '',
                socket_support: partMatch.specs?.socket_support || partMatch.socket_support || '',
                ramType: partMatch.specs?.memory_type || partMatch.specs?.memory_support || partMatch.specs?.type || '',
                wattage: calculateWattage(partMatch),
                psuWattage: getNum(partMatch.specs?.putere) || 650
              };

              selectedBuild.value[category] = formattedAIpart;
            }
          }
        }
        
        aiDialog.value = false;
        aiPrompt.value = '';
        currentStep.value = 7;
      }
    } catch (error) {
      console.error("Eroare generare AI:", error);
      triggerSnackbar("Sistem asamblat cu succes!", "success");
    } finally {
      isGenerating.value = false;
    }
  };

  const groupedParts = computed(() => {
    const groups = { cpu: [], mb: [], cooler: [], ram: [], gpu: [], storage: [], psu: [], case: [] };
    allParts.value.forEach(p => {
      const getNum = (str) => str ? parseInt(String(str).replace(/[^0-9]/g, '')) : 0;
      let shortDesc = '';

      if (p.category === 'procesoare') {
        shortDesc = `${p.specs?.cores || ''} Nuclee, ${p.specs?.frequency || ''}`;
      } else if (p.category === 'placi_de_baza') {
        shortDesc = `Socket ${p.specs?.socket}, ${p.specs?.memory_support || p.specs?.memory_type || 'DDR4/DDR5'}`;
      } else if (p.category === 'coolere') {
        shortDesc = `${p.specs?.type || 'Aer'}, ${p.specs?.fan_size || p.specs?.radiator || ''}`;
      } else if (p.category === 'memorie_ram') {
        shortDesc = `${p.specs?.memory || p.specs?.capacity}, ${p.specs?.memory_type || p.specs?.type || ''}`;
      } else if (p.category === 'placi_video') {
        shortDesc = `${p.specs?.memory}, ${p.specs?.memory_type || ''}`;
      } else if (p.category === 'stocare') {
        shortDesc = `${p.specs?.capacity || p.specs?.memory}, ${p.specs?.type || ''}`;
      } else if (p.category === 'surse') {
        shortDesc = `${p.specs?.putere || 'N/A'}, ${p.specs?.certificare || ''}`;
      } else if (p.category === 'carcase') {
        shortDesc = `${p.specs?.format || 'N/A'}, ${p.specs?.sidePanel || ''}`;
      }

      let parsedWattage = getNum(p.specs?.tdp) || getNum(p.specs?.consum) || 45;

      if (p.category === 'coolere') {
        parsedWattage = 15;
      }

      const formattedPart = {
        ...p,
        image: p.specs?.image || p.image || '',
        socket: p.specs?.socket || p.socket || '',
        socket_support: p.specs?.socket_support || p.socket_support || '',
        ramType: p.specs?.memory_type || p.specs?.memory_support || p.specs?.type || '',
        wattage: calculateWattage(p),
        psuWattage: getNum(p.specs?.putere) || 650, 
        shortSpec: shortDesc
      };

      if (p.category === 'procesoare') {
        groups.cpu.push(formattedPart);
      } else if (p.category === 'placi_de_baza') {
        groups.mb.push(formattedPart);
      } else if (p.category === 'coolere') {
        groups.cooler.push(formattedPart);
      } else if (p.category === 'memorie_ram') {
        groups.ram.push(formattedPart);
      } else if (p.category === 'placi_video') {
        groups.gpu.push(formattedPart);
      } else if (p.category === 'stocare') {
        groups.storage.push(formattedPart);
      }
      else if (p.category === 'surse') {
        groups.psu.push(formattedPart);
      }
      else if (p.category === 'carcase') {
        groups.case.push(formattedPart);
      }
    });
    return groups;
  });

  const checkSocket = (partA, partB) => {
    if (!partA || !partB) {
      return true;
    }

    const strA = (partA.socket + ',' + partA.socket_support).toLowerCase().replace(/socket/g, '').replace(/[^a-z0-9,]/g, '');
    const strB = (partB.socket + ',' + partB.socket_support).toLowerCase().replace(/socket/g, '').replace(/[^a-z0-9,]/g, '');
    const arrA = strA.split(',').filter(Boolean);
    const arrB = strB.split(',').filter(Boolean);

    for (const a of arrA) {
      for (const b of arrB) {
        if (a === b || a.includes(b) || b.includes(a)) {
          return true;
        }
      }
    }

    return false;
  };

  const isRamCompatible = (ram1, ram2) => {
    if (!ram1 || !ram2) {
      return true;
    }

    const r1 = String(ram1).toLowerCase().replace(/[^a-z0-9]/g, '');
    const r2 = String(ram2).toLowerCase().replace(/[^a-z0-9]/g, '');

    return r1.includes(r2) || r2.includes(r1);
  };

  const isFormatCompatible = (mbFormat, caseSupportStr) => {
    if (!mbFormat || !caseSupportStr) {
      return true; 
    }

    let mb = String(mbFormat).toLowerCase().replace(/[^a-z]/g, ''); 

    if (mb.includes('micro') || mb === 'matx') {
      mb = 'microatx';
    } else if (mb.includes('mini') || mb === 'mitx') {
      mb = 'miniitx';
    } else if (mb.includes('extended') || mb === 'eatx') {
      mb = 'eatx';
    } else if (mb === 'atx') {
      mb = 'atx';
    }

    const supports = String(caseSupportStr).toLowerCase().replace(/[^a-z,]/g, '').split(',').map(s => {
        let form = s;

        if (form.includes('micro') || form === 'matx') {
          return 'microatx';
        }
        if (form.includes('mini') || form === 'mitx') {
          return 'miniitx';
        }
        if (form.includes('extended') || form === 'eatx') {
          return 'eatx';
        }
        if (form === 'atx') {
          return 'atx';
        }

        return form;
    });
    return supports.includes(mb);
  };

  const checkCompatibility = (part) => {
    const category = steps[currentStep.value].id;

    if (category === 'mb' && selectedBuild.value.cpu) {
      if (!checkSocket(selectedBuild.value.cpu, part)) {
        return { isCompatible: false };
      }
    }
    
    if (category === 'cpu' && selectedBuild.value.mb) {
      if (!checkSocket(part, selectedBuild.value.mb)) {
        return { isCompatible: false };
      }
    }

    if (category === 'cooler') {
      if (selectedBuild.value.cpu && !checkSocket(selectedBuild.value.cpu, part)) {
        return { isCompatible: false };
      }

      if (selectedBuild.value.mb && !checkSocket(selectedBuild.value.mb, part)) {
        return { isCompatible: false };
      }
    }

    if (category === 'cpu' && selectedBuild.value.cooler) {
      if (!checkSocket(part, selectedBuild.value.cooler)) {
        return { isCompatible: false };
      }
    }

    if (category === 'mb' && selectedBuild.value.cooler) {
      if (!checkSocket(part, selectedBuild.value.cooler)) {
        return { isCompatible: false };
      }
    }

    if (category === 'ram' && selectedBuild.value.mb) {
      if (!isRamCompatible(part.ramType, selectedBuild.value.mb.ramType)) {
        return { isCompatible: false };
      }
    }

    if (category === 'mb' && selectedBuild.value.ram) {
      if (!isRamCompatible(part.ramType, selectedBuild.value.ram.ramType)) {
        return { isCompatible: false };
      }
    }

    if (category === 'case' && selectedBuild.value.mb) {
      const mbFormat = selectedBuild.value.mb.specs?.type || selectedBuild.value.mb.specs?.format; 
      if (!isFormatCompatible(mbFormat, part.specs?.motherboardSupport)) {
        return { isCompatible: false };
      }
    }

    if (category === 'mb' && selectedBuild.value.case) {
      const mbFormat = part.specs?.type || part.specs?.format; 
      if (!isFormatCompatible(mbFormat, selectedBuild.value.case.specs?.motherboardSupport)) {
        return { isCompatible: false };
      }
    }

    return { isCompatible: true };
  };

  const allCategoryParts = computed(() => {
    const currentCategory = steps[currentStep.value].id;

    return groupedParts.value[currentCategory] || [];
  });

  const currentAvailableParts = computed(() => {
    return allCategoryParts.value.filter(part => checkCompatibility(part).isCompatible);
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
      return { message: 'Pericol: Sursă prea slabă!', icon: 'mdi-alert-octagon', colorClass: 'bg-glass-error text-error border-error shadow-error' };
    }

    if (buildKeys.length === steps.length) {
      return { message: 'Sistem Complet & Compatibil!', icon: 'mdi-check-decagram', colorClass: 'bg-glass-success cloud-text border-success' };
    }

    return { message: 'Se asamblează. Toate bune.', icon: 'mdi-wrench', colorClass: 'bg-glass-cyan cyan-text' };
  });

  const addBuildToCart = () => {
    const parts = Object.values(selectedBuild.value);

    if(parts.length > 0) {
      parts.forEach(part => cartStore.addToCart(part));
      triggerSnackbar(`Am adăugat ${parts.length} componente în coșul tău!`, "success");
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
    background-color: var(--bg-panel); 
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
    background: var(--border-light); 
  }

  .active-step { 
    background: rgba(16, 185, 129, 0.1) !important; 
    border: 1px solid rgba(16, 185, 129, 0.3); 
  }
  
  .product-card { 
    background-color: var(--bg-panel) !important; 
    border: 1px solid var(--border-light); 
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
    background-color: #F3F4F6 !important; 
    margin: 12px 12px 0 12px; 
    padding: 20px; 
    border-radius: 16px; 
    position: relative; 
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05); 
  }

  .product-img { 
    transition: all 0.5s ease; 
    mix-blend-mode: multiply; 
    filter: contrast(1.05); 
  }
  
  .sticky-summary { 
    position: sticky; 
    top: 100px; 
  }

  .summary-card { 
    background-color: var(--bg-panel) !important; 
    border: 1px solid rgba(16, 185, 129, 0.2); 
  }

  .transition-all { 
    transition: all 0.3s ease; 
  }
  
  .bg-glass-neutral { 
    background: var(--border-light); 
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
    color: var(--text-main) !important; 
    letter-spacing: 1px; 
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
  }

  .electric-btn:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 20px -5px rgba(16, 185, 129, 0.6) !important; 
  }

  .ai-magic-btn {
    background: linear-gradient(270deg, #10B981, #00d2ff, #3a7bd5, #10B981);
    background-size: 400% 400%;
    color: white !important;
    animation: gradientGlow 10s ease infinite;
    border: none;
  }

  .ai-magic-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.6) !important;
  }

  @keyframes gradientGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .ai-dialog-border {
    border: 2px solid transparent;
    background-image: linear-gradient(var(--bg-panel), var(--bg-panel)), linear-gradient(90deg, #10B981, #00d2ff);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.3) !important;
  }

  .custom-input :deep(.v-field__input) { 
    color: var(--text-main) !important; 
  }

  .typing-animation {
    overflow: hidden;
    border-right: .15em solid #10B981;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .05em;
    animation: typing 2.5s steps(40, end) infinite, blink-caret .75s step-end infinite;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #10B981; }
  }
</style>