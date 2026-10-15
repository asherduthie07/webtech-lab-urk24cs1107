const { MongoClient } = require('mongodb');
const { run } = require('./operations.cjs');
(async () => {
  const client = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const name = 'urk24cs1107_shell_' + Date.now();
    console.log('Database:', name);
    const results = await run(client.db(name));
    for (const item of results) {
      console.log('\n' + item.title + '\n' + item.command);
      console.dir(item.value, { depth: null, colors: false });
    }
  } finally { await client.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
