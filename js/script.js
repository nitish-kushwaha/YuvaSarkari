document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    // --- 2. GET ALL ELEMENT IDs FROM THE PAGE ---
    const jobsGrid = document.getElementById('jobs-grid');
    const resultsList = document.getElementById('results-list');
    const admitCardList = document.getElementById('admit-card-list');
    const latestJobsList = document.getElementById('latest-jobs-list');
    const syllabusList = document.getElementById('syllabus-list');

    // --- 3. FETCH DATA FROM ALL JSON FILES ---
    
    const fetchData = (url) => fetch(url).then(response => response.json());

    Promise.all([
        fetchData('data/jobs.json'),
        fetchData('data/results.json'),
        fetchData('data/admit-cards.json'),
        fetchData('data/syllabus.json')
    ])
    .then(([jobsData, resultsData, admitCardsData, syllabusData]) => {
        
        // --- Populate Top 6 Job Pills ---
        if (jobsGrid) {
            const topJobs = jobsData.jobs.slice(0, 6);
            jobsGrid.innerHTML = '';
            topJobs.forEach(job => {
                const jobPill = document.createElement('a');
                jobPill.href = `post.html?id=${job.id}`;
                jobPill.className = 'job-pill';
                jobPill.innerHTML = `<div class="job-pill-content">${job.title}</div>`;
                jobsGrid.appendChild(jobPill);
            });
        }

        // --- UPDATED: Generic function for lists that now takes a page name ---
        const displayInfoList = (element, items, pageName) => {
            if (element && items) {
                element.innerHTML = '';
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="${pageName}?id=${item.id}">
                            <i class="fas fa-circle"></i>
                            <span class="list-item-text">${item.title}</span>
                            <i class="fas fa-angle-double-right"></i>
                        </a>`;
                    element.appendChild(listItem);
                });
            }
        };
        
        // --- Special function for the job list that links to post.html ---
        const displayJobsList = (element, items) => {
             if (element && items) {
                element.innerHTML = '';
                const jobItems = items.slice(0, 10);
                jobItems.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="post.html?id=${item.id}">
                            <i class="fas fa-circle"></i>
                            <span class="list-item-text">${item.title}</span>
                            <i class="fas fa-angle-double-right"></i>
                        </a>`;
                    element.appendChild(listItem);
                });
            }
        };

        // --- Populate all the lists with their CORRECT links ---
        displayInfoList(resultsList, resultsData.results, 'result-detail.html'); // Corrected link
        displayInfoList(admitCardList, admitCardsData.admitCards, 'admit-card-detail.html'); // Corrected link
        displayInfoList(syllabusList, syllabusData.syllabus, 'syllabus-detail.html'); // Corrected link
        displayJobsList(latestJobsList, jobsData.jobs);
    })
    .catch(error => {
        console.error('There was a problem fetching the data:', error);
    });

});