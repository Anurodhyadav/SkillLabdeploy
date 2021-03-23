<template>
  <div>
    <div class="feedback">
      <vs-row vs-justify="center" align="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="9">
          <vs-card vs-justify="center" align="center">
            <!-- <div slot="header">
              <h2>Transcription Project Feedback Form</h2>
            </div> -->
            <div class="emoji" align="left">
              <h6>How do you rate your experience? *</h6>
              <vue-feedback-reaction
                :labels="['hate', 'disappointed', 'natural', 'good', 'excellent']"
                v-model="feedback"
              />
            </div>
            <br />
            <div>
              <div class="form-floating" align="left">
                <h6>Details of your problem or suggestion *</h6>
                <span>
                  Provide as many details as you can including the URL of the page you were on, and
                  the complete text of any error messages you may see
                </span>
                <br /><br />
                <textarea
                  v-focus
                  rows="8"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  v-model="comments"
                  @input="(e) => updateForm(e)"
                  required
                ></textarea>
                <label for="floatingTextarea2">Comments</label>
              </div>
            </div>
            <div slot="footer">
              <vs-row vs-justify="center">
                <vs-button size="large" type="filled" color="primary" @click="submitForm"
                  >Submit</vs-button
                >
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
      </vs-row>
      <!-- <vs-row vs-type="flex" vs-justify="center" style="margin-top: 20px">
        <vs-button href="/#/">Go back to Home Page</vs-button>
      </vs-row> -->
    </div>
  </div>
</template>

<script>
import AlertMsg from '@/mixins/AlertMsg';
import { VueFeedbackReaction } from 'vue-feedback-reaction';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import getDate from '@/utilities/getDate';
import { db } from '../firebase/db';

export default {
  name: 'feedbackform',
  mixins: [AlertMsg],
  components: {
    VueFeedbackReaction,
  },
  data() {
    return {
      feedback: '',
      currentUserEmail: '',
      userName: '',
      comments: '',
    };
  },
  methods: {
    updateForm(e) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    async submitForm() {
      try {
        if (this.feedback !== '') {
          this.$vs.loading({
            type: 'material',
          });
          await db.collection('FeedbacksData').add({
            name: this.userName,
            email: this.currentUserEmail,
            reaction: this.feedback,
            comments: this.comments,
            date: getDate(),
          });
          this.comments = '';
          this.$vs.loading.close();
          this.acceptAlert('success', 'Submitted', 'The feedback has been submitted');
        } else {
          this.acceptAlert('danger', 'Opps', 'fields cannot be empty');
        }
      } catch (err) {
        this.$vs.loading.close();
        this.acceptAlert('danger', 'Opps', err);
      }
    },
  },
  // mounted for Auto-Expanding Textare
  // mounted() {
  //   this.$nextTick(() => {
  //     this.$el.setAttribute('style', 'height', `${this.$el.scrollHeight}px`);
  //   });
  // },
  // updated() {
  //   console.log(this.feedback);
  // },
  mounted() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.currentUserEmail = user.email;
      this.userName = user.displayName;
    }
    db.collection('UserData')
      .where('email', '==', user.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const Data = {
            username: doc.data().username,
          };
          this.userName = Data.username;
        });
      });
  },
};
</script>

<style scoped>
/* .feedback {
  width: 100%;
  display: flex;
} */
.textarea {
  width: 70% !important;
}
.form-control {
  width: 100%;
  overflow: hidden;
}
h2 {
  font-weight: bolder;
}
h6 {
  color: black;
  font-weight: bolder;
}
span {
  color: gray;
}
</style>
