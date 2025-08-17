// Presenter Mode JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const nextItemBtn = document.getElementById('next-item-btn');
    const resetItemsBtn = document.getElementById('reset-items-btn');
    const presenterItem = document.getElementById('presenter-item');
    const shownCounter = document.getElementById('shown-counter');
    const totalCounter = document.getElementById('total-counter');
    
    // Set to track items that have been shown
    let shownItems = new Set();
    
    // Reference to the data pool (from script.js)
    let dataPool = [];
    
    // Initialize the presenter mode
    function initPresenterMode() {
        // Check if bingoDataPool is available from script.js
        if (typeof bingoDataPool !== 'undefined') {
            dataPool = [...bingoDataPool];
            
            // Update the total counter
            totalCounter.textContent = dataPool.length;
            
            // Load any saved state
            loadPresenterState();
        } else {
            console.error('Bingo data pool not found. Make sure script.js is loaded correctly.');
            presenterItem.innerHTML = '<p class="error-message">Error: Bingo data not available</p>';
        }
    }
    
    // Display a random item that hasn't been shown yet
    function displayRandomItem() {
        // Remove the start message if it exists
        const startMessage = presenterItem.querySelector('.start-message');
        if (startMessage) {
            presenterItem.removeChild(startMessage);
        }
        
        // Check if all items have been shown
        if (shownItems.size >= dataPool.length) {
            presenterItem.textContent = "All items have been shown!";
            return;
        }
        
        // Find an item that hasn't been shown yet
        let availableItems = dataPool.filter(item => !shownItems.has(item));
        
        // If there are no available items (shouldn't happen due to the check above)
        if (availableItems.length === 0) {
            presenterItem.textContent = "All items have been shown!";
            return;
        }
        
        // Select a random item from the available items
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const selectedItem = availableItems[randomIndex];
        
        // Add to the set of shown items
        shownItems.add(selectedItem);
        
        // Update the counter
        shownCounter.textContent = shownItems.size;
        
        // Display the item with animation
        presenterItem.classList.remove('animate');
        void presenterItem.offsetWidth; // Trigger reflow to restart animation
        presenterItem.classList.add('animate');
        presenterItem.textContent = selectedItem;
        
        // Save the current state
        savePresenterState();
    }
    
    // Reset all shown items
    function resetShownItems() {
        shownItems.clear();
        shownCounter.textContent = '0';
        presenterItem.innerHTML = '<p class="start-message">Click "Next Item" to begin</p>';
        savePresenterState();
    }
    
    // Save the presenter state to localStorage
    function savePresenterState() {
        const state = {
            shownItems: Array.from(shownItems)
        };
        localStorage.setItem('bingoPresenterState', JSON.stringify(state));
    }
    
    // Load the presenter state from localStorage
    function loadPresenterState() {
        const savedState = localStorage.getItem('bingoPresenterState');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                // Restore shown items
                if (state && state.shownItems && Array.isArray(state.shownItems)) {
                    shownItems = new Set(state.shownItems);
                    shownCounter.textContent = shownItems.size;
                    
                    // If items have been shown, display a message
                    if (shownItems.size > 0) {
                        presenterItem.innerHTML = '<p>Click "Next Item" to continue</p>';
                    }
                }
            } catch (e) {
                console.error('Error parsing saved presenter state:', e);
                resetShownItems();
            }
        }
    }
    
    // Event listeners
    nextItemBtn.addEventListener('click', displayRandomItem);
    resetItemsBtn.addEventListener('click', resetShownItems);
    
    // Initialize the presenter mode
    initPresenterMode();
});