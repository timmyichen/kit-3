const fs = require('fs');

const PATH = './config/gcs-creds.json';

if (fs.existsSync(PATH)) {
  console.log(`File at ${PATH} exists, exiting`);
  process.exit(0);
}

if (!process.env.GCS_CONFIG_JSON) {
  throw new Error('Missing GCS_CONFIG_JSON');
}

fs.writeFileSync(PATH, process.env.GCS_CONFIG_JSON);
console.log(`Wrote file to ${PATH}`);
