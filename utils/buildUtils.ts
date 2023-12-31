import * as chokidar from 'chokidar';
import { build, BuildOptions } from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';
import style from 'esbuild-style-plugin';

type Browser = 'firefox' | 'chrome';

const distDir = (targetBrowser: Browser) => {
  switch (targetBrowser) {
    case 'firefox':
      return 'dist-firefox';
    case 'chrome':
      return 'dist-chrome';
  }
};

const distPath = (relPath: string, targetBrowser: Browser) =>
  path.join(distDir(targetBrowser), relPath);

const makeManifestFile = async (targetBrowser: Browser) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const baseManifestJson = JSON.parse(
    await fs.readFile('manifest.json', 'utf8')
  );
  if (targetBrowser === 'firefox') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firefoxJson = JSON.parse(await fs.readFile('firefox.json', 'utf8'));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const manifestJson = { ...baseManifestJson, ...firefoxJson };
    await fs.writeFile(
      distPath('manifest.json', targetBrowser),
      JSON.stringify(manifestJson, null, 1)
    );
  } else {
    await fs.copyFile(
      'manifest.json',
      distPath('manifest.json', targetBrowser)
    );
  }
};

export class Builder {
  watchFlag: boolean;
  devFlag: boolean;
  chromeFlag: boolean;
  firefoxFlag: boolean;
  buildFiles: string[];
  staticFiles: string[];
  staticDirs: string[];

  constructor(option: {
    watchFlag: boolean;
    devFlag: boolean;
    chromeFlag: boolean;
    firefoxFlag: boolean;
  }) {
    this.watchFlag = option.watchFlag;
    this.devFlag = option.devFlag;
    this.chromeFlag = option.chromeFlag;
    this.firefoxFlag = option.firefoxFlag;
    this.buildFiles = [];
    this.staticFiles = [];
    this.staticDirs = [];
  }

  addBuildFile(file: string) {
    this.buildFiles.push(file);
  }

  addStaticFile(file: string) {
    this.staticFiles.push(file);
  }

  addStaticDir(dir: string) {
    this.staticDirs.push(dir);
  }

  watchOption(targetBrowser: Browser): BuildOptions['watch'] {
    return this.watchFlag
      ? {
          onRebuild: (error, result) => {
            if (error) {
              console.error(`watch build failed for ${targetBrowser}: `, error);
            } else {
              console.log(
                `watch build succeeded for ${targetBrowser}:`,
                result
              );
            }
          },
        }
      : false;
  }

  async copyStaticFile(file: string, targetBrowser: Browser) {
    await fs.mkdir(distPath(path.dirname(file), targetBrowser), {
      recursive: true,
    });
    if (this.watchFlag) {
      chokidar.watch(file).on('all', (event, path) => {
        console.log(event, path);
        void fs.copyFile(path, distPath(file, targetBrowser));
      });
    } else {
      await fs.copyFile(file, distPath(file, targetBrowser));
    }
  }

  async copyStaticDir(dir: string, targetBrowser: Browser) {
    await fs.mkdir(distPath(dir, targetBrowser), {
      recursive: true,
    });
    if (this.watchFlag) {
      chokidar.watch(path.join(dir, '*')).on('all', (event, filepath) => {
        console.log(event, filepath);
        void fs.copyFile(
          filepath,
          distPath(path.join(dir, path.basename(filepath)), targetBrowser)
        );
      });
    } else {
      await fs.cp(dir, distPath(dir, targetBrowser), { recursive: true });
    }
  }

  makeManifestFileAndWatch(targetBrowser: Browser) {
    if (this.watchFlag) {
      chokidar
        .watch(['manifest.json', 'firefox.json'])
        .on('all', (event, path) => {
          console.log(event, path);
          void makeManifestFile(targetBrowser);
        });
    } else {
      void makeManifestFile(targetBrowser);
    }
  }

  buildForBrowser(targetBrowser: Browser) {
    this.buildFiles.forEach((file) => {
      void build({
        entryPoints: [file],
        bundle: true,
        outdir: distPath(path.dirname(file), targetBrowser),
        watch: this.watchOption(targetBrowser),
        sourcemap: this.devFlag ? 'inline' : false,
        define: {
          'process.env.NODE_ENV': this.devFlag
            ? '"development"'
            : '"production"',
        },
        plugins: [
          style({
            postcss: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          }),
        ],
      });
    });
    this.staticFiles.forEach((file) => {
      void this.copyStaticFile(file, targetBrowser);
    });
    this.staticDirs.forEach((dir) => {
      void this.copyStaticDir(dir, targetBrowser);
    });
    this.makeManifestFileAndWatch(targetBrowser);
  }

  build() {
    if (this.chromeFlag) {
      const browser: Browser = 'chrome';
      this.buildForBrowser(browser);
    }
    if (this.firefoxFlag) {
      const browser: Browser = 'firefox';
      this.buildForBrowser(browser);
    }
  }
}
