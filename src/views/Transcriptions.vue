<template>
  <div class="Transcriptions" v-if="allowAccess">
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
        <h3>Students Information</h3>
      </template>
      <template slot="thead">
        <!-- <vs-th>Id</vs-th> -->
        <vs-th>Email</vs-th>
        <vs-th>Total Tests</vs-th>
        <!-- <vs-th>Avg Score</vs-th> -->
        <!-- <vs-th>Highest Score</vs-th> -->
        <vs-th>Action</vs-th>
        <vs-th>Test Retake Access</vs-th>
        <vs-th>setoutcomes</vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr v-for="(tr, indextr) in data" :key="indextr">
          <!-- <vs-td :data="tr.id">
            {{ tr.id }}
          </vs-td> -->
          <span v-if="tr.outcome == 'Unsettled'" :style="{ color: 'orange' }"
            ><vs-td :data="tr.email">
              {{ tr.email }}
            </vs-td></span
          >
          <span v-else
            ><vs-td :data="tr.email">
              {{ tr.email }}
            </vs-td></span
          >
          <vs-td :data="tr.testNo">
            {{ tr.testNo }}
          </vs-td>
          <!-- <vs-td :data="tr.averagejsdiff">
            {{ tr.averagejsdiff }}
          </vs-td> -->
          <!-- <vs-td :data="tr.maxjsDiff">
            {{ tr.maxjsDiff }}
          </vs-td> -->
          <vs-td :data="tr.email">
            <vs-button v-if="tr.testNo" color="danger" @click.native="alldata(tr)" type="filled"
              >View</vs-button
            >
            <vs-button class="ml-2" color="primary" @click.native="hideUser(tr.id)" type="filled"
              >Hide</vs-button
            >
          </vs-td>
          <vs-td v-if="tr.role != 'admin'" :data="tr.email">
            <vs-button
              color="danger"
              v-show="tr.testNo"
              v-if="tr.permit == true"
              @click.native="allowaccess(tr.email)"
              type="filled"
              >Cancel</vs-button
            >
            <vs-button
              color="success"
              v-show="tr.testNo"
              v-if="tr.permit != true"
              @click.native="allowaccess(tr.email)"
              type="filled"
              >Allow</vs-button
            >
          </vs-td>
          <vs-td v-else>Admin</vs-td>
          <vs-td :data="tr">
            <span>
              <vs-dropdown>
                <a class="a-icon" href="#" style="color: #ffffff">
                  <!-- <span v-if="tests.outcome">Update Outcomes</span> -->
                  <span style="color: black">Set Outcome</span>
                  <vs-icon class="" icon="expand_more"></vs-icon>
                </a>

                <vs-dropdown-menu>
                  <vs-dropdown-item @click="acceptClient(tr.id, tr.email)">
                    Accepted
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="rejectClient(tr.id, tr.email)">
                    Rejected
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="meetClient(tr.id, tr.email)">
                    Unsettled
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </span>
          </vs-td>
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
// import { getSingleUser } from './api/Api';

export default {
  name: 'Transcriptions',
  mixins: [AlertMsg],
  components: {
    NavBar,
  },
  data() {
    return {
      UserData: [],
      myStore: [],
      search: '',
      allowAccess: false,
    };
  },
  methods: {
    editData(transDataItem) {
      this.$router.push({ name: 'Edit', params: { id: transDataItem.id } });
    },
    alldata(tr) {
      this.$router.push({ name: 'UserData', params: { mail: tr.email } });
    },
    hideUser(id) {
      db.collection('UserData').doc(id).set(
        {
          visibility: false,
        },
        { merge: true },
      );
    },
    allowaccess(usermail) {
      db.collection('UserData')
        .where('email', '==', usermail)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const Data = {
              id: doc.id,
              permit: doc.data().permit,
            };
            db.collection('UserData').doc(Data.id).set(
              {
                permit: !Data.permit,
              },
              { merge: true },
            );
          });
        });
    },
    viewData(transDataItem) {
      this.$router.push({
        name: 'Details',
        params: {
          iod: transDataItem.id,
        },
      });
    },
    deleteItem(id) {
      db.collection('transData').doc(id).delete();
      this.deleteAlert = true;
      this.acceptAlert('danger', 'File Deleted', 'The file was successfully deleted');
    },
    acceptClient(testId, userEmail) {
      // console.log(testId, 'akjshlkasl');
      const userResult = db.collection('UserData').doc(testId);
      userResult.update({
        outcome: 'Accepted',
        visibility: false,
      });
      this.acceptAlert(
        'success',
        'Outcome Saved ',
        `The user ${userEmail} Outcome is set to Accepted and visibility set to hidden`,
      );
    },
    meetClient(testId, userEmail) {
      const userResult = db.collection('UserData').doc(testId);
      userResult.update({
        outcome: 'Unsettled',
      });
      this.acceptAlert(
        'info',
        'Outcome Saved',
        `The user ${userEmail} Outcome is set to Unsettled and visibility set to hidden`,
      );
    },
    rejectClient(testId, userEmail) {
      const userResult = db.collection('UserData').doc(testId);
      userResult.update({
        outcome: 'Rejected',
        visibility: false,
      });
      this.acceptAlert(
        'danger',
        'Outcome Saved',
        `The user ${userEmail} Outcome is set to Accepted and visibility set to hidden`,
      );
    },
  },
  firestore: {
    // .where('visibility', '==', true) .where('visibility', '!=', false)
    // .where('role', '==', 'admin'),
    UserData: db.collection('UserData').orderBy('testDate', 'desc'),
  },
  computed: {
    filterEmails() {
      const filteredUserData = this.UserData.filter((filters) => filters.visibility === true);
      return filteredUserData.filter((filters) => {
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
  border: 10px;
  padding: 10px;
  text-align: left;
}
</style>
