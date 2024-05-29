import { defineStore } from 'pinia';

export const useFlashMessageStore = defineStore('flashMessage', {
    state: () => ({
        message: ''
    }),
    getters: {
        flashMessage: (state) => state.message 
    },
    actions: {
        setFlashMessage(message) {
            this.message = message;
            setTimeout(() => {
                this.message = '';
            }, 3000); // Adjust the timeout as needed
        },
        clearFlashMessage() {
            this.message = '';
        }
    }
});