const {setup, teardown} = require("./helper");
require("../../customMatchers");
const {expect, describe, it, afterAll} = require("@jest/globals");

describe("Firestore rules", () => {
    const bob = "bob";
    const alice = "alice";

    afterAll(async () => {
        await teardown();
    });


    it("should allow read access to the 'operation' collection when user is signed in", async () => {
        const db = await setup({uid: bob});

        const collectionRef = db.collection("operation");

        await expect(collectionRef.get()).toAllow();
    });

    it("should deny read access to the 'operation' collection when user is not signed in", async () => {
        const db = await setup(null);

        const collectionRef = db.collection("operation");

        await expect(collectionRef.get()).toDeny();
    });

    it("should allow read and write access to the 'record' collection for the user who owns the document", async () => {
        const mockData = {"record/document123": {userId: bob}};
        const db = await setup({uid: bob}, mockData);

        const collectionRef = db.collection("record");

        await expect(collectionRef.doc("document123").get()).toAllow();
        await expect(collectionRef.doc("document123").set({field: 1})).toAllow();
    });

    it("should deny read and write access to the 'record' collection for a user who does not own the document", async () => {
        const mockData = {"record/document123": {userId: bob}};
        const db = await setup({uid: alice}, mockData);

        const collectionRef = db.collection("record");

        await expect(collectionRef.doc("document123").get()).toDeny();
        await expect(collectionRef.doc("document123").set({field: 1})).toDeny();
    });

    it("should allow read and write access to the user document for the authenticated user", async () => {
        const db = await setup({uid: bob});

        const docRef = db.collection("user").doc(bob);

        await expect(docRef.get()).toAllow();
        await expect(docRef.set({userId: bob})).toAllow();
    });

    it("should deny read and write access to the user document for a different user", async () => {
        const db = await setup({uid: alice});
        const docRef = db.collection("user").doc(bob);
        await expect(docRef.get()).toDeny();
        await expect(docRef.set({userId: alice})).toDeny();
    });
});
