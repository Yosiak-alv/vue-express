import { defineStore } from 'pinia'
import axiosInstance from '@/utils/route';

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [],
        book: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchBooks() {
            this.books = [];
            this.loading = true;
            this.error = null; // Reset error state
            try {
                const response = await axiosInstance.get('/books');
                this.books = await response.data;
            } catch (error) {
                this.error = error;
                console.error(error);   
            } finally {
                this.loading = false;
            }
        },
        async fetchBook(id) {
            this.book = null;
            this.loading = true;
            this.error = null; // Reset error state
            try {
                const response = await axiosInstance.get(`/books/${id}`);
                this.book = await response.data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async storeBook(book) {
            this.loading = true;
            this.error = null; // Reset error state
            try {
                await axiosInstance.post('/books', book);
                this.books.push(book);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async updateBook(id,book) {
            this.loading = true;
            this.error = null; // Reset error state
            try {
                await axiosInstance.patch(`/books/${id}`, book);
                const index = this.books.findIndex(book => book._id === id);
                if (index !== -1) {
                    this.items[index] = response.data;
                }
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async deleteBook(id) {
            this.loading = true;
            this.error = null; // Reset error state
            try {
                await axiosInstance.delete(`/books/${id}`);
                this.items = this.books.filter(book => book._id !== id);
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }

});