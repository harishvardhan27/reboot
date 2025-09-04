import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cognitive_study.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        duration INTEGER,
        completed_time INTEGER,
        focus_score REAL,
        distractions INTEGER,
        date TEXT
      );`
    );
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS distractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        type TEXT,
        timestamp TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions (id)
      );`
    );
  });
};

export const saveSession = (sessionData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO sessions (duration, completed_time, focus_score, distractions, date) VALUES (?, ?, ?, ?, ?)',
        [
          sessionData.duration,
          sessionData.completedTime,
          sessionData.focusScore,
          sessionData.distractions,
          new Date().toISOString()
        ],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const saveDistraction = (sessionId, type) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO distractions (session_id, type, timestamp) VALUES (?, ?, ?)',
      [sessionId, type, new Date().toISOString()]
    );
  });
};

export const getSessionHistory = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM sessions ORDER BY date DESC LIMIT 30',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};