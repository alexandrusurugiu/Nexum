<template>
    <v-app class="nexum-bg">
        <AppHeader></AppHeader>

        <v-main class="pb-16 px-4 px-md-10 mt-16">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Componente</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Selectează o categorie pentru a vedea piesele disponibile.
                </p>
            </div>

            <v-row>
                <v-col cols="12" md="3" lg="2">
                    <v-card class="filter-panel pa-5 rounded-xl" elevation="10">
                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Categorii</h3>
                        <v-list bg-color="transparent" class="pa-0 mb-6">
                            <v-list-item
                                v-for="cat in categories"
                                :key="cat.id"
                                @click="activeCategory = cat.id"
                                :class="['category-item mb-2 rounded-lg', { 'active-category': activeCategory === cat.id }]"
                                :prepend-icon="cat.icon"
                            >
                                <v-list-item-title class="font-weight-medium">{{ cat.name }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        
                        <v-divider class="border-opacity-25 mb-6" color="#00CEC9"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-2">Buget (Lei)</h3>
                        <div class="d-flex justify-space-between cloud-text opacity-80 text-caption font-weight-bold mb-4">
                            <span>{{ priceRange[0] }}</span>
                            <span>{{ priceRange[1] }}</span>
                        </div>
                        <v-range-slider
                            v-model="priceRange"
                            :min="0"
                            :max="10000"
                            :step="50"
                            color="#00CEC9"
                            track-color="rgba(245, 246, 250, 0.1)"
                            track-fill-color="#00CEC9"
                            thumb-size="18"
                            class="neon-slider mt-2 mb-6"
                        >
                            <template v-slot:thumb="{ modelValue }">
                                <div class="neon-thumb elevation-5"></div>
                            </template>
                        </v-range-slider>

                        <v-divider class="border-opacity-25 mb-6" color="#00CEC9"></v-divider>

                        <h3 class="text-h6 font-weight-bold cloud-text mb-4">Filtre</h3>

                        <v-expansion-panels variant="accordion" multiple class="custom-expansion-panels" bg-color="transparent">
                            <v-expansion-panel v-if="availableFilters.brands.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Producător</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="brand in availableFilters.brands" :key="brand" v-model="selectedFilters.brands" :label="brand" :value="brand" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.series.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Serie</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="serie in availableFilters.series" :key="serie" v-model="selectedFilters.series" :label="serie" :value="serie" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.models.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Model</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="model in availableFilters.models" :key="model" v-model="selectedFilters.models" :label="model" :value="model" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.motherboardSupport.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Plăci Suportate</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="mb in availableFilters.motherboardSupport" :key="mb" v-model="selectedFilters.motherboardSupport" :label="mb" :value="mb" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.sidePanels.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Panou Lateral</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="panel in availableFilters.sidePanels" :key="panel" v-model="selectedFilters.sidePanels" :label="panel" :value="panel" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.includedFans.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Ventilatoare</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="fan in availableFilters.includedFans" :key="fan" v-model="selectedFilters.includedFans" :label="`${fan} incluse`" :value="fan" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.sockets.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Socket</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="socket in availableFilters.sockets" :key="socket" v-model="selectedFilters.sockets" :label="socket" :value="socket" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.cores.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Număr Nuclee</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="core in availableFilters.cores" :key="core" v-model="selectedFilters.cores" :label="`${core} Nuclee`" :value="core" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.chipsets.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Chipset</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="chipset in availableFilters.chipsets" :key="chipset" v-model="selectedFilters.chipsets" :label="chipset" :value="chipset" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.memory.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Capacitate</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="mem in availableFilters.memory" :key="mem" v-model="selectedFilters.memory" :label="mem" :value="mem" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.memoryTypes.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Tip Memorie</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="type in availableFilters.memoryTypes" :key="type" v-model="selectedFilters.memoryTypes" :label="type" :value="type" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.interfaces.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Interfață</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="intf in availableFilters.interfaces" :key="intf" v-model="selectedFilters.interfaces" :label="intf" :value="intf" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.puteri.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Putere (W)</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="putere in availableFilters.puteri" :key="putere" v-model="selectedFilters.puteri" :label="putere" :value="putere" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.certificari.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Certificare</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="cert in availableFilters.certificari" :key="cert" v-model="selectedFilters.certificari" :label="cert" :value="cert" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.modularitati.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Modularitate</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="mod in availableFilters.modularitati" :key="mod" v-model="selectedFilters.modularitati" :label="mod" :value="mod" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel v-if="availableFilters.formate.length > 0" elevation="0">
                                <v-expansion-panel-title class="text-subtitle-2 cyan-text font-weight-bold text-uppercase px-0" style="letter-spacing: 1px;">Format / Tip</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-checkbox v-for="format in availableFilters.formate" :key="format" v-model="selectedFilters.formate" :label="format" :value="format" color="#00CEC9" density="compact" hide-details class="custom-checkbox"></v-checkbox>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                        </v-expansion-panels>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="10">
                    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 pa-4 sort-bar rounded-xl">
                        <div class="cloud-text font-weight-medium mb-4 mb-sm-0">
                            Afișare <span class="cyan-text font-weight-bold">{{ filteredComponents.length }}</span> produse pentru 
                            <v-chip color="#0984E3" variant="flat" size="small" class="ml-2 font-weight-bold text-uppercase">
                                {{ activeCategoryName }}
                            </v-chip>
                        </div>
                        
                        <div class="d-flex align-center" style="width: 250px;">
                            <span class="cloud-text opacity-80 mr-3 text-body-2">Sortează:</span>
                            <v-select
                                v-model="sortOption"
                                :items="sortOptions"
                                variant="outlined"
                                density="compact"
                                hide-details
                                bg-color="rgba(30, 39, 46, 0.8)"
                                color="#00CEC9"
                                base-color="rgba(245, 246, 250, 0.2)"
                                class="custom-select"
                            ></v-select>
                        </div>
                    </div>

                    <div v-if="filteredComponents.length === 0" class="text-center py-16">
                        <v-icon size="100" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-package-variant-closed</v-icon>
                        <h2 class="cloud-text opacity-80">Niciun produs corespunde filtrelor</h2>
                        <p class="cyan-text mt-2" style="cursor: pointer;" @click="resetFilters">Resetează toate filtrele</p>
                    </div>

                    <v-row v-else>
                        <v-col v-for="component in filteredComponents" :key="component.id" cols="12" sm="6" md="6" lg="4" xl="3">
                            <v-card class="product-card h-100 d-flex flex-column rounded-xl" elevation="0">
                                <v-chip v-if="component.discount" color="#0984E3" class="discount-badge font-weight-bold" size="small">
                                -{{ component.discount }}%
                                </v-chip>

                                <div class="img-container pa-4 text-center">
                                    <v-img :src="component.specs?.image || component.image" height="200" contain class="product-img mx-auto"></v-img>
                                </div>
                                
                                <v-card-text class="flex-grow-1 pt-4">
                                    <span class="text-caption text-uppercase font-weight-bold" style="color: #00CEC9; letter-spacing: 1px;">
                                        {{ component.brand }}
                                    </span>
                                    <h3 class="text-h6 font-weight-bold cloud-text mt-1 mb-3 line-clamp-2" style="line-height: 1.3;">
                                        {{ component.name }}
                                    </h3>
                                    
                                    <div class="quick-specs">
                                        <template v-for="(value, key) in component.specs" :key="key">
                                            <div v-if="key !== 'image'" class="d-flex align-center mb-1">
                                                <v-icon size="small" color="#00CEC9" class="mr-2 opacity-80">mdi-circle-small</v-icon>
                                                <span class="cloud-text opacity-80 text-body-2 text-truncate">
                                                    <strong class="cyan-text" style="opacity: 0.9;">{{ formatSpecLabel(key) }}:</strong> {{ value }}
                                                </span>
                                            </div>
                                        </template>
                                    </div>
                                </v-card-text>

                                <v-card-actions class="pa-4 pt-0 d-flex justify-space-between align-end">
                                    <div>
                                        <div v-if="component.oldPrice" class="text-decoration-line-through text-caption cloud-text opacity-50 mb-n1">
                                        {{ component.oldPrice }} Lei
                                        </div>
                                        <div class="text-h5 font-weight-black cloud-text">
                                        {{ component.price }} <span class="text-body-1 cyan-text font-weight-bold">Lei</span>
                                        </div>
                                    </div>
                                    <v-btn icon color="#0984E3" variant="tonal" class="cart-btn rounded-lg" @click="cartStore.addToCart(component)" title="Adaugă în coș">
                                        <v-icon>mdi-cart-plus</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import AppHeader from '../components/AppHeader.vue';
    import { useComponentsStore } from '../stores/componentsStore';
    import { storeToRefs } from 'pinia';
    import { useCartStore } from '../stores/cartStore';

    const componentsStore = useComponentsStore();
    const cartStore = useCartStore();
    const { allComponents, isLoading } = storeToRefs(componentsStore);
    const activeCategory = ref('procesoare');
    const sortOption = ref('popular');
    const priceRange = ref([0, 10000]);

    const selectedFilters = ref({
        brands: [],
        sockets: [],
        memory: [],
        types: [],
        cores: [],
        chipsets: [],
        series: [],
        models: [],
        memoryTypes: [],
        interfaces: [],
        puteri: [],
        certificari: [],
        modularitati: [],
        formate: [],
        motherboardSupport: [],
        sidePanels: [],
        includedFans: []
    });

    const specLabels = {
        socket: 'Socket',
        memory: 'Capacitate memorie',
        memory_type: 'Tip Memorie',
        max_memory: 'Memorie maximă',
        memory_frequency: 'Frecvență memorie',
        type: 'Tip / Format',
        cores: 'Număr nuclee',
        threads: 'Fire de execuție',
        frequency: 'Frecvență',
        boost_frequency: 'Frecvență maximă',
        tdp: 'Consum (TDP)',
        putere: 'Putere',
        certificare: 'Certificare 80+',
        modular: 'Modularitate',
        format: 'Format',
        motherboardSupport: 'Plăci de bază suportate',
        sidePanel: 'Panou lateral',
        includedFans: 'Ventilatoare incluse'
    };

    watch(activeCategory, () => {
        resetFilters();
    });

    const formatSpecLabel = (key) => {
        return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const resetFilters = () => {
        priceRange.value = [0, 10000];
        selectedFilters.value = { 
            brands: [], series: [], models: [], sockets: [], memory: [], 
            types: [], cores: [], chipsets: [], memoryTypes: [], interfaces: [],
            puteri: [], certificari: [], modularitati: [], formate: [],
            motherboardSupport: [], sidePanels: [], includedFans: []
        };
    };

    const categories = [
        { id: 'procesoare', name: 'Procesoare', icon: 'mdi-cpu-64-bit' },
        { id: 'placi_video', name: 'Plăci video', icon: 'mdi-expansion-card-variant' },
        { id: 'placi_de_baza', name: 'Plăci de bază', icon: 'mdi-developer-board' },
        { id: 'memorie_ram', name: 'Memorii RAM', icon: 'mdi-memory' },
        { id: 'stocare', name: 'Stocare internă', icon: 'mdi-harddisk' },
        { id: 'surse', name: 'Surse', icon: 'mdi-power-plug' },
        { id: 'carcase', name: 'Carcase', icon: 'mdi-desktop-tower' }
    ];

    const getSeries = (name, category) => {
        if (category === 'procesoare') {
            const series = ['Ryzen 9', 'Ryzen 7', 'Ryzen 5', 'Ryzen 3', 'Core i9', 'Core i7', 'Core i5', 'Core i3'];
            return series.find(s => name.includes(s)) || null;
        }
        if (category === 'placi_video') {
            if (name.includes('RTX 40')) return 'GeForce RTX 40 Series';
            if (name.includes('RTX 30')) return 'GeForce RTX 30 Series';
            if (name.includes('RX 7')) return 'Radeon RX 7000 Series';
            if (name.includes('RX 6')) return 'Radeon RX 6000 Series';
        }
        return null;
    };

    const getModel = (name, category) => {
        if (category === 'procesoare') {
            return name.replace('Procesor AMD ', '').replace('Procesor Intel ', '');
        }
        if (category === 'placi_video') {
            const match = name.match(/(RTX \d{4}(?: Ti)?(?: SUPER)?|RX \d{4}(?: XT)?(?: XTX)?(?: GRE)?)/);
            return match ? match[0] : null;
        }
        return null;
    };

    const activeCategoryName = computed(() => {
        return categories.find(c => c.id === activeCategory.value)?.name || 'Produse';
    });

    const sortOptions = [
        { title: 'Recomandate', value: 'popular' },
        { title: 'Preț: Crescător', value: 'price_asc' },
        { title: 'Preț: Descrescător', value: 'price_desc' }
    ];

    onMounted(() => {
        componentsStore.fetchComponents();
    });

    const availableFilters = computed(() => {
        const currentProducts = allComponents.value.filter(p => p.category === activeCategory.value);
        
        return {
            brands: [...new Set(currentProducts.map(p => p.brand).filter(Boolean))],
            sockets: [...new Set(currentProducts.map(p => p.specs?.socket).filter(Boolean))],
            memory: [...new Set(currentProducts.map(p => p.specs?.memory || p.specs?.capacity).filter(Boolean))],
            types: [...new Set(currentProducts.map(p => p.specs?.type).filter(Boolean))],
            cores: [...new Set(currentProducts.map(p => p.specs?.cores).filter(Boolean))].sort((a,b) => a - b),
            series: [...new Set(currentProducts.map(p => getSeries(p.name, p.category)).filter(Boolean))].sort(),
            models: [...new Set(currentProducts.map(p => getModel(p.name, p.category)).filter(Boolean))].sort(),
            chipsets: [...new Set(currentProducts.map(p => p.specs?.chipset).filter(Boolean))],
            memoryTypes: [...new Set(currentProducts.map(p => p.specs?.memory_type || p.specs?.memory_support).filter(Boolean))],
            interfaces: [...new Set(currentProducts.map(p => p.specs?.interface).filter(Boolean))],
            puteri: [...new Set(currentProducts.map(p => p.specs?.putere).filter(Boolean))].sort((a,b) => parseInt(a) - parseInt(b)),
            certificari: [...new Set(currentProducts.map(p => p.specs?.certificare).filter(Boolean))],
            modularitati: [...new Set(currentProducts.map(p => p.specs?.modular).filter(Boolean))],
            formate: [...new Set(currentProducts.map(p => p.specs?.format).filter(Boolean))],
            motherboardSupport: [...new Set(currentProducts.flatMap(p => p.specs?.motherboardSupport ? p.specs.motherboardSupport.split(',').map(s => s.trim()) : []))].sort(),
            sidePanels: [...new Set(currentProducts.map(p => p.specs?.sidePanel).filter(Boolean))],
            includedFans: [...new Set(currentProducts.map(p => p.specs?.includedFans).filter(Boolean))].sort()
        };
    });

    const filteredComponents = computed(() => {
        let result = allComponents.value.filter(p => p.category === activeCategory.value);
        result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
        
        const f = selectedFilters.value;

        if (f.series.length > 0) result = result.filter(p => f.series.includes(getSeries(p.name, p.category)));
        if (f.models.length > 0) result = result.filter(p => f.models.includes(getModel(p.name, p.category)));
        if (f.brands.length > 0) result = result.filter(p => f.brands.includes(p.brand));
        if (f.sockets.length > 0) result = result.filter(p => f.sockets.includes(p.specs?.socket));
        if (f.memory.length > 0) result = result.filter(p => f.memory.includes(p.specs?.memory) || f.memory.includes(p.specs?.capacity));
        if (f.types.length > 0) result = result.filter(p => f.types.includes(p.specs?.type));
        if (f.cores.length > 0) result = result.filter(p => f.cores.includes(p.specs?.cores));
        if (f.chipsets.length > 0) result = result.filter(p => f.chipsets.includes(p.specs?.chipset));
        if (f.memoryTypes.length > 0) result = result.filter(p => f.memoryTypes.includes(p.specs?.memory_type) || f.memoryTypes.includes(p.specs?.memory_support));
        if (f.interfaces.length > 0) result = result.filter(p => f.interfaces.includes(p.specs?.interface));
        
        if (f.puteri.length > 0) result = result.filter(p => f.puteri.includes(p.specs?.putere));
        if (f.certificari.length > 0) result = result.filter(p => f.certificari.includes(p.specs?.certificare));
        if (f.modularitati.length > 0) result = result.filter(p => f.modularitati.includes(p.specs?.modular));
        if (f.formate.length > 0) result = result.filter(p => f.formate.includes(p.specs?.format));

        if (f.motherboardSupport.length > 0) {
            result = result.filter(p => {
                if (!p.specs?.motherboardSupport) return false;
                const supportedFormats = p.specs.motherboardSupport.split(',').map(s => s.trim());
                
                return f.motherboardSupport.some(selectedFormat => supportedFormats.includes(selectedFormat));
            });
        }
        if (f.sidePanels.length > 0) result = result.filter(p => f.sidePanels.includes(p.specs?.sidePanel));
        if (f.includedFans.length > 0) result = result.filter(p => f.includedFans.includes(p.specs?.includedFans));

        if (sortOption.value === 'price_asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption.value === 'price_desc') {
            result.sort((a, b) => b.price - a.price);
        }
        
        return result;
    });
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

    .filter-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
    }

    .category-item {
        color: #F5F6FA !important;
        transition: all 0.3s ease;
        opacity: 0.7;
    }

    .category-item:hover {
        opacity: 1;
        background-color: rgba(245, 246, 250, 0.05) !important;
    }

    .active-category {
        opacity: 1;
        color: #00CEC9 !important;
        background: rgba(0, 206, 201, 0.1) !important;
        border-left: 4px solid #00CEC9;
    }

    .neon-slider :deep(.v-slider-track__fill) {
        background: linear-gradient(90deg, #0984E3, #00CEC9) !important; 
        box-shadow: 0 0 10px rgba(0, 206, 201, 0.4); 
    }
    .neon-slider :deep(.v-slider-track__background) { 
        opacity: 0.2 !important; 
    }

    .neon-thumb {
        width: 18px; 
        height: 18px; 
        border-radius: 50%; 
        background-color: #1E272E; 
        border: 3px solid #00CEC9; 
        box-shadow: 0 0 12px rgba(0, 206, 201, 0.8); 
        transition: all 0.3s ease;
    }

    .neon-slider :deep(.v-slider-thumb--pressed) .neon-thumb {
        box-shadow: 0 0 20px rgba(0, 206, 201, 1); 
        transform: scale(1.2);
    }

    .custom-checkbox :deep(.v-label) { 
        color: #F5F6FA !important; 
        opacity: 0.85; 
        font-size: 0.9rem; 
    }

    .custom-checkbox :deep(.v-selection-control__input > .v-icon) { 
        opacity: 0.7; 
    }

    .custom-checkbox :deep(.v-selection-control--dirty .v-selection-control__input > .v-icon) {
        opacity: 1; 
        filter: drop-shadow(0 0 5px rgba(0, 206, 201, 0.5));
    }

    .sort-bar { 
        background-color: #253038; 
        border: 1px solid rgba(245, 246, 250, 0.05); 
    }

    .custom-select :deep(.v-field) { 
        border-radius: 10px; 
    }

    .custom-select :deep(.v-field__input) { 
        color: #F5F6FA !important; 
    }

    .product-card {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
        border-radius: 24px !important;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative; 
        overflow: hidden;
    }

    .product-card:hover {
        transform: translateY(-10px);
        border-color: rgba(0, 206, 201, 0.4);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 206, 201, 0.15) !important;
    }

    .img-container {
        background-color: #F5F6FA; 
        margin: 12px 12px 0 12px;
        padding: 20px; 
        border-radius: 16px; 
        position: relative;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05); 
    }

    .product-card:hover .img-container {
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 80%);
        box-shadow: 0 8px 30px rgba(0, 206, 201, 0.3);
    }

    .product-img {
        transition: all 0.5s ease;
        mix-blend-mode: multiply; 
        filter: contrast(1.05);
    }

    .product-card .v-card-text { 
        padding-top: 24px !important; 
    }

    .product-card:hover .product-img { 
        transform: scale(1.15) translateY(-5px); 
    }
    
    .discount-badge {
        position: absolute; 
        top: 16px; 
        right: 16px; 
        z-index: 2;
        box-shadow: 0 4px 10px rgba(9, 132, 227, 0.4);
    }

    .line-clamp-2 {
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical;  
        overflow: hidden; 
        min-height: 3rem;
    }

    .quick-specs { 
        border-top: 1px solid rgba(245, 246, 250, 0.1); 
        padding-top: 12px; 
    }

    .cart-btn { 
        background-color: rgba(9, 132, 227, 0.1) !important; 
        transition: all 0.3s ease; 
    }

    .cart-btn:hover {
        background-color: #0984E3 !important; 
        color: #F5F6FA !important;
        transform: scale(1.1) rotate(5deg); 
        box-shadow: 0 5px 15px rgba(9, 132, 227, 0.4);
    }

    .custom-expansion-panels { 
        background: transparent !important; 
    }

    .custom-expansion-panels :deep(.v-expansion-panel) { 
        background-color: transparent !important; 
    }

    .custom-expansion-panels :deep(.v-expansion-panel-title) {
        padding-left: 0 !important; 
        padding-right: 0 !important;
         min-height: 48px !important;
        border-bottom: 1px solid rgba(245, 246, 250, 0.05); 
        color: #00CEC9 !important;
    }

    .custom-expansion-panels :deep(.v-expansion-panel-title__overlay) { 
        background-color: transparent !important; 
    }

    .custom-expansion-panels :deep(.v-expansion-panel-text__wrapper) {
        padding-left: 0 !important; 
        padding-right: 0 !important; 
        padding-top: 12px !important; 
        padding-bottom: 16px !important;
    }
</style>