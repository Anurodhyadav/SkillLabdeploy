<template>
    <div class="Files" v-if="allowAccess">
        <NavBar />
        <vs-input
            icon-after="true"
            icon="search"
            placeholder="Search by audio titles"
            v-model="search"
            class="center"
        />
        <vs-table max-items="8" pagination stripe :data="audioSearch" class="center">
            <template slot="header">
                <h3>Audio Information</h3>
            </template>
            <template slot="thead">
                <vs-th>Duration</vs-th>
                <vs-th>Audio</vs-th>
                <vs-th>Tests</vs-th>
                <!-- <vs-th>Average Score</vs-th> -->
                <vs-th>Action</vs-th>
            </template>

            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{ data[indextr].duration }}
                    </vs-td>
                    <vs-td>
                        {{ data[indextr].title }}
                    </vs-td>
                    <vs-td>
                        {{ data[indextr].tests }}
                    </vs-td>
                    <!-- <vs-td>
            {{ data[indextr].avgScore }}
          </vs-td> -->
                    <vs-td>
                        <!-- <b-button variant="outline-primary">Button</b-button> -->
                        <b-button
                            @click="
                                editItem(
                                    data[indextr].id,
                                    data[indextr].title,
                                    data[indextr].comment,
                                )
                            "
                            variant="outline-primary"
                            >Edit</b-button
                        >
                        <b-button @click="deleteItem(data[indextr].id)" variant="outline-danger"
                            >Delete</b-button
                        >
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <a href="/#/upload" class="btn btn-info m-1" role="button">Add New</a>
        <a href="/#/stats" class="btn btn-info m-1"><b-icon icon="house-fill"></b-icon></a>
    </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue';
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '@/firebase/db';

export default {
    name: 'Files',
    mixins: [AlertMsg],
    components: {
        NavBar,
    },
    data() {
        return {
            audioInfo: [],
            allowAccess: false,
            search: '',
        };
    },
    methods: {
        editItem(id, title, comment) {
            this.$router.push({
                name: 'EditAudio',
                params: {
                    audioId: id,
                    audioTitle: title,
                    audioComment: comment,
                },
            });
        },
        viewData(transDataItem) {
            this.$router.push({ name: 'Details', params: { id: transDataItem.id } });
        },
        reviewData(audioInfoItem) {
            this.$router.push({
                name: 'Review',
                params: {
                    audioId: audioInfoItem.id,
                },
            });
        },
        deleteItem(id) {
            db.collection('audioInfo').doc(id).delete();
            this.deleteAlert = true;
            this.acceptAlert('danger', 'File Deleted', 'The file was successfully deleted');
        },
    },
    firestore: {
        audioInfo: db.collection('audioInfo'),
        transData: db.collection('transData'),
    },
    created() {
        const user = firebase.auth().currentUser;
        db.collection('UserData')
            .where('email', '==', user.email)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        role: doc.data().role,
                    };
                    this.userRole = Data.role;
                    if (this.userRole === 'admin') {
                        this.allowAccess = true;
                    } else {
                        this.$router.replace({ name: 'Home' });
                    }
                });
            });
    },
    // below computed property will hepl to compute the data according to the serach content and update it
    computed: {
        audioSearch() {
            return this.audioInfo.filter((filters) => {
                return filters.title.match(this.search);
            });
        },
    },
};
</script>
<style scoped>
table {
    width: 40%;
}
.center {
    margin: auto;
    margin-top: 15px;
    width: 50%;
    border: 0px;
    padding: 10px;
    text-align: left;
}
</style>
