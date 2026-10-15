import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
const empty = { regNo: '', name: '', department: '', email: '', cgpa: '' };
function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('Loading student records...');
  const [busy, setBusy] = useState(false);
  async function request(path = '', options = {}) {
    const response = await fetch('/api/fullstack/students' + path, options);
    const value = await response.json();
    if (!response.ok) throw new Error(value.message || 'Request failed');
    return value;
  }
  async function refresh() { setStudents(await request()); }
  useEffect(() => {
    refresh().then(() => setMessage('Ready')).catch(error => setMessage(error.message));
  }, []);
  async function save(event) {
    event.preventDefault(); setBusy(true);
    try {
      await request(editing ? '/' + encodeURIComponent(editing) : '', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cgpa: Number(form.cgpa) })
      });
      await refresh(); setMessage(editing ? 'Student updated' : 'Student added');
      setForm(empty); setEditing(null);
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  async function remove(regNo) {
    setBusy(true);
    try {
      await request('/' + encodeURIComponent(regNo), { method: 'DELETE' });
      await refresh(); setMessage('Student deleted');
      if (editing === regNo) { setEditing(null); setForm(empty); }
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <><header><small>23CS2049 - Web Technology Lab | URK24CS1107</small>
    <h1>Student records workspace</h1></header><main>
    <section><h2>{editing ? 'Edit student' : 'Add student'}</h2>
      <form onSubmit={save}>
        {Object.keys(empty).map(key => <label key={key}>{key}<br/>
          <input aria-label={key} type={key === 'cgpa' ? 'number' : key === 'email' ? 'email' : 'text'}
            min={key === 'cgpa' ? 0 : undefined} max={key === 'cgpa' ? 10 : undefined}
            step={key === 'cgpa' ? '0.01' : undefined}
            required={key !== 'email'} value={form[key]}
            disabled={busy || (key === 'regNo' && editing !== null)}
            onChange={event => setForm({ ...form, [key]: event.target.value })}/>
        </label>)}<button disabled={busy}>{editing ? 'Update student' : 'Add student'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
      </form><output>{message}</output>
    </section><section><h2>Saved students</h2><div style={{overflowX:'auto'}}><table>
      <thead><tr>{['Register number','Name','Department','Email','CGPA','Actions'].map(label => <th key={label}>{label}</th>)}</tr></thead>
      <tbody>{students.map(student => <tr key={student._id}>
        <td>{student.regNo}</td><td>{student.name}</td><td>{student.department}</td>
        <td>{student.email}</td><td>{student.cgpa}</td><td>
          <button disabled={busy} onClick={() => { setEditing(student.regNo); setForm(student); }}>Edit</button>
          <button disabled={busy} onClick={() => remove(student.regNo)}>Delete</button>
        </td></tr>)}</tbody></table></div>
      {!students.length && <p>No student records yet.</p>}
    </section></main></>;
}
createRoot(document.getElementById('root')).render(<StudentManager/>);
