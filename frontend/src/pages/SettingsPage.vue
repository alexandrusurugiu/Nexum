<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-10">
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Setări Cont</h1>
                <p class="text-body-1 cloud-text opacity-80 mt-2">
                    Gestionează securitatea, notificările și preferințele tale.
                </p>
            </div>

            <v-row>
                <v-col cols="12" md="3">
                    <v-card class="settings-panel rounded-xl pa-5 mb-4" elevation="5">
                        <v-list bg-color="transparent" class="pa-0">
                            <v-list-item 
                                :class="['menu-item rounded-lg mb-2', { 'active-menu-item': activeTab === 'security' }]" 
                                @click="activeTab = 'security'" 
                                prepend-icon="mdi-shield-lock-outline"
                            >
                                <v-list-item-title class="font-weight-medium">Securitate & Parolă</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item 
                                :class="['menu-item rounded-lg mb-2', { 'active-menu-item': activeTab === 'notifications' }]" 
                                @click="activeTab = 'notifications'" 
                                prepend-icon="mdi-bell-outline"
                            >
                                <v-list-item-title class="font-weight-medium">Notificări</v-list-item-title>
                            </v-list-item>

                            <v-list-item 
                                :class="['menu-item rounded-lg mb-2', { 'active-menu-item': activeTab === 'preferences' }]" 
                                @click="activeTab = 'preferences'" 
                                prepend-icon="mdi-cog-outline"
                            >
                                <v-list-item-title class="font-weight-medium">Preferințe Site</v-list-item-title>
                            </v-list-item>

                            <v-divider class="border-opacity-25 my-4" color="#00CEC9"></v-divider>

                            <v-list-item class="menu-item danger-item rounded-lg" prepend-icon="mdi-delete-alert-outline" @click="confirmDeleteAccount">
                                <v-list-item-title class="font-weight-medium">Șterge Contul</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9">
                    
                    <v-card v-if="activeTab === 'security'" class="settings-panel rounded-xl pa-6 pa-md-8" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Schimbare Parolă</h2>
                        
                        <v-form @submit.prevent="updatePassword">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Parola Actuală</div>
                                    <v-text-field v-model="passwords.current" type="password" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input mb-2"></v-text-field>
                                </v-col>
                                
                                <v-col cols="12" md="8">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Parola Nouă</div>
                                    <v-text-field v-model="passwords.new" type="password" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input mb-2"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Confirmă Parola Nouă</div>
                                    <v-text-field v-model="passwords.confirm" type="password" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input mb-4"></v-text-field>
                                </v-col>
                            </v-row>
                            
                            <v-btn type="submit" color="#0984E3" size="large" class="rounded-lg neon-btn font-weight-bold">
                                Actualizează Parola
                            </v-btn>
                        </v-form>

                        <v-divider class="border-opacity-25 my-8" color="#00CEC9"></v-divider>

                        <h2 class="text-h5 font-weight-bold cloud-text mb-4">Autentificare în doi pași (2FA)</h2>
                        <div class="d-flex align-center justify-space-between flex-wrap">
                            <p class="cloud-text opacity-80 text-body-1 mb-4 mb-sm-0 mr-4">
                                Adaugă un strat suplimentar de securitate contului tău cerând un cod la logare.
                            </p>
                            <v-btn color="#00CEC9" variant="tonal" class="rounded-lg font-weight-bold">
                                Activează 2FA
                            </v-btn>
                        </div>
                    </v-card>

                    <v-card v-if="activeTab === 'notifications'" class="settings-panel rounded-xl pa-6 pa-md-8" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Preferințe Comunicare</h2>
                        
                        <v-list bg-color="transparent" class="pa-0">
                            <v-list-item class="px-0 mb-4">
                                <template v-slot:prepend>
                                    <v-switch v-model="notifications.orders" color="#00CEC9" hide-details class="custom-switch mr-4"></v-switch>
                                </template>
                                <v-list-item-title class="cloud-text font-weight-bold text-h6">Actualizări Comenzi</v-list-item-title>
                                <v-list-item-subtitle class="cloud-text opacity-70 mt-1" style="white-space: normal;">
                                    Primește email-uri când comanda ta este confirmată, expediată sau livrată. (Recomandat)
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item class="px-0 mb-4">
                                <template v-slot:prepend>
                                    <v-switch v-model="notifications.newsletter" color="#00CEC9" hide-details class="custom-switch mr-4"></v-switch>
                                </template>
                                <v-list-item-title class="cloud-text font-weight-bold text-h6">Noutăți și Promoții</v-list-item-title>
                                <v-list-item-subtitle class="cloud-text opacity-70 mt-1" style="white-space: normal;">
                                    Fii primul care află despre reducerile la componente și lansările noi de produse.
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item class="px-0">
                                <template v-slot:prepend>
                                    <v-switch v-model="notifications.sms" color="#00CEC9" hide-details class="custom-switch mr-4"></v-switch>
                                </template>
                                <v-list-item-title class="cloud-text font-weight-bold text-h6">Alerte SMS (Curier)</v-list-item-title>
                                <v-list-item-subtitle class="cloud-text opacity-70 mt-1" style="white-space: normal;">
                                    Primește un SMS în ziua livrării coletului de către curier.
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>

                        <div class="mt-8">
                            <v-btn color="#0984E3" size="large" class="rounded-lg neon-btn font-weight-bold" @click="savePreferences('Notificările')">
                                Salvează Preferințele
                            </v-btn>
                        </div>
                    </v-card>

                    <v-card v-if="activeTab === 'preferences'" class="settings-panel rounded-xl pa-6 pa-md-8" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Afișare și Localizare</h2>
                        
                        <v-row>
                            <v-col cols="12" md="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Tema Aplicației</div>
                                <v-select 
                                    v-model="preferences.theme" 
                                    :items="['Dark Mode (Implicit)', 'Light Mode', 'Sincronizare cu sistemul']" 
                                    variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"
                                ></v-select>
                            </v-col>
                            
                            <v-col cols="12" md="6">
                                <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Limba</div>
                                <v-select 
                                    v-model="preferences.language" 
                                    :items="['Română', 'English']" 
                                    variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <div class="mt-4">
                            <v-btn color="#0984E3" size="large" class="rounded-lg neon-btn font-weight-bold" @click="savePreferences('Setările de afișare')">
                                Aplică Modificările
                            </v-btn>
                        </div>
                    </v-card>

                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/authStore';
    import { useRouter } from 'vue-router';
    import AppHeader from '../components/AppHeader.vue';

    const authStore = useAuthStore();
    const router = useRouter();

    if (!authStore.isAuthenticated) {
        router.push('/profil');
    }

    const activeTab = ref('security');

    const passwords = ref({
        current: '',
        new: '',
        confirm: ''
    });

    const notifications = ref({
        orders: true,
        newsletter: false,
        sms: true
    });

    const preferences = ref({
        theme: 'Dark Mode',
        language: 'Română'
    });

    const updatePassword = () => {
        if (passwords.value.new !== passwords.value.confirm) {
            alert("Parolele noi nu se potrivesc!");
            return;
        }
        if (passwords.value.new.length < 6) {
            alert("Parola trebuie să aibă minim 6 caractere!");
            return;
        }
        
        alert("Parola a fost schimbată cu succes!");
        passwords.value = { current: '', new: '', confirm: '' };
    };

    const savePreferences = (type) => {
        alert(`${type} au fost salvate cu succes!`);
    };

    const confirmDeleteAccount = () => {
        const confirmed = confirm("Ești sigur că vrei să ștergi definitiv contul? Această acțiune este ireversibilă și vei pierde tot istoricul comenzilor.");
        if (confirmed) {
            alert("Contul a fost șters.");
            authStore.logout();
            router.push('/');
        }
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

    .opacity-70 { 
        opacity: 0.7; 
    }

    .settings-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
    }

    .menu-item {
        color: #F5F6FA !important;
        opacity: 0.7;
        transition: all 0.3s ease;
    }

    .menu-item:hover {
        opacity: 1;
        background-color: rgba(245, 246, 250, 0.05);
    }

    .active-menu-item {
        opacity: 1;
        color: #00CEC9 !important;
        background: rgba(0, 206, 201, 0.1) !important;
        border-left: 4px solid #00CEC9;
    }

    .danger-item {
        color: #ff7675 !important;
    }
    
    .danger-item:hover {
        background-color: rgba(214, 48, 49, 0.1);
        opacity: 1;
    }

    .custom-input :deep(.v-field__input) { 
        color: #F5F6FA !important; 
    }

    .custom-switch :deep(.v-selection-control__wrapper) {
        color: rgba(245, 246, 250, 0.3) !important;
    }

    .neon-btn {
        box-shadow: 0 0 15px rgba(9, 132, 227, 0.5);
        transition: all 0.3s ease;
    }
    
    .neon-btn:hover {
        box-shadow: 0 0 25px rgba(9, 132, 227, 0.8);
        transform: translateY(-2px);
    }
</style>