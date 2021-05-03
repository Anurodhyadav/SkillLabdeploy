<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="/#/">
                <img
                    src="../img/logo.png"
                    class="d-inline-block align-top"
                    alt="logo"
                    style="width: 170px; height: 50px"
                />
            </a>
            <a
                v-if="allowAccess === true || allowSuperAdmin === true"
                class="navbar-brand"
                href="/#/stats"
                >Goto admin section</a
            >
            <div>
                <vs-button class="navbar-brand" @click="popupActivo4 = true" color="transparent"
                    >Give Feedback</vs-button
                >
                <vs-popup
                    fullscreen
                    title="Transcription Project Feedback Form"
                    :active.sync="popupActivo4"
                    background-color-popup="#4a5153"
                    color="white"
                >
                    <FeedbackForm />
                </vs-popup>
            </div>
            <!-- <a class="navbar-brand" href="/#/feedbackform">Give Feedback</a> -->
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto"></ul>
                <div class="nav-item dropdown">
                    <a
                        class="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <span class="navEmail" v-if="user_PhotoUrl === null">{{
                            current_User_email
                        }}</span>
                        <img
                            v-else
                            class="navimg"
                            v-bind:src="user_PhotoUrl"
                            width="30"
                            height="30"
                        />
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <div class="card text-white">
                            <span class="navEmail" v-if="user_PhotoUrl === null"></span>
                            <img
                                v-else
                                class="dropdnimg"
                                v-bind:src="user_PhotoUrl"
                                width="90"
                                height="90"
                            />
                            <h6 class="card-title">{{ user_Name }}</h6>
                            <p>{{ current_User_email }}</p>
                            <button @click="signOut()" class="btn btn-secondary">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../firebase/db';
import FeedbackForm from '../views/FeedbackForm.vue';

export default {
    name: 'NavBar',
    components: {
        FeedbackForm,
    },
    data() {
        return {
            current_User_email: '',
            user_Name: null,
            user_PhotoUrl: null,
            allowAccess: false,
            allowSuperAdmin: false,
            popupActivo4: false,
        };
    },
    methods: {
        async signOut() {
            try {
                firebase.auth().signOut();
                this.$router.replace({ name: 'sign_in' });
            } catch (err) {
                console.log(err);
            }
        },
    },
    created() {
        const user = firebase.auth().currentUser;
        if (user) {
            this.current_User_email = user.email;
            this.user_Name = user.displayName;
            this.user_PhotoUrl = user.photoURL;
        }
        db.collection('UserData')
            .where('email', '==', this.current_User_email)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        username: doc.data().username,
                    };
                    this.user_Name = Data.username;
                });
            });
        // below check for admin role
        db.collection('UserData')
            .where('email', '==', this.current_User_email)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        role: doc.data().role,
                        superuser: doc.data().superuser,
                    };
                    this.userRole = Data.role;
                    this.mySuperuser = Data.superuser;
                    if (this.mySuperuser) {
                        this.allowSuperAdmin = true;
                    }
                    if (this.userRole === 'admin') {
                        this.allowAccess = true;
                    }
                });
            });
    },
};
</script>
<style scoped>
.navbar {
    padding: 2px 20px 2px 20px;
    background-color: rgb(23, 162, 184);
}
.navbar-brand {
    margin-left: 50px;
}
.navimg {
    border-radius: 50%;
}
.btn {
    margin-right: 20px;
    border-radius: 10px;
}
.navEmail {
    color: antiquewhite;
}
.dropdown-menu {
    background-color: #172727;
}
.card {
    width: 20rem;
    text-align: center;
    border: transparent;
    padding-right: 35px;
    background-color: #172727;
}
.dropdnimg {
    margin-left: 20%;
    border-radius: 50%;
    margin-bottom: 6px;
}
.card-title {
    margin-bottom: 0px;
    margin-right: 25%;
    font-size: 19px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
p {
    margin-right: 25%;
    font-size: 15px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: lighter;
    color: #437575;
}
.card button {
    margin-right: 29%;
}
</style>
