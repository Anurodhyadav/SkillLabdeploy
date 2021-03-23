<template>
  <div>
    <Header />
    <div class="signup-form">
      <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="18">
          <vs-card>
            <div slot="header">
              <h3>Register</h3>
              <p>Please fill in this form to create an account!</p>
            </div>
            <div>
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <b-icon icon="person-fill"></b-icon>
                    </span>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    name="username"
                    v-model="username"
                    placeholder="Username"
                    required="required"
                    @keyup.enter="$refs.email.focus"
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <b-icon icon="envelope"></b-icon>
                    </span>
                  </div>
                  <input
                    ref="email"
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
                    @keyup.enter="$refs.confirmpass.focus"
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
                    ref="confirmpass"
                    type="password"
                    class="form-control"
                    name="confirmpassword"
                    v-model="confirmPassword"
                    placeholder="Confirm Password"
                    required="required"
                    @keyup.enter="registerNew"
                  />
                </div>
              </div>
              <div class="form-group">
                <vs-button type="gradient" @click="registerNew">Register</vs-button>
              </div>
              <div slot="footer">
                <vs-row vs-justify="center">
                  <!-- <vs-button type="gradient" color="danger" icon="favorite"></vs-button> -->
                  <vs-button type="line" color="dark" :to="{ name: 'sign_in' }"
                    >Already have an account?</vs-button
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
      username: '',
      confirmPassword: '',
    };
  },
  methods: {
    async registerNew() {
      try {
        if (
          this.email !== '' &&
          this.username !== '' &&
          this.password !== '' &&
          this.password === this.confirmPassword
        ) {
          this.$vs.loading({
            type: 'material',
          });
          await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
          await db.collection('UserData').add({
            email: this.email,
            username: this.username,
            testNo: 0,
            role: '',
            tests: [],
            permit: false,
            totalStages: 0,
            averagejsdiff: 0,
            maxjsDiff: 0,
            visibility: true,
          });
          this.$vs.loading.close();
          this.acceptAlert('success', 'Registered', 'The account is registered');
          this.$router.replace({ name: 'sign_in' });
        } else if (this.password !== this.confirmPassword) {
          this.acceptAlert('danger', 'Opps', 'Password didnot matched');
        } else {
          this.acceptAlert('danger', 'Opps', 'Fields cannot be empty');
        }
      } catch (err) {
        this.$vs.loading.close();
        this.acceptAlert('danger', 'Opps', err);
      }
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
  color: #19aa8d;
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
