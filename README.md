# StudyLog Pro

StudyLog Pro is a React productivity logger for focused laptop study. It uses Firebase Authentication and Cloud Firestore with real-time listeners, so data synchronizes immediately without page refreshes.

## What is included

- Email/password signup, sign-in, persistent login, password reset, logout, and account deletion.
- Persistent laptop sessions with task selection, pause/resume, automatic restore after closing the browser, and a five-minute idle prompt.
- Manual offline-study top-ups.
- Daily goals, streaks, history search/filtering, CSV/Excel/print-to-PDF export, calendar detail, dark mode, and responsive analytics with Chart.js.

## Firebase setup (beginner friendly)

1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**. Give it a name such as `studylog-pro`; Analytics is optional.
2. In the project overview, click the web icon (`</>`) to add a **Web app**. Give it a nickname and register it. Firebase will show a `firebaseConfig` object.
3. Open [`js/firebase.js`](js/firebase.js) and replace every `PASTE_YOUR_...` value with the matching value from that object. These values identify your web app; Firebase protects actual data using the rules below.
4. In Firebase Console, open **Authentication → Sign-in method**, select **Email/Password**, click **Enable**, then save.
5. Open **Firestore Database → Create database**. Choose your preferred location, start in **production mode**, and create it.
6. In Firestore, open the **Rules** tab, replace its contents with [`firestore.rules`](firestore.rules), and click **Publish**. This prevents users from reading anyone else's records.

## Run locally

Install dependencies once, then start the React development server:

```powershell
npm install
npm run dev
```

Open the `http://localhost` address Vite prints in the terminal. Do not use Live Server or double-click the HTML file for the React version.

## Deploy to Firebase Hosting

Install the Firebase CLI once (requires Node.js):

```powershell
npm install -g firebase-tools
firebase login
firebase use --add
npm run build
firebase deploy
```

Choose the Firebase project you created when prompted. The supplied `firebase.json` deploys this entire static application and the Firestore rules.

## Deploy free on Vercel

1. Create a free [Vercel](https://vercel.com/) account and sign in with GitHub.
2. Push this project to a GitHub repository.
3. In Vercel, choose **Add New → Project**, import that repository, and click **Deploy**. Vercel automatically runs `npm run build` and publishes `dist` using the included `vercel.json`.
4. In Firebase Console, open **Authentication → Settings → Authorized domains** and add the Vercel domain shown after deployment (for example, `your-project.vercel.app`).
5. Open the Vercel domain and test sign-in, laptop sessions, and offline top-ups.

## Firestore data layout

Each account's data is isolated beneath `users/{uid}`:

```
users/{uid}
  laptopSessions/{sessionId}
  offlineSessions/{entryId}
  dailyStats/{yyyy-mm-dd}
```

## PDF export

The PDF button opens the browser print dialog. Select **Save as PDF** as the printer/destination for a clean, native PDF export.
