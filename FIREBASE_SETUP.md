# Complete Firebase Setup Guide (0 - 100)

Follow these exact steps to connect your CUNP app to Google Firebase.

## Phase 1: Create the Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Create a project"**.
3.  Enter a name (e.g., `cunp-hacknova`).
4.  (Optional) Disable Google Analytics for this MVP to save setup time.
5.  Click **"Create project"** and wait for it to finish.

## Phase 2: Register the Web App & Get Config
1.  In your project dashboard, click the **Web icon (`</>`)** to add an app.
2.  Name it (e.g., `CUNP Web`).
3.  **Check the box** "Also set up Firebase Hosting for this app" (We will use this later).
4.  Click **"Register app"**.
5.  You will see a code block with `const firebaseConfig = { ... }`.
6.  **COPY THIS CONFIG OBJECT**. 
    - It contains `apiKey`, `authDomain`, `projectId`, etc.
7.  Open `src/firebase.js` in your code editor.
8.  Replace the placeholder `firebaseConfig` with the one you just copied.

## Phase 3: Enable Authentication
1.  In the Firebase Console menu (left sidebar), click **Build > Authentication**.
2.  Click **"Get started"**.
3.  **Email/Password**:
    - Click "Email/Password".
    - Enable the **"Email/Password"** toggle.
    - Click **Save**.
4.  **Google Sign-In**:
    - Click "Add new provider".
    - Select **"Google"**.
    - Enable the toggle.
    - Set the **Project support email** (use your email).
    - Click **Save**.

## Phase 4: Enable Firestore Database
1.  In the sidebar, click **Build > Firestore Database**.
2.  Click **"Create database"**.
3.  Choose a location (e.g., `nam5 (us-central)` or closest to you).
4.  **Security Rules**:
    - Choose **"Start in test mode"** for now (allows reads/writes for 30 days).
    - *Note: For production, we would lock this down.*
5.  Click **Create**.

## Phase 5: Enable Storage
1.  In the sidebar, click **Build > Storage**.
2.  Click **"Get started"**.
3.  Keep "Start in test mode" (similar to Firestore).
4.  Click **Next**, then **Done**.
5.  This creates the bucket where ID cards and photos will be stored.

## Phase 6: Cloud Functions (Backend Logic)
*Note: To use Cloud Functions, your project usually needs to be on the **Blaze (Pay as you go)** plan. The free tier still applies (2M invocations/month), but a card is required on file.*
1.  If you can upgrade to Blaze:
    - Click the **"Spark"** badge in the bottom left > Select **Blaze**.
    - Set a budget alert (e.g., $1) to ensure you never actually pay anything.
2.  In your terminal (inside `cunp` folder):
    - Run `npm install -g firebase-tools` (if you haven't already).
    - Run `firebase login` and sign in.
    - Run `firebase init`.
        - Select **Functions**.
        - Select **Use an existing project** > (Your `cunp-hacknova` project).
        - Language: **JavaScript**.
        - ESLint: **No**.
        - Install dependencies: **Yes**.
3.  **Important**: Since we already created the `functions` folder with code, proceed carefully. If `firebase init` asks to overwrite `functions/index.js`, say **NO**.

## Phase 7: Deploying
1.  In your terminal:
    ```bash
    npm run build
    firebase deploy
    ```
2.  This will deploy your specific React build and your Cloud Functions to Google's servers.

## Troubleshooting
- **CORS Errors**: If images don't load or Login fails locally, you may need to check the Console logs.
- **Rule Denied**: If you see "Missing or insufficient permissions," check your Firestore rules (ensure they are in Test Mode or configured correctly).
