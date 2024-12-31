document.getElementById('replaceButton').addEventListener('click', async function() {
    const findText = document.getElementById('find').value.trim();
    const replaceText = document.getElementById('replace').value;
    const statusDiv = document.getElementById('status');

    if (!findText) {
        statusDiv.style.color = '#ff0000';
        statusDiv.textContent = "Please enter a word to find.";
        return;
    }

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: replaceTextInPage,
            args: [findText, replaceText]
        });
        statusDiv.style.color = '#4CAF50';
        statusDiv.textContent = "Text replacement completed successfully!";
    } catch (error) {
        statusDiv.style.color = '#ff0000';
        statusDiv.textContent = "An error occurred while trying to replace text.";
        console.error(error);
    }
});

function replaceTextInPage(findText, replaceText) {
    const bodyText = document.body.innerHTML;
    
    const lowerFind = findText.toLowerCase();
    const upperFind = findText.toUpperCase();
    const titleFind = findText.charAt(0).toUpperCase() + findText.slice(1).toLowerCase();
    
    const lowerReplace = replaceText.toLowerCase();
    const upperReplace = replaceText.toUpperCase();
    const titleReplace = replaceText.charAt(0).toUpperCase() + replaceText.slice(1).toLowerCase();
    
    let newText = bodyText;
    
    newText = newText.replace(new RegExp(upperFind, 'g'), upperReplace);
    newText = newText.replace(new RegExp(titleFind, 'g'), titleReplace);
    newText = newText.replace(new RegExp(lowerFind, 'g'), lowerReplace);
    
    document.body.innerHTML = newText;
}
