<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { reactive , ref, watchEffect} from 'vue';
import { watch , computed } from 'vue';
import { editBook, getBook } from '@/services/BookServices.js';
import { useFlashMessageStore } from '@/stores/flashMessageStore.js';

import intus from "intus";
import { isRequired, isMin, isMax, isNumeric } from 'intus/rules';

const props = defineProps({
    id: String
});

const { data, isLoading: isFetching, isError, error } = getBook(props.id);
const form = reactive({
    title: '',
    author: '',
    year: '',
});
watchEffect(() => {
    if (data.value) {
        form.title = data.value.title;
        form.author = data.value.author;
        form.year = data.value.year;
    }
});

const { isError: isMutateError, error: mutateError, isSuccess, mutate } = editBook(props.id);
const errors = ref({});
const onUpdate  = () => {
    let validation = intus.validate(form, {
        title: [isRequired(), isMin(3), isMax(50)],
        author: [isRequired(), isMin(3), isMax(50)],
        year: [isRequired(), isNumeric(), isMin(1900), isMax(new Date().getFullYear())]
    });

    errors.value = validation.errors();

    if(validation.passes()){
        mutate(form);
    }
}
const router = useRouter();
const flashMessageStore = useFlashMessageStore();
watch(isSuccess, (value) => {
    if (value) {
        flashMessageStore.setFlashMessage('Book Created Successfully!');
        router.push({ name: 'home'});
    }
});

</script>

<template>
    <div class="container mt-4">
        <!-- error messages --> 
        <div v-if="isError || isMutateError" class="alert alert-danger">
            <strong>Whoops!</strong> {{ error?.message || mutateError?.message }}<br><br>
            <span>{{ error?.response?.data || mutateError?.response?.data }}</span>
        </div>

        <div class="row mt-4">
            <div v-if="!isFetching"  class="col-md-6 offset-md-3 p-4 bg-light border rounded-3">
                <header class="mt-4">  
                    <h3> Edit Book</h3>
                    <p>
                        Edit a book with the following form.
                    </p>
                    <router-link to="/" class="btn btn-primary">go home</router-link>
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
                        <button  class="btn btn-primary mt-3 mb-3">
                            Update Book
                        </button>
                    </div>
                </form>
           </div> 
           <div v-else class="text-center">
                <div class="spinner-border text-primary " role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>      
        </div>
    </div>
</template>