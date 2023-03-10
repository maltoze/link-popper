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
  return await esbuild.build({
    entryPoints: ['src/content/index.tsx'],
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
    metafile: true,
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
  const result = await runEsbuild();

  const commonFiles = [
    { src: 'build/index.js', dst: 'content.js' },
    { src: 'build/index.css', dst: 'content.css' },
    { src: 'src/logo.png', dst: 'logo.png' },
  ];

  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`
  );
  await zipFolder(`./${outdir}/chromium`);

  // firefox
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.v2.json', dst: 'manifest.json' }],
    `./${outdir}/firefox`
  );
  await zipFolder(`./${outdir}/firefox`);

  if (result.metafile) {
    // use https://bundle-buddy.com/esbuild to analyses
    await fs.writeFile(
      `./${outdir}/metafile.json`,
      JSON.stringify(result.metafile)
    );
  }
  console.log('Build success.');
}

build();
