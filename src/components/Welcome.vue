<template>
    <div class="Welcome">
        <div class="container">
            <div class="card">
                <div class="card-header">
                    Welcome to the English language transcription test by SkillLab!
                </div>
                <div class="info">
                    This test will judge:
                    <ul>
                        <div class="lists">
                            <li>
                                Your ability to listen to audio files and accurately type what you
                                hear word for word.
                            </li>
                            <br />
                            <li>Your ability to adhere to standard English grammatical rules.</li>
                            <br />
                        </div>
                    </ul>
                </div>
                <div class="card-footer">
                    <b-button
                        type="button"
                        class="sbutton-imp p-2 m-2"
                        @click="furtherInstruction"
                        variant="info"
                    >
                        <span class="button-header">Take Test</span>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'Welcome',
    methods: {
        furtherInstruction() {
            this.$store.state.Test.PracticeTest = true;
            this.$router.push({ name: 'InstructionFormat' });
        },
    },
};
</script>

<style>
.sbutton-imp {
    width: 300px;
}
.Welcome {
    padding: 75px 50px 25px 75px;
    width: 100%;
}
.card {
    width: 60%;
    background-color: transparent !important;
    color: #0b1c4b;
    margin-left: 20%;
}
.info {
    margin-left: 7%;
    text-align: start;
    font-size: 17px;
    margin-top: 4%;
    color: #0b1c4b;
}
.lists {
    margin-top: 5%;
    margin-left: 2%;
}
.card-header {
    font-size: 28px;
}
.button-header {
    font-size: 20px;
}
p {
    padding-left: 1em;
}
</style>
