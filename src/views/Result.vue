/* eslint-disable no-undef */
<template>
    <div class="Result">
        <NavBar />
        <ThanksMessage />
        <vs-button class="download" @click="reportDownload" color="rgb(125, 140, 176)" type="filled"
            >Download Report
            <b-icon-download></b-icon-download>
        </vs-button>
        <div class="A4" ref="myReport">
            <h2>SkillLab Test Report</h2>
            <hr />
            <div class="list">
                <ul class="list-group text-left m-2">
                    <li class="list-group-item">
                        Date: <b>{{ date }}</b>
                    </li>
                    <li class="list-group-item">
                        Net Time Taken: <b>{{ formattedAudioLength(totalTime) }}</b>
                    </li>
                    <!-- <li class="list-group-item">
            Total Tests: <b>{{ mytestNo }}</b>
          </li>
          -->

                    <!-- <li class="list-group-item">
            Audio: <b>{{ audioTitle }}</b>
          </li> -->
                    <!-- <li class="list-group-item">
            Total Errors: <b>{{ totalError }}</b>
          </li> -->
                </ul>
            </div>
            <div class="para">
                <p>
                    <b
                        >{{ textTop }} {{ nameFromEmail }}, you scored
                        {{ cumulativeAccuracy.toFixed(3) }}%</b
                    ><br />
                    {{ topBody }}<br /><br />
                    <!-- <b>Time:</b><br />You took {{ totalTime }} to complete all the test, which is<br /><br /> -->
                    <!-- {{ ratio }} minutes taken to transcribe one minute of audio.<br /><br />  -->
                    <!-- <b>Grammar:</b><br />
          You entered {{ wordCount }} words, from which {{ wordCount - totalError }} were correct
          and {{ totalError }} had grammatical errors.<br /> -->
                </p>
                <p class="bar">
                    <b>Diff: {{ cumulativeDiff.toFixed(3) }}%</b
                    ><vs-progress
                        color="rgba(86, 72, 72, 0.5)"
                        :height="12"
                        :percent="Math.floor(cumulativeDiff)"
                    ></vs-progress>
                </p>
                <p class="bar">
                    <b>Accuracy: {{ cumulativeAccuracy.toFixed(3) }}%</b
                    ><vs-progress
                        color="rgba(86, 72, 72, 0.5)"
                        :height="12"
                        :percent="Math.floor(cumulativeAccuracy)"
                    ></vs-progress>
                </p>
                <!-- <p class="bar">
          <b>Grammar: {{ grammarAccuracy }}%</b
          ><vs-progress
            :height="12"
            :percent="Math.floor(grammarAccuracy)"
            color="rgba(86, 72, 72, 0.5)"
          ></vs-progress>
        </p> -->
                <!-- <p class="bar">
          <b>Average: {{ ((parseFloat(jsDiff) + parseFloat(grammarAccuracy)) / 2).toFixed(3) }}%</b
          ><vs-progress
            :height="12"
            :percent="Math.floor(avgAccuracy)"
            color="rgba(86, 72, 72, 0.5)"
          ></vs-progress>
        </p> -->
            </div>
            <vs-divider></vs-divider>
            <!-- <div class="graph">
        <mdb-container>
          <mdb-radar-chart
          :data="radarChartData"
          :options="radarChartOptions"
          :width="1500"
          :height="750"
          ></mdb-radar-chart>
        </mdb-container>
      </div> -->
            <!-- <vs-table v-if="totalError > 0" stripe :data="grammarError" class="grammar-info">
        <template slot="header">
          <h3>Grammar Information</h3>
        </template>
        <template slot="thead">
          <vs-th>Sentence</vs-th>
          <vs-th>Issue</vs-th>
        </template>
        <template slot-scope="{ data }">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="tr.sentence">
              {{ tr.sentence }}
            </vs-td>
            <vs-td :data="tr.message">
              {{ tr.message }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table> -->
            <vs-row v-for="(value, index) in Test" :key="index" vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-card actionable class="cardx">
                        <div slot="header">
                            <h5 v-if="index != 3">Test{{ index + 1 }}</h5>
                            <h5 v-else>SuperHardTest</h5>
                        </div>
                        <div>
                            <div>
                                <b>Audio: {{ audioTitle[index] }}</b>
                            </div>
                            <div>
                                <b
                                    >Time Taken:
                                    {{
                                        formattedAudioLength(value[`test${index + 1}`].timetaken)
                                    }}</b
                                >
                            </div>
                            <div>
                                <b>JsDiff: {{ value[`test${index + 1}`].jsDiff }}</b>
                            </div>
                            <div>
                                <b>Accuracy: {{ value[`test${index + 1}`].accuracy }}</b>
                            </div>
                            <div>
                                <b>AudioLength: {{ selectedAudioslength[index] }}</b>
                            </div>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
            <div>
                <vs-row v-if="HardTest != undefined">
                    <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12"> </vs-col>
                    <vs-card actionable class="cardx">
                        <div slot="header">
                            <h5>Test: SuperHard</h5>
                        </div>
                        <div>
                            <div>
                                <b>Audio: {{ HardAudioTitle }}</b>
                            </div>
                            <div>
                                <b>Time Taken: {{ formattedAudioLength(HardTest.timetaken) }}</b>
                            </div>
                            <div>
                                <b>JsDiff: {{ HardTest.jsDiff }}</b>
                            </div>
                            <div>
                                <b>Accuracy: {{ HardTest.accuracy }}</b>
                            </div>
                            <div>
                                <b>AudioLength: {{ HardAudiolength }}</b>
                            </div>
                        </div>
                    </vs-card>
                </vs-row>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import ThanksMessage from '@/components/ThanksMessage.vue';
import NavBar from '@/components/NavBar.vue';
import AlertMsg from '@/mixins/AlertMsg';
import ResultWords from '@/mixins/ResultWords';
import * as firebase from 'firebase/app';
import 'firebase/auth';
// import { mdbRadarChart, mdbContainer } from 'mdbvue';
import html2pdf from 'html2pdf.js';
import { db } from '@/firebase/db';
import {
    getSingleUser,
    getSelectedAudiosLengthInfo,
    getSingleAudio,
    getUrlAudioTitle,
} from './api/Api';

// import jspdf from 'jspdf';
// @ is an alias to /src
export default {
    name: 'Result',
    props: {
        transId: {
            type: String,
        },
    },
    mixins: [AlertMsg, ResultWords],
    components: {
        NavBar,
        ThanksMessage,
    },
    data() {
        return {
            current_user_email: null,
            date: '',
            selectedAudios: [],
            HardAudiolength: '',
            totalTime: 0,
            HardAudioTitle: '',
            cumulativeDiff: 0,
            cumulativeAccuracy: 0,
            topBody: '',
            textTop: '',
            HardTest: [],
            nameFromEmail: '',
            Test: [],
            selectedAudioslength: [],
            audioTitle: [],
            radarChartData: {
                labels: [
                    'Measure 1',
                    'Measure 2',
                    'Measure 3',
                    'Measure 4',
                    'Measure 5',
                    'Measure 6',
                ],
                datasets: [
                    {
                        label: '25/09/2020',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        data: [85, 99, 90, 71, 76, 24],
                    },
                ],
            },
            radarChartOptions: {
                responsive: true,
                maintainAspectRatio: true,
            },
        };
    },
    methods: {
        formattedAudioLength(audio) {
            const min = Math.floor(audio / 60);
            const sec = audio % 60;
            return `${min}min ${sec}sec`;
        },
        reportDownload() {
            if (this.$refs.myReport) {
                const myFile = this.$refs.myReport;
                const opt = {
                    margin: 0,
                    padding: 0,
                    filename: `${this.nameFromEmail}Report.pdf`,
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'A4' },
                };
                html2pdf().from(myFile).set(opt).save();
            } else {
                this.acceptAlert('danger', 'Error', 'Error Occured during downloading.');
            }
        },
    },
    async created() {
        const user = firebase.auth().currentUser;
        this.current_user_email = user.email;
        this.nameFromEmail = this.current_user_email.substring(
            0,
            this.current_user_email.lastIndexOf('@'),
        );
        // eslint-disable-next-line no-unused-vars
        const [userId, userData] = await getSingleUser(user.email);
        const lastTransId = userData.tests[userData.tests.length - 1];
        const transRef = db.collection('transData').doc(lastTransId);
        const transData = await transRef.get();
        const {
            cumulativeAccuracy,
            cumulativeDiff,
            tests,
            date,
            totalTime,
            selectedAudios,
            HardTest,
        } = transData.data();
        this.totalTime = totalTime;
        console.log(selectedAudios);
        const selectedAudiosTitle = selectedAudios.map((obj) => obj.title);
        console.log('The title', selectedAudiosTitle);
        this.HardTest = HardTest;
        this.cumulativeAccuracy = cumulativeAccuracy / 3;
        this.cumulativeDiff = cumulativeDiff / 3;
        this.Test = tests;
        this.date = date;
        const hardaudioData =
            HardTest !== undefined ? await getSingleAudio(HardTest.audioSelected) : null;
        this.HardAudiolength = HardTest !== undefined ? hardaudioData.audioData.duration : null;
        this.HardAudioTitle = HardTest !== undefined ? hardaudioData.audioData.title : null;
        this.selectedAudioslength = await getSelectedAudiosLengthInfo(selectedAudiosTitle);
        this.audioTitle = await getUrlAudioTitle(selectedAudiosTitle);
    },
};
</script>

<style scoped>
.A4 {
    background: white;
    display: block;
    margin: 8px auto;
    margin-bottom: 0.5cm;
    box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
    width: 21cm;
    height: auto;
    padding: 20px;
}
/* @media print {
  body, page {
    margin: 5px;
    box-shadow: 0;
  }
} */
.download {
    border-radius: 2px;
    margin-top: 6%;
    margin-right: 5%;
    padding: 2px;
    float: right;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
}
.center {
    margin: auto;
    margin-top: 20px;
    width: 100%;
    border: 0px;
    padding: 10px;
    text-align: left;
}
.list {
    float: left;
    width: 30%;
    /* margin-left: 5px; */
}
.grammar-info {
    margin: auto;
    margin-top: 15px;
    width: 100%;
    border: 0px;
    padding: 10px;
    text-align: left;
}
.para {
    float: right;
    width: 70%;
    text-align: justify;
    line-height: normal;
    font-size: 16px;
}
.bar {
    margin: 6px;
    font-size: 14px;
}
</style>
