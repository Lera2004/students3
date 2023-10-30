<template>
    <main :class="theme">
        <router-view>

        </router-view>
    </main>
</template> 
<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();


const theme = computed(() => {
    return store.getters.getSelectedTheme;
}); 
</script> 
 
<style> html,
 body,
 #app {
     margin: 0;
     padding: 0;
     height: 100%;
 }

 main {
     min-height: 100%;
     display: flex;
     flex-direction: column;
     align-items: center;
     background-color: #FFFFFF;
     padding: 20px;
     border-radius: 5px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
 }
</style>