<template>
    <div class="ManageUser" v-if="allowAccess">
        <NavBar />
        <vs-input
            icon-after="true"
            icon="search"
            placeholder="Search by email"
            v-model="search"
            class="center"
        />
        <vs-table max-items="8" pagination stripe :data="filterEmails" class="center">
            <template slot="header">
                <h3>Hidden Students</h3>
            </template>
            <template slot="thead">
                <!-- <vs-th>Id</vs-th> -->
                <vs-th>Email</vs-th>
                <vs-th>Action</vs-th>
                <!-- <vs-th>Access</vs-th> -->
            </template>
            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <!-- <vs-td :data="tr.id">
            {{ tr.id }}
          </vs-td> -->
                    <vs-td :data="tr.email">
                        {{ tr.email }}
                    </vs-td>
                    <!-- <vs-td :data="tr.testNo">
            {{ tr.testNo }}
          </vs-td> -->
                    <!-- <vs-td :data="tr.averagejsdiff">
            {{ tr.averagejsdiff }}
          </vs-td> -->
                    <!-- <vs-td :data="tr.maxjsDiff">
            {{ tr.maxjsDiff }}
          </vs-td> -->
                    <vs-td :data="tr.email">
                        <!-- <vs-button color="primary" @click.native="alldata(tr)" type="filled">View</vs-button> -->
                        <vs-button color="success" @click.native="unhideUser(tr.id)" type="filled"
                            >UnHide</vs-button
                        >
                    </vs-td>
                    <!-- <vs-td :data="tr.email">
            <vs-button
              color="danger"
              v-if="tr.permit == true"
              @click.native="allowaccess(tr.email)"
              type="filled"
              >Cancel</vs-button
            >
            <vs-button
              color="success"
              v-if="tr.permit != true"
              @click.native="allowaccess(tr.email)"
              type="filled"
              >Allow</vs-button
            >
          </vs-td> -->
                </vs-tr>
            </template>
        </vs-table>
        <a href="/#/stats" class="btn btn-info m-3"><b-icon icon="house-fill"></b-icon></a>
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
    name: 'ManageUser',
    mixins: [AlertMsg],
    components: {
        NavBar,
    },
    data() {
        return {
            UserData: [],
            search: '',
            allowAccess: false,
        };
    },
    methods: {
        // editData(transDataItem) {
        //   this.$router.push({ name: 'Edit', params: { id: transDataItem.id } });
        // },
        // alldata(tr) {
        //   this.$router.push({ name: 'UserData', params: { mail: tr.email } });
        // },
        unhideUser(id) {
            db.collection('UserData').doc(id).set(
                {
                    visibility: true,
                },
                { merge: true },
            );
        },
    },
    firestore: {
        UserData: db.collection('UserData').where('visibility', '==', false),
    },
    computed: {
        filterEmails() {
            return this.UserData.filter((filters) => {
                return filters.email.match(this.search);
            });
        },
    },
    mounted() {
        const user = firebase.auth().currentUser;
        db.collection('UserData')
            .where('email', '==', user.email)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        role: doc.data().role,
                        superuser: doc.data().superuser,
                    };
                    this.userRole = Data.role;
                    this.mySuperuser = Data.superuser;
                    if (this.mySuperuser) {
                        this.allowSuperAdmin = true;
                    }
                    if (this.userRole === 'admin') {
                        this.allowAccess = true;
                    } else {
                        this.$router.replace({ name: 'Home' });
                    }
                });
            });
    },
};
</script>

<style scoped>
b-alert {
    width: 50%;
}
.center {
    margin: auto;
    margin-top: 15px;
    width: 70%;
    border: 0px;
    padding: 10px;
    text-align: left;
}
</style>
