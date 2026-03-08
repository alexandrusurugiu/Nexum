<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800">
        <v-card class="rounded-xl pa-4 bg-panel">
            <v-card-title class="text-h5 cloud-text font-weight-bold mb-4">
                <v-icon color="#10B981" class="mr-2">{{ getIcon }}</v-icon>
                {{ mode === 'add' ? 'Adaugă ' + getTitle : 'Editează ' + getTitle }}
            </v-card-title>
            
            <v-card-text class="pa-2 max-height-modal custom-scrollbar">
                <v-row>
                    <v-col cols="12" sm="8">
                        <v-text-field v-model="formData.name" label="Nume Produs" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="formData.brand" label="Brand" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="formData.price" label="Preț (Lei)" type="number" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select 
                            v-model="formData.category" 
                            :items="categoryOptions" 
                            item-title="title" 
                            item-value="value"
                            label="Selectează Categoria" 
                            variant="outlined" 
                            color="#10B981" 
                            class="custom-select" 
                            hide-details
                        ></v-select>
                    </v-col>
                   <v-col cols="12">
                        <v-text-field v-model="formData.specs.image" label="URL Imagine Principală" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field>
                    </v-col>

                    <v-col cols="12" v-if="formData.category">
                        <v-divider class="my-2 border-opacity-25" color="#10B981"></v-divider>
                        <p class="cyan-text font-weight-bold text-subtitle-1 mb-2 d-flex align-center">
                            <v-icon size="small" class="mr-2">mdi-cogs</v-icon> Specificații {{ selectedCategoryTitle }}
                        </p>
                    </v-col>

                    <template v-if="formData.category === 'procesoare'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.socket" label="Socket (ex: AM5, LGA1700)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.cores" label="Număr Nuclee" type="number" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.threads" label="Fire de execuție" type="number" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.frequency" label="Frecvență de bază" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.boost_frequency" label="Frecvență Boost" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.tdp" label="TDP / Consum (W)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'placi_video'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.memory" label="Capacitate Memorie (ex: 16GB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.memory_type" label="Tip Memorie (ex: GDDR6X)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.interface" label="Interfață (ex: PCI Express 4.0)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.consum" label="Consum (W)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'placi_de_baza'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.socket" label="Socket Suportat" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.chipset" label="Chipset (ex: B650, Z790)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.format" label="Format (ex: ATX, mATX)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.memory_support" label="Suport Memorie (ex: DDR5)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'memorie_ram'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.memory" label="Capacitate (ex: 32GB / 2x16GB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.memory_type" label="Tip (ex: DDR5)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.frequency" label="Frecvență (ex: 6000 MHz)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'stocare'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.capacity" label="Capacitate (ex: 1TB, 500GB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.type" label="Tip (ex: SSD, HDD)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.interface" label="Interfață (ex: PCIe 4.0, SATA3)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.format" label="Format (ex: M.2, 2.5 inch)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'surse'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.putere" label="Putere (W)" type="number" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.certificare" label="Certificare (ex: 80+ Gold)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.modular" label="Modularitate (ex: Full Modular)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'carcase'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.format" label="Format Carcasă (ex: MiddleTower)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.motherboardSupport" label="Plăci suportate (ex: ATX, mATX)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.sidePanel" label="Panou Lateral (ex: Sticlă)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.includedFans" label="Număr ventilatoare incluse" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'coolere'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.type" label="Tip (Aer / Lichid AIO)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.socket_support" label="Socket-uri suportate" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.fan_size" label="Ventilatoare (ex: 2 x 120mm)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.radiator" label="Radiator (doar pt AIO - 240mm/360mm)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.rpm" label="Viteză Max (RPM)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.noise_level" label="Nivel Zgomot (dB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.tdp" label="Răcire TDP (W)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.lighting" label="Iluminare (RGB / Fără)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'laptopuri'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.cpu" label="Procesor" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.gpu" label="Placă Video" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.ram" label="Memorie RAM" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.storage" label="Stocare" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12"><v-text-field v-model="formData.specs.display" label="Ecran (Diagonală, Rezoluție, Hz)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'monitoare'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.size" label="Diagonală (ex: 27 inch)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.resolution" label="Rezoluție (ex: 2560 x 1440)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.refreshRate" label="Rată de Refresh (ex: 144Hz)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.panel" label="Tip Panou (ex: IPS, VA)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.responseTime" label="Timp Răspuns (ex: 1ms)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'mousi'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.techType" label="Senzor (ex: Optic, Laser)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.connectivity" label="Conectivitate (ex: Wireless, Fir)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.dpi" label="DPI Maxim (ex: 25600)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.weight" label="Greutate (ex: 63g)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12"><v-text-field v-model="formData.specs.lighting" label="Iluminare (ex: RGB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'tastaturi'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.techType" label="Tehnologie (ex: Mecanică)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.switches" label="Tip Switch (ex: Red, Blue)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.format" label="Format (ex: TKL, 60%, 100%)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.connectivity" label="Conectivitate" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12"><v-text-field v-model="formData.specs.lighting" label="Iluminare (ex: RGB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'casti'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.connectivity" label="Conectivitate (ex: Wireless 2.4GHz)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.microphone" label="Microfon (ex: Da, detașabil)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12"><v-text-field v-model="formData.specs.lighting" label="Iluminare (ex: RGB, Fără)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                    <template v-if="formData.category === 'mousepad'">
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.size" label="Dimensiuni (ex: 900x400 mm)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="formData.specs.thickness" label="Grosime (ex: 3 mm)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                        <v-col cols="12"><v-text-field v-model="formData.specs.lighting" label="Iluminare (ex: Margini RGB)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field></v-col>
                    </template>

                </v-row>
            </v-card-text>

            <v-card-actions class="px-6 pb-4 mt-4 pt-4 border-top">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" class="font-weight-bold rounded-lg" @click="closeModal">Anulează</v-btn>
                <v-btn color="#10B981" variant="flat" class="font-weight-bold px-8 rounded-lg text-white" @click="saveProduct" :loading="isSaving">
                    {{ mode === 'add' ? 'Creează' : 'Actualizează' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, watch, computed } from 'vue';
    import axios from 'axios';

    const props = defineProps({
        modelValue: Boolean,
        mode: String,
        product: Object,
        apiEndpoint: String 
    });

    const emit = defineEmits(['update:modelValue', 'saved']);

    const isSaving = ref(false);

    const formData = ref({ 
        name: '', 
        brand: '', 
        price: null,  
        category: '', 
        specs: { image: '' } 
    });

    const categoryOptions = computed(() => {
        switch(props.apiEndpoint) {
            case 'components': return [
                { title: 'Procesoare', value: 'procesoare' },
                { title: 'Coolere Procesor', value: 'coolere' },
                { title: 'Plăci Video', value: 'placi_video' },
                { title: 'Plăci de Bază', value: 'placi_de_baza' },
                { title: 'Memorii RAM', value: 'memorie_ram' },
                { title: 'Stocare Internă', value: 'stocare' },
                { title: 'Surse', value: 'surse' },
                { title: 'Carcase', value: 'carcase' }
            ];
            case 'laptops': return [
                { title: 'Laptopuri', value: 'laptopuri' }
            ];
            case 'monitors': return [
                { title: 'Monitoare', value: 'monitoare' }
            ];
            case 'peripherals': return [
                { title: 'Mouși Gaming', value: 'mousi' },
                { title: 'Tastaturi', value: 'tastaturi' },
                { title: 'Căști Audio', value: 'casti' },
                { title: 'Mousepad-uri', value: 'mousepad' }
            ];
            default: return [];
        }
    });

    const selectedCategoryTitle = computed(() => {
        const found = categoryOptions.value.find(c => c.value === formData.value.category);
        return found ? found.title : '';
    });

    watch(() => formData.value.category, (newVal, oldVal) => {
        if (oldVal && newVal !== oldVal && props.modelValue) {
            const currentImage = formData.value.specs.image || '';
            formData.value.specs = { image: currentImage };
        }
    });

    const getTitle = computed(() => {
        if (props.apiEndpoint === 'components') {
            return 'Componentă';
        } else if (props.apiEndpoint === 'laptops') {
            return 'Laptop';
        } else if (props.apiEndpoint === 'monitors') {
            return 'Monitor';
        } else if (props.apiEndpoint === 'peripherals') {
            return 'Periferice';
        }

        return 'Produs';
    });

    const getIcon = computed(() => {
        if (props.apiEndpoint === 'components') {
            return 'mdi-cpu-64-bit';
        } else if (props.apiEndpoint === 'laptops') {
            return 'mdi-laptop';
        } else if (props.apiEndpoint === 'monitors') {
            return 'mdi-monitor';
        }

        return 'mdi-mouse';
    });

    watch(() => props.modelValue, (isOpen) => {
        if (isOpen) {
            if (props.mode === 'edit' && props.product) {
                const existingSpecs = props.product.specs ? { ...props.product.specs } : {};
                
                if (!existingSpecs.image && props.product.image) {
                    existingSpecs.image = props.product.image;
                }

                formData.value = { 
                    name: props.product.name, 
                    brand: props.product.brand, 
                    price: props.product.price, 
                    category: props.product.category,
                    specs: existingSpecs
                };
            } else {
                let defaultCategory = categoryOptions.value.length > 0 ? categoryOptions.value[0].value : '';
                formData.value = { 
                    name: '', 
                    brand: '', 
                    price: null, 
                    category: defaultCategory, 
                    specs: { image: '' } 
                };
            }
        }
    });

    const closeModal = () => {
        emit('update:modelValue', false);
    };

    const saveProduct = async () => {
        isSaving.value = true;
        
        const payload = { 
            ...formData.value, 
            price: Number(formData.value.price) 
        };

        try {
            let savedProduct = null;
            if (props.mode === 'add') {
                const response = await axios.post(`http://localhost:5000/server/${props.apiEndpoint}`, payload);
                savedProduct = { id: response.data.id, ...payload };
            } else {
                await axios.put(`http://localhost:5000/server/${props.apiEndpoint}/${props.product.id}`, payload);
                savedProduct = { id: props.product.id, ...payload };
            }
            
            emit('saved', savedProduct);
            closeModal();
        } catch (e) {
            console.error("Eroare la salvare:", e);
        } finally {
            isSaving.value = false;
        }
    };
</script>

<style scoped>
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

    .border-top {
        border-top: 1px solid var(--border-light);
    }
    
    .custom-input :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .custom-input :deep(.v-label) { 
        color: var(--text-main) !important; 
        opacity: 0.7; 
    }
    
    .custom-input :deep(.v-field:not(.v-field--focused) .v-field__outline) {
        color: var(--text-main) !important;
        opacity: 0.35 !important; 
    }

    .custom-select :deep(.v-field) { 
        border-radius: 4px; 
    }

    .custom-select :deep(.v-field__input), .custom-select :deep(.v-select__selection-text) { 
        color: var(--text-main) !important; 
    }

    .custom-select :deep(.v-label) { 
        color: var(--text-main) !important; 
        opacity: 0.7; 
    }

    .custom-select :deep(.v-field:not(.v-field--focused) .v-field__outline) {
        color: var(--text-main) !important;
        opacity: 0.35 !important; 
    }

    .max-height-modal {
        max-height: 65vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.3);
        border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.6);
    }
</style>