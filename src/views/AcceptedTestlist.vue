<template>
  <div class="AcceptedTestlist" v-if="allowAccess">
    <Header />
    <vs-input
      icon-after="true"
      icon="search"
      placeholder="Search by email"
      v-model="search"
      class="center"
    />
    <vs-table max-items="8" pagination stripe :data="acceptedTest" class="center">
      <template slot="header">
        <h3>Accepted and Unsetteled Test Information</h3>
      </template>
      <template slot="thead">
        <!-- <vs-th>Id</vs-th> -->
        <vs-th>Email</vs-th>
        <vs-th>Test Date</vs-th>
        <!-- <vs-th>Avg Score</vs-th> -->
        <!-- <vs-th>Highest Score</vs-th> -->
        <vs-th>Action</vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr v-for="(tr, indextr) in data" :key="indextr">
          <!-- <vs-td :data="tr.id">
            {{ tr.id }}
          </vs-td> -->
          <vs-td v-if="tr.outcome === 'Unsettled'" :style="{ color: 'blue' }" :data="tr.user">
            {{ tr.user }}
          </vs-td>
          <vs-td v-else :data="tr.user">
            {{ tr.user }}
          </vs-td>
          <vs-td :data="tr.date"> {{ tr.date }}</vs-td>
          <vs-td :data="tr.email">
            <vs-button
              v-if="tr.outcome != 'Rejected'"
              color="danger"
              @click.native="rejectClient(tr)"
              type="filled"
              >Reject</vs-button
            >
            <vs-button
              class="ml-2"
              v-if="tr.outcome != 'Accepted'"
              color="success"
              @click.native="acceptClient(tr)"
              type="filled"
              >Accept</vs-button
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
  name: 'AcceptedTestlist',
  mixins: [AlertMsg],
  components: {
    Header,
  },
  data() {
    return {
      acceptedTest: [],
      search: '',
      allowAccess: false,
    };
  },
  methods: {
    rejectClient(testData) {
      const userResult = db.collection('transData').doc(testData.id);
      const userHide = db.collection('UserData').doc(testData.user);
      userResult.update({
        outcome: 'Rejected',
      });
      userHide.update({
        visibility: false,
      });
      this.acceptAlert(
        'danger',
        'Outcome Saved',
        `The user ${testData.user} Outcome is set to Rejected and visibility set to hidden`,
      );
    },
    acceptClient(testData) {
      const userResult = db.collection('transData').doc(testData.id);
      const userHide = db.collection('UserData').doc(testData.user);
      userResult.update({
        outcome: 'Accepted',
      });
      userHide.update({
        visibility: false,
      });
      this.acceptAlert(
        'danger',
        'Outcome Saved',
        `The user ${testData.user} Outcome is set to Accepted and visibility set to hidden`,
      );
    },
    // editData(transDataItem) {
    //   this.$router.push({ name: 'Edit', params: { id: transDataItem.id } });
    // },
    // alldata(tr) {
    //   this.$router.push({ name: 'UserData', params: { mail: tr.email } });
    // },
    // hideUser(id) {
    //   db.collection('UserData').doc(id).set(
    //     {
    //       visibility: false,
    //     },
    //     { merge: true },
    //   );
    // },
    // allowaccess(usermail) {
    //   db.collection('UserData')
    //     .where('email', '==', usermail)
    //     .get()
    //     .then((snapshot) => {
    //       snapshot.forEach((doc) => {
    //         const Data = {
    //           id: doc.id,
    //           permit: doc.data().permit,
    //         };
    //         db.collection('UserData').doc(Data.id).set(
    //           {
    //             permit: !Data.permit,
    //           },
    //           { merge: true },
    //         );
    //       });
    //     });
    // },
  },
  firestore: {
    // .where('visibility', '==', true) .where('visibility', '!=', false)
    // .where('role', '==', 'admin'),
    acceptedTest: db.collection('transData').where('outcome', '!=', 'Rejected'),
  },
  computed: {
    // filterEmails() {
    //   const filteredacceptedTest = this.acceptedTest;
    //   return filteredacceptedTest.filter((filters) => {
    //     return filters.email.match(this.search);
    //   });
    // },
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
