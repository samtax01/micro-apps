// Real-time href monitor for anchor tags
class HrefMonitor {
    constructor() {
        this.injectStyles();

        // Initial setup of href labels
        this.updateAllHrefLabels();

        // Set up MutationObserver
        this.setupMutationObserver();

        // Set up periodic updates
        //setInterval(() => this.updateAllHrefLabels(), 1000);
    }
    
    injectStyles() {
        // Create a style element if it doesn't exist
        if (!document.getElementById('href-monitor-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'href-monitor-styles';
            styleElement.textContent = `
                .href-label {
                    display: inline-block;
                    margin-left: 5px;
                    padding: 2px 6px;
                    background-color: rgba(243, 244, 246, 0.9);
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: #6b7280;
                    vertical-align: middle;
                    transition: all 0.3s ease;
                    cursor: help;
                    user-select: none;
                }
                .href-label:hover {
                    background-color: rgba(229, 231, 235, 0.9);
                }
            `;
            document.head.appendChild(styleElement);
        }
    }

    setupMutationObserver() {
        // Create a MutationObserver to watch for DOM changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    this.updateAllHrefLabels();
                }
            });
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }

    updateAllHrefLabels() {
        // Get all anchor tags
        const anchors = document.querySelectorAll('a');
        
        anchors.forEach(anchor => {
            this.updateOrCreateLabel(anchor);
        });
    }

    updateOrCreateLabel(anchor) {
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Check if label already exists
        let label = anchor.nextElementSibling;
        if (label && label.classList.contains('href-label')) {
            // Update existing label
            label.textContent = href;
        } else {
            // Create new label
            label = document.createElement('span');
            label.className = 'href-label';
            label.textContent = href;
            // Insert label after anchor
            anchor.parentNode.insertBefore(label, anchor.nextSibling);
        }
    }
}

// Initialize the monitor when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HrefMonitor();
});