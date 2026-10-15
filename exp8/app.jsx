import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
const courses = [
  { code: '23CS2049', title: 'Web Technology Lab', credits: 2 },
  { code: 'CS202', title: 'Database Systems', credits: 4 },
  { code: 'CS203', title: 'Computer Networks', credits: 3 }
];
function StatCard({ label, value }) {
  return <article><p>{label}</p><strong className="large">{value}</strong></article>;
}
function Dashboard() {
  const [dark, setDark] = useState(false);
  const [draft, setDraft] = useState('');
  const [tasks, setTasks] = useState(['Review DOM events', 'Practice MongoDB queries']);
  function addTask(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    setTasks(previous => [...previous, draft.trim()]); setDraft('');
  }
  return <div className={dark ? 'dark' : ''}>
    <style>{`
      .dark { background:#10282f; color:#e5f1f1; min-height:100vh; }
      .dark section,.dark article { background:#1b3e47; border-color:#40616a; }
      nav a { color:#b7dcd5; margin-right:20px; }
      .grid article { margin:0; }
    `}</style>
    <header><small>23CS2049 - Web Technology Lab | URK24CS1107</small>
      <h1>Student study dashboard</h1>
      <nav><a href="#courses">Courses</a><a href="#tasks">Tasks</a></nav>
      <button onClick={() => setDark(value => !value)}>
        {dark ? 'Light theme' : 'Dark theme'}</button>
    </header>
    <main><h2>Academic overview</h2><p>Sample academic data for the dashboard exercise.</p>
      <div className="grid">
        <StatCard label="Courses" value={courses.length}/>
        <StatCard label="Open tasks" value={tasks.length}/>
        <StatCard label="Attendance" value="94%"/>
        <StatCard label="CGPA" value="8.70"/>
      </div>
      <section id="courses"><h2>Enrolled courses</h2>
        {courses.map(course => <p key={course.code}>
          <b>{course.code}</b> — {course.title} · {course.credits} credits</p>)}
      </section>
      <section id="tasks"><h2>Study tasks</h2>
        <form onSubmit={addTask}>
          <input aria-label="New task" value={draft}
            onChange={event => setDraft(event.target.value)} placeholder="Add a study task"/>
          <button>Add task</button>
        </form>
        <ul>{tasks.map((task, index) => <li key={index}>{task}</li>)}</ul>
      </section>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<Dashboard/>);
