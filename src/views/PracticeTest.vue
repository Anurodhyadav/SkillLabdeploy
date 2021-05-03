<template>
    <div class="Test" v-if="allowAccess">
        <NavBar />
        <VsAlert
            @closing="startNextStage"
            :visibility="isBreakPopupVisible"
            title="Break"
            type="alert"
        >
            <div>Press Continue to proceed to next test.</div>
        </VsAlert>
        <!-- <VsAlert
      @closing="showResult"
      @accept="startHardTest"
      :visibility="isHardTestPopupVisible"
      title="Confirm Hard Test"
      type="confirm"
    >
      <div>Do you want to take Super Hard Test</div>
    </VsAlert> -->
        <Instructions />
        <div class="testsec">
            <div class="row">
                <div class="col-2">
                    <Timer ref="timerElement" />
                    <audio
                        class="audioPlayer"
                        id="match"
                        ref="match"
                        :src="currentAudio"
                        controls
                    ></audio>
                </div>
                <div class="col-10">
                    <div slot="header">
                        <!-- <h3>Test: {{ getHeader }}</h3> -->
                        <h3>Practice Test</h3>
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
                            <b-button
                                type="button"
                                class="sbutton-imp"
                                @click="addItem"
                                variant="light"
                            >
                                Submit
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue';
import Instructions from '@/components/Instructions.vue';
import Timer from '@/components/Timer.vue';
import AlertMsg from '@/mixins/AlertMsg';
import getDate from '@/utilities/getDate';
import diffCalculator from '@/utilities/diffCalculator';
import * as firebase from 'firebase/app';
import shortid from 'shortid';
import 'firebase/auth';
import VsAlert from '@/components/VsAlert.vue';
import keybinds from '@/utilities/keybindings';
import { getSingleAudio, getSingleUser, getAllAudioInfo } from './api/Api';
import { db } from '../firebase/db';

export default {
    name: 'Test',
    mixins: [AlertMsg],
    components: {
        NavBar,
        Timer,
        Instructions,
        VsAlert,
    },
    props: {
        mode: String,
    },
    data() {
        return {
            current_User_email: '',
            myUserId: '',
            accuracy: 0,
            audioTranscription: '',
            jsDiff: 0,
            status: true,
            transcriptions: [],
            speakerList: [1, 2, 3, 4, 5],
            allowAccess: false,
            currentBlock: '',
            isBreakPopupVisible: false,
            isHardTestPopupVisible: false,
            userData: null,
            userId: null,
            transId: null,
            currentAudio: '',
            currentAudioTitle: '',
            audioId: null,
            myAudio: [],
        };
    },
    async created() {
        const user = firebase.auth().currentUser;
        this.current_User_email = user.email;
        this.myAudio = await this.getRandomAudio();
        this.allowAccess = true;
        this.testStart(0);
        const [userId, userData] = await getSingleUser(user.email);
        [this.userId, this.userData] = [userId, userData];
        keybinds(this); // define keybindings
    },
    methods: {
        testStart(stage) {
            this.count = stage;
            const { url, title } = this.myAudio[this.count];
            this.currentAudio = url;
            this.currentAudioTitle = title;
            this.handleInsert(1);
        },
        clearAllData() {
            this.transcriptions = [];
            this.audioTranscription = '';
            this.type = '';
            this.accuracy = 0;
            this.timerWork().resetTimer();
            this.handleInsert(1);
            this.$vs.loading.close();
            this.showResult();
        },
        timerWork() {
            return {
                toggleTimer: () => {
                    this.$refs.timerElement.toggleTimer();
                },
                getTime: () => this.$refs.timerElement.getSeconds(),
                resetTimer: () => {
                    this.$refs.timerElement.resetTimer();
                },
            };
        },
        startNextStage() {
            this.count = 0;
            this.currentAudio = this.myAudio[this.count];
            this.isBreakPopupVisible = false;
            this.timerWork().toggleTimer();
        },
        showResult() {
            this.$router.push({ name: 'PracticeResult', params: { transId: this.transId } });
        },
        increaseInStore(value) {
            return firebase.firestore.FieldValue.increment(value);
        },
        pushInStore(value) {
            return firebase.firestore.FieldValue.arrayUnion(value);
        },
        // async getRandomAudio() {
        //   const typeAudio = [];
        //   const allAudio = await getAllAudioInfo();
        //   const audioGroupByType = allAudio.filter((audio) => {
        //     return audio.type === 'Practice';
        //   });
        //   typeAudio.push(audioGroupByType[Math.floor(Math.random() * audioGroupByType.length)].url);
        //   return typeAudio;
        // },
        async getRandomAudio() {
            const typeAudio = [];
            const allAudio = await getAllAudioInfo();
            const audioGroupByType = allAudio.filter((audio) => {
                return audio.type === 'Practice';
            });
            const { url, title } = audioGroupByType[
                Math.floor(Math.random() * audioGroupByType.length)
            ];
            typeAudio.push({ url, title });
            return typeAudio;
        },
        totalTranscriptText() {
            return this.transcriptions.reduce(
                (accumulator, current) =>
                    current.text === '' ? '' : `${accumulator} ${current.text}`,
                '',
            );
        },
        getResultInStage(title) {
            const testTitle = typeof title === 'number' ? `test${title}` : title;
            return {
                [testTitle]: {
                    blocks: this.transcriptions,
                    audioSelected: [this.currentAudioTitle],
                    accuracy: this.accuracy,
                    timetaken: this.timerWork().getTime(),
                    jsDiff: this.jsDiff,
                },
            };
        },
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
        async addItem() {
            // check if empty transcription
            if (!this.totalTranscriptText()) {
                this.acceptAlert('danger', 'Cannot Submit', 'The text field cannot be empty.');
                return;
            }
            this.$refs.match.pause();
            this.timerWork().toggleTimer();
            // eslint-disable-next-line no-alert
            if (window.confirm("You're about to submit the test")) {
                this.$vs.loading({ type: 'material' });
                // calculating accuracy
                [this.jsDiff, this.accuracy] = await this.diffAlgo(this.currentAudioTitle);
                try {
                    // Giving test for first time
                    if (this.count === 0) {
                        const batch = db.batch();
                        const res = await db.collection('practiceTestData').add({
                            date: getDate(),
                            tests: [this.getResultInStage(1)],
                            selectedAudios: [this.currentAudioTitle],
                            user: this.current_User_email,
                            Accuracy: this.accuracy,
                            Diff: this.jsDiff,
                            totalTime: this.timerWork().getTime(),
                        });
                        this.transId = res.id;
                        const userRef = db.collection('UserData').doc(this.userId);
                        userRef.update({
                            practiceTests: this.pushInStore(this.transId),
                        });
                        const audioRef = db.collection('audioInfo').doc(this.audioId);
                        audioRef.update({
                            tests: this.increaseInStore(1),
                            cumulativeAccuracy: this.increaseInStore(this.accuracy),
                        });
                        await batch.commit();
                    }
                    this.clearAllData();
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.timerWork().toggleTimer();
            }
        },
        async diffAlgo(audio) {
            const { audioId, audioData } = await getSingleAudio(audio);
            const { comment, type } = audioData;
            this.audioId = audioId;
            this.audioTranscription = comment;
            this.type = type;
            return diffCalculator(this.totalTranscriptText(), this.audioTranscription);
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
                this.transcriptions = this.transcriptions.filter(
                    (block) => block.id !== this.currentBlock,
                );
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
};
</script>

<style scoped>
.speaker-selector {
    color: black;
}
.audioPlayer {
    display: block;
    border-radius: 1px;
    margin-top: 18%;
    padding: 2px;
    float: left;
    transform: rotate(270deg);
    position: fixed;
    margin-left: -3%;
    margin-top: 12%;
}
.row {
    /* background-color: green; */
    margin-right: 6%;
    margin-left: 1%;
}
.inputsec {
    width: 80%;
}
.input {
    display: block;
}
.input-group-prepend {
    margin-top: 10px;
    margin-left: -4%;
}
.input-group-text {
    color: black;
}
span {
    background-color: transparent;
    color: black;
    border: none;
}
.input-group-sm {
    background-color: transparent !important;
}
.col-8 {
    margin-top: 1%;
}
textarea {
    padding: 10px;
    font-size: 16px;
    margin: auto;
    width: 100%;
    border-radius: 10px;
    border: 2px solid #556677;
    border-top: 2px solid #556677;
    border-bottom: hidden;
    border-right: none;
    border-left: 2px solid #556677;
    overflow: hidden;
    color: black;
    background-color: transparent !important;
}
.sbutton-imp {
    background-color: #556677;
}
</style>
