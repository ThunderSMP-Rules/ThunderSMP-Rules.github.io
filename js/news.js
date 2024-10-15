let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const newsContainer = document.getElementById('news-container');
const newsForm = document.getElementById('news-form');
const postNewsForm = document.getElementById('post-news-form');

// Load news from local storage
let news = JSON.parse(localStorage.getItem('news')) || [];

function displayNews() {
    newsContainer.innerHTML = '';
    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.content}</p>
            <small>Posted by ${item.author} on ${new Date(item.date).toLocaleString()}</small>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function checkOperatorStatus() {
    if (currentUser && currentUser.role === 'operator') {
        newsForm.style.display = 'block';
    } else {
        newsForm.style.display = 'none';
    }
}

postNewsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('news-title').value.trim();
    const content = document.getElementById('news-content').value.trim();
    
    if (title && content && currentUser && currentUser.role === 'operator') {
        const newNewsItem = {
            title,
            content,
            author: currentUser.name,
            date: new Date().toISOString()
        };
        
        news.unshift(newNewsItem);
        localStorage.setItem('news', JSON.stringify(news));
        displayNews();
        postNewsForm.reset();
    }
});

displayNews();
checkOperatorStatus();
