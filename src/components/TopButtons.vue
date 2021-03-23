<!-- eslint-disable max-len -->
<template>
  <div class="container">
    <div class="mycontainer" ref="myContainer" v-if="isVideoVisible">
      <div class="c_video">
        <b-icon @click="closeUploadWindow" icon="x-circle-fill"></b-icon>
        <audio class="audio" id="match" ref="match" :src="videoSrc" controls></audio>
      </div>
    </div>
    <button type="button" class="btn btn-light">
      <input type="file" accept="audio/*, video/*" name="" @change="videoClick" id="file" hidden />
      <label for="file" id="selector">
        <b-icon icon="soundwave"></b-icon>
        Choose audio file
      </label>
    </button>
    <div style="margin-top: 10px">
      <p>
        <span>Progress: {{ uploadValue.toFixed() + '%' }}</span>
        <progress id="progress" :value="uploadValue" max="100"></progress>
      </p>
    </div>
    <div v-if="audioData != null">
      <vs-button @click="onUpload">Upload</vs-button>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';

export default {
  name: 'TopButtons',
  data() {
    return {
      isVideoVisible: false,
      isActive: true,
      videoSrc: '',
      audioDuration: '',
      audioSecond: '',
      audioData: null,
      uploadValue: 0,
      audioFiles: [],
    };
  },
  methods: {
    openWindow() {
      this.isFloatWindowOpen = true;
    },
    closeWindow() {
      this.isFloatWindowOpen = false;
      this.isLinkValid = false;
    },
    closeUploadWindow() {
      this.isVideoVisible = false;
    },
    videoClick(event) {
      this.uploadValue = 0;
      // eslint-disable-next-line prefer-destructuring
      this.audioData = event.target.files[0];
      this.isVideoVisible = true;
      const vm = this;
      const reader = new FileReader();
      reader.onload = (e) => {
        vm.videoSrc = e.target.result;
        this.$refs.match.addEventListener('loadedmetadata', () => {
          this.audioName = event.target.files[0].name;
          this.audioSecond = Math.floor(this.$refs.match.duration);
          const hours = Math.floor(this.audioSecond / 60 / 60);
          const minutes = Math.floor(this.audioSecond / 60) - hours * 60;
          const seconds = Math.floor(this.audioSecond % 60);
          if (hours !== 0) {
            this.audioDuration = `${hours}hr ${minutes}min ${seconds}sec`;
          } else {
            this.audioDuration = `${minutes}min ${seconds}sec`;
          }
          this.$emit(
            'durationData',
            this.audioDuration,
            this.audioName,
            this.audioSecond,
            this.$refs.match,
          );
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    },
    // below code for uploading audio data to firebase storage
    onUpload() {
      const storageRef = firebase.storage().ref(`${this.audioData.name}`).put(this.audioData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.$emit('audioUrl', downloadURL);
          });
        },
      );
    },
  },
  //   created() {
  //     const storageRef = firebase.storage().ref();
  //     storageRef
  //       .listAll()
  //       .then((result) => {
  //         result.items.forEach((audioRef) => {
  //           // And finally display them
  //           this.audioFiles.push(audioRef);
  //           audioRef.getDownloadURL().then((url) => {
  //             console.log(url);
  //           });
  //           // this.audioFiles.push(
  //           //   audioRef.getDownloadURL().then((url) => {
  //           //     console.log(url);
  //           //   }),
  //           // );
  //         });
  //       })
  //       .catch((error) => {
  //         // Handle any errors
  //         console.log(error);
  //       });
  //     console.log(this.audioFiles);
  //   },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-top: 1%;
}
/* .mycontainer {
  height: 0vh;
} */
/* .video {
  width: 80%;
} */
.c_video {
  position: absolute;
  top: 35%;
  left: 0;
  width: 100%;
  max-width: 370px;
  transform: rotate(270deg);
}

.btn {
  width: 230px;
  margin-top: 5px;
  width: 230px;
  background-color: #46a2b9;
  color: #b4e2e7;
}
.btn:hover {
  transform: scale(1.08);
  background-color: #2e8daa;
  color: #b4e2e7;
  box-shadow: 2px 2px 10px rgba(92, 91, 91, 0.89);
  transition: 0.5s ease;
}
/*below is the css for FLOATING WINDOW for youtube URL */
/* .floatWindow {
  color: aliceblue;
  margin-top: 10px;
  width: 400px;
  height: 88px;
  background-color: rgba(17, 16, 16, 0.897);
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  margin-bottom: 10px;
} */
.btnCross {
  border: none;
  background-color: rgba(46, 44, 44, 0.411);
  color: rgba(143, 146, 148, 0.521);
  float: right;
}
.btnCross:hover {
  color: aliceblue;
}
/*FLOATING WINDOW ends HERE */
</style>
