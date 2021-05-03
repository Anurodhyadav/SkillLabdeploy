import { db } from '../../firebase/db';

// get user data
export const getAllUser = async (...all) => {
    const users = [];
    await db
        .collection('UserData')
        .where(...all)
        .get()
        .then((mySnapshot) => {
            mySnapshot.forEach((myDoc) => {
                users.push(myDoc.data());
            });
        });
    return users;
};

export const getUsersByGroup = async (...all) => {
    const users = [];
    await db
        .collection('UserData')
        .where(...all)
        .get()
        .then((mySnapshot) => {
            mySnapshot.forEach((myDoc) => {
                users.push(myDoc.data());
            });
        });
    return users;
};

export const getSingleUser = async (email) => {
    const user = await db
        .collection('UserData')
        .where('email', '==', email)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => [doc.id, doc.data()]));
    return user[0];
};

export const canTakeExtraTest = async (email) => {
    const { testNo, role } = await getSingleUser(email);
    return !!(testNo === 0 || role === 'admin');
};

export const getAllAudioInfo = async () => {
    const audios = [];
    await db
        .collection('audioInfo')
        .get()
        .then((mySnapshot) => {
            mySnapshot.forEach((myDoc) => {
                audios.push(myDoc.data());
            });
        });
    return audios;
};

export const getAudioByGroup = async (...all) => {
    const audios = [];
    await db
        .collection('audioInfo')
        .where(...all)
        .get()
        .then((mySnapshot) => {
            mySnapshot.forEach((myDoc) => {
                audios.push(myDoc.data());
            });
        });
    return audios;
};

export const getHardAudio = async () => {
    const audios = await getAudioByGroup('type', '==', 'SuperHard');
    return audios[Math.floor(Math.random() * audios.length)];
};

export const getSingleAudio = async (title) => {
    const audioInfo = await db
        .collection('audioInfo')
        .where('title', '==', title)
        .get()
        .then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => ({ audioId: doc.id, audioData: doc.data() }));
        });
    return audioInfo[0];
};

export const getSelectedAudiosLengthInfo = async (audioList) => {
    const audios = [];
    await audioList.forEach((item) => {
        db.collection('audioInfo')
            .where('title', '==', item)
            .get()
            .then((mySnapshot) => {
                audios.push(mySnapshot.docs.map((doc) => doc.data().duration)[0]);
            });
    });
    return audios;
};

export const getUrlAudioTitle = async (audioList) => {
    const audios = [];
    await audioList.forEach((item) => {
        db.collection('audioInfo')
            .where('title', '==', item)
            .get()
            .then((mySnapshot) => {
                audios.push(mySnapshot.docs.map((doc) => doc.data().title)[0]);
            });
    });
    return audios;
};

export const getTitleAudioURl = async (audioList) => {
    const audios = [];
    await audioList.forEach((item) => {
        db.collection('audioInfo')
            .where('title', '==', item)
            .get()
            .then((mySnapshot) => {
                audios.push(mySnapshot.docs.map((doc) => doc.data().url)[0]);
            });
    });
    return audios;
};
export const getAudioByRangeFunc = async (startDate, endDate) =>
    db
        .collection('transData')
        .orderBy('date')
        .startAt(startDate)
        .endAt(endDate)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()));

export const getAudioByRange = async (startDate, endDate) =>
    startDate === endDate
        ? getAudioByGroup('date', '==', startDate)
        : getAudioByRangeFunc(startDate, endDate);

export const getAllTransData = async () =>
    db
        .collection('transData')
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()));

export const gettransDataByGroup = async (...all) => {
    return db
        .collection('transData')
        .where(...all)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};

export const getpracticeDataByGroup = async (...all) => {
    return db
        .collection('practiceTestData')
        .where(...all)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};
