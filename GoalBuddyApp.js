import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

export default function GoalBuddyApp() {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [mood, setMood] = useState('');
  const [goalReflections, setGoalReflections] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  const [journalEntry, setJournalEntry] = useState('');
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadGoals(user.uid); // Load goals when the user signs in
        loadJournals(user.uid); // Load journals when the user signs in
      } else {
        setUser(null);
        setGoals([]); // Clear goals when the user signs out
        setJournals([]); // Clear journals when the user signs out
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const quotes = [
      "The only way to do great work is to love what you do.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "Believe you can and you're halfway there.",
    ];
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const loadGoals = async (uid) => {
    const snapshot = await getDocs(collection(db, 'users', uid, 'goals'));
    const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGoals(goalsData); // Update state with goals fetched from Firebase
  };

  const loadJournals = async (uid) => {
    const snapshot = await getDocs(collection(db, 'users', uid, 'journals'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJournals(data);
  };

  const addGoal = async () => {
    if (!newGoal || !user) return;

    const newEntry = {
      title: newGoal,
      deadline: deadline,
      category: category,
      priority: priority,
      mood: mood, 
      goalHistory: [], 
      checkIns: Array(7).fill(false),
      progress: 0,
      reflection: goalReflections,
      completionDate: null,
      milestones: [],
      difficulty: 'Medium',
    };

    const goalId = new Date().toISOString();
    const docRef = doc(db, 'users', user.uid, 'goals', goalId);
    await setDoc(docRef, newEntry);

    setGoals([{ id: goalId, ...newEntry }, ...goals]); // Add new goal to state
    setNewGoal('');
    setDeadline('');
    setCategory('');
    setPriority('Medium');
    setMood('');
    setGoalReflections('');
  };

  const addJournalEntry = async () => {
    if (!journalEntry || !user) return;

    const entryId = new Date().toISOString();
    const docRef = doc(db, 'users', user.uid, 'journals', entryId);
    const entry = {
      content: journalEntry,
      timestamp: new Date().toISOString(),
    };
    await setDoc(docRef, entry);

    setJournals([{ id: entryId, ...entry }, ...journals]);
    setJournalEntry('');
  };

  const deleteGoal = async (goalId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId));
    setGoals(goals.filter((goal) => goal.id !== goalId)); // Remove deleted goal from state
  };

  const toggleCheckIn = async (goalId, index) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newCheckIns = [...goal.checkIns];
    newCheckIns[index] = !newCheckIns[index];

    const newProgress = Math.round((newCheckIns.filter(Boolean).length / 7) * 100);

    const updatedGoal = { ...goal, checkIns: newCheckIns, progress: newProgress };
    await updateDoc(doc(db, 'users', user.uid, 'goals', goalId), updatedGoal);

    setGoals(goals.map(g => g.id === goalId ? updatedGoal : g)); // Update the goal in state
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const remindBuddy = () => {
    alert(`⏰ Reminder sent to your buddy! (Just for demo 😄)`);
  };

  const markGoalComplete = async (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedGoal = { ...goal, completionDate: new Date().toISOString() };
    await updateDoc(doc(db, 'users', user.uid, 'goals', goalId), updatedGoal);

    setGoals(goals.map(g => g.id === goalId ? updatedGoal : g)); // Update completion status in state
  };

  // AI Chatbot Feature
  const handleChatSubmit = async () => {
    if (chatMessage.trim()) {
      const userMessage = { user: true, message: chatMessage };
      setChatHistory([...chatHistory, userMessage]);

      // Simple AI chatbot logic (you can later enhance this with an actual AI backend)
      const aiResponse = generateAIResponse(chatMessage);
      const botMessage = { user: false, message: aiResponse };
      setChatHistory([...chatHistory, userMessage, botMessage]);

      setChatMessage('');
    }
  };

  const generateAIResponse = (message) => {
    if (message.toLowerCase().includes('goal')) {
      return "That's great! Keep your goals clear and measurable, and don't forget to track your progress.";
    }
    return "I’m here to help with any goal-related questions! Let’s crush those goals!";
  };

  return (
    <div style={isDarkMode ? darkModeStyles.container : lightModeStyles.container}>
      <h1 style={isDarkMode ? darkModeStyles.heading : lightModeStyles.heading}>🎯 Goal Buddy</h1>

      <button onClick={toggleDarkMode} style={isDarkMode ? darkModeStyles.darkModeBtn : lightModeStyles.darkModeBtn}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {!user ? (
        <button onClick={() => signInWithPopup(auth, provider)} style={isDarkMode ? darkModeStyles.signInBtn : lightModeStyles.signInBtn}>
          Sign in with Google
        </button>
      ) : (
        <button onClick={() => signOut(auth)} style={isDarkMode ? darkModeStyles.signOutBtn : lightModeStyles.signOutBtn}>
          Sign Out
        </button>
      )}

      {user && (
        <>
          <div style={isDarkMode ? darkModeStyles.form : lightModeStyles.form}>
            <input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Your goal"
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline (e.g., 2025-06-30)"
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Your mood"
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <textarea
              value={goalReflections}
              onChange={(e) => setGoalReflections(e.target.value)}
              placeholder="Goal Reflections"
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button onClick={addGoal} style={isDarkMode ? darkModeStyles.addBtn : lightModeStyles.addBtn}>Add Goal</button>
          </div>

          <div style={isDarkMode ? darkModeStyles.goalList : lightModeStyles.goalList}>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} style={isDarkMode ? darkModeStyles.goalItem : lightModeStyles.goalItem}>
                  <h3>{goal.title}</h3>
                  <p><strong>Deadline:</strong> {goal.deadline}</p>
                  <p><strong>Category:</strong> {goal.category}</p>
                  <p><strong>Priority:</strong> {goal.priority}</p>
                  <p><strong>Mood:</strong> {goal.mood}</p>
                  <p><strong>Reflection:</strong> {goal.reflection}</p>
                  <div style={isDarkMode ? darkModeStyles.checkIns : lightModeStyles.checkIns}>
                    {goal.checkIns.map((checked, idx) => (
                      <label key={idx}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheckIn(goal.id, idx)}
                        /> Day {idx + 1}
                      </label>
                    ))}
                  </div>
                  <button onClick={remindBuddy} style={isDarkMode ? darkModeStyles.remindBtn : lightModeStyles.remindBtn}>
                    Remind Buddy
                  </button>
                  {goal.completionDate ? (
                    <p>Completed on: {new Date(goal.completionDate).toLocaleDateString()}</p>
                  ) : (
                    <button onClick={() => markGoalComplete(goal.id)} style={isDarkMode ? darkModeStyles.completeBtn : lightModeStyles.completeBtn}>
                      Mark as Complete
                    </button>
                  )}
                  <button onClick={() => deleteGoal(goal.id)} style={isDarkMode ? darkModeStyles.deleteBtn : lightModeStyles.deleteBtn}>
                    Delete Goal
                  </button>
                </div>
              ))
            ) : (
              <p>No goals added yet!</p>
            )}
          </div>

          <div style={isDarkMode ? darkModeStyles.chatbotContainer : lightModeStyles.chatbotContainer}>
            <h3>📓 Daily Journal</h3>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              style={isDarkMode ? darkModeStyles.input : lightModeStyles.input}
            />
            <button onClick={addJournalEntry} style={isDarkMode ? darkModeStyles.chatBtn : lightModeStyles.chatBtn}>
              Save Entry
            </button>
            <div style={{ marginTop: 10 }}>
              {journals.map(journal => (
                <div key={journal.id} style={{ marginBottom: 10 }}>
                  <small>{new Date(journal.timestamp).toLocaleString()}</small>
                  <p>{journal.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot Section */}
          <div style={isDarkMode ? darkModeStyles.chatbot : lightModeStyles.chatbot}>
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything!"
              style={isDarkMode ? darkModeStyles.chatInput : lightModeStyles.chatInput}
            />
            <button onClick={handleChatSubmit} style={isDarkMode ? darkModeStyles.chatBtn : lightModeStyles.chatBtn}>
              Send
            </button>
            <div style={isDarkMode ? darkModeStyles.chatHistory : lightModeStyles.chatHistory}>
              {chatHistory.map((msg, index) => (
                <div key={index} style={msg.user ? darkModeStyles.userMessage : lightModeStyles.botMessage}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Light and Dark mode styles
const lightModeStyles = {
  container: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '20px',
  },
  heading: {
    color: '#333',
    fontSize: '24px',
  },
  signInBtn: {
    backgroundColor: '#4285F4',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  signOutBtn: {
    backgroundColor: '#FF5733',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  goalList: {
    marginTop: '20px',
  },
  goalItem: {
    padding: '15px',
    backgroundColor: '#f4f4f4',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  checkIns: {
    marginTop: '10px',
  },
  completeBtn: {
    backgroundColor: '#FFD700',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#FF6347',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatbotContainer: {
    marginTop: '30px',
    padding: '10px',
  },
  chatBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatHistory: {
    marginTop: '20px',
  },
  userMessage: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  botMessage: {
    backgroundColor: '#d3f4f3',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  chatInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
};

const darkModeStyles = {
  container: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
    padding: '20px',
  },
  heading: {
    color: '#e4e4e4',
    fontSize: '24px',
  },
  signInBtn: {
    backgroundColor: '#4285F4',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  signOutBtn: {
    backgroundColor: '#FF5733',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  goalList: {
    marginTop: '20px',
  },
  goalItem: {
    padding: '15px',
    backgroundColor: '#3a3a3a',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  checkIns: {
    marginTop: '10px',
  },
  completeBtn: {
    backgroundColor: '#FFD700',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#FF6347',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatbotContainer: {
    marginTop: '30px',
    padding: '10px',
  },
  chatBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chatHistory: {
    marginTop: '20px',
  },
  userMessage: {
    backgroundColor: '#3a3a3a',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  botMessage: {
    backgroundColor: '#4a4a4a',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  chatInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
  },
};
