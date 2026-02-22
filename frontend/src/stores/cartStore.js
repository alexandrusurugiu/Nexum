import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useCartStore = defineStore('cart', () => {
    const items = ref([]);
    const isLoading = ref(false);
    
    const userId = 'guest_user'; 

    const cartCount = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0);
    });

    const cartTotal = computed(() => {
        return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    const fetchCart = async () => {
        isLoading.value = true;
        try {
            const response = await axios.get(`http://localhost:5000/server/cart/${userId}`);
            if (response.data.success) {
                items.value = response.data.data;
            }
        } catch (error) {
            console.error("Eroare la încărcarea coșului:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const addToCart = async (product) => {
        const existingItem = items.value.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            items.value.push({ 
                ...product, 
                image: product.image || product.specs?.image,
                quantity: 1 
            });
        }

        try {
            await axios.post(`http://localhost:5000/server/cart/${userId}/add`, product);
        } catch (error) {
            console.error("Eroare la salvarea în coș:", error);
            fetchCart(); 
        }
    };

    const removeFromCart = async (productId, removeAll = false) => {
        const index = items.value.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (items.value[index].quantity > 1 && !removeAll) {
                items.value[index].quantity--;
            } else {
                items.value.splice(index, 1);
            }
        }

        try {
            const url = `http://localhost:5000/server/cart/${userId}/remove/${productId}${removeAll ? '?removeAll=true' : ''}`;
            await axios.delete(url);
        } catch (error) {
            console.error("Eroare la ștergerea din coș:", error);
            fetchCart();
        }
    };

    return { items, isLoading, cartCount, cartTotal, fetchCart, addToCart, removeFromCart };
});