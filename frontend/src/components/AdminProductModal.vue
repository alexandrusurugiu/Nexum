<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600">
        <v-card class="rounded-xl pa-4 bg-panel">
            <v-card-title class="text-h5 cloud-text font-weight-bold mb-4">
                {{ mode === 'add' ? 'Adaugă Produs Nou' : 'Editează Produs' }}
            </v-card-title>
            
            <v-card-text>
                <v-text-field v-model="formData.name" label="Nume Produs" variant="outlined" color="#10B981" class="mb-4 custom-input" hide-details></v-text-field>
                <v-text-field v-model="formData.brand" label="Brand" variant="outlined" color="#10B981" class="mb-4 custom-input" hide-details></v-text-field>
                <v-text-field v-model="formData.price" label="Preț (Lei)" type="number" variant="outlined" color="#10B981" class="mb-4 custom-input" hide-details></v-text-field>
                <v-text-field v-model="formData.image" label="URL Imagine" variant="outlined" color="#10B981" class="mb-4 custom-input" hide-details></v-text-field>
                <v-text-field v-model="formData.category" label="Categorie (ex: procesoare, mousi)" variant="outlined" color="#10B981" class="custom-input" hide-details></v-text-field>
            </v-card-text>

            <v-card-actions class="px-6 pb-4 mt-4">
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" class="font-weight-bold rounded-lg" @click="closeModal">Anulează</v-btn>
                <v-btn color="#10B981" variant="flat" class="font-weight-bold px-6 rounded-lg text-white" @click="saveProduct" :loading="isSaving">Salvează</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import axios from 'axios';

    const props = defineProps({
        modelValue: Boolean,
        mode: String,
        product: Object,
        collectionName: String
    });

    const emit = defineEmits(['update:modelValue', 'saved']);
    const isSaving = ref(false);
    const formData = ref({ name: '', 
        brand: '', 
        price: null, 
        image: '', 
        category: '' 
    });

    watch(() => props.modelValue, (isOpen) => {
        if (isOpen) {
            if (props.mode === 'edit' && props.product) {
                formData.value = { 
                    name: props.product.name, 
                    brand: props.product.brand, 
                    price: props.product.price, 
                    image: props.product.image || props.product.specs?.image, 
                    category: props.product.category 
                };
            } else {
                formData.value = { name: '', 
                    brand: '', 
                    price: null, 
                    image: '', 
                    category: '' 
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
            collectionName: props.collectionName,
            productData: { ...formData.value, price: Number(formData.value.price) }
        };

        try {
            let savedId = null;
            
            if (props.mode === 'add') {
                const response = await axios.post('http://localhost:5000/server/admin/product', payload);
                savedId = response.data.id;
            } else {
                await axios.put(`http://localhost:5000/server/admin/product/${props.product.id}`, payload);
                savedId = props.product.id;
            }
            
            emit('saved', { id: savedId, ...payload.productData });
            closeModal();
        } catch (e) {
            console.error(e);
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

    .custom-input :deep(.v-field:hover:not(.v-field--focused) .v-field__outline) {
        opacity: 0.55 !important;
    }
</style>