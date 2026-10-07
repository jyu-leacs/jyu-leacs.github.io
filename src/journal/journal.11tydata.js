export default {
  tags: ['post'],
  layout: 'post.njk',
  eleventyComputed: {
    permalink: data => data.draft ? false : `/journal/${data.page.fileSlug}/`,
    noindex: data => Boolean(data.example)
  }
};
