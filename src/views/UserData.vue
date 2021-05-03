<template>
    <div class="userdata">
        <NavBar />
        <div>
            <vs-collapse accordion not-arrow>
                <vs-collapse-item v-for="tests in storedTranscriptions" :key="tests.id">
                    <div slot="header" class="header-collapse">
                        <div>
                            <span v-if="tests.outcome == 'Accepted'" :style="{ color: 'green' }">{{
                                tests.date
                            }}</span>
                            <span
                                v-else-if="tests.outcome == 'Rejected'"
                                :style="{ color: 'red' }"
                                >{{ tests.date }}</span
                            >
                            <span
                                v-else-if="tests.outcome == 'Unsettled'"
                                :style="{ color: 'yellow' }"
                                >{{ tests.date }}</span
                            >
                            <span v-else>{{ tests.date }}</span>
                            <!-- below for selection -->
                            <!-- <span class="arrangeItems">
                <vs-dropdown>
                  <a class="a-icon" href="#" style="color: #ffffff">
                    <span v-if="tests.outcome">Update Outcomes</span>
                    <span v-else>Set Outcome</span>
                    <vs-icon class="" icon="expand_more"></vs-icon>
                  </a>
 
                  <vs-dropdown-menu>
                    <vs-dropdown-item @click="acceptClient(tests.id)"> Accepted </vs-dropdown-item>
                    <vs-dropdown-item @click="rejectClient(tests.id)"> Rejected </vs-dropdown-item>
                    <vs-dropdown-item @click="meetClient(tests.id)"> Unsettled </vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </span> -->
                        </div>
                    </div>

                    <div>
                        <vs-tabs alignment="center" color="white" class="white">
                            <vs-tab
                                @click="
                                    loadDiff(
                                        tests.id + '___' + test[`test${key + 1}`].audioSelected,
                                        getTranscriptText(test[`test${key + 1}`]),
                                    )
                                "
                                :label="'Test ' + (key + 1)"
                                :key="key"
                                v-for="(test, key) in tests.tests"
                            >
                                <div style="font-size: 20px">Email: {{ mail }}</div>
                                <div>Title: {{ test[`test${key + 1}`].audioSelected }}</div>
                                <div>Type: {{ test[`test${key + 1}`].type }}</div>
                                <div>
                                    Diff:
                                    <span
                                        :ref="
                                            tests.id +
                                            '0' +
                                            '---' +
                                            test[`test${key + 1}`].audioSelected
                                        "
                                        >{{ test[`test${key + 1}`].jsDiff }}</span
                                    >%
                                    <b-icon
                                        icon="arrow-clockwise"
                                        font-scale="1.1"
                                        @click="
                                            reDiff(
                                                tests.id +
                                                    '0' +
                                                    '---' +
                                                    test[`test${key + 1}`].audioSelected,
                                                getTranscriptText(test[`test${key + 1}`]),
                                                0,
                                            )
                                        "
                                    ></b-icon>
                                </div>
                                <div>
                                    Accuracy:
                                    <span
                                        :ref="
                                            tests.id +
                                            '1' +
                                            '---' +
                                            test[`test${key + 1}`].audioSelected
                                        "
                                        >{{ test[`test${key + 1}`].accuracy }}</span
                                    >%
                                    <b-icon
                                        @click="
                                            reDiff(
                                                tests.id +
                                                    '1' +
                                                    '---' +
                                                    test[`test${key + 1}`].audioSelected,
                                                getTranscriptText(test[`test${key + 1}`]),
                                                1,
                                            )
                                        "
                                        icon="arrow-clockwise"
                                        font-scale="1.1"
                                    ></b-icon>
                                </div>
                                <div>
                                    Test Time: {{ getTime(test[`test${key + 1}`].timetaken) }}
                                </div>
                                <div :ref="tests.id + '___' + test[`test${key + 1}`].audioSelected">
                                    <div v-show="false">
                                        {{ getTranscriptText(test[`test${key + 1}`]) }}
                                    </div>
                                </div>
                            </vs-tab>
                            <vs-tab
                                v-if="tests.hardtest"
                                label="Hard Test"
                                @click="
                                    loadDiff(
                                        tests.id + '___' + tests.hardtest.audioSelected,
                                        getTranscriptText(tests.hardtest),
                                    )
                                "
                            >
                                <div>Title: {{ tests.hardtest.audioSelected }}</div>
                                <div>Type: {{ tests.hardtest.type }}</div>
                                <div>
                                    Diff:
                                    <span
                                        :ref="tests.id + '0' + '---' + tests.hardtest.audioSelected"
                                        >{{ tests.hardtest.jsDiff }}</span
                                    >%
                                    <b-icon
                                        icon="arrow-clockwise"
                                        font-scale="1.1"
                                        @click="
                                            reDiff(
                                                tests.id +
                                                    '0' +
                                                    '---' +
                                                    tests.hardtest.audioSelected,
                                                getTranscriptText(tests.hardtest),
                                                0,
                                            )
                                        "
                                    ></b-icon>
                                </div>
                                <div>
                                    Accuracy:
                                    <span
                                        :ref="tests.id + '1' + '---' + tests.hardtest.audioSelected"
                                        >{{ tests.hardtest.accuracy }}</span
                                    >%
                                    <b-icon
                                        icon="arrow-clockwise"
                                        font-scale="1.1"
                                        @click="
                                            reDiff(
                                                tests.id +
                                                    '1' +
                                                    '---' +
                                                    tests.hardtest.audioSelected,
                                                getTranscriptText(tests.hardtest),
                                                1,
                                            )
                                        "
                                    ></b-icon>
                                </div>
                                <div>Test Time: {{ getTime(tests.hardtest.timetaken) }}</div>
                                <div :ref="tests.id + '___' + tests.hardtest.audioSelected">
                                    <div v-show="false">
                                        {{ getTranscriptText(tests.hardtest) }}
                                    </div>
                                </div>
                            </vs-tab>
                        </vs-tabs>
                    </div>
                </vs-collapse-item>
            </vs-collapse>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import AlertMsg from '@/mixins/AlertMsg';
import 'firebase/auth';
import NavBar from '@/components/NavBar.vue';
import * as firebase from 'firebase/app';
import * as Diff from 'diff';
import { db } from '../firebase/db';
import 'firebase/database';
import { gettransDataByGroup, getSingleUser } from './api/Api';
import diffCalc from '../utilities/diffCalculator';

export default {
    name: 'UserData',
    props: {
        mail: {
            type: String,
        },
    },
    mixins: [AlertMsg],
    data() {
        return {
            storedTranscriptions: null,
            userId: '',
            userData: '',
            originalData: null,
            blockData: null,
        };
    },
    components: {
        NavBar,
    },

    methods: {
        getTime(time) {
            const minsInNum = Math.floor(time / 60);
            const minsPostfix = minsInNum > 1 ? 'minutes' : 'minute';
            const secInNum = time % 60;
            const secsPostfix = secInNum > 1 ? 'seconds' : 'second';
            return `${minsInNum} ${minsPostfix} ${secInNum} ${secsPostfix}`;
        },

        reDiff(ref, transcriptText, choice) {
            const selectedAudio = ref.split('---')[1];
            const originalText = this.originalData[selectedAudio];
            const newData = diffCalc(transcriptText, originalText)[choice];
            this.$refs[ref][0].innerText = newData;
        },

        loadDiff(key, transText) {
            this.$nextTick(() => {
                const audio = key.split('___')[1];
                const element = this.$refs[key][0];
                const originalText = this.originalData[audio];
                const diffBlock = this.produceDiffElement(transText, originalText);
                element.innerHTML = '';
                element.appendChild(diffBlock);
            });
        },
        produceDiffElement(blockText, originalText) {
            let span = null;
            const diff = Diff.diffWords(blockText, originalText);
            const fragment = document.createDocumentFragment();
            diff.forEach((part) => {
                // eslint-disable-next-line no-nested-ternary
                const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
                span = document.createElement('span');
                span.style.color = color;
                if (part.removed) span.style.textDecoration = 'line-through';
                span.appendChild(document.createTextNode(part.value));
                fragment.appendChild(span);
                if (part.removed) fragment.appendChild(document.createTextNode(' '));
            });
            // this.fragment = fragment;
            return fragment;
        },

        getData(mytitle) {
            return this.originalData.find((data) => data.title === mytitle);
        },

        getTranscriptText(transcriptData) {
            return transcriptData.blocks.reduce(
                (fullText, currentBlock) => `${fullText} ${currentBlock.text}`,
                '',
            );
        },

        async getOriginalData(audios) {
            const originalData = {};
            const originalText = await db
                .collection('audioInfo')
                .where('title', 'in', [...audios])
                .get();
            originalText.forEach((mydoc) => {
                originalData[mydoc.data().title] = mydoc.data().comment;
            });
            return originalData;
        },

        async getTranscriptData() {
            const transData = await gettransDataByGroup('user', '==', this.mail);
            const newData = transData
                .filter((transcript) => transcript.tests && transcript.tests.length === 3)
                .map((transcription) => ({
                    tests: [...transcription.tests],
                    hardtest: transcription.HardTest,
                    outcome: transcription.outcome,
                    audios: transcription.selectedAudios,
                    date: transcription.date,
                    id: transcription.id,
                }));
            return newData;
        },

        getHardAudios(tests) {
            return tests
                .filter((trans) => trans.hardtest && trans.hardtest.audioSelected)
                .map((trans) => trans.hardtest.audioSelected);
        },

        getAllAudioTitle(transcripts) {
            const allAudioData = transcripts.map((trans) => trans.audios).flat();
            const allAudio = allAudioData.map((obj) => obj.title);
            const hardAudios = this.getHardAudios(transcripts);
            return Array.from(new Set([...allAudio, ...hardAudios]));
        },

        // acceptClient(testId) {
        //   const userResult = db.collection('transData').doc(testId);
        //   const userHide = db.collection('UserData').doc(this.userId);
        //   userResult.update({
        //     outcome: 'Accepted',
        //   });
        //   userHide.update({
        //     visibility: false,
        //   });
        //   this.acceptAlert(
        //     'success',
        //     'Outcome Saved ',
        //     `The user ${this.mail} Outcome is set to Accepted and visibility set to hidden`,
        //   );
        // },
        // meetClient(testId) {
        //   const userResult = db.collection('transData').doc(testId);
        //   const userHide = db.collection('UserData').doc(this.userId);
        //   userResult.update({
        //     outcome: 'Unsettled',
        //   });
        //   userHide.update({
        //     visibility: false,
        //   });
        //   this.acceptAlert(
        //     'info',
        //     'Outcome Saved',
        //     `The user ${this.mail} Outcome is set to Unsettled and visibility set to hidden`,
        //   );
        // },
        // rejectClient(testId) {
        //   const userResult = db.collection('transData').doc(testId);
        //   const userHide = db.collection('UserData').doc(this.userId);
        //   userResult.update({
        //     outcome: 'Rejected',
        //   });
        //   userHide.update({
        //     visibility: false,
        //   });
        //   this.acceptAlert(
        //     'danger',
        //     'Outcome Saved',
        //     `The user ${this.mail} Outcome is set to Accepted and visibility set to hidden`,
        //   );
        // },
    },

    async created() {
        const user = firebase.auth().currentUser;
        this.currentUseremail = user.email;
        const [userId, userData] = await getSingleUser(this.mail);
        [this.userId, this.userData] = [userId, userData];
        if (!this.mail) {
            this.$router.replace({ name: 'Transcriptions' });
        }
    },

    async mounted() {
        const allTests = await this.getTranscriptData();
        console.log(allTests);
        const allAudios = this.getAllAudioTitle(allTests);
        this.storedTranscriptions = allTests;
        this.originalData = await this.getOriginalData(allAudios);

        const refs = this.$refs;
        Object.keys(refs).forEach((key) => {
            if (key.includes('___')) {
                const audio = key.split('___')[1];
                const element = refs[key] && refs[key][0];
                if (element) {
                    const transText = element.firstChild.innerText;
                    const originalText = this.originalData[audio];

                    const diffBlock = this.produceDiffElement(transText, originalText);

                    element.innerHTML = '';
                    element.appendChild(diffBlock);
                }
            }
        });
    },
};
</script>
<style scoped>
table {
    width: 50%;
}
.cardx {
    background-color: #05386bf5;
    color: rgba(250, 235, 215, 0.788);
}
.real {
    margin-right: 30px;
}
/* .date {
  color: rgb(156, 19, 19);
} */
/* .arrangeItems {
  float: right;
  padding-right: 3%;
} */
/* .header-collapse {
  color: white;
} */
/* .white {
  color: rgb(170, 33, 33);
} */
</style>
