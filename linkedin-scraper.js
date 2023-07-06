const puppeteer = require('puppeteer');

async function scrapeLinkedInJobs(url)

 {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
  
    // Load job listings
    await page.waitForSelector('.job-search-card');
  
    // Scrap the job listings
    const jobListings = await page.$$('.job-search-card');
  
    // extract info from each job listingf
    const jobs = [];
    for (const listing of jobListings) 

    {
      const job = {};
  
      // Job title
      const jobTitle = await listing.$('.base-search-card__title');
      job.title = await page.evaluate(element => element.innerText, jobTitle);
  
      // Company name
      const companyName = await listing.$('h4.base-search-card__subtitle a');
      job.company = await page.evaluate(element => element.innerText, companyName);
  
      // Job location
      const jobLocation = await listing.$('.job-search-card__location');
      job.location = await page.evaluate(element => element.innerText, jobLocation);
  
      // Job link
      const jobLink = await listing.$('a.base-card__full-link');
      job.link = await page.evaluate(element => element.href, jobLink);
  
      jobs.push(job);

    }
  
    await browser.close();
  
    return jobs;

  }
  
const searchUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=python&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&start=0';

scrapeLinkedInJobs(searchUrl)
  .then(jobs => 
    {
    console.log(jobs);
    // Process the scraped job data as needed
  })
  .catch(error => 
    {
    console.error('Error:', error);
  });
