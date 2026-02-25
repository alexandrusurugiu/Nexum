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

                        <v-divider class="border-opacity-25 mb-4" color="#10B981"></v-divider>

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
                                    <v-text-field v-model="editForm.name" variant="outlined" color="#10B981" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă Email</div>
                                    <v-text-field :model-value="authStore.user.email" disabled variant="outlined" color="#10B981" class="custom-input disabled-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Telefon</div>
                                    <v-text-field v-model="editForm.phone" placeholder="07xx xxx xxx" variant="outlined" color="#10B981" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">URL Avatar (Opțional)</div>
                                    <v-text-field v-model="editForm.avatar" placeholder="https://..." variant="outlined" color="#10B981" class="custom-input"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <div class="text-subtitle-2 cloud-text opacity-80 mb-2">Adresă de Livrare</div>
                                    <v-textarea v-model="editForm.address" rows="3" placeholder="Strada, Număr, Oraș, Județ, Cod Poștal" variant="outlined" color="#10B981" class="custom-input"></v-textarea>
                                </v-col>
                            </v-row>
                            
                            <div class="d-flex justify-end mt-4">
                                <v-btn type="submit" color="#059669" size="large" class="rounded-lg neon-btn px-8 font-weight-bold" :loading="authStore.isLoading">
                                    Salvează Modificările
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card>

                    <v-card v-if="activeTab === 'orders'" class="profile-panel rounded-xl pa-16 text-center" elevation="5">
                        <v-icon size="80" color="rgba(245, 246, 250, 0.1)" class="mb-4">mdi-package-variant-closed</v-icon>
                        <h2 class="text-h5 cloud-text font-weight-bold">Nu ai plasat nicio comandă</h2>
                        <p class="cloud-text opacity-80 mt-2 mb-6">Aici vor apărea toate comenzile tale după ce finalizezi cumpărăturile din coș.</p>
                        <v-btn color="#10B981" variant="tonal" class="rounded-lg" to="/home">
                            Începe Cumpărăturile
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-else justify="center" align="center" class="mt-4">
                <v-col cols="12" md="6" lg="5">
                    <v-card class="auth-card rounded-xl pa-8 pa-sm-10" elevation="15">
                        
                        <div class="text-center mb-8">
                            <v-icon size="64" color="#10B981" class="mb-4 drop-shadow-cyan">
                                {{ isLogin ? 'mdi-shield-account' : 'mdi-account-plus-outline' }}
                            </v-icon>
                            <h2 class="text-h4 font-weight-black cloud-text mb-2">
                                {{ isLogin ? 'Bine ai revenit' : 'Creează un cont' }}
                            </h2>
                            <p class="cloud-text opacity-50 text-body-2 px-4">
                                {{ isLogin ? 'Introdu datele pentru a accesa configurațiile și comenzile tale.' : 'Alătură-te comunității și bucură-te de o experiență premium.' }}
                            </p>
                        </div>

                        <div class="custom-toggle-wrapper mb-8">
                            <div class="toggle-slider" :class="{ 'is-right': !isLogin }"></div>
                            <button class="toggle-btn" :class="{ 'active': isLogin }" @click="isLogin = true">Autentificare</button>
                            <button class="toggle-btn" :class="{ 'active': !isLogin }" @click="isLogin = false">Cont Nou</button>
                        </div>

                        <v-alert v-if="authStore.errorMsg" type="error" variant="tonal" class="mb-6 rounded-lg text-body-2 auth-alert">
                            {{ authStore.errorMsg }}
                        </v-alert>

                        <div class="form-container">
                            <transition name="fade-slide" mode="out-in">
                                
                                <v-form v-if="isLogin" @submit.prevent="submitLogin" key="login">
                                    <div class="text-subtitle-2 cloud-text font-weight-bold mb-2 ml-1">Adresă Email</div>
                                    <v-text-field v-model="loginForm.email" type="email" placeholder="nume@email.com" required variant="outlined" color="#10B981" base-color="rgba(245, 246, 250, 0.15)" class="custom-input mb-2" prepend-inner-icon="mdi-email-outline"></v-text-field>
                                    
                                    <div class="text-subtitle-2 cloud-text font-weight-bold mb-2 ml-1">Parolă</div>
                                    <v-text-field v-model="loginForm.password" type="password" placeholder="••••••••" required variant="outlined" color="#10B981" base-color="rgba(245, 246, 250, 0.15)" class="custom-input mb-6" prepend-inner-icon="mdi-lock-outline"></v-text-field>

                                    <v-btn type="submit" block color="#059669" size="x-large" class="rounded-xl neon-btn font-weight-black text-uppercase" style="letter-spacing: 1px;" :loading="authStore.isLoading">
                                        Intră în Cont
                                    </v-btn>
                                </v-form>

                                <v-form v-else @submit.prevent="submitRegister" key="register">
                                    <div class="text-subtitle-2 cloud-text font-weight-bold mb-2 ml-1">Nume Complet</div>
                                    <v-text-field v-model="registerForm.name" placeholder="Popescu Ion" required variant="outlined" color="#10B981" base-color="rgba(245, 246, 250, 0.15)" class="custom-input mb-2" prepend-inner-icon="mdi-account-outline"></v-text-field>

                                    <div class="text-subtitle-2 cloud-text font-weight-bold mb-2 ml-1">Adresă Email</div>
                                    <v-text-field v-model="registerForm.email" type="email" placeholder="nume@email.com" required variant="outlined" color="#10B981" base-color="rgba(245, 246, 250, 0.15)" class="custom-input mb-2" prepend-inner-icon="mdi-email-outline"></v-text-field>
                                    
                                    <div class="text-subtitle-2 cloud-text font-weight-bold mb-2 ml-1">Parolă (Minim 6 caractere)</div>
                                    <v-text-field v-model="registerForm.password" type="password" placeholder="••••••••" required variant="outlined" color="#10B981" base-color="rgba(245, 246, 250, 0.15)" class="custom-input mb-6" prepend-inner-icon="mdi-lock-outline"></v-text-field>

                                    <v-btn type="submit" block color="#10B981" size="x-large" class="rounded-xl font-weight-black text-uppercase auth-register-btn" style="color: var(--bg-main) !important; letter-spacing: 1px;" :loading="authStore.isLoading">
                                        Creează Cont
                                    </v-btn>
                                </v-form>

                            </transition>
                        </div>
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
    const isLogin = ref(true); 

    const loginForm = ref({ email: '', password: '' });
    const registerForm = ref({ name: '', email: '', password: '' });
    
    const editForm = ref({ name: '', phone: '', address: '', avatar: '' });

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
        const success = await authStore.login(loginForm.value.email, loginForm.value.password);
        if (success) loginForm.value = { email: '', password: '' }; 
    };

    const submitRegister = async () => {
        const success = await authStore.register(registerForm.value.name, registerForm.value.email, registerForm.value.password);
        if (success) registerForm.value = { name: '', email: '', password: '' }; 
    };

    const saveProfile = async () => {
        const success = await authStore.updateProfile(editForm.value);
        if (success) alert("Datele au fost salvate cu succes!");
    };

    const handleLogout = () => {
        authStore.logout();
        activeTab.value = 'profile';
        isLogin.value = true;
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

    .opacity-80 { 
        opacity: 0.8; 
    }

    .opacity-50 { 
        opacity: 0.5; 
    }

    .profile-panel {
        background-color: var(--bg-panel) !important;
        border: 1px solid var(--border-light);
    }
    .border-cyan { 
        border: 1px solid rgba(16, 185, 129, 0.5) !important; 
    }

    .menu-item { 
        color: var(--text-main) !important; 
        opacity: 0.7; 
        transition: all 0.3s ease; 
    }

    .menu-item:hover { 
        opacity: 1; 
        background-color: var(--border-light); 
    }

    .active-menu-item { 
        opacity: 1; 
        color: #10B981 !important; 
        background: rgba(16, 185, 129, 0.1) !important; 
        border-left: 4px solid #10B981; 
    }

    .logout-item { 
        color: rgb(220, 38, 38) !important; 
    }

    .logout-item:hover { 
        background-color: rgba(214, 48, 49, 0.1); 
    }

    .disabled-input :deep(.v-field) { 
        background-color: rgba(245, 246, 250, 0.03) !important; 
    }

    .line-clamp-1 { 
        display: -webkit-box; 
        -webkit-line-clamp: 1; 
        -webkit-box-orient: vertical; 
        overflow: hidden; 
    }
    
    .auth-card {
        background-color: #253038 !important;
        border: 1px solid var(--border-light);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.05) !important;
    }

    .drop-shadow-cyan {
        filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.6));
    }

    .custom-toggle-wrapper {
        position: relative;
        display: flex;
        background: rgba(15, 20, 25, 0.6); 
        border-radius: 30px;
        padding: 5px;
        border: 1px solid var(--border-light);
    }

    .toggle-slider {
        position: absolute;
        top: 5px;
        bottom: 5px;
        left: 5px;
        width: calc(50% - 5px);
        background: linear-gradient(90deg, #059669, #10B981);
        border-radius: 25px;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .toggle-slider.is-right {
        transform: translateX(100%);
    }

    .toggle-btn {
        flex: 1;
        position: relative;
        z-index: 1;
        background: transparent;
        border: none;
        color: var(--text-main);
        font-weight: 700;
        font-size: 0.95rem;
        padding: 12px 0;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.3s ease, color 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .toggle-btn.active {
        opacity: 1;
        color: #ffffff;
    }

    .custom-input :deep(.v-field) {
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .custom-input :deep(.v-field--focused) {
        background-color: rgba(16, 185, 129, 0.03);
    }
    
    .custom-input :deep(.v-field__input) { 
        color: var(--text-main) !important; 
    }

    .neon-btn {
      background-color: #10B981 !important; 
      color: var(--bg-main) !important; 
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
      transition: all 0.3s ease;
  }

    .neon-btn:hover {
      background-color: #059669 !important;
      color: var(--text-main) !important;
      transform: translateY(-2px); 
      box-shadow: 0 12px 25px rgba(16, 185, 129, 0.25) !important;
  }

    .auth-register-btn {
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .auth-register-btn:hover {
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
        transform: translateY(-2px);
    }

    .form-container {
        position: relative;
        overflow: hidden; 
    }

    .fade-slide-enter-active, .fade-slide-leave-active {
        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .fade-slide-enter-from {
        opacity: 0;
        transform: translateX(30px);
    }

    .fade-slide-leave-to {
        opacity: 0;
        transform: translateX(-30px);
    }
</style>