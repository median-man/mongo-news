const html = require('./smashingHtml');

const createResponse = data => ({
  data,
  status: 200,
  statusText: 'OK',
});

module.exports = {
  html,
  responses: {
    noArticles: createResponse(html.noArticles),
    oneArticle: createResponse(html.oneArticle),
  },
};
