const puppeteer = require('puppeteer');

async function scrapeLinkedInJobs(jobTitles, url)
 {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let jobs = [];
  let start = 0;
  let jobListingsCount = 0;
  let currentJobListings = [];

  do
   {
    await page.waitForSelector('li');

    currentJobListings = await page.$$eval('li', (listings) => 
    {
      return listings.map((listing) => 
      {
        const job = {};
        const jobTitle = listing.querySelector('.base-search-card__title');
        job.title = jobTitle ? jobTitle.innerText.trim() : 'no-job-title';
        const companyName = listing.querySelector('h4.base-search-card__subtitle a');
        job.company = companyName ? companyName.innerText.trim() : 'no-xompany-name';
        const jobLocation = listing.querySelector('.job-search-card__location');
        job.location = jobLocation ? jobLocation.innerText.trim() : 'no-job-location';
        const jobLink = listing.querySelector('a.base-card__full-link');
        job.link = jobLink ? jobLink.href : 'no-job-link';
        return job;
      });
    });

    jobs = jobs.concat(currentJobListings);
    jobListingsCount = currentJobListings.length;
    start += jobListingsCount;

    if (jobListingsCount < 25)
     {
      break; 
    }

    await page.goto(`${url}&start=${start}`, { waitUntil: 'networkidle0' });

   // Delay to allow job listings to load
    await delay(2000); 
  } while (jobListingsCount > 0);

  await browser.close();

  return jobs;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runScraping() 
{
  try
   {
    const jobTitles = process.argv.slice(2).join(' ');
    const searchUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(
      jobTitles
    )}&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit`;

    const jobs = await scrapeLinkedInJobs(jobTitles, searchUrl);
    console.log(jobs);
    console.log(jobs.length);

  } catch (error) 
  {
    console.error('Error:', error);
  }
}

runScraping();
