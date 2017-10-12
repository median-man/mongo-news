# Basic Requirements
* Scrape for news stories from https://www.smashingmagazine.com/ every time a user visits the site
* Add the article to the database.
* Save and unsave articles
* No duplicate articles in database.
* Save the following for each article:
	* Headline
	* Summary
	* URL
	* Tags
	* Date Published
	* Author
* User should be able to leave comments on displayed articles
* Comments should persist on the articles.
* Comments should be saved to db.
* Comments should be associated with their articles
* Users should be able to delete comments
* All comments are visible to every user

## Scraper.js
* scrapes smashingmagazine and returns an array of objects