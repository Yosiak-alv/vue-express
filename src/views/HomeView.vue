<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useFlashMessageStore } from '@/stores/flashMessageStore.js';
import { useBookStore } from '@/stores/bookStore.js';
import { storeToRefs } from 'pinia'

//fetch books
const { books, loading, error } = storeToRefs(useBookStore());
const { fetchBooks } = useBookStore();
fetchBooks();

//flash message
const flashMessageStore = useFlashMessageStore();
const flashMessage = computed(() => flashMessageStore.message);

</script>
<template>
    <div v-if="flashMessage" class="flash-message">
        {{ flashMessage }}
    </div>
    <div class="container"> 
        <div v-if="loading" class="text-center mt-4">
            <div class="spinner-border text-primary " role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>   
        <div v-else-if="error" class="alert alert-danger mt-4">
            <strong>{{error.code}}:</strong> {{error.message}}<br><br>
        </div>       
        <div class="row mt-5 mb-4" v-else-if="books">
            <div class="p-5 bg-light border rounded-3">
                <div class="col-md-10 offset-md-1 ">
                    <h1 class="h1">Express Books</h1>
                </div>
                <div class="col-md-10 offset-md-1 ">
                    <div class="row mt-5">
                        <div class="col-md-6 text-right">
                            <router-link to="/book/create" class="btn btn-primary">Create Book</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-10 offset-md-1">
                    <table class="table mt-3">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Author</th>
                                <th scope="col">Year</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(book, index) in books" :key="book._id">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ book.title }}</td>
                                <td>{{ book.author }}</td>
                                <td>{{ book.year }}</td>
                                <td>
                                    <router-link :to="`/book/${book._id}`" class="btn btn-primary">Show</router-link>
                                </td>
                            </tr>
                            <tr v-if="books.length === 0" class="text-center">
                                <td colspan="5">No Books data in our database.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>