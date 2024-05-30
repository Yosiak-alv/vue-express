<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useFlashMessageStore } from '@/stores/flashMessageStore';
import { useBookStore } from '@/stores/bookStore';
import { storeToRefs } from 'pinia';

// get params id from router
const props = defineProps({
    id: String
});

const { book, loading, error } = storeToRefs(useBookStore());
const { loading: loadingDelete, error: errorDelete } = storeToRefs(useBookStore());
const { fetchBook, deleteBook } = useBookStore();

fetchBook(props.id);

//handle delete book
const router = useRouter();
const flashMessageStore = useFlashMessageStore();

const handleDelete = async () => {
    await deleteBook(props.id);
    if (!errorDelete.value) {
        //close the modal
        const modal = document.getElementById('staticBackdrop');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        flashMessageStore.setFlashMessage('Book deleted successfully');
        router.push('/');
    }
};

</script>

<template>
    <div class="container">
        <div v-if="loading" class="text-center mt-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else-if="error">
            <div class="alert alert-danger mt-4" role="alert">
                {{ error.message }}
            </div>
        </div>
        <div class="row py-5" v-else-if="book">
            <div class="container my-5">
                <div class="position-relative p-5 text-center bg-light border rounded-3">
                    <router-link to="/" class="position-absolute top-0 end-0 p-3 m-3 btn-arrow bg-primary bg-opacity-10 rounded-pill" aria-label="Close" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                        </svg>
                    </router-link>
                    <h1 class="text-body-emphasis">{{book.title}}</h1>
                    <p class="col-lg-8 mx-auto fs-5 text-muted">
                        Author: {{book.author}}
                    </p>
                    <p class="col-lg-8 mx-auto fs-5 text-muted">
                        Year: {{book.year}}
                    </p>
                    <div class="d-inline-flex gap-2 mb-5">
                        <router-link :to="`/book/${book._id}/edit`" class="d-inline-flex align-items-center btn btn-primary btn-lg px-4" type="button">
                            Edit
                        </router-link>
                        <button class="btn btn-outline-danger btn-lg px-4" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                           Delete
                        </button>
                    </div>
                </div>
            </div>
            <!-- Delete error alert -->
            <div v-if="errorDelete" class="alert alert-danger mt-4" role="alert">
                {{ errorDelete.message }}
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">You want to Delete this Book ?</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>
                        Are you sure you want to delete this book? This action cannot be undone.
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    <button @click="handleDelete" type="button" class="btn btn-danger" :disabled="loadingDelete">
                    <span v-if="loadingDelete" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>