# Firebase Project Local Setup Guide

This guide will walk you through the process of setting up a local development environment for a Firebase project that utilizes Firestore, Functions, and Authentication. By following these steps, you'll be able to run and test your Firebase project on your local machine.

## Prerequisites

Before proceeding, make sure you have the following prerequisites installed on your machine:

- Node.js and npm (Node Package Manager): [Download and install Node.js](https://nodejs.org)
- Firebase CLI: Install the Firebase CLI globally by running the following command:
  ```
  npm install -g firebase-tools
  ```

## Step 1: Clone your Firebase project

Start by cloning your Firebase project repository from your version control system (e.g., Git) to your local machine.

```
git clone <repository-url>
```

## Step 2: Install project dependencies

Navigate to the project's root directory and install the required dependencies by running the following command:

```
npm install
```

This will install the necessary Firebase SDKs, Firestore, and other project-specific dependencies defined in the `package.json` file.


## Step 3: Emulate Firebase features locally

Now you can start emulating Firebase features on your local machine. We'll be using Firestore, Functions, and Authentication
We'll be importing the /emulators folder to seed some data into the database (the list of operations)
```
cd functions
firebase emulators:start --import=../emulators
```

You're all set, now start up the front end project and take it for a whirl :) 


## Running Tests

To run tests for your Firebase project, you need to ensure that the Firebase emulators are running first. (Follow all steps above)

Once you have the emulators running, run the tests using the command `npm test`
