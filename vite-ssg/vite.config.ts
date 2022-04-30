import fs from 'fs';
import path from 'path';
import {vmpa, autoreloadExtraPlugin} from './vite-plugin-vmpa/plugin';

export default {
  plugins: [vmpa(), autoreloadExtraPlugin()],
  root: 'src',
  build: {
    outDir : '../dist',
  }
};
