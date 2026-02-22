<template>
    <v-app class="nexum-bg">
        <AppHeader />

        <v-main class="pb-16 px-4 px-md-10 mt-10">
            
            <div class="mb-8">
                <h1 class="text-h3 font-weight-black cloud-text">Contul Meu</h1>
            </div>

            <v-row v-if="authStore.isAuthenticated">
                <v-col cols="12" md="3">
                    <v-card class="profile-panel rounded-xl pa-5 mb-4" elevation="5">
                        <div class="d-flex align-center mb-6">
                            <v-avatar size="60" class="border-cyan mr-4" color="rgba(30,39,46,0.5)">
                                <v-img :src="authStore.user.avatar"></v-img>
                            </v-avatar>
                            <div>
                                <div class="text-caption cyan-text font-weight-bold">Salut,</div>
                                <div class="text-h6 cloud-text font-weight-bold line-clamp-1" style="line-height: 1.2;">
                                    {{ authStore.user.name }}
                                </div>
                            </div>
                        </div>

                        <v-divider class="border-opacity-25 mb-4" color="#00CEC9"></v-divider>

                        <v-list bg-color="transparent" class="pa-0">
                            <v-list-item 
                                :class="['menu-item rounded-lg mb-2', { 'active-menu-item': activeTab === 'profile' }]" 
                                @click="activeTab = 'profile'" 
                                prepend-icon="mdi-account-details"
                            >
                                <v-list-item-title class="font-weight-medium">Date Personale</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item 
                                :class="['menu-item rounded-lg mb-2', { 'active-menu-item': activeTab === 'orders' }]" 
                                @click="activeTab = 'orders'" 
                                prepend-icon="mdi-package-variant"
                            >
                                <v-list-item-title class="font-weight-medium">Comenzile Mele</v-list-item-title>
                            </v-list-item>

                            <v-list-item class="menu-item logout-item rounded-lg mt-8" prepend-icon="mdi-logout" @click="handleLogout">
                                <v-list-item-title class="font-weight-medium">Deconectare</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <v-col cols="12" md="9">
                    <v-card v-if="activeTab === 'profile'" class="profile-panel rounded-xl pa-6 pa-md-8" elevation="5">
                        <h2 class="text-h5 font-weight-bold cloud-text mb-6">Informații Cont</h2>
                        <v-form @submit.prevent="saveProfile">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Nume Complet</div>
                                    <v-text-field v-model="editForm.name" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă Email</div>
                                    <v-text-field :model-value="authStore.user.email" disabled variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input disabled-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Telefon</div>
                                    <v-text-field v-model="editForm.phone" placeholder="07xx xxx xxx" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">URL Avatar (Opțional)</div>
                                    <v-text-field v-model="editForm.avatar" placeholder="https://..." variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă de Livrare</div>
                                    <v-textarea v-model="editForm.address" rows="3" placeholder="Strada, Număr, Oraș, Județ, Cod Poștal" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.2)" class="custom-input"></v-textarea>
                                </v-col>
                            </v-row>
                            
                            <div class="d-flex justify-end mt-4">
                                <v-btn type="submit" color="#0984E3" size="large" class="rounded-lg neon-btn px-8 font-weight-bold" :loading="authStore.isLoading">
                                    Salvează Modificările
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card>

                    <v-card v-if="activeTab === 'orders'" class="profile-panel rounded-xl pa-16 text-center" elevation="5">
                        <v-icon size="80" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-package-variant-closed</v-icon>
                        <h2 class="text-h5 cloud-text font-weight-bold">Nu ai plasat nicio comandă</h2>
                        <p class="cloud-text opacity-80 mt-2 mb-6">Aici vor apărea toate comenzile tale după ce finalizezi cumpărăturile din coș.</p>
                        <v-btn color="#00CEC9" variant="tonal" class="rounded-lg" to="/home">
                            Începe Cumpărăturile
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-else justify="center">
                <v-col cols="12" md="5" lg="4">
                    <v-card class="profile-panel rounded-xl pa-8 h-100" elevation="10">
                        <h2 class="text-h5 font-weight-black cloud-text mb-6">Client Existent</h2>
                        
                        <v-alert v-if="authStore.errorMsg && isLoginAttempt" type="error" variant="tonal" class="mb-4 rounded-lg">
                            {{ authStore.errorMsg }}
                        </v-alert>

                        <v-form @submit.prevent="submitLogin">
                            <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă Email</div>
                            <v-text-field v-model="loginForm.email" type="email" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.4)" class="custom-input mb-2" required></v-text-field>
                            
                            <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Parolă</div>
                            <v-text-field v-model="loginForm.password" type="password" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.4)" class="custom-input mb-6" required></v-text-field>

                            <v-btn type="submit" block color="#0984E3" size="x-large" class="rounded-lg neon-btn font-weight-bold" :loading="authStore.isLoading && isLoginAttempt">
                                Intră în cont
                            </v-btn>
                        </v-form>
                    </v-card>
                </v-col>

                <v-col cols="12" md="1" class="d-none d-md-flex justify-center align-center">
                    <div class="vertical-divider"></div>
                </v-col>

                <v-col cols="12" md="5" lg="4">
                    <v-card class="profile-panel rounded-xl pa-8 h-100" elevation="10">
                        <h2 class="text-h5 font-weight-black cloud-text mb-6">Client Nou</h2>
                        
                        <v-alert v-if="authStore.errorMsg && !isLoginAttempt" type="error" variant="tonal" class="mb-4 rounded-lg">
                            {{ authStore.errorMsg }}
                        </v-alert>

                        <v-form @submit.prevent="submitRegister">
                            <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Nume Complet</div>
                            <v-text-field v-model="registerForm.name" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.4)" class="custom-input mb-2" required></v-text-field>

                            <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă Email</div>
                            <v-text-field v-model="registerForm.email" type="email" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.4)" class="custom-input mb-2" required></v-text-field>
                            
                            <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Parolă</div>
                            <v-text-field v-model="registerForm.password" type="password" variant="outlined" color="#00CEC9" base-color="rgba(245, 246, 250, 0.4)" class="custom-input mb-6" required></v-text-field>

                            <v-btn type="submit" block color="#00CEC9" variant="tonal" size="x-large" class="rounded-lg font-weight-bold" :loading="authStore.isLoading && !isLoginAttempt">
                                Creează Cont
                            </v-btn>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>

        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, watch, onMounted } from 'vue';
    import { useAuthStore } from '../stores/authStore';
    import AppHeader from '../components/AppHeader.vue';

    const authStore = useAuthStore();
    const activeTab = ref('profile');
    const isLoginAttempt = ref(true);
    const loginForm = ref({ 
        email: '', 
        password: '' 
    });
    const registerForm = ref({ 
        name: '', 
        email: '', 
        password: '' 
    });
    const editForm = ref({ 
        name: '', 
        phone: '', 
        address: '', 
        avatar: '' 
    });

    const populateEditForm = () => {
        if (authStore.user) {
            editForm.value = { 
                name: authStore.user.name || '', 
                phone: authStore.user.phone || '', 
                address: authStore.user.address || '', 
                avatar: authStore.user.avatar || '' 
            };
        }
    };

    onMounted(populateEditForm);
    watch(() => authStore.user, populateEditForm);

    const submitLogin = async () => {
        isLoginAttempt.value = true;
        const success = await authStore.login(loginForm.value.email, loginForm.value.password);
        if (success) {
            loginForm.value = { email: '', password: '' }; 
        }
    };

    const submitRegister = async () => {
        isLoginAttempt.value = false;
        const success = await authStore.register(registerForm.value.name, registerForm.value.email, registerForm.value.password);
        if (success) {
            registerForm.value = { name: '', email: '', password: '' }; 
        }
    };

    const saveProfile = async () => {
        const success = await authStore.updateProfile(editForm.value);
        if (success) {
            alert("Datele au fost salvate cu succes!");
        }
    };

    const handleLogout = () => {
        authStore.logout();
        activeTab.value = 'profile';
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

    .profile-panel {
        background-color: #253038 !important;
        border: 1px solid rgba(245, 246, 250, 0.05);
    }

    .border-cyan { 
        border: 2px solid rgba(0, 206, 201, 0.5); 
    }

    .vertical-divider {
        height: 70%;
        width: 1px;
        background-color: rgba(245, 246, 250, 0.1);
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

    .logout-item {
        color: #ff7675 !important;
    }

    .logout-item:hover {
        background-color: rgba(214, 48, 49, 0.1);
    }

    .custom-input :deep(.v-field__input) { 
        color: #F5F6FA !important; 
    }
    
    .disabled-input :deep(.v-field) {
        background-color: rgba(245, 246, 250, 0.03) !important;
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