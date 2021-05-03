<template>
    <div>
        <audio
            class="video p-1 m-1"
            id="match"
            ref="match"
            :src="require(`../assets/${info.title}`)"
            controls
        ></audio>
        <form>
            <div class="form-group">
                <textarea
                    class="form-control p-2"
                    rows="1"
                    id="title"
                    placeholder="Title"
                    v-model="newTitle"
                    disabled
                ></textarea>
            </div>
            <div class="form-group">
                <textarea
                    class="form-control p-2"
                    rows="12"
                    id="comment"
                    placeholder="START TRANSCRIBING HERE"
                    v-model="newItem"
                ></textarea>
            </div>
            <div class="form-group text-left">
                <p>Being transcribed by: {{ current_user_email }}</p>
            </div>
        </form>
        <div class="p-2">
            <b-button type="button" class="sbutton-imp" @click="addItem" variant="light">
                <b-icon icon="collection-play"></b-icon>Save
            </b-button>
        </div>
        <b-alert
            class="mx-auto m-2"
            :show="dismissCountDown"
            variant="success"
            @dismiss-count-down="countDownChanged"
        >
            Transcription Saved!
        </b-alert>
    </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../firebase/db';

export default {
    name: 'TextBox',
    props: {
        info: {
            type: Object,
        },
    },
    data() {
        return {
            newItem: '',
            newTitle: this.info.title,
            successAlert: false,
            dismissSecs: 1,
            dismissCountDown: 0,
            current_user_email: null,
        };
    },
    created() {
        const user = firebase.auth().currentUser;
        this.current_user_email = user.email;
    },
    methods: {
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
            this.showDismissibleAlert = false;
        },
        showAlert() {
            if (this.successAlert) {
                this.dismissCountDown = this.dismissSecs;
            }
        },
        async addItem() {
            if (this.newItem && this.newTitle) {
                try {
                    await db.collection('transData').add({
                        transcription: this.newItem,
                        title: this.newTitle,
                        user: this.current_user_email,
                        audioid: this.info.id,
                    });
                    db.collection('audioInfo').doc(this.info.id).update({ status: 'Transcribed' });
                } catch (e) {
                    alert('Error');
                }
                this.newItem = '';
                this.newTitle = '';
                this.current_user_email = '';
                this.successAlert = true;
                this.showAlert();
            }
        },
    },
};
</script>

<style>
.sbutton-imp,
.sbutton-exp {
    box-shadow: none;
    border: none;
    border-radius: 5px;
    background-color: #46a2b9;
    color: #b4e2e7;
    padding: 5px;
}
.sbutton-exp:hover,
.sbutton-imp:hover {
    transform: scale(1.2);
    background-color: #46a2b9;
    color: #b4e2e7;
    box-shadow: 5px 5px 10px rgba(92, 91, 91, 0.89);
    transition: 0.5s ease;
}

form {
    box-shadow: 5px 5px 15px rgba(119, 117, 117, 0.514);
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
}
form:hover {
    transform: scale(1.01);
    box-shadow: 5px 5px 10px rgba(49, 111, 153, 0.562);
    transition: 0.3s;
}
textarea {
    font-size: 18px;
    position: center;
    border-radius: 10px;
    background: rgb(189, 212, 231);
    background: radial-gradient(circle, rgba(189, 212, 231, 1) 0%, rgba(134, 147, 171, 1) 120%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
}
b-alert {
    width: 40%;
}
</style>
<style scoped>
.fa {
    border: 1px solid rgba(97, 92, 92, 0.911);
    border-radius: 3px;
    width: 25px;
    height: 29px;
    margin-top: 5px;
    margin-bottom: 0px;
    color: rgba(0, 0, 0, 0.89);
    font-size: 20px;
}
</style>
