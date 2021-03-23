<template>
  <div>
    <Header />
    <div class="signup-form">
      <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="18">
          <vs-card>
            <div slot="header">
              <h3>Sign In</h3>
            </div>
            <div>
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <b-icon icon="envelope"></b-icon>
                    </span>
                  </div>
                  <input
                    type="email"
                    class="form-control"
                    name="email"
                    v-model="email"
                    placeholder="Email Address"
                    required="required"
                    @keyup.enter="$refs.password.focus"
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <b-icon icon="lock"></b-icon>
                    </span>
                  </div>
                  <input
                    ref="password"
                    type="password"
                    class="form-control"
                    name="password"
                    v-model="password"
                    placeholder="Password"
                    required="required"
                    @keyup.enter="singIn"
                  />
                </div>
              </div>
              <div class="form-group">
                <vs-button type="gradient" @click="singIn()">Sign In</vs-button>
              </div>
              <div class="form-group">
                <button @click="googlelogIn()" type="submit" class="btn btn-primary btn-lg">
                  Google Sign In
                </button>
              </div>
              <div slot="footer">
                <vs-row vs-justify="center">
                  <!-- <vs-button type="gradient" color="danger" icon="favorite"></vs-button> -->
                  <vs-button type="line" color="dark" :to="{ name: 'register' }"
                    >Don't have an account?</vs-button
                  >
                </vs-row>
              </div>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
    </div>
  </div>
</template>

<script>
// import NavBar from '@/components/NavBar.vue';
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Header from '@/components/Header.vue';
import { db } from '../firebase/db';

export default {
  mixins: [AlertMsg],
  components: {
    Header,
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      current_user_email: '',
      user_name: '',
      myUserId: '',
      mySuperuser: '',
      userRole: '',
    };
  },
  methods: {
    async singIn() {
      try {
        if (this.email !== '' && this.password !== '') {
          this.$vs.loading({
            type: 'material',
          });
          await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
          db.collection('UserData')
            .where('email', '==', this.email)
            .get()
            .then((mySnapshot) => {
              mySnapshot.forEach((doc) => {
                const myData = {
                  role: doc.data().role,
                };
                this.userRole = myData.role;
                if (this.userRole === 'admin') {
                  this.$router.push({ name: 'TempAdmin' });
                  this.$vs.loading.close();
                } else {
                  this.$router.push({ name: 'Home' });
                  this.$vs.loading.close();
                }
              });
            });
        } else {
          this.acceptAlert('danger', 'Oops!', 'Missing Sign In Crediantials');
        }
      } catch (err) {
        this.acceptAlert('danger', 'Oops!', err);
        this.$vs.loading.close();
      }
    },
    async googlelogIn() {
      const provider = await new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          const user = firebase.auth().currentUser;
          if (user) {
            this.current_user_email = user.email;
            this.user_name = user.displayName;
            db.collection('UserData')
              .where('email', '==', this.current_user_email)
              .get()
              .then((mySnapshot) => {
                mySnapshot.forEach((myDoc) => {
                  const myData = {
                    id: myDoc.id,
                  };
                  this.myUserId = myData.id;
                });
                if (this.myUserId) {
                  this.$router.replace({ name: 'Home' });
                } else {
                  db.collection('UserData').add({
                    email: this.current_user_email,
                    username: this.user_name,
                    testNo: 0,
                    role: '',
                    tests: [],
                    permit: false,
                    totalStages: 0,
                    averagejsdiff: 0,
                    maxjsDiff: 0,
                    visibility: true,
                  });
                  this.$router.replace({ name: 'Home' });
                }
              });
          }
        });
    },
  },
};
</script>

<style scoped>
.form-control {
  font-size: 15px;
}
.form-control,
.form-control:focus,
.input-group-text {
  border-color: #e1e1e1;
}
.form-control,
.btn {
  border-radius: 3px;
}
.signup-form {
  width: 400px;
  margin: 0 auto;
  padding: 30px 0;
}
.signup-form form {
  color: #999;
  border-radius: 3px;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.signup-form h2 {
  color: #333;
  font-weight: bold;
  margin-top: 0;
}
.signup-form hr {
  margin: 0 -30px 20px;
}
.signup-form .form-group {
  margin-bottom: 20px;
}
.signup-form label {
  font-weight: normal;
  font-size: 15px;
}
.signup-form .form-control {
  min-height: 38px;
  box-shadow: none !important;
}
.signup-form .input-group-addon {
  max-width: 42px;
  text-align: center;
}
.signup-form .btn,
.signup-form .btn:active {
  font-size: 16px;
  font-weight: bold;
  background: #46a2b9 !important;
  border: none;
  min-width: 140px;
}
.signup-form .btn:hover,
.signup-form .btn:focus {
  background: #2e8daa !important;
}
.signup-form a {
  color: #fff;
  text-decoration: underline;
}
.signup-form a:hover {
  text-decoration: none;
}
.signup-form form a {
  color: #81d8d0;
  text-decoration: none;
}
.signup-form form a:hover {
  text-decoration: underline;
}
.signup-form .fa {
  font-size: 21px;
}
.signup-form .fa-paper-plane {
  font-size: 18px;
}
.signup-form .fa-check {
  color: #fff;
  left: 17px;
  top: 18px;
  font-size: 7px;
  position: absolute;
}
</style>
