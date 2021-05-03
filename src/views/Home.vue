<template>
    <div class="Home">
        <NavBar />
        <welcome />
    </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue';
import Welcome from '@/components/Welcome.vue';
// import { db } from '../firebase/db';

export default {
    name: 'Home',
    components: {
        NavBar,
        Welcome,
    },
};
</script>
