<template>
  <div class="upload" v-if="allowAccess">
    <NavBar />
    <TopButtons @durationData="durationDataValue" @audioUrl="audioUrlValue" />
    <div v-if="audioUrl" class="inputForm mx-auto p-2">
      <div class="form-group">
        <textarea
          class="form-control p-2"
          rows="1"
          id="title"
          placeholder="Title"
          v-model="audioName"
          disabled
        ></textarea>
      </div>
      <div class="form-group">
        <textarea
          class="form-control p-2"
          rows="1"
          id="duration"
          placeholder="Duration"
          v-model="audioLength"
          disabled
        ></textarea>
      </div>
      <div class="form-group">
        <select id="options" class="form-control p-2" v-model="audioType" name="audioType">
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="SuperHard">SuperHard</option>
          <option value="Practice">Practice</option>
        </select>
      </div>
      <div class="myTemplate">
        <div class="ma-auto myText">
          <div v-for="transcription in transcriptions" :key="transcription.id">
            <div class="input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <b
                    ><vs-select
                      v-model="transcription.speaker"
                      class="speaker-selector"
                      width="100px"
                    >
                      <vs-select-item
                        :key="index"
                        :value="item"
                        :text="'Speaker ' + item"
                        v-for="(item, index) in speakerList"
                      /> </vs-select
                  ></b>
                </span>
                <textarea
                  v-focus
                  :ref="transcription.id"
                  class="form-control"
                  id="default"
                  aria-label="text"
                  :value="transcription.text"
                  @input="(e) => updateTranscript(e, transcription.id)"
                  @click="setFocus(transcription.id)"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2">
          <b-button type="button" class="sbutton-imp" @click="addItem" variant="primary">
            Save
          </b-button>
          <a href="/#/stats" class="btn btn-info m-1"><b-icon icon="house-fill"></b-icon></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TopButtons from '@/components/TopButtons.vue';
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import shortid from 'shortid';
import 'firebase/auth';
import NavBar from '@/components/NavBar.vue';
import keybinds from '@/utilities/keybindings';
import { db } from '../firebase/db';

export default {
  name: 'Upload',
  props: {
    mail: {
      type: String,
    },
  },
  mixins: [AlertMsg],
  data() {
    return {
      newTitle: '',
      audioLength: '',
      audioName: '',
      match: '',
      audioUrl: '',
      newComment: '',
      userRole: '',
      audioType: '',
      allowAccess: false,
      transcriptions: [],
      speakerList: [1, 2, 3, 4, 5],
    };
  },
  components: {
    NavBar,
    TopButtons,
  },
  methods: {
    updateTranscript(e, id) {
      this.transcriptions = this.transcriptions.map((item) => {
        if (item.id === id) {
          return { ...item, text: e.target.value };
        }
        return item;
      });
      // below for Auto-Expanding Textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    audioPause() {
      if (this.match.currentTime <= 3) {
        this.match.currentTime = 0;
        this.match.pause();
      } else {
        this.match.currentTime -= 3;
        this.match.pause();
      }
    },
    getEmptyTranscription(speaker) {
      return {
        id: shortid.generate(),
        text: '',
        speaker,
      };
    },
    addItem() {
      if (this.audioName && this.audioLength) {
        try {
          db.collection('audioInfo').add({
            avgScore: 0,
            comment: this.transcriptionTexts,
            blocks: this.transcriptions,
            tests: 0,
            duration: this.audioLength,
            timeSec: this.audioSecond,
            title: this.audioName,
            type: this.audioType,
            url: this.audioUrl,
          });
        } catch (e) {
          alert('Error');
        }
        this.audioName = '';
        this.audioLength = '';
        this.newComment = '';
        this.transcriptions = [];
        this.acceptAlert('success', 'File Saved', 'The file was successfully added');
        this.$router.push({ name: 'Files' });
      } else {
        this.acceptAlert('danger', 'Field Empty', 'One or more fields empty');
      }
    },
    durationDataValue(audioDuration, audioName, audioSecond, match) {
      this.audioLength = audioDuration;
      this.audioName = audioName;
      this.audioSecond = audioSecond;
      this.match = match;
    },
    audioUrlValue(audioUrl) {
      this.audioUrl = audioUrl;
    },
    defaultTextBox() {
      this.handleInsert(1);
    },
    handleInsert(speaker) {
      if (this.transcriptions.length === 0) {
        this.transcriptions.push(this.getEmptyTranscription(1));
        return;
      }
      const blocks = [...this.transcriptions];
      const currentBlockIndex = this.transcriptions.findIndex(
        (block) => block.id === this.currentBlock,
      );
      const newBlock = this.getEmptyTranscription(speaker);
      blocks.splice(currentBlockIndex + 1, 0, newBlock);
      this.transcriptions = blocks;
      this.currentBlock = newBlock.id;
    },
    handleRemove() {
      if (this.transcriptions.length > 1) {
        const currentBlockIndex = this.transcriptions.findIndex(
          (block) => block.id === this.currentBlock,
        );
        this.transcriptions = this.transcriptions.filter((block) => block.id !== this.currentBlock);
        if (currentBlockIndex === 0) {
          this.setFocus(this.transcriptions[currentBlockIndex].id);
        } else {
          this.setFocus(this.transcriptions[currentBlockIndex - 1].id);
        }
      }
    },
    setFocus(id) {
      this.currentBlock = id;
      this.$refs[this.currentBlock][0].focus();
    },
  },
  computed: {
    transcriptionTextArr() {
      return this.transcriptions.map((transcription) => transcription.text) || [];
    },
    transcriptionTexts() {
      return this.transcriptionTextArr.join(' ');
    },
  },
  created() {
    const user = firebase.auth().currentUser;
    this.defaultTextBox();
    keybinds(this);
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
};
</script>

<style scoped>
/* table {
  width: 50%;
} */
.inputForm {
  width: 68%;
}
</style>
