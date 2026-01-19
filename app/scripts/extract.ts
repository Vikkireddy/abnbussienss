import fs from 'fs';
import unzipper from 'unzipper';

const zipPath = '/Users/Vikram/Task/firmabletask/data/public_split_1_10.zip';
const extractPath = '/Users/Vikram/Task/firmabletask/data/xml';

fs.createReadStream(zipPath)
  .pipe(unzipper.Extract({ path: extractPath }))
  .promise()
  .then(() => console.log('ZIP extracted'))
  .catch(console.error);
