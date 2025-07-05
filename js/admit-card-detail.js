document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('admit-card-content');
    const urlParams = new URLSearchParams(window.location.search);
    const admitCardId = parseInt(urlParams.get('id'));

    if (isNaN(admitCardId)) {
        content.innerHTML = '<h1>Error</h1><p>No ID provided.</p>';
        return;
    }

    fetch('data/admit-cards.json')
        .then(response => response.json())
        .then(data => {
            const item = data.admitCards.find(ac => ac.id === admitCardId);
            if (item) {
                renderDetails(item);
            } else {
                content.innerHTML = '<h1>Not Found</h1><p>Sorry, the item you are looking for does not exist.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            content.innerHTML = '<h1>Error</h1><p>Could not load details.</p>';
        });

    function renderDetails(item) {
        document.title = `${item.title} - Sarkari Job`;
        document.getElementById('meta-description').setAttribute('content', `Download admit card for ${item.title}. Check exam dates and get direct download links for the ${item.organization} exam.`);
    document.getElementById('meta-keywords').setAttribute('content', `${item.title}, ${item.organization}, admit card, hall ticket`);

        const createTableRows = (dataObject) => Object.entries(dataObject).map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`).join('');
        const createListItems = (dataArray) => dataArray.map(item => `<li>${item}</li>`).join('');
        const createLinkButtons = (dataArray) => dataArray.map(link => `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`).join('');

        content.innerHTML = `
            <div class="post-intro">
                <h1>${item.title}</h1>
                <p>${item.organization}</p>
                <p class="post-date">Post Date: ${item.postDate}</p>
            </div>

            <p>${item.brief}</p>

            <h2 class="post-section-heading">Important Dates</h2>
            <table class="content-table">
                <tbody>${createTableRows(item.importantDates)}</tbody>
            </table>
            
            <h2 class="post-section-heading">Application Fee</h2>
            <table class="content-table">
                <tbody>${createTableRows(item.applicationFee)}</tbody>
            </table>

            <h2 class="post-section-heading">Age Limit (as on ${item.ageLimit.asOn})</h2>
            <table class="content-table">
                <tbody>
                    <tr><td><strong>Minimum Age</strong></td><td>${item.ageLimit.minimum}</td></tr>
                    <tr><td><strong>Maximum Age</strong></td><td>${item.ageLimit.maximum}</td></tr>
                </tbody>
            </table>
            
            <h2 class="post-section-heading">Vacancy Details (Total: ${item.vacancyDetails.totalPosts})</h2>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>Post Name</th>
                        <th>No. of Posts</th>
                        <th>Eligibility</th>
                    </tr>
                </thead>
                <tbody>
                    ${item.vacancyDetails.posts.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.count}</td>
                            <td>${p.eligibility}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h2 class="post-section-heading">Mode of Selection</h2>
            <ol class="step-list">${createListItems(item.selectionMode)}</ol>
            
            <h2 class="post-section-heading">How to Check / Download</h2>
            <ol class="step-list">${createListItems(item.howToDownload)}</ol>

            <div class="important-links-box">
                <h2 class="post-section-heading">Important Links</h2>
                <ul class="important-links-list">${createLinkButtons(item.importantLinks)}</ul>
            </div>
        `;
    }
});