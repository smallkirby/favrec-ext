import { Builder } from './utils/buildUtils';

const watchFlag = process.argv.includes('--watch');
const devFlag = process.argv.includes('--dev');
const chromeFlag = process.argv.includes('--chrome');
const firefoxFlag = process.argv.includes('--firefox');

if (firefoxFlag) {
  console.error('Firefox build is not supported yet');
  process.exit(1);
}

const builder = new Builder({ watchFlag, devFlag, chromeFlag, firefoxFlag });
builder.addBuildFile('popup/index.tsx');
builder.addStaticFile('popup/popup.html');
builder.addStaticFile('popup/index.css');

builder.addBuildFile('background/index.ts');

builder.addBuildFile('content_script/index.ts');

builder.addStaticDir('icons');

builder.build();
