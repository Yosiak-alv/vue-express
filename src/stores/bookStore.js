import { defineStore } from 'pinia'
import axiosInstance from '@/utils/route';

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [],
        book: null,
        loading: false,
        error: null
    }),
    getters:{
        getPost: (state) => (id) => {
            return state.books.find(book => book._id === id);
        }
    },
    actions: {
        async fetchBooks() {
            this.books = [];
            this.loading = true;
            try {
                const response = await axiosInstance.get('/books');
                this.books = await response.json();
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async fetchBook(id) {
            this.book = null;
            this.loading = true;
            try {
                const response = await axiosInstance.get(`/books/${id}`);
                this.book = await response.json();
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async storeBook(book) {
            this.loading = true;
            try {
                await axiosInstance.post('/books', book);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async updateBook(book) {
            this.loading = true;
            try {
                await axiosInstance.put(`/books/${book._id}`, book);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async deleteBook(id) {
            this.loading = true;
            try {
                await axiosInstance.delete(`/books/${id}`);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }

});