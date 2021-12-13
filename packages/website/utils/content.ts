import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getDataByFilepath(filepath: string) {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const frontMatter = matter(fileContents);

  return {
    content: fileContents,
    frontMatter,
    filepath,
  };
}

async function fetchFiles(targetPath: string) {
  const files = await fs.promises.readdir(targetPath);
  const fetchedFiles: string[] = [];

  for (const file of files) {
    // ignore these directories
    if (['dist', 'node_modules'].includes(file)) {
      continue;
    }

    try {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      // only store in the array files that are MDX
      if (stats.isFile() && /(.mdx)$/.test(filepath)) {
        fetchedFiles.push(filepath);
      }

      if (stats.isDirectory()) {
        const childFiles = await fs.promises.readdir(filepath);
        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return fetchedFiles;
}

async function getAllMdx(paths: string[]) {
  let allMDX: string[] = [];

  for (const path of paths) {
    const newFiles = await fetchFiles(path);
    allMDX = allMDX.concat(newFiles);
  }

  const mdxData = allMDX
    .map((filepath) => getDataByFilepath(filepath))
    .filter((data) => {
      // return only those mdx files which have 'slug' set in meta section
      return data.frontMatter.data.slug;
    });
  return mdxData;
}

const allMdxSources = [
  path.resolve('../../packages/components'),
  path.resolve('../../packages/core'),
  path.resolve('../../packages/forma-36-website/src/content'),
];

async function getMdxSourceBySlug(slug: string[]) {
  const mdxFiles = await getAllMdx(allMdxSources);
  const joinedSlug = slug.join('/');
  return mdxFiles.find(
    (item) =>
      item.frontMatter.data.slug === `/${joinedSlug}/` ||
      item.frontMatter.data.slug === `/${joinedSlug}`,
  );
}

async function getMdxPaths() {
  const pages = await getAllMdx(allMdxSources);

  const paths = pages.map((page) => {
    const slug = page.frontMatter.data.slug;
    const sanitizedSlug = slug.split('/').filter((item) => item);
    return {
      params: {
        slug: sanitizedSlug,
      },
    };
  });

  return paths;
}

export { getMdxSourceBySlug, getMdxPaths };
