const express = require('express');
const { scryptSync, randomBytes } = require('node:crypto');
module.exports = function registration(database) {
  const router = express.Router();
  router.post('/', async (req, res, next) => {
    try {
      const { name, password, age, mobile, email, gender, state } = req.body;
      const skills = Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills].filter(Boolean);
      const allowedSkills = ['JavaScript', 'Python', 'C++', 'Java'];
      if (typeof name !== 'string' || !name.trim() || typeof password !== 'string' ||
          password.length < 6 || !Number.isInteger(Number(age)) || Number(age) < 1 ||
          Number(age) > 120 || !/^\d{10}$/.test(mobile || '') ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '') ||
          !['Male', 'Female', 'Other'].includes(gender) ||
          !['Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra'].includes(state) ||
          !skills.length || !skills.every(skill => allowedSkills.includes(skill))) {
        return res.status(400).json({ message: 'Complete all fields with valid details.' });
      }
      const salt = randomBytes(16).toString('hex');
      const passwordHash = scryptSync(password, salt, 64).toString('hex');
      const record = { name: name.trim(), age: Number(age), mobile, email,
        gender, state, skills: [...new Set(skills)], salt, passwordHash };
      const result = await database.collection('registrations').insertOne(record);
      const saved = await database.collection('registrations').findOne(
        { _id: result.insertedId }, { projection: { salt: 0, passwordHash: 0 } });
      res.status(201).json(saved);
    } catch (error) { next(error); }
  });
  return router;
};
