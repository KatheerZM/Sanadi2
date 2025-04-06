// Save content to database
function saveContent() {
    const content = editor.getValue();

    fetch('save_content.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'content': content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show the link to retrieve the content
            let link = `https://sanadi.fussilat.com/?id=${data.id}`;

            navigator.clipboard.writeText(link)
              .then(function() {
                alert('Copied the link to share!'); 
              }) 
              .catch(function(error) {
                  alert('Failed to create link');
              });
            
        } 
        else {
            alert('Failed to create link');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Retrieve content from database and set editor value
function retrieveContent(id) {
    fetch(`get_content.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                editor.setValue(data.content);
                updateFunction(null, true);
            } else {
                console.error('Failed to retrieve content');
            }
        })
        .catch(error => console.error('Error:', error));
}
