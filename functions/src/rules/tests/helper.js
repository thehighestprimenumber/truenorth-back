const firebase = require("@firebase/testing");
const fs = require("fs");
const path = require("path");

module.exports.setup = async (auth, data) => {
    const projectId = `rules-spec-${Date.now()}`;
    const app = await firebase.initializeTestApp({
        projectId, auth,
    });

    const db = app.firestore();

    // Initialize admin app
    const adminApp = firebase.initializeAdminApp({
        projectId,
    });

    const adminDB = adminApp.firestore();

    // Write mock documents before rules using adminApp
    if (data) {
        for (const key in data) {
            const ref = adminDB.doc(key);
            await ref.set(data[key]);
        }
    }
    const rulesPath = path.resolve(__dirname, "../firestore.rules");
    const rulesFile = fs.readFileSync(rulesPath, "utf8");

    await firebase.loadFirestoreRules({
        projectId, rules: rulesFile,
    });

    return db;
};

module.exports.teardown = async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
};
