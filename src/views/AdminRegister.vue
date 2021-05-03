<template>
    <div v-if="allowAccess">
        <NavBar />
        <div class="signup-form">
            <h2>AdminRegister</h2>
            <p>Please fill in this form to register an admin!</p>
            <hr />
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">
                            <b-icon icon="envelope"></b-icon>
                        </span>
                    </div>
                    <input
                        type="email"
                        class="form-control"
                        name="email"
                        v-model="email"
                        placeholder="Email Address"
                        required="required"
                    />
                </div>
            </div>
        </div>
        <div class="form-group">
            <button @click="registerNew" type="submit" class="btn btn-success btn-lg">
                Add Admin
            </button>
            <a href="/#/stats" class="btn btn-info m-3"><b-icon icon="house-fill"></b-icon></a>
        </div>
        <table class="table table-borderless mx-auto m-2 text-left">
            <tbody>
                <tr v-for="emailItem in emailList" :key="emailItem">
                    <td>{{ emailItem }}</td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-danger m-1"
                            @click="removeAdmin(emailItem)"
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import AlertMsg from '@/mixins/AlertMsg';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import NavBar from '@/components/NavBar.vue';
import { db } from '../firebase/db';

export default {
    name: 'AdminRegister',
    mixins: [AlertMsg],
    components: {
        NavBar,
    },
    data() {
        return {
            email: '',
            myUserId: '',
            emailList: [],
            myEmail: '',
            myEmailId: '',
            allowAccess: false,
            mySuperuser: '',
        };
    },
    methods: {
        async removeAdmin(emailItem) {
            await db
                .collection('UserData')
                .where('email', '==', emailItem)
                .get()
                .then((mySnapshot) => {
                    mySnapshot.forEach((myDoc) => {
                        const myData = {
                            id: myDoc.id,
                        };
                        this.myEmailId = myData.id;
                        db.collection('UserData')
                            .doc(this.myEmailId)
                            .set({ role: '' }, { merge: true });
                    });
                });
            this.acceptAlert('danger', 'Permission changed', 'Admin removed');
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        },
        async registerNew() {
            try {
                await db
                    .collection('UserData')
                    .where('email', '==', this.email)
                    .get()
                    .then((mySnapshot) => {
                        mySnapshot.forEach((myDoc) => {
                            const myData = {
                                id: myDoc.id,
                            };
                            this.myUserId = myData.id;
                            db.collection('UserData')
                                .doc(this.myUserId)
                                .set({ role: 'admin' }, { merge: true });
                        });
                    });
                if (this.myUserId) {
                    this.email = '';
                    this.acceptAlert(
                        'success',
                        'Admin Regitered',
                        'The admin was successfully completed',
                    );
                } else {
                    this.acceptAlert(
                        'danger',
                        'User doesnot exits',
                        'The user with given email address doesnot exists',
                    );
                }
            } catch (e) {
                this.acceptAlert('danger', 'Error', e);
            }
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        },
    },
    created() {
        const user = firebase.auth().currentUser;
        this.current_User_email = user.email;
        db.collection('UserData')
            .where('email', '==', this.current_User_email)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        superuser: doc.data().superuser,
                    };
                    this.mySuperuser = Data.superuser;
                    if (this.mySuperuser) {
                        this.allowAccess = true;
                    } else {
                        this.$router.replace({ name: 'Home' });
                    }
                });
            });
        db.collection('UserData')
            .where('role', '==', 'admin')
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    const Data = {
                        email: doc.data().email,
                    };
                    this.myEmail = Data.email;
                    this.emailList.push(this.myEmail);
                });
            });
    },
};
</script>
<style scoped>
.form-control {
    font-size: 15px;
}
.form-control,
.form-control:focus,
.input-group-text {
    border-color: #e1e1e1;
}
.form-control,
.btn {
    border-radius: 3px;
}
.signup-form {
    width: 400px;
    margin: 0 auto;
    padding: 30px 0;
}
.signup-form form {
    color: #999;
    border-radius: 3px;
    margin-bottom: 15px;
    background: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 30px;
}
.signup-form h2 {
    font-weight: bold;
    margin-top: 0;
}
/* .signup-form p {
  color: white;
} */
.signup-form hr {
    margin: 0 -30px 20px;
}
.signup-form .form-group {
    margin-bottom: 20px;
}
.signup-form label {
    font-weight: normal;
    font-size: 15px;
}
.signup-form .form-control {
    min-height: 38px;
    box-shadow: none !important;
}
.signup-form .input-group-addon {
    max-width: 42px;
    text-align: center;
}
.signup-form .btn,
.signup-form .btn:active {
    font-size: 16px;
    font-weight: bold;
    background: #46a2b9 !important;
    border: none;
    min-width: 140px;
}
.signup-form .btn:hover,
.signup-form .btn:focus {
    background: #2e8daa !important;
}
.signup-form a {
    text-decoration: underline;
}
.signup-form a:hover {
    text-decoration: none;
}
.signup-form form a {
    color: #19aa8d;
    text-decoration: none;
}
.signup-form form a:hover {
    text-decoration: underline;
}
.signup-form .fa {
    font-size: 21px;
}
.signup-form .fa-paper-plane {
    font-size: 18px;
}
.signup-form .fa-check {
    left: 17px;
    top: 18px;
    font-size: 7px;
    position: absolute;
}
.table {
    width: 40%;
    font-weight: bold;
}
/* h2 {
  color: white;
} */
</style>
