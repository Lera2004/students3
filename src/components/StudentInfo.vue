<template>
    <div class="student-profile">
        <div class="student-info">
            <h2>{{ student.name }}</h2>
            <img :src="student.photo" :alt="student.name" class="student-photo">
        </div>
        <div class="student-details">
            <p><strong>Група:</strong> {{ student.group }}</p>
            <p><strong>Оцінка:</strong> {{ student.mark }}</p>
        </div>
    </div>
    <p>Кількість студентів: {{ studentNumber }}</p>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const props = defineProps(["id"]);
const student = ref({});

const store = useStore();

onMounted(() => {
    axios.get(`http://34.82.81.113:3000/students/${props.id}`).then((response) => {
        student.value = response.data;
    });

    store.commit('setCount', store.getters.getCount);
});

const studentNumber = computed(() => {
    return store.getters.getCount;
});
</script>

<style scoped>
.student-profile {
    display: flex;
    align-items: center;
}

.student-info {
    flex: 1;
    text-align: center;
}

.student-photo {
    max-width: 200px;
    border: 2px solid #ccc;
    border-radius: 10px;
}

.student-details {
    flex: 1;
    text-align: left;
    margin-left: 20px;
    color: #E44D26;
}

h2 {
    color: #E44D26;
}
</style>
