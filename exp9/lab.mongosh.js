// Run: mongosh --file exp9/lab.mongosh.js
// A unique database keeps this exercise independent of existing data.
db = db.getSiblingDB('urk24cs1107_shell_' + Date.now());
print('Database: ' + db.getName());
const samples = [
  {rollno:201,name:'Aditi',department:'CSE',year:3,marks:86},
  {rollno:202,name:'Nikhil',department:'ECE',year:3,marks:93},
  {rollno:203,name:'Sara',department:'CSE',year:2,marks:79},
  {rollno:204,name:'Dev',department:'EEE',year:3,marks:88},
  {rollno:205,name:'Rhea',department:'CSE',year:4,marks:68},
  {rollno:206,name:'Kabir',department:'CSE',year:3,marks:82},
  {rollno:207,name:'Tara',department:'ECE',year:2,marks:75},
  {rollno:208,name:'Neil',department:'EEE',year:4,marks:91},
  {rollno:209,name:'Mira',department:'CSE',year:3,marks:70},
  {rollno:210,name:'Zoya',department:'ECE',year:3,marks:96}
];
printjson(db.students.insertMany(samples));
printjson(db.students.find().toArray());
printjson(db.students.find({department:'CSE'}).toArray());
printjson(db.students.find({marks:{$gt:80}}).toArray());
printjson(db.students.find({}, {name:1,marks:1,_id:0}).toArray());
printjson(db.students.find({department:'CSE',year:3}).toArray());
printjson(db.students.find({$or:[{department:'CSE'},{department:'ECE'}]}).toArray());
printjson(db.students.find().sort({marks:1}).toArray());
printjson(db.students.find().sort({marks:-1}).limit(3).toArray());
printjson(db.students.countDocuments({department:'CSE'}));
printjson(db.students.updateOne({rollno:201},{$set:{marks:90}}));
printjson(db.students.findOne({rollno:201}));
printjson(db.students.updateMany({department:'CSE'},{$set:{status:'Active'}}));
printjson(db.students.find({department:'CSE'}).toArray());
printjson(db.students.deleteOne({rollno:205}));
printjson(db.students.distinct('department'));
printjson(db.students.aggregate([
  {$group:{_id:'$department',averageMarks:{$avg:'$marks'}}},{$sort:{_id:1}}
]).toArray());
// Additional practice: an index, a single document and an aggregation maximum.
printjson(db.students.createIndex({rollno:1},{unique:true}));
printjson(db.students.getIndexes());
printjson(db.students.findOne({rollno:202}));
printjson(db.students.aggregate([
  {$group:{_id:'$department',count:{$sum:1},highestMark:{$max:'$marks'}}}
]).toArray());
