document.addEventListener('DOMContentLoaded', () => {
    const resultContent = document.getElementById('result-content');
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = parseInt(urlParams.get('id'));

    if (isNaN(resultId)) {
        resultContent.innerHTML = '<h1>Error</h1><p>No result ID provided.</p>';
        return;
    }

    fetch('data/results.json')
        .then(response => response.json())
        .then(data => {
            const result = data.results.find(r => r.id === resultId);
            if (result) {
                renderResultDetails(result);
            } else {
                resultContent.innerHTML = '<h1>Result Not Found</h1><p>Sorry, the result you are looking for does not exist.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultContent.innerHTML = '<h1>Error</h1><p>Could not load result details.</p>';
        });

    function renderResultDetails(result) {
        document.title = `${result.title} - Sarkari Job`;
        document.getElementById('meta-description').setAttribute('content', `Download ${result.title}. Check important dates, selection process, and get direct links for the ${result.organization} exam result.`);
    document.getElementById('meta-keywords').setAttribute('content', `${result.title}, ${result.organization}, exam result, result download`);

        const createTableRows = (dataObject) => Object.entries(dataObject).map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`).join('');
        const createListItems = (dataArray) => dataArray.map(item => `<li>${item}</li>`).join('');
        const createLinkButtons = (dataArray) => dataArray.map(link => `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`).join('');

        resultContent.innerHTML = `
            <div class="post-intro">
                <h1>${result.title}</h1>
                <p>${result.postName}</p>
                <p class="post-date">Last Updated: ${result.lastUpdated}</p>
            </div>

            <p>${result.brief}</p>

            <h2 class="post-section-heading">Important Dates</h2>
            <table class="content-table">
                <tbody>${createTableRows(result.importantDates)}</tbody>
            </table>
            
            <h2 class="post-section-heading">Application Fee</h2>
            <table class="content-table">
                <tbody>${createTableRows(result.applicationFee)}</tbody>
            </table>

            <h2 class="post-section-heading">Selection Process</h2>
            <ol class="step-list">${createListItems(result.selectionProcess)}</ol>
            
            <h2 class="post-section-heading">How to Download Result</h2>
            <ol class="step-list">${createListItems(result.howToDownload)}</ol>

            <div class="important-links-box">
                <h2 class="post-section-heading">Important Links</h2>
                <ul class="important-links-list">${createLinkButtons(result.importantLinks)}</ul>
            </div>
        `;
    }
});