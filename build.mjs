import archiver from 'archiver';
import esbuild from 'esbuild';
import fs from 'fs-extra';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import postcssPlugin from 'esbuild-style-plugin';

const outdir = 'build';

async function deleteOldDir() {
  await fs.remove(outdir);
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: ['src/content/index.tsx', 'src/background/index.ts'],
    bundle: true,
    outdir: outdir,
    treeShaking: true,
    minify: true,
    legalComments: 'none',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
    },
    plugins: [
      postcssPlugin({
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
    ],
  });
}

async function zipFolder(dir) {
  const output = fs.createWriteStream(`${dir}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.pipe(output);
  archive.directory(dir, false);
  await archive.finalize();
}

async function copyFiles(entryPoints, targetDir) {
  await fs.ensureDir(targetDir);
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fs.copy(entryPoint.src, `${targetDir}/${entryPoint.dst}`);
    })
  );
}

async function build() {
  await deleteOldDir();
  await runEsbuild();

  const commonFiles = [
    { src: 'build/content/index.js', dst: 'content.js' },
    { src: 'build/content/index.css', dst: 'content.css' },
    { src: 'build/background/index.js', dst: 'background.js' },
    { src: 'src/logo.png', dst: 'logo.png' },
  ];

  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`
  );

  await zipFolder(`./${outdir}/chromium`);

  console.log('Build success.');
}

build();
