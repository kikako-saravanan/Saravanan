// Custom Cursor - Only on desktop
if (window.innerWidth >= 1024) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll reveal animation with Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// Parallax effect for gradient orbs - throttled for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');

            orbs.forEach((orb, index) => {
                const speed = 0.5 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});

// Resume Modal Functionality
const resumeModal = document.getElementById('resumeModal');
const closeResumeModalBtn = document.getElementById('closeResumeModal');
const downloadResumeBtn = document.getElementById('downloadResumeBtn');
const resumeViewerContainer = document.getElementById('resumeViewerContainer');
const resumeModalTitle = document.getElementById('resumeModalTitle');

let currentDocumentType = '';
let currentDocumentUrl = '';

// Document paths - Update these to your actual file paths
const DOCUMENTS = {
    resume: {
        title: 'My Resume',
        url: 'documents/Saravanan_Mohan_Resume.pdf',
        downloadName: 'Saravanan_Mohan_Resume.pdf'
    },
    cv: {
        title: 'My CV',
        url: 'documents/Saravanan_Mohan_CV.pdf',
        downloadName: 'Saravanan_Mohan_CV.pdf'
    }
};

function openResumeModal(type) {
    const doc = DOCUMENTS[type];
    if (!doc) return;

    currentDocumentType = type;
    currentDocumentUrl = doc.url;
    resumeModalTitle.textContent = doc.title;

    // Show modal
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load document viewer
    loadDocumentViewer(doc.url);
}

function loadDocumentViewer(docUrl) {
    // Show loading state
    //         resumeViewerContainer.innerHTML = `
    //     <div class="resume-loading">
    //       <div class="resume-loading-spinner"></div>
    //       <p>Loading document...</p>
    //     </div>
    //   `;

    //         // Use Google Docs Viewer for DOCX files
    //         // You can also use Microsoft Office Online Viewer or convert to PDF
    //         const fullUrl = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)}${docUrl}`;
    //         const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;

    //         // Create iframe
    //         setTimeout(() => {
    //             resumeViewerContainer.innerHTML = `
    //       <iframe src="${viewerUrl}" title="Document Viewer"></iframe>
    //     `;
    //         }, 500);
    resumeViewerContainer.innerHTML = `
<iframe src="${docUrl}" title="Document Viewer"></iframe>
`;
}

function closeResumeModal() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear viewer after animation
    setTimeout(() => {
        resumeViewerContainer.innerHTML = `
  <div class="resume-loading">
    <div class="resume-loading-spinner"></div>
    <p>Loading document...</p>
  </div>
`;
    }, 300);
}

function downloadDocument() {
    const doc = DOCUMENTS[currentDocumentType];
    if (!doc) return;

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
closeResumeModalBtn.addEventListener('click', closeResumeModal);
downloadResumeBtn.addEventListener('click', downloadDocument);

// Close modal when clicking outside
resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
        closeResumeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeResumeModal();
    }
});

// Make function globally available
window.openResumeModal = openResumeModal;
