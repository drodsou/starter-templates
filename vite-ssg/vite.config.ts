import fs from 'fs';
import path from 'path';
import vmpa from './vite-plugin-vmpa/plugin';

export default {
  plugins: [vmpa()],
  root: 'src',
  build: {
    outDir : '../dist',
  }
};
