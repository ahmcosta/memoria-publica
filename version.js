// Auto-generated version info
// This file should be updated by build process
const VERSION_INFO = {
    version: 'v1.0.0',
    commit: 'dev-build',
    buildDate: new Date().toISOString().split('T')[0]
};

// Update version display
document.addEventListener('DOMContentLoaded', () => {
    const versionElement = document.getElementById('version');
    if (versionElement) {
        // Show tag version if available, otherwise show commit hash
        const displayVersion = VERSION_INFO.version.startsWith('v') ? 
            VERSION_INFO.version : 
            `#${VERSION_INFO.commit.substring(0, 7)}`;
        
        versionElement.textContent = displayVersion;
        versionElement.title = `Build: ${VERSION_INFO.buildDate}`;
    }
});