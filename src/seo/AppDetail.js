export const AppDetail = {
  title: (name, metatitle) => `${name} - ${metatitle} | Shopify app store metrics`,
  description: (name, metadesc) => `${name} - ${metadesc}`,
  metaTitle: (name, year) => `Shopify App Metrics and Analytics of ${name} in ${year}`,
  canonical: (app_id) => `https://letsmetrix.com/app/${app_id}`,
};

export const AppDetailReviews = {
  title: (name) => `Review: ${name} | Shopify app store metrics`,
  description: (name) =>
    `Get the latest Shopify ${name} rating and reviews. Check reviews by locations, time, nature of reviews and more to make a better decision.`,
  metaTitle: (name) => `${name} Reviews - Overall rating, reviews and more | Letsmetrix`,
  canonical: (app_id) => `https://letsmetrix.com/app/${app_id}/reviews`,
};
