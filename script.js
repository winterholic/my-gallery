document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery');
    const toast = document.getElementById('toast');
    const titleElement = document.getElementById('gallery-title');

    // Set title from config if available
    if (galleryConfig.title) {
        titleElement.textContent = galleryConfig.title;
    }

    // Load Images
    if (galleryConfig.images && galleryConfig.images.length > 0) {
        galleryConfig.images.forEach(filename => {
            createGalleryItem(filename);
        });
    } else {
        galleryContainer.innerHTML = '<p class="subtitle">No images found in config.js</p>';
    }

    function createGalleryItem(filename) {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        // Image Path
        const imagePath = `images/${filename}`;

        item.innerHTML = `
            <img src="${imagePath}" alt="${filename}" loading="lazy">
            <div class="gallery-overlay">
                <span class="overlay-text">Copy URL</span>
            </div>
        `;

        // Click Event to Copy URL
        item.addEventListener('click', () => {
            copyToClipboard(imagePath);
        });

        galleryContainer.appendChild(item);
    }

    function copyToClipboard(relativePath) {
        // Construct absolute URL based on current location
        const absoluteUrl = new URL(relativePath, window.location.href).href;

        navigator.clipboard.writeText(absoluteUrl).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for some environments
            const textarea = document.createElement('textarea');
            textarea.value = absoluteUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast();
        });
    }

    let toastTimeout;
    function showToast() {
        toast.classList.remove('hidden');

        if (toastTimeout) clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2000); // Hide after 2 seconds
    }
});
