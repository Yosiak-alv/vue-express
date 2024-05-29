import axiosInstance from '@/utils/route';

import { useQuery, useMutation, } from '@tanstack/vue-query'


const fetchBooks = async () => ((await axiosInstance.get('/books')).data);
const getBooks = () => {
    const { isLoading, isFetching, isError, data, error } = useQuery({
        queryKey: ['books'],
        queryFn: fetchBooks,
        refetchOnWindowFocus: false,
    });
    return { isLoading, isFetching, isError, data, error };
};

const fetchBook = async (id) => ((await axiosInstance.get(`/books/${id}`)).data);
const getBook = (id) => {
    const { isLoading, isFetching, isError, data, error } = useQuery({
        queryKey: ['book', id],
        queryFn: () => fetchBook(id),
        refetchOnWindowFocus: false,
    });
    return { isLoading, isFetching, isError, data, error };
};

const storeBook = async (book) => ((await axiosInstance.post('/books', book)));
const createBook = () => {
    
    return useMutation({
        mutationFn: (book) => storeBook(book),
        onError: (error, variables, context) => {
            // An error happened!
            console.log('soy un error');
            console.log(error);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            console.log(data.data.message);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
        },
    });
    
};

const updateBook = async (id, book) => ((await axiosInstance.patch(`/books/${id}`, book)));
const editBook = (id) => {
    return useMutation({
        mutationFn: (book) => updateBook(id,book),
        onError: (error, variables, context) => {
            // An error happened!
            console.log('soy un error');
            console.log(error , variables, context);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            console.log(data.data.message);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
        },
    });
}

const destroyBook = async (id) => ((await axiosInstance.delete(`/books/${id}`)));
const deleteBook = () => {
    return useMutation({
        mutationFn: (id) => destroyBook(id),
        onError: (error, variables, context) => {
            // An error happened!
            console.log('soy un error');
            console.log(error);
        },
        onSuccess: (data, variables, context) => {
            // Boom baby!
            console.log(data.data.message);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
        },
    });
};

export {
    getBooks,
    getBook,
    createBook,
    editBook,
    deleteBook
};