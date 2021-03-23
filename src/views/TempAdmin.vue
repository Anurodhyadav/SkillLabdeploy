<template>
  <div class="Admin" v-if="allowAccess">
    <NavBar />
    <div class="container">
      <vs-row vs-type="flex" vs-justify="space-around">
        <!-- student record -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Student Records</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Total Students : {{ studentCount }}</li>
                  <li>Visible Students: {{ visiblestudentCount }}</li>
                  <!-- <li>SuperUser: {{ superuserCount }}</li> -->
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="flex-end">
                <vs-button color="primary" href="/#/transcriptions">
                  View Student Records</vs-button
                >
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
        <!-- hidden students -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Hidden Students</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Hidden Students: {{ hiddenstudentCount }}</li>
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="flex-end">
                <vs-button color="primary" href="/#/manageuser"> Manage</vs-button>
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="space-around">
        <!-- Audio Section -->
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Audio</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Total Audio: {{ totalAudio }}</li>
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="space-around">
                <vs-button color="primary" icon="cloud_download" @click="toggleAudioDumper"
                  >Export Data</vs-button
                >
                <vs-button type="gradient" color="danger" href="/#/upload">Add Audio</vs-button>
                <vs-button color="primary" href="/#/files">Audio Files</vs-button>
              </vs-row>
            </div>
            <AudioDump :isActive="isAudioDumperVisible" @closing="toggleAudioDumper"></AudioDump>
          </vs-card>
        </vs-col>
        <!-- feedback card -->
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Feedbacks</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Total feedbacks: {{ totalFeedbacks }}</li>
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="flex-end">
                <vs-button color="primary" href="/#/feedbackrecords"
                  >View Feedback Records</vs-button
                >
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="space-around">
        <!-- superadmin section -->
        <vs-col v-if="allowSuperAdmin" type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Manage Admin</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Total Admin: {{ adminCount }}</li>
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="flex-end">
                <vs-button type="gradient" color="danger" href="/#/adminregister">Manage</vs-button>
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
        <!-- <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="4.5">
          <vs-card>
            <div slot="header">
              <h3>Accepted and Unsettled Test</h3>
            </div>
            <div>
              <span>
                <ul class="list">
                  <li>Total Accepted Test: {{ acceptedCount }}</li>
                  <li>Total Unsettled Test: {{ UnsettledCount }}</li>
                </ul>
              </span>
            </div>
            <div slot="footer">
              <vs-row vs-justify="flex-end">
                <vs-button type="gradient" color="danger" href="/#/acceptedtestlist"
                  >View</vs-button
                >
              </vs-row>
            </div>
          </vs-card>
        </vs-col> -->
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="4.5"></vs-col>
      </vs-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue';
// import { mdbHorizontalBarChart, mdbContainer } from 'mdbvue';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import AudioDump from '@/components/AudioDump.vue';
import { db } from '../firebase/db';

export default {
  name: 'Admin',
  components: {
    NavBar,
    // mdbHorizontalBarChart,
    // mdbContainer,
    AudioDump,
  },
  data() {
    return {
      allowAccess: false,
      popupActivo: false,
      isAudioDumperVisible: false,
      allowSuperAdmin: false,
      mySuperuser: '',
      // superuserCount: 0,
      acceptedCount: 0,
      UnsettledCount: 0,
      jsdfAccuracy: 0,
      grammarAccuracy: 0,
      testCount: 0,
      totalAudio: 0,
      totalFeedbacks: 0,
      jsdiffNet: 0,
      grammarNet: 0,
      studentCount: 0,
      hiddenstudentCount: 0,
      visiblestudentCount: 0,
      adminCount: 0,
      // horizontalBarChartData: {
      //   labels: ['Stat a', 'Stat b', 'Stat c'],
      //   datasets: [
      //     {
      //       label: '',
      //       data: [12, 19, 3, 5, 2, 3],
      //       backgroundColor: [
      //         'rgba(255, 99, 132, 0.2)',
      //         'rgba(54, 162, 235, 0.2)',
      //         'rgba(255, 206, 86, 0.2)',
      //         'rgba(75, 192, 192, 0.2)',
      //         'rgba(153, 102, 255, 0.2)',
      //         'rgba(255, 159, 64, 0.2)',
      //       ],
      //       borderColor: [
      //         'rgba(255,99,132,1)',
      //         'rgba(54, 162, 235, 1)',
      //         'rgba(255, 206, 86, 1)',
      //         'rgba(75, 192, 192, 1)',
      //         'rgba(153, 102, 255, 1)',
      //         'rgba(255, 159, 64, 1)',
      //       ],
      //       borderWidth: 1,
      //     },
      //   ],
      // },
      // horizontalBarChartOptions: {
      //   responsive: false,
      //   maintainAspectRatio: false,
      //   scales: {
      //     xAxes: [
      //       {
      //         barPercentage: 1,
      //         gridLines: {
      //           display: true,
      //           color: 'rgba(0, 0, 0, 0.1)',
      //         },
      //       },
      //     ],
      //     yAxes: [
      //       {
      //         gridLines: {
      //           display: true,
      //           color: 'rgba(0, 0, 0, 0.1)',
      //         },
      //       },
      //     ],
      //   },
      // },
    };
  },

  methods: {
    toggleAudioDumper() {
      this.isAudioDumperVisible = !this.isAudioDumperVisible;
    },
  },
  created() {
    this.$vs.loading();
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
    db.collection('transData')
      .get()
      .then((querySnapshot) => {
        this.testCount = querySnapshot.size;
        this.$vs.loading.close();
      });
    db.collection('audioInfo')
      .get()
      .then((querySnapshot) => {
        this.totalAudio = querySnapshot.size;
      });
    db.collection('FeedbacksData')
      .get()
      .then((querySnapshot) => {
        this.totalFeedbacks = querySnapshot.size;
      });
    db.collection('UserData')
      .where('role', '==', '')
      .get()
      .then((querySnapshot) => {
        this.studentCount = querySnapshot.size;
      });
    db.collection('UserData')
      .where('visibility', '==', false)
      .get()
      .then((querySnapshot) => {
        this.hiddenstudentCount = querySnapshot.size;
      });
    db.collection('UserData')
      .where('visibility', '==', true)
      .get()
      .then((querySnapshot) => {
        this.visiblestudentCount = querySnapshot.size;
      });
    db.collection('UserData')
      .where('role', '==', 'admin')
      .get()
      .then((querySnapshot) => {
        this.hiddenstudentCount -= querySnapshot.size;
      });
    // check for superuser
    // db.collection('UserData')
    //   .where('superuser', '==', true)
    //   .get()
    //   .then((querySnapshot) => {
    //     this.superuserCount = querySnapshot.size;
    //   });
    db.collection('UserData')
      .where('role', '==', 'admin')
      .get()
      .then((querySnapshot) => {
        this.adminCount = querySnapshot.size;
      });
    db.collection('transData')
      .where('outcome', '==', 'Accepted')
      .get()
      .then((querySnapshot) => {
        this.acceptedCount = querySnapshot.size;
      });
    db.collection('transData')
      .where('outcome', '==', 'Unsettled')
      .get()
      .then((querySnapshot) => {
        this.UnsettledCount = querySnapshot.size;
      });
    db.collection('transData')
      .where('jsDiff', '!=', null)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const Data = {
            jsDiff: doc.data().jsDiff,
          };
          this.jsdiffNet += parseInt(Data.jsDiff, 10);
        });
        this.jsdfAccuracy = this.jsdiffNet / this.testCount;
      });
    db.collection('transData')
      .where('grammaraccuracy', '!=', null)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const Data = {
            grammaraccuracy: doc.data().grammaraccuracy,
          };
          this.grammarNet += parseInt(Data.grammaraccuracy, 10);
        });
        this.grammarAccuracy = this.grammarNet / this.testCount;
      });
  },
};
</script>

<style scoped>
.center {
  margin: auto;
  margin-top: 15px;
  width: 50%;
  border: 0px;
  padding: 10px;
  text-align: left;
}
.list {
  list-style: none;
}
.container {
  margin-top: 2%;
}
</style>
