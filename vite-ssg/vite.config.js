import fs from 'fs';
import path from 'path';
import vmpa from './vite-plugin-vmpa/plugin.js';

export default {
  plugins: [vmpa()],
  root: 'src',
  build: {
    outDir : '../dist',
  }
};
