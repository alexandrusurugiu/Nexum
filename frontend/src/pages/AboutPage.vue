<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-10">
            <div class="mb-10 text-center">
                <h1 class="text-h3 font-weight-black cloud-text">Contact <span class="cyan-text">& Informații Legale</span></h1>
                <p class="cloud-text opacity-70 mt-3 text-body-1">
                    Aici găsești toate datele noastre de identificare și formularul de contact.
                </p>
            </div>

            <v-row justify="center" class="mt-4">
                <v-col cols="12" md="5" lg="4" class="d-flex flex-column gap-4">
                    
                    <v-card class="bg-panel rounded-xl pa-6 mb-4" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Suport Clienți</h2>
                        
                        <div class="d-flex align-center mb-4">
                            <v-avatar color="rgba(16, 185, 129, 0.1)" size="45" class="mr-4 border-cyan">
                                <v-icon color="#10B981">mdi-email-outline</v-icon>
                            </v-avatar>
                            <div>
                                <div class="text-caption cloud-text opacity-70">Email</div>
                                <div class="font-weight-bold cloud-text text-body-1">contact@nexum.ro</div>
                            </div>
                        </div>

                        <div class="d-flex align-center mb-6">
                            <v-avatar color="rgba(16, 185, 129, 0.1)" size="45" class="mr-4 border-cyan">
                                <v-icon color="#10B981">mdi-phone-outline</v-icon>
                            </v-avatar>
                            <div>
                                <div class="text-caption cloud-text opacity-70">Telefon (L-V: 09:00 - 18:00)</div>
                                <div class="font-weight-bold cloud-text text-body-1">031 123 4567</div>
                            </div>
                        </div>
                    </v-card>

                    <v-card class="bg-panel rounded-xl pa-6 mb-4" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6 d-flex align-center">
                            <v-icon color="#10B981" class="mr-2">mdi-domain</v-icon>
                            Date Companie
                        </h2>
                        
                        <div class="cloud-text text-body-2 mb-2">
                            <span class="opacity-70">Denumire:</span> <strong class="ml-1">S.C. NEXUM IT S.R.L.</strong>
                        </div>
                        <div class="cloud-text text-body-2 mb-2">
                            <span class="opacity-70">C.U.I / C.I.F:</span> <strong class="ml-1">RO12345678</strong>
                        </div>
                        <div class="cloud-text text-body-2 mb-2">
                            <span class="opacity-70">Reg. Comerțului:</span> <strong class="ml-1">J40/1234/2026</strong>
                        </div>
                        <div class="cloud-text text-body-2 mb-2">
                            <span class="opacity-70">Capital social:</span> <strong class="ml-1">200 RON</strong>
                        </div>
                        <div class="cloud-text text-body-2 mb-4">
                            <span class="opacity-70">Sediu Social:</span> <strong class="ml-1">București, Sector 1, Str. Paris Nr. 40</strong>
                        </div>
                    </v-card>

                    <v-card class="bg-panel rounded-xl pa-6" elevation="5">
                        <h3 class="text-subtitle-1 font-weight-bold cloud-text mb-4">Protecția Consumatorului</h3>
                        
                        <v-btn 
                            href="https://anpc.ro/" 
                            target="_blank" 
                            variant="outlined" 
                            color="#10B981" 
                            class="mb-3 w-100 rounded-lg justify-start"
                            prepend-icon="mdi-shield-check-outline"
                        >
                            ANPC - anpc.ro
                        </v-btn>

                        <v-btn 
                            href="https://ec.europa.eu/consumers/odr" 
                            target="_blank" 
                            variant="outlined" 
                            color="#10B981" 
                            class="w-100 rounded-lg justify-start text-none"
                            prepend-icon="mdi-gavel"
                        >
                            Platforma SOL (Litigii)
                        </v-btn>
                    </v-card>

                </v-col>

                <v-col cols="12" md="7" lg="6">
                    <v-card class="bg-panel rounded-xl pa-6 pa-md-10 h-100" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Trimite-ne un mesaj</h2>
                        
                        <v-form @submit.prevent="submitForm" ref="contactForm">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2 ml-1">Numele tău</div>
                                    <v-text-field v-model="form.name" placeholder="Popescu Ion" variant="outlined" color="#10B981" class="custom-input" :rules="rules.required" hide-details="auto"></v-text-field>
                                </v-col>
                                
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2 ml-1">Adresa de Email</div>
                                    <v-text-field v-model="form.email" type="email" placeholder="nume@email.com" variant="outlined" color="#10B981" class="custom-input" :rules="rules.email" hide-details="auto"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2 ml-1">Subiect</div>
                                    <v-text-field v-model="form.subject" placeholder="Ex: Informații comandă #12345" variant="outlined" color="#10B981" class="custom-input" :rules="rules.required" hide-details="auto"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2 ml-1">Mesajul tău</div>
                                    <v-textarea v-model="form.message" placeholder="Scrie aici detaliile..." variant="outlined" color="#10B981" class="custom-input" rows="6" :rules="rules.required" hide-details="auto"></v-textarea>
                                </v-col>

                                <v-col cols="12" class="mt-4 d-flex justify-end">
                                    <v-btn type="submit" color="#10B981" size="x-large" class="rounded-lg font-weight-bold px-10 neon-btn w-100 w-sm-auto" style="color: var(--bg-main) !important; letter-spacing: 1px;" :loading="isSubmitting">
                                        Trimite Mesajul
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>

                        <v-expand-transition>
                            <v-alert v-if="showSuccess" type="success" variant="tonal" class="mt-6 rounded-lg d-flex align-center" icon="mdi-check-circle-outline">
                                Mesajul tău a fost trimis cu succes! Echipa noastră îți va răspunde în cel mai scurt timp pe email.
                            </v-alert>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref } from 'vue';
    import AppHeader from '../components/AppHeader.vue';

    const contactForm = ref(null);
    const isSubmitting = ref(false);
    const showSuccess = ref(false);

    const form = ref({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const rules = {
        required: [v => !!v || 'Acest câmp este obligatoriu'],
        email: [
            v => !!v || 'Emailul este obligatoriu',
            v => /.+@.+\..+/.test(v) || 'Te rugăm să introduci un email valid'
        ]
    };

    const submitForm = async () => {
        const { valid } = await contactForm.value.validate();
        
        if (!valid) return;

        isSubmitting.value = true;
        showSuccess.value = false;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showSuccess.value = true;
            
            form.value = { name: '', email: '', subject: '', message: '' };
            contactForm.value.resetValidation();
            
            setTimeout(() => { showSuccess.value = false; }, 5000);

        } catch (error) {
            console.error('Eroare la trimiterea mesajului:', error);
        } finally {
            isSubmitting.value = false;
        }
    };
</script>

<style scoped>
    .nexum-bg { 
        background-color: var(--bg-main) !important; 
    }

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

    .opacity-80 { opacity: 0.8; }
    .opacity-70 { opacity: 0.7; }

    .border-cyan { 
        border: 1px solid rgba(16, 185, 129, 0.3) !important; 
    }

    .custom-input :deep(.v-field) {
        border-radius: 8px;
    }

    .custom-input :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .custom-input :deep(.v-field:not(.v-field--focused) .v-field__outline) {
        color: var(--text-main) !important;
        opacity: 0.35 !important; 
    }

    .custom-input :deep(.v-field:hover:not(.v-field--focused) .v-field__outline) {
        opacity: 0.55 !important;
    }

    .neon-btn {
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    .neon-btn:hover {
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
        transform: translateY(-2px);
    }
    
    .gap-4 {
        gap: 1rem;
    }
</style>