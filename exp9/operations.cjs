// The same operation list drives the browser report and command-line run.
const samples = [
  { rollno: 201, name: 'Aditi', department: 'CSE', year: 3, marks: 86 },
  { rollno: 202, name: 'Nikhil', department: 'ECE', year: 3, marks: 93 },
  { rollno: 203, name: 'Sara', department: 'CSE', year: 2, marks: 79 },
  { rollno: 204, name: 'Dev', department: 'EEE', year: 3, marks: 88 },
  { rollno: 205, name: 'Rhea', department: 'CSE', year: 4, marks: 68 },
  { rollno: 206, name: 'Kabir', department: 'CSE', year: 3, marks: 82 },
  { rollno: 207, name: 'Tara', department: 'ECE', year: 2, marks: 75 },
  { rollno: 208, name: 'Neil', department: 'EEE', year: 4, marks: 91 },
  { rollno: 209, name: 'Mira', department: 'CSE', year: 3, marks: 70 },
  { rollno: 210, name: 'Zoya', department: 'ECE', year: 3, marks: 96 }
];
async function run(database) {
  const collection = database.collection('students');
  if (await collection.countDocuments()) {
    throw new Error('Use an empty dedicated database for this demonstration.');
  }
  const results = [];
  async function record(title, command, action) {
    const value = await action(); results.push({ title, command, value });
  }
  const find = (query = {}, options = {}) => collection.find(query, options).toArray();
  await record('1 Insert ten students', 'db.students.insertMany(samples)',
    () => collection.insertMany(samples.map(student => ({ ...student }))));
  await record('2 Display all students', 'db.students.find()', () => find());
  await record('3 CSE students', 'db.students.find({department:"CSE"})',
    () => find({ department: 'CSE' }));
  await record('4 Marks greater than 80', 'db.students.find({marks:{$gt:80}})',
    () => find({ marks: { $gt: 80 } }));
  await record('5 Names and marks', 'db.students.find({}, {name:1,marks:1,_id:0})',
    () => find({}, { projection: { name: 1, marks: 1, _id: 0 } }));
  await record('6 Third year CSE', 'db.students.find({department:"CSE",year:3})',
    () => find({ department: 'CSE', year: 3 }));
  await record('7 CSE or ECE', 'db.students.find({$or:[{department:"CSE"},{department:"ECE"}]})',
    () => find({ $or: [{ department: 'CSE' }, { department: 'ECE' }] }));
  await record('8 Sort by marks', 'db.students.find().sort({marks:1})',
    () => collection.find().sort({ marks: 1 }).toArray());
  await record('9 Top three', 'db.students.find().sort({marks:-1}).limit(3)',
    () => collection.find().sort({ marks: -1 }).limit(3).toArray());
  await record('10 Count CSE students', 'db.students.countDocuments({department:"CSE"})',
    () => collection.countDocuments({ department: 'CSE' }));
  await record('11 Update one mark', 'db.students.updateOne({rollno:201},{$set:{marks:90}})',
    async () => { await collection.updateOne({ rollno: 201 }, { $set: { marks: 90 } });
      return collection.findOne({ rollno: 201 }); });
  await record('12 Set CSE status', 'db.students.updateMany({department:"CSE"},{$set:{status:"Active"}})',
    async () => { await collection.updateMany({ department: 'CSE' }, { $set: { status: 'Active' } });
      return find({ department: 'CSE' }); });
  await record('13 Delete one student', 'db.students.deleteOne({rollno:205})',
    () => collection.deleteOne({ rollno: 205 }));
  await record('14 Distinct departments', 'db.students.distinct("department")',
    () => collection.distinct('department'));
  await record('15 Department averages',
    'db.students.aggregate([{$group:{_id:"$department",averageMarks:{$avg:"$marks"}}}])',
    () => collection.aggregate([{ $group: { _id: '$department', averageMarks: { $avg: '$marks' } } },
      { $sort: { _id: 1 } }]).toArray());
  return results;
}
module.exports = { samples, run };
