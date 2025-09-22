document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL: AUTH & NAV LOGIC ---
    const authLinksNav = document.getElementById('auth-links-nav');
    const profileSectionNav = document.getElementById('profile-section-nav');
    if (localStorage.getItem('isLoggedIn') === 'true') {
        authLinksNav?.classList.add('hidden');
        profileSectionNav?.classList.remove('hidden');
    }

    // --- LOGIN/SIGNUP FLOW ---
    const loginFormButton = document.getElementById('login-form-button');
    loginFormButton?.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    });
    
    const signupFormButton = document.getElementById('signup-form-button');
    signupFormButton?.addEventListener('click', () => {
        alert('Account created successfully! Please log in.');
        window.location.href = 'login.html';
    });

    // --- AI PLANNER LOGIC ---
    const aiForm = document.getElementById('ai-form');
    if (aiForm) {
        aiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const destination = document.getElementById('destination').value;
            const startDate = new Date(document.getElementById('start-date').value);
            const endDate = new Date(document.getElementById('end-date').value);
            const people = parseInt(document.getElementById('people').value);
            const budgetType = document.getElementById('budget').value;

            if (!destination || !startDate.valueOf() || !endDate.valueOf() || startDate >= endDate || !people) {
                alert('Please fill in all fields correctly.');
                return;
            }
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            
            let budgetPerPerson = 25000; // mid-range default
            if (budgetType === 'budget') budgetPerPerson = 15000;
            if (budgetType === 'luxury') budgetPerPerson = 60000;
            
            const total = budgetPerPerson * people;
            
            document.getElementById('ai-results-title').textContent = `Your ${duration}-Day Plan for ${destination}`;
            document.getElementById('people-count').textContent = people;
            document.getElementById('budget-total').textContent = `₹${total.toLocaleString('en-IN')}`;

            document.getElementById('ai-form-section').classList.add('hidden');
            document.getElementById('ai-results-section').classList.remove('hidden');
        });
    }

    // --- DISCOVER PAGE LOGIC ---
    const discoverSearchForm = document.getElementById('discover-search-form');
    if (discoverSearchForm) {
        const mockData = {
            'varanasi': {
                places: [{ name: 'Kashi Vishwanath Temple', desc: 'A sacred Hindu temple.', img: 'https://source.unsplash.com/400x300/?varanasi,temple' }, { name: 'Dashashwamedh Ghat', desc: 'The main ghat on the Ganga River.', img: 'https://source.unsplash.com/400x300/?varanasi,ghat' }],
                gems: [{ name: 'Sarnath Village', desc: 'A peaceful deer park where Buddha first taught.', img: 'https://source.unsplash.com/400x300/?sarnath' }],
                handilooms: [{ name: 'Banarasi Silk Weavers', desc: 'See the making of authentic Banarasi sarees.', tag: 'Silk Weaving', img: 'https://source.unsplash.com/400x300/?silk,saree,loom' }],
                events: [{ name: 'Dev Deepawali', desc: 'The festival of lights of the gods.', date: 'November', img: 'https://source.unsplash.com/400x300/?varanasi,diwali' }]
            },
            'rajasthan': {
                places: [{ name: 'Hawa Mahal', desc: 'The iconic "Palace of Winds" in Jaipur.', img: 'https://source.unsplash.com/400x300/?hawa,mahal' }],
                gems: [{ name: 'Abhaneri Village', desc: 'Home to an ancient and stunning stepwell.', img: 'https://source.unsplash.com/400x300/?abhaneri,stepwell' }],
                handilooms: [{ name: 'Sanganer Block Printing', desc: 'A village famous for woodblock printing.', tag: 'Block Printing', img: 'https://source.unsplash.com/400x300/?block,printing,textile' }],
                events: [{ name: 'Pushkar Camel Fair', desc: 'A vibrant annual livestock fair.', date: 'November', img: 'https://source.unsplash.com/400x300/?pushkar,camel,fair' }]
            }
        };

        discoverSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('location').value.trim().toLowerCase();
            if (!location) return;

            const data = mockData[location];
            document.getElementById('results-section').classList.remove('hidden');
            
            document.querySelectorAll('.results-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-target="places-results"]').classList.add('active');
            document.querySelectorAll('.results-tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById('places-results').classList.add('active');

            if (data) {
                document.getElementById('results-title').textContent = `Showing Results for ${location.charAt(0).toUpperCase() + location.slice(1)}`;
                document.getElementById('places-results').innerHTML = data.places.map(createCard).join('');
                document.getElementById('gems-results').innerHTML = data.gems.map(createCard).join('');
                document.getElementById('handilooms-results').innerHTML = data.handilooms.map(createCard).join('');
                document.getElementById('events-results').innerHTML = data.events.map(createCard).join('');
            } else {
                document.getElementById('results-title').textContent = `No results found for "${location}"`;
                ['places-results', 'gems-results', 'handilooms-results', 'events-results'].forEach(id => document.getElementById(id).innerHTML = '');
            }
        });
        
        document.querySelectorAll('.results-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.results-tab-btn').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.dataset.target;
                document.querySelectorAll('.results-tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetId) content.classList.add('active');
                });
            });
        });

        const createCard = (item) => `
            <div class="result-card">
                <img src="${item.img}" alt="${item.name}" class="card-image">
                <div class="card-overlay">
                    <div class="card-text">
                        <h3>${item.name}</h3>
                        <p>${item.desc}</p>
                    </div>
                    <button class="card-button" data-name="${item.name}">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>`;
        
        document.getElementById('results-section')?.addEventListener('click', (e) => {
            const cardButton = e.target.closest('.card-button');
            if (cardButton) {
                const placeName = cardButton.dataset.name;
                alert(`Showing details for ${placeName}...`);
            }
        });
    }
    
    // --- VOICE ASSISTANT LOGIC ---
    const micContainer = document.getElementById('mic-container');
    if (micContainer) {
        const micStatus = document.getElementById('mic-status');
        micContainer.addEventListener('click', () => {
            micContainer.classList.toggle('listening');
            micStatus.textContent = micContainer.classList.contains('listening') ? 'Listening... (simulation)' : 'Click the mic to start';
        });
    }

    // --- GROUP TRAVEL TAB LOGIC ---
    const groupTabButtons = document.querySelectorAll('.results-tabs .results-tab-btn');
    if (document.querySelector('.group-travel-container') && groupTabButtons.length > 0) {
        const groupTabContents = document.querySelectorAll('.group-tab');
        groupTabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                groupTabButtons.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.dataset.target;
                groupTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetId) content.classList.add('active');
                });
            });
        });
    }
});