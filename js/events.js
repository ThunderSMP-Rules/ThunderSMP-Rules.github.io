let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const eventsContainer = document.getElementById('events-container');
const eventForm = document.getElementById('event-form');
const postEventForm = document.getElementById('post-event-form');

// Load events from local storage
let events = JSON.parse(localStorage.getItem('events')) || [];

function displayEvents() {
    eventsContainer.innerHTML = '';
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    events.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        eventItem.innerHTML = `
            <h2>${event.title}</h2>
            <p>Date: ${new Date(event.date).toLocaleString()}</p>
            <p>${event.description}</p>
            <small>Posted by ${event.author}</small>
        `;
        eventsContainer.appendChild(eventItem);
    });
}

function checkOperatorStatus() {
    if (currentUser && currentUser.role === 'operator') {
        eventForm.style.display = 'block';
    } else {
        eventForm.style.display = 'none';
    }
}

postEventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const description = document.getElementById('event-description').value.trim();
    
    if (title && date && description && currentUser && currentUser.role === 'operator') {
        const newEvent = {
            title,
            date,
            description,
            author: currentUser.name
        };
        
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
        postEventForm.reset();
    }
});

displayEvents();
checkOperatorStatus();
