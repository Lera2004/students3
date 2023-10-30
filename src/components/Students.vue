<template>
    <div :class="selectedTheme">
        <div>
            <input type="radio" v-model="selectedTheme" value="light-theme" @change="changeTheme()" /> Світла тема
            <input type="radio" v-model="selectedTheme" value="dark-theme" @change="changeTheme()" /> Темна тема
        </div>
        <div>
            <input type="text" id="search-input" v-model="search" placeholder="Пошук за прізвищем" />

            <form @submit.prevent="addStudent">
                <input type="url" v-model="newStudent.photo" placeholder="Фото" />
                <input type="text" v-model="newStudent.name" placeholder="ПІБ" required />
                <select v-model="newStudent.group" placeholder="Група">
                    <option value="RPZ 20 1/9">RPZ 20 1/9</option>
                    <option value="RPZ 20 2/9">RPZ 20 2/9</option>
                </select>
                <input type="number" v-model="newStudent.mark" placeholder="Оцінка" required />
                <input type="checkbox" v-model="newStudent.isDonePr" />
                <button type="submit">Додати</button>
            </form>

            <table :class="{ 'dark-table': selectedTheme === 'dark-theme' }">
                <thead>
                    <tr>
                        <th>Фото</th>
                        <th>ПІБ</th>
                        <th>Група</th>
                        <th>Оцінка</th>
                        <th>Практика</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in filteredStudents" :key="student._id">
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <a @click="openModal(student)">
                                <img v-if="student.photo" :src="student.photo" alt="Фото студента" width="50">
                            </a>
                        </td>
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <router-link :to="'/student-info/' + student._id">{{ student.name }}</router-link>
                            <span v-if="student._id !== editingStudentId"></span>
                            <input v-else v-model="student.name" />
                        </td>
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <span v-if="student._id !== editingStudentId">{{ student.group }}</span>
                            <select v-else v-model="student.group">
                                <option value="RPZ 20 1/9">RPZ 20 1/9</option>
                                <option value="RPZ 20 2/9">RPZ 20 2/9</option>
                            </select>
                        </td>
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <span v-if="student._id !== editingStudentId">{{ student.mark }}</span>
                            <input v-else type="number" v-model="student.mark" />
                        </td>
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <span v-if="student._id !== editingStudentId">
                                <span v-if="student.isDonePr">&#10004;</span>
                                <span v-else>&#10008;</span>
                            </span>
                            <input v-else type="checkbox" v-model="student.isDonePr" />
                        </td>
                        <td :class="{ 'dark-td': selectedTheme === 'dark-theme' }">
                            <button @click="editStudent(student)" v-if="student._id !== editingStudentId"
                                style="margin-bottom: 10px;">
                                <i class="fas fa-pencil-alt"></i> Редагувати
                            </button>
                            <button @click="updateStudent(student)" v-else style="margin-bottom: 10px;">
                                <i class="fas fa-check"></i> Оновити
                            </button>
                            <button @click="removeStudent(student._id)" v-show="student.group === getCurrentUser.group">
                                <i class="fas fa-trash-alt"></i> Видалити
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
            <p>Кількість студентів: {{ studentNumber }}</p>
            <div class="modal" v-if="isModalOpen">
                <div :class="['modal-content', { 'dark-modal-content': selectedTheme === 'dark-theme', 'light-modal-content': selectedTheme === 'light-theme' }]"
                    @click.stop>
                    <div @click="closeModal">×</div>
                    <img :src="selectedStudent.photo" alt="Фото студента">
                    <h2>{{ selectedStudent.name }}</h2>
                    <p>Група: {{ selectedStudent.group }}</p>
                    <p>Оцінка: {{ selectedStudent.mark }}</p>
                    <p>Практика: {{ selectedStudent.isDonePr ? 'Зараховано' : 'Не зараховано' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const store = useStore();
const theme = computed(() => store.getters['getSelectedTheme']);
const getCurrentUser = computed(() => store.getters.getUser);

const students = ref([]);
const search = ref("");
const newStudent = ref({
    name: "",
    group: "",
    mark: null,
    isDonePr: false,
    photo: "",
});
const editingStudentId = ref(null);
const isModalOpen = ref(false);
const selectedStudent = ref(null);
const selectedTheme = ref(store.getters.getSelectedTheme);

const changeTheme = () => {
    store.commit('setTheme', selectedTheme.value);
};

const fetchStudents = () => {
    axios
        .get("http://34.82.81.113:3000/students")
        .then((response) => {
            students.value = response.data;
            store.commit('setCount', students.value.length);
        })
        .catch((error) => {
            console.error("Помилка при завантаженні студентів:", error);
        });
};

const removeStudent = (id) => {
    axios
        .delete(`http://34.82.81.113:3000/students/${id}`)
        .then((data) => {
            console.log("Студент видалений:", data);
            students.value = students.value.filter((student) => student._id !== id);
            store.commit('setCount', students.value.length);
        })
        .catch((error) => {
            console.error("Помилка при видаленні студента:", error);
        });
};

const addStudent = () => {
    axios
        .post("http://34.82.81.113:3000/students", newStudent.value)
        .then((response) => {
            console.log("Студент доданий:", response.data);
            students.value.push(response.data);
            newStudent.value = {
                name: "",
                group: "",
                mark: null,
                isDonePr: false,
                photo: "",
            };
            store.commit('setCount', students.value.length);
        })
        .catch((error) => {
            console.error("Помилка при додаванні студента:", error);
        });
};

const editStudent = (student) => {
    editingStudentId.value = student._id;
};

onMounted(() => {
    fetchStudents();
});

const studentNumber = computed(() => {
    return store.getters.getCount;
});

const filteredStudents = computed(() => {
    const searchQuery = search.value.toLowerCase();
    return students.value.filter((student) => student.name.toLowerCase().includes(searchQuery));
});

const updateStudent = (student) => {
    axios
        .put(`http://34.82.81.113:3000/students/${student._id}`, student)
        .then((response) => {
            console.log("Студент оновлений:", response.data);
            editingStudentId.value = null;
        })
        .catch((error) => {
            console.error("Помилка при оновленні студента:", error);
        });
};

const openModal = (student) => {
    selectedStudent.value = student;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

