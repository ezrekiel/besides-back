document.querySelectorAll('.learn-more').forEach(button => {
    button.addEventListener('click', function() {
        const jobId = this.getAttribute('data-id'); 
        
        fetch(`/api/jobAds/${jobId}`)
            .then(response => response.json())
            .then(data => {
                
                const jobDetails = this.nextElementSibling;
                    
                jobDetails.innerHTML = `
                    <p><strong>Full Description:</strong> ${data.libelle}</p>
                    <p><strong>Wages:</strong> ${data.wages}</p>
                    <p><strong>Place:</strong> ${data.place}</p>
                    <p><strong>Working Time:</strong> ${data.workingTime}</p>
                    <p><strong>Posted at:</strong> ${new Date(data.posted_at).toLocaleString()}</p>
                `;
            })
            .catch(err => console.error('Error fetching job details:', err));
    });
});