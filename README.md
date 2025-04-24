
# Goal Buddy Website

## Overview
**Goal Buddy** is a motivational website designed to help users track their personal goals while staying organized and motivated. Users can set goals, track their progress, reflect on their journey, and even interact with an AI-powered chatbot for advice. With features like goal tracking, journal entries, and a daily motivational quote, **Goal Buddy** aims to make goal setting and achievement easier and more fun.

## Features
- **Sign In with Google**: Users can sign in using Firebase Authentication for a seamless experience.
- **Goal Management**: Add, update, and track your goals with progress check-ins, deadlines, and reflections.
- **Daily Journaling**: Keep track of your thoughts and progress with a simple journaling feature.
- **AI Chatbot**: A chatbot that offers motivational responses and tips based on your goals.
- **Motivational Quotes**: Get a random motivational quote to inspire your day.
- **Dark Mode**: Toggle between light and dark mode for a comfortable user experience.

## Tech Stack
- **React.js**: The front-end framework for building the interactive user interface.
- **Firebase**: Used for authentication (Firebase Authentication) and cloud-based database (Firebase Firestore).
- **CSS**: Custom CSS for styling the website with light/dark mode support.

## Installation

### 1. Clone the repository

git clone https://github.com/Disha-Se/goal-buddy.git
cd goal-buddy


### 2. Install dependencies

npm install


### 3. Set up Firebase
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new Firebase project.
- Set up Firebase Authentication (with Google Sign-In).
- Set up Firebase Firestore for storing goals and journal entries.

### 4. Add Firebase credentials
- In your Firebase project, get your Firebase config object.
- Create a \`.env\` file in the root of your project and add the Firebase credentials:

REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id


### 5. Run the app locally

npm start

The website should now be running on \`http://localhost:3000\`.

## Usage
- Sign in with your Google account.
- Add a new goal, set a deadline, and specify the category.
- Track your progress by checking off days, and mark your goal as complete when done.
- Write daily journal entries to track your thoughts and progress.
- Chat with the AI chatbot for some motivation and guidance.
- Enjoy the daily motivational quotes and switch between light and dark modes as you work on your goals.

## Contributing
Feel free to fork this repository, submit issues, and send pull requests. Contributions are always welcome to improve the app!

### Steps to contribute:
1. Fork this repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Open a pull request.

## License
This project is open-source and available under the MIT License.

## Acknowledgements
- [Firebase](https://firebase.google.com/) for authentication and Firestore database.
- [React](https://reactjs.org/) for the front-end framework.


![image](https://github.com/user-attachments/assets/485e8158-95db-45c9-9eba-54e1d49071e6)

![image](https://github.com/user-attachments/assets/c396e2ce-8ff7-46d5-9924-2926577769ab)

![image](https://github.com/user-attachments/assets/1c2e0e7a-421a-4f75-84f8-d706533b83de)

![image](https://github.com/user-attachments/assets/156be680-ba5e-4f16-ac4b-55394facf15b)

![image](https://github.com/user-attachments/assets/2aac556a-ce43-42a5-b6c4-7a4a8b813a08)

![image](https://github.com/user-attachments/assets/c8717aa2-5ed7-4119-82fd-05f60f8bf0be)

