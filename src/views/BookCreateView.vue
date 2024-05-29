<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { reactive , ref} from 'vue';
import { watch } from 'vue';
import { createBook } from '@/services/BookServices.js';
import { useFlashMessageStore } from '@/stores/flashMessageStore.js';

import intus from "intus";
import { isRequired, isMin, isMax, isNumeric } from 'intus/rules';

const form = reactive({
    title: '',
    author: '',
    year: ''
});

const { isLoading, isError, error, isSuccess, mutate} = createBook();
const errors = ref({});
const onCreate  = () => {
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
// Vue 3 form validation with vee-validate and yup
/* const schema = Yup.object().shape({
    title: Yup.string().min(3, 'Title must be at least 3 characters long').max(50).required('Title is required'),
    author: Yup.string().min(3, 'Author must be at least 3 characters long').max(50).required('Author is required'),
    year: Yup.number().min(1900).max(new Date().getFullYear()).required('Year is required'),
});

const { handleSubmit, errors, defineField } = useForm({
    validationSchema: schema 
});
const onCreate = handleSubmit(async values => {
    await mutateAsync(values);
});

const [title, titleAttrs] = defineField('title');
const [author, authorAttrs] = defineField('author');
const [year, yearAttrs] = defineField('year'); */

//if the book is created successfully, redirect to the home page
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
        <div v-if="isError" class="alert alert-danger">
            <strong>Whoops!</strong> {{error.message}}<br><br>
            <span>{{error.response.data}}</span>
        </div>

        <div class="row mt-4">
            <div v-if="!isLoading" class="col-md-6 offset-md-3 p-4 bg-light border rounded-3">
                <header class="mt-4">  
                    <h3> Create a New Book</h3>
                    <p>
                        Create a new book with the following form.
                    </p>
                    <router-link to="/" class="btn btn-primary">go home</router-link>
                </header>
                <form @submit.prevent="onCreate" class="mt-4">
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
                            Create Book
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