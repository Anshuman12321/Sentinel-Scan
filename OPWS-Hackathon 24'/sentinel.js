// JavaScript Snippet for Browser Extension
// Make sure to have permissions and OAuth token set up correctly for GitHub API access.

const githubToken = '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';
const repoName = 'Sentinel-Scan';
const ownerName = 'Anshuman12321';
const filePath = 'test.txt';
const commitMessage = 'Update URL with latest website click';

document.addEventListener('click', function(event) {
    let target = event.target;
    while (target && !(target.href)) {
        target = target.parentNode;
    }
    if (target && target.href) {
        console.log('Clicked URL:', target.href);
        updateFileOnGitHub(target.href);
    }
});

async function updateFileOnGitHub(url) {
    const contentBase64 = btoa(url); // Encode URL in base64
    const sha = await getFileSHA(filePath); // Retrieve SHA for existing file to update
    const response = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            message: commitMessage,
            content: contentBase64,
            sha: sha // Required to update file
        }),
    });

    if (!response.ok) {
        console.error('Failed to update URL on GitHub.', response.statusText);
    }
}

async function getFileSHA(path) {
    const response = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}/contents/${path}`, {
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data.sha;
    } else {
        console.error('Failed to retrieve file SHA.', response.statusText);
        return null; // Handle error appropriately
    }
}