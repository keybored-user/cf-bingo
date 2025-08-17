// Bingo data pool - a larger set of developer-themed items
const bingoDataPool = [
    "🚨 Resolved a production incident",
    "🧠 Has an AWS certification",
    "🧳 Joined a Team's call on holiday",
    "☕ Joined a 9am meeting",
    "🧪 Pushed code directly to main (oops)",
    "🔄 Restarted a service and fixed the issue",
    "📖 Read the GenAI handbook",
    "☁️ Onboarded to DHP",
    "🗓️ Coming to office on a Friday",
    "‍💻 Has more than 5 tabs open right now",
    "💳 Has a CommBank Credit Card",
    "🔒 Uses a password manager",
    "🤓 Has reviewed a pull request in the last 30 mins",
    "‍💼 Completed the BDD workshop",
    "🔄 Has completed a SDLC",
    "📧 Has more than 100 unread emails",
    "🎫 Has created a T2 CAB ticket",
    "🔄 Has worked on IFLF",
    "🚀 Has done a Fast Track Release onboarding",
    "📚 Has started the Service Management training",
    "📊 Done a Kafka cert renewal",
    "🐶 Brought your pet to the meeting",
    "🐱 Cat has walked on your keyboard",
    "👥 Pinged someone with the same name",
    "🔀 Assigned a Jira Ticket to the wrong person / had your ticket assigned to someone else",
    "📧 Received a \"Hi\" with no context",
    "🔥 Experienced a T2 outage",
    "⭐️ Knows what Lumen is",
    "🚗 Has used GitHub actions",
    "💛 Doing Can4Cancer",
    "🧟‍♂️ Attended a meeting while half-asleep",
    "🧊 Said \"It works on my machine\"",
    "🧾 Created a Jira ticket and immediately closed it",
    "🧬 Used agentic AI to write code",
    "🧛‍♂️ Worked past midnight on a deploy",
    "🧘‍♂️ Said \"Let's circle back on that\"",
    "🧍‍♂️ Been the only one in a meeting",
    "🧪 Accidentally deployed to prod instead of staging",
    "🧑‍🚀 Used \"git push --force\" and hoped for the best",
    "🧑‍🏫 Explained something with a whiteboard",
    "🧑‍🔧 Fixed a bug by deleting code",
    "🧠 Memorized keyboard shortcuts to look efficient",
    "🧠 Explained technical debt to non-technical people",
    "😴 Dozed off during a meeting",
    "👔 Wore a formal top and pyjama bottoms",
    "📲 Sent a message to the wrong chat/channel",
    "👶 Kid accidentally sends emojis or gibberish in a work chat",
    "👵 Parent starts talking to you while you're clearly on a video call",
    "📝 Chased for approvals more than you coded",
    "🔁 Had a meeting to plan another meeting"
];

// Current board data (will be populated with random selection)
const bingoData = Array(25).fill("");

// Board size constants
const BOARD_SIZE = 5;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;

// Highlighted state tracking (flat array of 25 false values)
const highlightedState = Array(TOTAL_TILES).fill(false);

// Counter for selected tiles
let selectedCount = 0;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the bingo board container and counter element
    const bingoBoard = document.getElementById('bingo-board');
    const selectedCounter = document.getElementById('selected-counter');
    
    // Shuffle the board data (but keep FREE in the middle)
    shuffleBoardData();
    
    // Generate the bingo board from the data structure
    generateBingoBoard();
    
    // Update the counter display
    updateCounter();
    
    // Function to generate the bingo board HTML
    function generateBingoBoard() {
        // Clear the current board
        bingoBoard.innerHTML = '';
        
        // Generate tiles from the flat data structure
        for (let index = 0; index < bingoData.length; index++) {
            const tile = document.createElement('div');
            tile.className = 'bingo-tile';
            if (highlightedState[index]) {
                tile.classList.add('highlighted');
            }
            tile.textContent = bingoData[index];
            
            // Add data attribute to identify position
            tile.dataset.index = index;
            
            // Add click event listener
            tile.addEventListener('click', handleTileClick);
            
            // Add to the board
            bingoBoard.appendChild(tile);
        }
        
        // Calculate and apply optimal tile sizes after all tiles are added
        calculateOptimalTileSize();
    }
    
    // Handle tile click
    function handleTileClick(event) {
        const tile = event.currentTarget;
        const index = parseInt(tile.dataset.index);
        
        // Toggle highlighted state
        highlightedState[index] = !highlightedState[index];
        tile.classList.toggle('highlighted');
        
        // Update the selected count
        if (highlightedState[index]) {
            selectedCount++;
        } else {
            selectedCount--;
        }
        
        // Update the counter display
        updateCounter();
        
        // Save state
        saveState();
    }
    
    // Update the counter display
    function updateCounter() {
        selectedCounter.textContent = selectedCount;
    }
    
    // Update a specific tile's content
    function updateTileContent(index, content) {
        if (index >= 0 && index < bingoData.length) {
            bingoData[index] = content;
            refreshBoard();
        }
    }
    
    // Helper function to convert row/col to index (for backward compatibility)
    function convertRowColToIndex(row, col) {
        return row * BOARD_SIZE + col;
    }
    
    // Update the entire board data
    function updateBoardData(newData) {
        if (Array.isArray(newData) && newData.length === TOTAL_TILES) {
            bingoData.length = 0;
            bingoData.push(...newData);
            refreshBoard();
        } else if (Array.isArray(newData) && newData.length === BOARD_SIZE && 
                  newData.every(row => Array.isArray(row) && row.length === BOARD_SIZE)) {
            // Handle 2D array for backward compatibility
            const flatData = [];
            for (let row = 0; row < newData.length; row++) {
                for (let col = 0; col < newData[row].length; col++) {
                    flatData.push(newData[row][col]);
                }
            }
            bingoData.length = 0;
            bingoData.push(...flatData);
            refreshBoard();
        } else {
            console.error('Invalid board data. Must be a flat array of 25 items or a 5x5 2D array.');
        }
    }
    
    // Calculate optimal tile size based on text content
    function calculateOptimalTileSize() {
        // Get all tiles
        const tiles = document.querySelectorAll('.bingo-tile');
        
        // Find the tile with the longest text
        let maxLength = 0;
        let longestTextTile = null;
        
        tiles.forEach(tile => {
            const textLength = tile.textContent.length;
            if (textLength > maxLength) {
                maxLength = textLength;
                longestTextTile = tile;
            }
        });
        
        // Base font size adjustment on text length
        if (maxLength > 0) {
            // Get the current board width
            const boardWidth = bingoBoard.offsetWidth;
            const tileBaseWidth = (boardWidth - (4 * 15)) / 5; // 5 tiles with 4 gaps of 15px
            
            // Calculate font size based on text length
            let fontSize = 1; // Default 1rem
            
            if (maxLength > 40) {
                fontSize = 0.7; // Very long text
            } else if (maxLength > 30) {
                fontSize = 0.8; // Long text
            } else if (maxLength > 20) {
                fontSize = 0.9; // Medium text
            }
            
            // Apply the calculated font size to all tiles
            tiles.forEach(tile => {
                tile.style.fontSize = `${fontSize}rem`;
            });
        }
    }
    
    // Refresh the board display
    function refreshBoard() {
        generateBingoBoard();
        updateCounter();
    }
    
    // Count highlighted tiles
    function countHighlightedTiles() {
        return highlightedState.filter(state => state).length;
    }
    
    // Reset all highlights
    function resetHighlights() {
        highlightedState.fill(false);
        selectedCount = 0;
        refreshBoard();
    }
    
    // Create a new board by randomly selecting items from the pool
    function shuffleBoardData() {
        const freeSpaceIndex = 12; // Middle of 5x5 grid
        
        // Shuffle the data pool using Fisher-Yates algorithm
        const shuffledPool = [...bingoDataPool];
        for (let i = shuffledPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
        }
        
        // Take the first 24 items from the shuffled pool
        const selectedItems = shuffledPool.slice(0, 24);
        
        // Place items on the board with FREE in the middle
        let currentIndex = 0;
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (i === freeSpaceIndex) {
                bingoData[i] = "FREE";
            } else {
                bingoData[i] = selectedItems[currentIndex++];
            }
        }
    }
    
    // Save state to localStorage
    function saveState() {
        const state = {
            highlighted: highlightedState,
            selectedCount: selectedCount
        };
        localStorage.setItem('bingoState', JSON.stringify(state));
    }
    
    // Load state from localStorage
    function loadState() {
        // Always shuffle the board for a new random layout
        shuffleBoardData();
        
        const savedState = localStorage.getItem('bingoState');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                // Only restore the highlighted state, not the board layout
                if (state && state.highlighted && state.highlighted.length === TOTAL_TILES) {
                    // Restore highlighted state
                    for (let i = 0; i < state.highlighted.length; i++) {
                        highlightedState[i] = state.highlighted[i];
                    }
                    
                    // Restore selected count
                    selectedCount = state.selectedCount || 0;
                }
            } catch (e) {
                console.error('Error parsing saved state:', e);
                // Reset highlights if there's an error
                highlightedState.fill(false);
                selectedCount = 0;
            }
        } else {
            // Reset highlights for new users
            highlightedState.fill(false);
            selectedCount = 0;
        }
        
        // Save the new state
        saveState();
        refreshBoard();
        
        // Recalculate tile sizes when window is resized
        window.addEventListener('resize', calculateOptimalTileSize);
    }
    
    // Try to load saved state
    loadState();
    
    // Expose functions to the global scope
    window.bingoFunctions = {
        updateTileContent,
        updateBoardData,
        resetHighlights,
        saveState,
        loadState,
        getBoardData: () => JSON.parse(JSON.stringify(bingoData)),
        getSelectedCount: () => selectedCount,
        convertRowColToIndex, // Helper for backward compatibility
        shuffleBoardData // Allow manual reshuffling
    };
});