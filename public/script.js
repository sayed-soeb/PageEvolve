 function evo() {
  const title = document.getElementById('title').innerHTML;
  const content = document.getElementById('h').innerHTML;

  // Store the title and content in MongoDB
  fetch('/store-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: title, content: content })
  })
  .then(response => {
    if (response.ok) {
      return response.text(); // Retrieve the response as plain text
    } else {
      throw new Error('Error storing content');
    }
  })
  .then(urlId => {
    // Generate the new URL with the ID parameter
    const currentURL = window.location.href;
    const baseURL = currentURL.split('?')[0]; // Remove any existing query parameters
    const newURL = `${baseURL}?id=${urlId}`;

    // Open the new page with the same CSS and edited content
    const newWindow = window.open(newURL, '_blank');
    newWindow.onload = function() {
      const newContent = newWindow.document.getElementById('h');
      if (newContent) {
        newContent.innerHTML = content;
      }
    };
  })
  .catch(error => {
    console.error('Error storing content:', error);
  });
}


function edit() {
  // Enable content editing
  document.getElementById('h').contentEditable = true;
}

function toggleTheme() {
            const body = document.body;
            const themeSwitch = document.getElementById('themeSwitch');
            
            if (themeSwitch.checked) {
                // Switch to dark mode
                body.classList.add('dark-mode');
            } else {
                // Switch to light mode
                body.classList.remove('dark-mode');
            }
        }


  // Function to fetch titles from MongoDB and populate the dropdown menu
  function fetchTitles() {
    fetch('/get-titles')
      .then((response) => response.json())
      .then((titles) => {
        const dropdown = document.getElementById('pageDropdown');
        dropdown.innerHTML = ''; // Clear existing content
  
        titles.forEach((title) => {
          const link = document.createElement('a');
          link.textContent = title;
          link.href = '/evolve/' + title;
  
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'X';
          deleteBtn.addEventListener('click', () => {
            deleteTitle(title);
          });
  
          // Create a container element for the link and delete button
          const optionContainer = document.createElement('div');
          optionContainer.appendChild(link);
          optionContainer.appendChild(deleteBtn);
  
          dropdown.appendChild(optionContainer);
        });
      })
      .catch((error) => {
        console.error('Error fetching titles:', error);
      });
  }

// Call the fetchTitles function to populate the dropdown menu initially
fetchTitles();
function deleteTitle(title) {
    fetch('/delete-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // Handle the successful delete operation
          console.log(result.message);
          // Reload the dropdown to reflect the updated content
          fetchTitles();
        } else {
          // Handle the failed delete operation
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting title:', error);
      });
  }
  
const dropdown = document.getElementById('pageDropdown');

dropdown.addEventListener('click', function () {
  // Fetch the content from the server
  const title = this.value;
  fetch(`/evolve/${title}`)
    .then((response) => response.json())
    .then((data) => {
      const newURL = `${baseURL}?id=${title}`; // Replace with the URL of the new page
      const newWindow = window.open(newURL, '_blank');

      newWindow.onload = function () {
        const newContent = newWindow.document.getElementById('h');
        if (newContent) {
          newContent.innerHTML = content;
        }
      };
      
    })
    .catch((error) => {
      console.error('Error fetching content:', error);
    });
});
function selectEmoticon(emoticon) {
     // Update the innerHTML of the element with id 'icon'
     var iconElement = document.getElementById('icon');
     iconElement.innerHTML = emoticon;
    // Update the favicon by changing the href attribute
    var faviconElement = document.querySelector("link[rel*='icon']");
    faviconElement.href = `data:image/png;base64,${getBase64FromEmoticon(emoticon)}`;
  }


  function getBase64FromEmoticon(emoticon) {
    // Convert the emoticon to base64 data URI
    // You can use an external library or service to convert the image to base64
    // Here's an example using a JavaScript function to convert it
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.font = '48px serif';
    ctx.fillText(emoticon, 0, 48);
    return canvas.toDataURL().split(',')[1];
  }
  function removeImage() {
    var iconDiv = document.getElementById("icon");
    iconDiv.innerHTML = "";
  }
  function uploadIcon() {
    const iconInput = document.getElementById("iconInput");
    iconInput.click();
  }
  
  function handleIconUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const iconURL = e.target.result;
  
      // Display the icon in the div with id="icon"
      const iconDiv = document.getElementById("icon");
      iconDiv.innerHTML = `<img src="${iconURL}" alt="Custom Icon">`;
  
      // Add a link with the icon as a background image
      const iconLink = document.createElement('a');
      iconLink.href = iconURL;
      iconLink.style.backgroundImage = `url(${iconURL})`;
      iconLink.style.display = 'inline-block';
      iconLink.style.width = '24px';
      iconLink.style.height = '24px';
      iconLink.style.marginLeft = '5px';
  
      // Append the link to the div
      iconDiv.appendChild(iconLink);
      document.getElementById('h').contentEditable = true;
    };
  
    reader.readAsDataURL(file);
  }
  