document.addEventListener('DOMContentLoaded', () => {
    const syllabusContent = document.getElementById('syllabus-content');
    const urlParams = new URLSearchParams(window.location.search);
    const syllabusId = parseInt(urlParams.get('id'));

    if (isNaN(syllabusId)) {
        syllabusContent.innerHTML = '<h1>Error</h1><p>No syllabus ID provided.</p>';
        return;
    }

    fetch('data/syllabus.json')
        .then(response => response.json())
        .then(data => {
            const syllabus = data.syllabus.find(s => s.id === syllabusId);
            if (syllabus) {
                renderSyllabusDetails(syllabus);
            } else {
                syllabusContent.innerHTML = '<h1>Syllabus Not Found</h1><p>Sorry, the syllabus you are looking for does not exist.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            syllabusContent.innerHTML = '<h1>Error</h1><p>Could not load syllabus details.</p>';
        });

    function renderSyllabusDetails(syllabus) {
        document.title = `${syllabus.title} - Sarkari Job`;
         document.getElementById('meta-description').setAttribute('content', `Find the detailed exam pattern and syllabus for ${syllabus.title} by ${syllabus.organization}. Prepare effectively for your exam.`);
    document.getElementById('meta-keywords').setAttribute('content', `${syllabus.title}, ${syllabus.organization}, syllabus, exam pattern, preparation`);


        const createTableRows = (dataObject) => Object.entries(dataObject).map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`).join('');
        const createListItems = (dataArray) => dataArray.map(item => `<li>${item}</li>`).join('');
        const createLinkButtons = (dataArray) => dataArray.map(link => `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`).join('');

        syllabusContent.innerHTML = `
            <div class="post-intro">
                <h1>${syllabus.title}</h1>
                <p>${syllabus.organization}</p>
                <p class="post-date">For: ${syllabus.associatedPosts}</p>
            </div>

            <h2 class="post-section-heading">Examination Mode</h2>
            <ol class="step-list">${createListItems(syllabus.examMode)}</ol>

            <h2 class="post-section-heading">Examination Details</h2>
            <table class="content-table">
                <tbody>${createTableRows(syllabus.examDetails)}</tbody>
            </table>

            <h2 class="post-section-heading">Exam Pattern & Syllabus Details</h2>
            <p>${syllabus.mainContent.introduction}</p>

            <h3>${syllabus.mainContent.examPattern.title}</h3>
            ${syllabus.mainContent.examPattern.stages.map(stage => `
                <h4>${stage.name}</h4>
                <ul>${createListItems(stage.points)}</ul>
            `).join('')}

            <h3>${syllabus.mainContent.examSyllabus.title}</h3>
            ${syllabus.mainContent.examSyllabus.subjects.map(subject => `
                <h4>${subject.name}</h4>
                <ul>${createListItems(subject.topics)}</ul>
            `).join('')}
            
            <h3>${syllabus.mainContent.preparationTips.title}</h3>
            <ol class="step-list">${createListItems(syllabus.mainContent.preparationTips.tips)}</ol>

            <div class="important-links-box">
                <h2 class="post-section-heading">Important Links</h2>
                <ul class="important-links-list">${createLinkButtons(syllabus.importantLinks)}</ul>
            </div>
        `;
    }
});