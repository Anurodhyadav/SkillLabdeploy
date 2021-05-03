<template>
    <div>
        <vs-button disabled class="timer" type="filled">
            <b-icon icon="alarm"></b-icon> <span class="timerColor">{{ showTimer }} </span>
        </vs-button>
        <!-- <vs-button @click="popIn">start</vs-button> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentTime: '00 : 00',
            seconds: 0,
            isRunning: false,
        };
    },

    computed: {
        showTimer() {
            const mins = Math.floor(this.seconds / 60);
            const sec = this.seconds % 60;
            return `${mins < 10 ? `0${mins}` : `${mins}`} : ${sec < 10 ? `0${sec}` : `${sec}`}`;
        },
    },

    methods: {
        toggleTimer() {
            if (this.isRunning === true) {
                clearInterval(this.timer);
            } else {
                this.timer = setInterval(() => {
                    this.seconds += 1;
                }, 1000);
            }
            this.isRunning = !this.isRunning;
        },

        resetTimer() {
            this.seconds = 0;
        },

        getSeconds() {
            return this.seconds;
        },
    },

    created() {
        this.toggleTimer();
    },

    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>
<style scoped>
.timer {
    border-radius: 10px;
    margin-left: -5%;
    float: right;
    padding: 8px 28px;
    text-align: center;
    text-decoration: none;
    font-size: 20px;
    cursor: pointer;
    margin-top: 0%;
    color: black;
    background-color: transparent !important;
    position: fixed;
}
</style>
