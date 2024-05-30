<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { reactive , ref, onMounted} from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { storeToRefs } from 'pinia';

import { useFlashMessageStore } from '@/stores/flashMessageStore.js';

import intus from "intus";
import { isRequired, isMin, isMax, isNumeric } from 'intus/rules';

const props = defineProps({
    id: String
});

const { book, loading, error } = storeToRefs(useBookStore());
const { updateBook, fetchBook } = useBookStore();

onMounted(async () => {
    await fetchBook(props.id);
});

const form = reactive({
    title: book.value?.title,
    author: book.value?.author,
    year: book.value?.year
});

const router = useRouter();
const flashMessageStore = useFlashMessageStore();

const errors = ref({});
const onUpdate  = async () => {
    let validation = intus.validate(form, {
        title: [isRequired(), isMin(3), isMax(50)],
        author: [isRequired(), isMin(3), isMax(50)],
        year: [isRequired(), isNumeric(), isMin(1900), isMax(new Date().getFullYear())]
    });

    errors.value = validation.errors();

    if(validation.passes()){
        await updateBook(props.id, form);
        if (!error.value) {
            flashMessageStore.setFlashMessage('Book updated successfully');
            router.push({name:'home'});
        }
    }
}
</script>

<template>
    <div class="container mt-4">
        <div class="row mt-4">
            <div class="col-md-6 offset-md-3 p-4 bg-light border rounded-3">
                <header class="mt-4">  
                    <h3> Edit Book</h3>
                    <p>
                        Edit a book with the following form.
                    </p>
                    <router-link :to="`/book/${props.id}`" class="btn btn-primary">go Back</router-link>
                </header>
                <form @submit.prevent="onUpdate" class="mt-4">
                    <div class="mb-3">
                        <label for="title" class="form-label">Title*</label>
                        <!-- <input v-model="title" v-bind="titleAttrs" type="text" name="title" id="title" class="form-control rounded" placeholder="Calculo II"> -->
                        <input v-model="form.title"type="text" name="title" id="title" class="form-control rounded" placeholder="Calculo II">
                        <span v-if="errors.title" class="text-danger">{{ errors.title }}</span>
                    </div>
                    <div class="mb-3">
                        <label for="author" class="form-label rounded">Author*</label>
                        <!-- <input v-model="author" v-bind="authorAttrs" type="text" name="author" id="author" class="form-control rounded" placeholder="Jose Romero"> -->
                        <input v-model="form.author" type="text" name="author" id="author" class="form-control rounded" placeholder="Jose Romero">
                        <span v-if="errors.author" class="text-danger">{{ errors.author }}</span>
                    </div>
                    <div class="mb-3">
                        <label for="year" class="form-label rounded">Year*</label>
                        <!-- <input v-model="year" v-bind="yearAttrs" type="number" name="year" id="year" class="form-control rounded" placeholder="2024"> -->
                        <input v-model="form.year" type="number" name="year" id="year" class="form-control rounded" placeholder="2024">
                        <span v-if="errors.year" class="text-danger">{{ errors.year }}</span>
                    </div>

                    <div class="col-12 text-right">
                        <button  class="btn btn-primary mt-3 mb-3" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Update Book
                        </button>
                    </div>
                </form>
           </div> 
           <div v-if="error" class="alert alert-danger mt-3">
                {{ error.message }} <br>
                <div v-if="error.response?.data?.error">
                    <span  v-for="error in error?.response?.data?.error" :key="error">
                        {{ error }} <br>
                    </span>
                </div>
           </div>
        </div>
    </div>
</template>