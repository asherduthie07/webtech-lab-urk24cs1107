const express = require('express');
const mongoose = require('mongoose');
module.exports = async function studentRoutes(connection, collection) {
  const schema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: { type: String, default: '', validate: value =>
      value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    cgpa: { type: Number, required: true, min: 0, max: 10 }
  }, { collection, versionKey: false });
  const Student = connection.model(collection, schema);
  await Student.init();
  const router = express.Router();
  function payload(body) {
    return Object.fromEntries(['regNo', 'name', 'department', 'email', 'cgpa']
      .filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
  }
  router.post('/', async (req, res, next) => {
    try { res.status(201).json(await Student.create(payload(req.body))); }
    catch (error) { next(error); }
  });
  router.get('/', async (req, res, next) => {
    try { res.json(await Student.find().sort({ regNo: 1 })); }
    catch (error) { next(error); }
  });
  router.get('/:regNo', async (req, res, next) => {
    try {
      const student = await Student.findOne({ regNo: req.params.regNo });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) { next(error); }
  });
  router.put('/:regNo', async (req, res, next) => {
    try {
      const student = await Student.findOneAndUpdate(
        { regNo: req.params.regNo }, { $set: payload(req.body) },
        { new: true, runValidators: true });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) { next(error); }
  });
  router.delete('/:regNo', async (req, res, next) => {
    try {
      const student = await Student.findOneAndDelete({ regNo: req.params.regNo });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json({ message: 'Student deleted successfully' });
    } catch (error) { next(error); }
  });
  return router;
};
