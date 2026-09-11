<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted, watch } from 'vue';
  import { useThemeStore } from '@/stores/themeStore';

  const themeStore = useThemeStore();
  const CHATBOT_ID = import.meta.env.VITE_CHATBASE_ID;

  const initChatbase = () => {
    window.embeddedChatbotConfig = {
      chatbotId: CHATBOT_ID,
      domain: "www.chatbase.co",
      styles: {
        theme: themeStore.isDark ? "dark" : "light",
        button: {
          backgroundColor: "#10B981"
        },
        chatWindow: {
          backgroundColor: themeStore.isDark ? "#1E1E1E" : "#FFFFFF"
        }
      }
    };

    if (!document.getElementById(CHATBOT_ID)) {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = CHATBOT_ID;
      script.setAttribute("chatbotId", CHATBOT_ID); 
      script.setAttribute("domain", "www.chatbase.co");
      script.defer = true;
      document.body.appendChild(script);
    }
  };

  onMounted(() => {
    if (CHATBOT_ID) {
      initChatbase();
    } else {
      console.warn("Chatbase ID nu a fost găsit în variabilele de mediu.");
    }
  });

  watch(() => themeStore.isDark, (newValue) => {
    if (window.embeddedChatbotConfig && window.embeddedChatbotConfig.styles) {
      window.embeddedChatbotConfig.styles.theme = newValue ? "dark" : "light";
    }
  });
</script>
