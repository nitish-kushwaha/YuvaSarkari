document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('post-content');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));

    if (isNaN(jobId)) {
        postContent.innerHTML = '<h1>Error</h1><p>No job ID provided.</p>';
        return;
    }

    fetch('data/jobs.json')
        .then(response => response.json())
        .then(data => {
            const job = data.jobs.find(j => j.id === jobId);
            if (job) {
                renderJobDetails(job);
            } else {
                postContent.innerHTML = '<h1>Job Not Found</h1><p>Sorry, the job you are looking for does not exist.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            postContent.innerHTML = '<h1>Error</h1><p>Could not load job details.</p>';
        });

    function renderJobDetails(job) {
        document.title = `${job.title} - Sarkari Job`; // Update page title
        document.getElementById('meta-description').setAttribute('content', `Get details for ${job.title}. Find eligibility, important dates, and apply online for the ${job.organization} recruitment.`);
        document.getElementById('meta-keywords').setAttribute('content', `${job.title}, ${job.organization}, sarkari naukri, government job`);

        // Helper function to build table rows from an object
        const createTableRows = (dataObject) => {
            return Object.entries(dataObject).map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`).join('');
        };

        // Helper function to build list items from an array
        const createListItems = (dataArray) => {
            return dataArray.map(item => `<li>${item}</li>`).join('');
        };

        postContent.innerHTML = `
            <div class="post-intro">
                <h1>${job.organization}</h1>
                <p>${job.title} - ${job.postName}</p>
                <p class="post-date">Published On: ${job.postDate}</p>
            </div>

            <p>${job.brief}</p>

            <h2 class="post-section-heading">Important Dates</h2>
            <table class="content-table">
                <tbody>${createTableRows(job.importantDates)}</tbody>
            </table>
            
            <h2 class="post-section-heading">Application Fee</h2>
            <table class="content-table">
                <tbody>${createTableRows(job.applicationFee)}</tbody>
            </table>

            <h2 class="post-section-heading">Age Limit (as on ${job.ageLimit.asOn})</h2>
            <table class="content-table">
                <tbody>
                    <tr><td><strong>Minimum Age</strong></td><td>${job.ageLimit.minimum}</td></tr>
                    <tr><td><strong>Maximum Age</strong></td><td>${job.ageLimit.maximum}</td></tr>
                </tbody>
            </table>
            
            <h2 class="post-section-heading">Vacancy & Eligibility Details</h2>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>Post Name</th>
                        <th>Total Posts</th>
                        <th>Eligibility</th>
                    </tr>
                </thead>
                <tbody>
                    ${job.eligibility.map(e => `
                        <tr>
                            <td>${e.post}</td>
                            <td>${e.vacancies}</td>
                            <td>${e.details}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h2 class="post-section-heading">Salary / Pay Scale</h2>
            <table class="content-table">
                 <tbody>
                    <tr><td><strong>Pay Scale</strong></td><td>${job.salary.payScale}</td></tr>
                    <tr><td><strong>Pay Level</strong></td><td>${job.salary.payLevel}</td></tr>
                </tbody>
            </table>

            <h2 class="post-section-heading">Selection Process</h2>
            <ol class="step-list">${createListItems(job.selectionProcess)}</ol>
            
            <h2 class="post-section-heading">How to Apply</h2>
            <ol class="step-list">${createListItems(job.howToApply)}</ol>

            <div class="important-links-box">
                <h2 class="post-section-heading">Important Links</h2>
                <a href="${job.importantLinks.applyOnline}" class="apply-button" target="_blank">Apply Online</a>
                <a href="${job.importantLinks.downloadNotification}" class="notification-button" target="_blank">Download Notification</a>
                <a href="${job.importantLinks.officialWebsite}" class="notification-button" target="_blank">Official Website</a>
            </div>
        `;
    }
});