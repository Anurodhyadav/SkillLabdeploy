<template>
  <div>
    <vs-prompt
      class="holamundo"
      title="Details"
      :active.sync="isPopupVisible"
      buttons-hidden
      @close="closingDialog"
    >
      <input
        type="date"
        id="start"
        name="trip-start"
        @change="setDateFrom"
        ref="dateFrom"
        :max="dateTo"
      />
      <input
        type="date"
        id="start"
        name="trip-start"
        :min="dateFrom"
        @change="setDateTo"
        ref="dateTo"
      />
      <hr />
      <vs-button
        color="primary"
        icon="cloud_download"
        v-if="dateFrom && dateTo"
        @click="generateCsv('range')"
        >Dump audio</vs-button
      >
      <vs-button type="filled" disabled icon="cloud_download" v-else>Dump audio</vs-button>
      <vs-button
        color="primary"
        icon="cloud_download"
        @click="generateCsv('all')"
        style="float: right"
        >All Dumps</vs-button
      >
      <a ref="link"></a>
    </vs-prompt>
  </div>
</template>
<script>
import { Parser } from 'json2csv';
import { getAudioByRange, getAllTransData } from '../views/api/Api';

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    isActive(newValue) {
      this.isPopupVisible = newValue;
    },
  },

  data() {
    return {
      isPopupVisible: false,
      dateFrom: 0,
      dateTo: 0,
    };
  },

  methods: {
    closingDialog() {
      this.$emit('closing');
    },

    setDateFrom() {
      this.dateFrom = this.$refs.dateFrom.value;
    },

    setDateTo() {
      this.dateTo = this.$refs.dateTo.value;
    },

    getLabel() {
      return [
        'user',
        'Test Date',
        'Easy Audio',
        'Accuracy (Easy)',
        'Time Taken (Easy)',
        'Medium Audio',
        'Accuracy (Medium)',
        'Time Taken (Medium)',
        'Hard Audio',
        'Accuracy (Hard)',
        'Time Taken (Hard)',
        'Average accuracy',
        'Total Time',
        'Super Hard Audio',
        'Accuracy (Super Hard)',
        'Time Taken (Super Hard)',
      ];
    },

    completedTests(tests) {
      return tests.filter((transcriptions) => {
        return (
          transcriptions.tests &&
          Array.isArray(transcriptions.tests) &&
          transcriptions.tests.length === 3
        );
      });
    },

    startDownload(blob, mode) {
      const { link } = this.$refs;
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = mode === 'range' ? `${this.dateFrom} to ${this.dateTo}.csv` : 'AllInput.csv';
      link.click();
    },

    parseToCsv(opts, entry) {
      const parser = new Parser(opts);
      return parser.parse(entry);
    },

    async generateCsv(mode) {
      try {
        const opts = { fields: this.getLabel() };
        const transData =
          mode === 'range'
            ? await getAudioByRange(this.dateFrom, this.dateTo)
            : await getAllTransData();
        const filteredTests = this.completedTests(transData);
        const entry = this.entryMaker(filteredTests);
        const csv = this.parseToCsv(opts, entry);
        const blob = new Blob([csv], { type: 'text/csv' });
        this.startDownload(blob, mode);
      } catch (err) {
        console.error(err);
      }
    },

    cutMp3Extension(name) {
      return name.replace('.mp3', '');
    },

    getAudioInfoByGroup(tests) {
      const separatedByType = {};
      const obj = Object.values(tests).map((test, index) => {
        return test[`test${index + 1}`];
      });
      Object.values(obj).forEach((test) => {
        separatedByType[test.type] = test;
      });
      return separatedByType;
    },

    entryMaker(transcriptions) {
      return transcriptions.map((transcription) => {
        const { Easy, Medium, Hard } = this.getAudioInfoByGroup(transcription.tests);
        const { HardTest } = transcription;
        return {
          user: transcription.user,
          'Test Date': transcription.date,
          'Easy Audio': this.cutMp3Extension(Easy.audioSelected),
          'Accuracy (Easy)': Easy.accuracy,
          'Time Taken (Easy)': Easy.timetaken,
          'Medium Audio': this.cutMp3Extension(Medium.audioSelected),
          'Accuracy (Medium)': Medium.accuracy,
          'Time Taken (Medium)': Medium.timetaken,
          'Hard Audio': this.cutMp3Extension(Hard.audioSelected),
          'Accuracy (Hard)': Hard.accuracy,
          'Time Taken (Hard)': Hard.timetaken,
          'Average accuracy': transcription.cumulativeAccuracy / 3,
          'Total Time': transcription.totalTime,
          'Super Hard Audio': HardTest ? HardTest.audioSelected : '',
          'Accuracy (Super Hard)': HardTest ? HardTest.accuracy : '',
          'Time Taken (Super Hard)': HardTest ? HardTest.timetaken : '',
        };
      });
    },
  },
};
</script>
<style scoped>
div {
  text-align: center;
}
</style>
