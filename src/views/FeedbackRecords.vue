<template>
  <div class="Transcriptions" v-if="allowAccess">
    <Header />
    <vs-table max-items="8" pagination stripe :data="UserData" class="center">
      <template slot="header">
        <h3>Feedback Records</h3>
      </template>
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Email</vs-th>
        <vs-th>Reactions(1 to 5)</vs-th>
        <vs-th>Comments</vs-th>
        <vs-th>Action</vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.name">
            {{ tr.name }}
          </vs-td>
          <vs-td :data="tr.email">
            {{ tr.email }}
          </vs-td>
          <vs-td :data="tr.reaction">
            {{ tr.reaction }}
          </vs-td>
          <vs-td :data="tr.comments">
            {{ tr.comments }}
          </vs-td>
          <vs-td :data="tr.email">
            <vs-button color="danger" @click="deleteItem(data[indextr].id)" type="filled"
              >Delete</vs-button
            >
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <a href="/#/stats" class="btn btn-info m-3"><b-icon icon="house-fill"></b-icon></a>
  </div>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '@/firebase/db';

export default {
  name: 'Transcriptions',
  mixins: [AlertMsg],
  components: {
    Header,
  },
  data() {
    return {
      UserData: [],
      search: '',
      allowAccess: false,
    };
  },
  methods: {
    deleteItem(id) {
      db.collection('FeedbacksData').doc(id).delete();
      this.deleteAlert = true;
      this.acceptAlert('danger', 'File Deleted', 'The file was successfully deleted');
    },
  },
  firestore: {
    UserData: db.collection('FeedbacksData').orderBy('email'),
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
