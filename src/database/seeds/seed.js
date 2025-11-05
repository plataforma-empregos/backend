require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../app/models/User');
const Job = require('../app/models/Job');
(async ()=>{
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trampomatch');
  await User.deleteMany({});
  await Job.deleteMany({});
  const u = await User.create({ email: 'demo@demo.com', password: '123456', name: 'Demo User', profile: { name: 'Demo User', preferences: { theme: 'light', notifications: true } } });
  await Job.create({ title: 'Frontend Developer', description: 'React dev', company: 'Acme', salary: 3000, tags: ['react','frontend'], owner: u._id });
  await Job.create({ title: 'Backend Developer', description: 'Node.js dev', company: 'Acme', salary: 4000, tags: ['node','backend'], owner: u._id });
  console.log('Seed completed. Users: demo@demo.com / 123456');
  process.exit(0);
})();
