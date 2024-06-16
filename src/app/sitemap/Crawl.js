const axios = require('axios').default;
const fs = require('fs');

async function generatorCategories() {
  try {
    const [collections, categories, blogs, developers] = await Promise.all([
      axios.get(`https://api.letsmetrix.com/collection`),
      axios.get(`https://api.letsmetrix.com/category`),
      axios.get(`https://letsmetrix.com/admin-blog/wp-json/wp/v2/blogs`),
      axios.post(`https://api.letsmetrix.com/partner`, {
        page: 1,
        per_page: 12000,
      }),
    ]);

    const jsonCategory = JSON.stringify(categories.data.category.reverse(), null, 2);
    const jsonCollection = JSON.stringify(
      collections.data.collection
        .map((item) => {
          return { slug: item.slug, text: item.text };
        })
        .reverse(),
      null,
      2,
    );
    const jsonBlog = JSON.stringify(
      blogs.data
        .map((item) => {
          return {
            slug: item.slug,
            title: item.title.rendered,
          };
        })
        .reverse(),
      null,
      2,
    );
    const jsonDeveloper = JSON.stringify(
      developers.data.partners
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            apps: item.apps,
          };
        })
        .reverse(),
      null,
      2,
    );

    fs.writeFileSync(
      './src/utils/data/DataCrawl.js',
      `export const CategorySite = ${jsonCategory};
        export const CollectionSite = ${jsonCollection};
        export const BlogSite = ${jsonBlog};
        export const DeveloperSite = ${jsonDeveloper}; `,
      'utf-8',
    );
  } catch (e) {
    console.log(e);
  }
}

generatorCategories();
