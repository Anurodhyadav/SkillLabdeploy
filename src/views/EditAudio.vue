<template>
  <div class="EditAudio" v-if="allowAccess">
    <NavBar />
    <div class="c_video">
      <audio class="audioPlayer" id="match" ref="match" :src="audioUrl" controls></audio>
    </div>
    <div class="inputForm mx-auto p-2">
      <div class="form-group">
        <textarea
          class="form-control p-2"
          rows="1"
          id="title"
          placeholder="Title"
          v-model="audioTitle"
          disabled
        ></textarea>
      </div>
      <div class="form-group">
        <select id="options" class="form-control p-2" v-model="newType" name="cars">
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
                  class="form-control p-2"
                  id="default"
                  aria-label="text"
                  v-model="transcription.text"
                  @input="(e) => updateTranscript(e, transcription.id)"
                  @click="setFocus(transcription.id)"
                  style="height: auto"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2">
          <b-button type="button" class="sbutton-imp" @click="editItem" variant="light">
            Submit
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import NavBar from '@/components/NavBar.vue';
import shortid from 'shortid';
import keybinds from '@/utilities/keybindings';
import { db } from '../firebase/db';

export default {
  name: 'EditAudio',
  props: {
    audioId: {
      type: String,
    },
    audioTitle: {
      type: String,
    },
    audioComment: {
      type: String,
    },
  },
  mixins: [AlertMsg],
  data() {
    return {
      videoSrc: '',
      comment: '',
      newTitle: '',
      audioLength: '',
      audioName: '',
      newComment: '',
      userRole: '',
      audioUrl: '',
      allowAccess: false,
      testC: '',
      status: true,
      audioStatus: '',
      speakerList: [1, 2, 3, 4, 5],
      mySpeakerdata: [],
      net: '',
      transcriptions: [],
      speakerBlock: [],
      count: 0,
      myType: '',
      newType: '',
    };
  },
  components: {
    NavBar,
  },
  computed: {
    transcriptionTextArr() {
      return this.transcriptions.map((speaker) => speaker.text) || [];
    },
    transcriptionTexts() {
      return this.transcriptionTextArr.join(' ');
    },
  },
  methods: {
    updateTranscript(e, id) {
      this.transcriptions = this.transcriptions.map((item) => {
        if (item.id === id) {
          return { ...item, text: e.target.value };
        }
        return item;
      });
    },
    async editItem() {
      const a = 2;
      if (a === 2) {
        try {
          await db.collection('audioInfo').doc(this.audioId).set(
            {
              comment: this.transcriptionTexts,
              blocks: this.transcriptions,
              type: this.newType,
            },
            { merge: true },
          );
        } catch (e) {
          alert('Error');
        }
        this.acceptAlert(
          'success',
          'Transcription Edited',
          'The transcription was successfully edited',
        );
        this.$router.push({ name: 'Files' });
      } else {
        this.acceptAlert('danger', 'No changes', 'No change has been made yet');
      }
    },
    getOriginalTranscription(speaker) {
      return {
        id: shortid.generate(),
        text: this.mySpeakerdata[speaker - 1],
        speaker,
      };
    },
    getEmptyTranscription(speaker) {
      return {
        id: shortid.generate(),
        text: '',
        speaker,
      };
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
    audioPause() {
      if (this.$refs.match.currentTime <= 3) {
        this.$refs.match.currentTime = 0;
        this.$refs.match.pause();
      } else {
        this.$refs.match.currentTime -= 3;
        this.$refs.match.pause();
      }
    },
  },
  created() {
    const user = firebase.auth().currentUser;
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
    this.comment = this.audioComment;
    db.collection('audioInfo')
      .where('title', '==', this.audioTitle)
      .get()
      .then((mysnapshot) => {
        mysnapshot.forEach((mydoc) => {
          const myData = {
            speakerdata: mydoc.data().speakerData,
            type: mydoc.data().type,
            blocks: mydoc.data().blocks,
            url: mydoc.data().url,
          };
          this.mySpeakerdata = myData.speakerdata;
          this.transcriptions = myData.blocks !== undefined ? myData.blocks : [];
          this.oldType = myData.type;
          this.newType = this.oldType;
          this.audioUrl = myData.url;
          if (myData.blocks === undefined) {
            const myCheck = () => {
              this.count += 1;
              this.transcriptions.push(this.getOriginalTranscription(this.count));
            };
            this.mySpeakerdata.forEach(myCheck);
          }
        });
      });
  },
};
</script>

<style scoped>
.inputForm {
  width: 68%;
  margin-top: 5%;
}
.audioPlayer {
  position: absolute;
  top: 35%;
  left: 0;
  max-width: 370px;
  transform: rotate(270deg);
}
</style>
