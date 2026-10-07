export default {
  tags: ['talk'],
  layout: 'talk.njk',
  eleventyComputed: {
    permalink: data => data.draft ? false : `/talks/${data.page.fileSlug}/`,
    noindex: data => Boolean(data.example)
  }
};
