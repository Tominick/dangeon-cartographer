// Configuration
const GRID_COLS = 48;
const GRID_ROWS = 27;
let TILE_SIZE = 20; // Will be calculated dynamically

// Tile types
const TILE_TYPES = [
    { id: 'grass', name: 'Grass', icon: '', color: '#4a7c4e' },
    { id: 'tree', name: 'Tree', icon: '', color: '#228B22' },
    { id: 'path', name: 'Path', icon: '', color: '#d2b48c' },
    { id: 'wall', name: 'Wall', icon: '', color: '#6b4423' },
    { id: 'door', name: 'Door', icon: '', color: '#8b6f47' },                        
    { id: 'water', name: 'Water', icon: '', color: '#1e90ff' },
    { id: 'dark', name: 'Dark', icon: '', color: '#000000' },            
];

// Player types
const PLAYER_TYPES = [
    { id: 0, name: 'Warrior', icon: '🛡️', color: '#c0392b' },
    { id: 1, name: 'Wizard', icon: '🧙', color: '#8e44ad' },
    { id: 2, name: 'Ranger', icon: '🏹', color: '#27ae60' },
    { id: 3, name: 'Rogue', icon: '🗡️', color: '#34495e' },
    { id: 4, name: 'Cleric', icon: '⚕️', color: '#f39c12' },
    { id: 5, name: 'Bard', icon: '🎭', color: '#e74c3c' },
    { id: 6, name: 'Druid', icon: '🦁', color: '#16a085' },
    { id: 7, name: 'Paladin', icon: '⚔️', color: '#d4af37' },
    { id: 8, name: 'Monk', icon: '👴', color: '#95a5a6' },
    { id: 9, name: 'Barbarian', icon: '👹', color: '#c0392b' },
    { id: 10, name: 'Fox', icon: '🦊', color: '#f1c40f' },
    { id: 11, name: 'Frog', icon: '🐸', color: '#27ae60' },
    { id: 12, name: 'Wolf', icon: '🐺', color: '#8b4513' },
    { id: 13, name: 'Rabbit', icon: '🐰', color: '#8b4513' },
    { id: 14, name: 'Prince', icon: '🤴', color: '#8b4513' },
    { id: 15, name: 'Girl', icon: '👱‍♀️', color: '#8b4513' },
    { id: 16, name: 'Person', icon: '🧑', color: '#8b4513' },
    { id: 17, name: 'Dragon', icon: '🐉', color: '#e74c3c' },
    { id: 18, name: 'Unicorn', icon: '🦄', color: '#9b59b6' },
    { id: 19, name: 'Elf', icon: '🧝', color: '#27ae60' },
    { id: 20, name: 'Skull', icon: '💀', color: '#7f8c8d' },
    { id: 21, name: 'Goblin', icon: '👺', color: '#27ae60' },
    //Items
    { id: 22, name: 'Key', icon: '🔑', color: '#f1c40f' },
    { id: 23, name: 'Fire', icon: '🔥', color: '#e74c3c' },
    { id: 24, name: 'Food', icon: '🍲', color: '#f1c40f' },
    { id: 25, name: 'Bed', icon: '🛏️', color: '#95a5a6' },
    { id: 26, name: 'Book', icon: '📘', color: '#95a5a6' },
    { id: 27, name: 'Trap', icon: '⚠️', color: '#8b4513' },
    { id: 28, name: 'Treasure', icon: '💰', color: '#d4af37' },
    { id: 29, name: 'Potion', icon: '🧪', color: '#9b59b6' },
    { id: 30, name: 'Amulet', icon: '🥇', color: '#f1c40f' },            
];

// State
let currentStage = 1;
let selectedTileType = TILE_TYPES[0];
let mapData = [];
let players = [];
let selectedPlayer = null;
let selectedPlayerForMovement = null;
let lastCol = -1;
let lastRow = -1;

// Initialize
function init() {
    createTilePalette();
    PopulatePlayerTypeDropdown();            
    window.addEventListener('load', () => {
        calculateTileSize();
        createMapGrid();
        restoreState();
    });
    window.addEventListener('resize', () => {
        RecalculateTileAndGrid();
    });
}

function PopulatePlayerTypeDropdown() {
    const playerTypeSelect = document.getElementById('playerType');
    PLAYER_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.icon + ' ' + type.name;
        playerTypeSelect.appendChild(option);
    });
}
function RecalculateTileAndGrid() {
    calculateTileSize();
    updateGridSize();
}

// Calculate optimal tile size based on available space
function calculateTileSize() {
    const container = document.querySelector('.map-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    console.log('Container Size:', containerWidth, containerHeight);

    const tileSizeByWidth = Math.floor(containerWidth / GRID_COLS);
    const tileSizeByHeight = Math.floor(containerHeight / GRID_ROWS);
    console.log('Predicted Tile Size:', tileSizeByWidth, tileSizeByHeight);
    
    // Use the smaller of the two to ensure tiles remain square
    TILE_SIZE = Math.min(tileSizeByWidth, tileSizeByHeight);
    TILE_SIZE = Math.max(TILE_SIZE-1, 20); // Min 20px
    console.log('TILE_SIZE:', TILE_SIZE);
}

// Update grid size
function updateGridSize() {
    const grid = document.getElementById('mapGrid');
    grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${TILE_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${TILE_SIZE}px)`;
    
    const tiles = document.querySelectorAll('.map-tile');
    tiles.forEach(tile => {
        tile.style.width = `${TILE_SIZE}px`;
        tile.style.height = `${TILE_SIZE}px`;
        tile.style.minWidth = `${TILE_SIZE}px`;
        tile.style.minHeight = `${TILE_SIZE}px`;
        tile.style.maxWidth = `${TILE_SIZE}px`;
        tile.style.maxHeight = `${TILE_SIZE}px`;
    });

    // Update player tokens
}

// Create tile palette
function createTilePalette() {
    const palette = document.getElementById('tilePalette');
    TILE_TYPES.forEach((type, index) => {
        const option = document.createElement('div');
        option.className = 'tile-option' + (index === 0 ? ' selected' : '');
        option.onclick = () => selectTileType(type, option);
        option.innerHTML = `
            <div class="tile-preview ${type.id}" style="background: ${type.color};">${type.icon}</div>
            <div class="tile-label">${type.name}</div>
        `;
        palette.appendChild(option);
    });
}

// Select tile type
function selectTileType(type, element) {
    selectedTileType = type;
    document.querySelectorAll('.tile-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Create map grid
function createMapGrid() {
    const grid = document.getElementById('mapGrid');
    grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${TILE_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${TILE_SIZE}px)`;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        mapData[row] = [];
        for (let col = 0; col < GRID_COLS; col++) {
            const tile = document.createElement('div');
            tile.className = 'map-tile grass';
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.style.width = `${TILE_SIZE}px`;
            tile.style.height = `${TILE_SIZE}px`;
            tile.onpointerdown = (ev) => {
                console.log(ev);
                ev.preventDefault();
                if (ev.buttons === 1) {
                    handleTileClick(row, col, tile, ev.shiftKey);
                }
            };
            tile.onpointerup = (ev) => {
                console.log(ev);
                if (ev.pointerType === 'pen')
                {
                    ev.stopPropagation();
                    var overTile = document.elementFromPoint(ev.clientX, ev.clientY);
                    if (overTile && overTile.classList.contains('map-tile')) {
                        handleTileClick(overTile.dataset.row, overTile.dataset.col, overTile, true);
                    }
                } else {
                    handleTileClick(row, col, tile, true);
                }
            };
            tile.onpointercancel = (ev) => {};
            grid.appendChild(tile);
            mapData[row][col] = { type: 'grass', icon: '' };
        }
    }
}

function log(msg){
    document.getElementById('stageIndicator').textContent = msg;
}

// Handle tile click
function handleTileClick(row, col, tileElement, rectangularFill) {
    if (currentStage === 1) {                
        
        if (rectangularFill) {                    
            // fill area
            for (let r = Math.min(lastRow, row); r <= Math.max(lastRow, row); r++) {
                for (let c = Math.min(lastCol, col); c <= Math.max(lastCol, col); c++) {
                    mapData[r][c] = { type: selectedTileType.id, icon: selectedTileType.icon };
                    const tileToUpdate = document.querySelector(`.map-tile[data-row='${r}'][data-col='${c}']`);
                    tileToUpdate.className = `map-tile ${selectedTileType.id}`;
                    tileToUpdate.textContent = selectedTileType.icon;
                }
            }
        } else {
        // one tile at a time
        mapData[row][col] = { 
            type: selectedTileType.id, 
            icon: selectedTileType.icon 
        };
        tileElement.className = `map-tile ${selectedTileType.id}`;
        tileElement.textContent = selectedTileType.icon;
        lastCol = col;
        lastRow = row; 
        }                
        
    } else if (currentStage === 2 && !rectangularFill) {
        if (selectedPlayerForMovement)
        {
            // Player movement mode                
            if (TileContainsAnotherPlayer(selectedPlayerForMovement, row, col)) {
                if (confirm('Another player is already on this tile. Move anyway?')) {
                    movePlayerToTile(selectedPlayerForMovement, row, col);
                } else {                         
                    clearSelectedPlayerForMovement();
                    document.querySelectorAll('.player-item').forEach(item => item.classList.remove('selected-player'));
                }
            }
            else
            {
                movePlayerToTile(selectedPlayerForMovement, row, col);
            }                
        }
        else
        {
            // Select player on this tile     
            const playersOnThisTile = GetTilePlayerTokens(row, col);
            if (playersOnThisTile.length > 0) {
                const token = playersOnThisTile[0];
                const player = players.find(p => p.id === parseInt(token.dataset.playerId));
                const playerItem = document.querySelector(`.player-item:nth-child(${players.indexOf(player) + 1})`);
                selectPlayerForMovement(player, playerItem);
            }
        }
    }
}

// Save map
function saveMap() {
    localStorage.setItem('dndMap', JSON.stringify(mapData));
    showNotification('Map saved successfully! 🗺️');
}

function restoreState(){
    const previouslySaved = localStorage.getItem('dndGameState')
    if (previouslySaved) {
        currentStage = 2;
        document.getElementById('stage1').style.display = 'none';
        document.getElementById('stage2').style.display = 'block';
        document.getElementById('stageIndicator').textContent = 'Stage: Player Setup';
        RecalculateTileAndGrid();
        loadGameState();
        showNotification('Entering Player Setup Stage ⚔️');
    } else {
        loadMap();
    }
}


// Load map
function loadMap() {
    const saved = localStorage.getItem('dndMap');
    if (saved) {
        mapData = JSON.parse(saved);
        updateMapDisplay();
        showNotification('Map loaded successfully! 📂');
    } else {
        loadStoredMap();
    }
}

function loadStoredMap(filename='dungeon-map.json') {
    fetch(filename)
        .then(response => response.json())
        .then(data => {
            mapData = data.mapData;
            updateMapDisplay();
            showNotification('Default ' + filename + '! 📂');
        })
        .catch(error => {
            showNotification('Error loading ' + filename + ':' + error);
            console.error('loadStoredMap error:', error);
        });
}

// Clear map
function clearMap() {
    if (confirm('Are you sure you want to clear the entire map?')) {
        mapData.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                mapData[rowIdx][colIdx] = { type: 'grass', icon: '' };
            });
        });
        updateMapDisplay();
        showNotification('Map cleared! 🗑️');
    }
}

// Generate random map
function generateMap() {
    if (confirm('Generate a new random map? This will replace the current map.')) {
        // Clear map first
        const grassType = TILE_TYPES.find(t => t.id === 'grass');
        mapData.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                mapData[rowIdx][colIdx] = { type: grassType.id, icon: grassType.icon };
            });
        });

        // Generate random trees
        const numtrees = 20 + Math.floor(Math.random() * 20); // 20-39 trees
        const treeType = TILE_TYPES.find(t => t.id === 'tree');
        for (let i = 0; i < numtrees; i++) {
            const x = Math.floor(Math.random() * GRID_COLS);
            const y = Math.floor(Math.random() * GRID_ROWS);
            mapData[y][x] = { type: treeType.id, icon: treeType.icon };
        }

        // Generate random rooms
        const numRooms = 8 + Math.floor(Math.random() * 7); // 8-14 rooms
        const rooms = [];

        for (let i = 0; i < numRooms; i++) {
            const attempts = 50;
            for (let attempt = 0; attempt < attempts; attempt++) {
                const width = 4 + Math.floor(Math.random() * 8); // 4-11 tiles wide
                const height = 4 + Math.floor(Math.random() * 8); // 4-11 tiles tall
                const x = 1 + Math.floor(Math.random() * (GRID_COLS - width - 2));
                const y = 1 + Math.floor(Math.random() * (GRID_ROWS - height - 2));

                const newRoom = { x, y, width, height };
                
                // Check if room overlaps with existing rooms
                let overlaps = false;
                for (const room of rooms) {
                    if (!(newRoom.x + newRoom.width + 1 < room.x ||
                          newRoom.x > room.x + room.width + 1 ||
                          newRoom.y + newRoom.height + 1 < room.y ||
                          newRoom.y > room.y + room.height + 1)) {
                        overlaps = true;
                        break;
                    }
                }

                if (!overlaps) {
                    rooms.push(newRoom);
                    break;
                }
            }
        }

        // Draw rooms
        const pathType = TILE_TYPES.find(t => t.id === 'path');
        rooms.forEach((room, roomIndex) => {
            // Floor
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    mapData[y][x] = { type: pathType.id, icon: pathType.icon };
                }
            }

            // Walls
            const wallType = TILE_TYPES.find(t => t.id === 'wall');
            for (let x = room.x; x < room.x + room.width; x++) {
                mapData[room.y][x] = { type: wallType.id, icon: wallType.icon };
                mapData[room.y + room.height - 1][x] = { type: wallType.id, icon: wallType.icon };
            }
            for (let y = room.y; y < room.y + room.height; y++) {
                mapData[y][room.x] = { type: wallType.id, icon: wallType.icon };
                mapData[y][room.x + room.width - 1] = { type: wallType.id, icon: wallType.icon };
            }

            // Add doors (1-2 per room)
            const numDoors = 1 + Math.floor(Math.random() * 2);
            const doorType = TILE_TYPES.find(t => t.id === 'door');
            for (let d = 0; d < numDoors; d++) {
                const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
                let doorX, doorY;
                
                if (side === 0) { // top
                    doorX = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
                    doorY = room.y;
                } else if (side === 1) { // right
                    doorX = room.x + room.width - 1;
                    doorY = room.y + 1 + Math.floor(Math.random() * (room.height - 2));
                } else if (side === 2) { // bottom
                    doorX = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
                    doorY = room.y + room.height - 1;
                } else { // left
                    doorX = room.x;
                    doorY = room.y + 1 + Math.floor(Math.random() * (room.height - 2));
                }
                
                if (doorY >= 0 && doorY < GRID_ROWS && doorX >= 0 && doorX < GRID_COLS) {
                    mapData[doorY][doorX] = { type: doorType.id, icon: doorType.icon };
                }
            }
        });

        // Add some water features
        const numWaterAreas = 2 + Math.floor(Math.random() * 3); // 2-4 water areas
        const waterType = TILE_TYPES.find(t => t.id === 'water');
        for (let i = 0; i < numWaterAreas; i++) {
            const wx = 2 + Math.floor(Math.random() * (GRID_COLS - 8));
            const wy = 2 + Math.floor(Math.random() * (GRID_ROWS - 8));
            const wsize = 2 + Math.floor(Math.random() * 4); // 2-5 tiles
            
            for (let dy = 0; dy < wsize; dy++) {
                for (let dx = 0; dx < wsize; dx++) {
                    const ty = wy + dy;
                    const tx = wx + dx;
                    if (ty < GRID_ROWS && tx < GRID_COLS && 
                        (mapData[ty][tx].type === grassType.id || mapData[ty][tx].type === treeType.id)) {
                        mapData[ty][tx] = { type: waterType.id, icon: waterType.icon };
                    }
                }
            }
        }

        updateMapDisplay();
        showNotification('Random dungeon generated! 🎲');
    }
}

// Update map display
function updateMapDisplay() {
    const tiles = document.querySelectorAll('.map-tile');
    tiles.forEach(tile => {
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        const data = mapData[row][col];
        tile.className = `map-tile ${data.type}`;
        tile.textContent = data.icon;
    });
}

// Stage navigation
function goToStage2() {
    currentStage = 2;
    document.getElementById('stage1').style.display = 'none';
    document.getElementById('stage2').style.display = 'block';
    document.getElementById('stageIndicator').textContent = 'Stage: Player Setup';
    RecalculateTileAndGrid();
    RestorePlayerPositions();
    showNotification('Entering Player Setup Stage ⚔️');
}

function RestorePlayerPositions() {
    players.forEach(player => {
        if (player.position) {
            const tile = document.querySelector(`.map-tile[data-row="${player.position.row}"][data-col="${player.position.col}"]`);
            if (tile) {
                if (tile.querySelectorAll('.player-token').length === 0) {
                    selectedPlayer = player;
                    selectedPlayerForMovement = player;
                    var row = player.position.row;
                    var col = player.position.col;
                    movePlayerToTile(selectedPlayerForMovement, row, col);
                }                            
            }
        }
    });
}

function goToStage1() {
    currentStage = 1;
    document.getElementById('stage1').style.display = 'block';
    document.getElementById('stage2').style.display = 'none';
    document.getElementById('stageIndicator').textContent = 'Stage: Map Design';
    RecalculateTileAndGrid();
    showNotification('Returning to Map Design 🗺️');
}

// Add player
function addPlayer(event) {
    const nameInput = document.getElementById('playerName');
    const typeSelect = document.getElementById('playerType');
    var name = nameInput.value.trim();
    
    if (!name) {
        const typeSelect = document.getElementById('playerType');
        const nameInput = document.getElementById('playerName');
        const selectedType = PLAYER_TYPES[parseInt(typeSelect.value)];
        name = selectedType.name;
        
        var index = 1;
        var namePrefix = name;
        do {
            name = namePrefix + ' ' + index;
            index++;
        } while (players.some(p => p.name === name));                
    }

    const typeId = parseInt(typeSelect.value);
    const playerType = PLAYER_TYPES[typeId];
    
    const player = {
        id: Date.now(),
        name: name,
        type: playerType,
        position: null
    };

    players.push(player);
    updatePlayerList();
    nameInput.value = '';
    RecalculateTileAndGrid();
    showNotification(`${name} the ${playerType.name} joined the party! 🎉`);
}

// Update player list
function updatePlayerList() {
    const list = document.getElementById('playerList');
    list.innerHTML = '';
    
    players.forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item' + (selectedPlayer?.id === player.id ? ' selected-player' : '');
        item.onclick = () => toggleSelectPlayerForMovement(player, item);
        item.innerHTML = `
            <div class="player-item-icon" style="background: ${player.type.color};">
                ${player.type.icon}
            </div>
            <div style="flex: 1;">
                <strong>${player.name}</strong> - ${player.type.name}
                ${player.position ? `<br><small>Position: (${player.position.row}, ${player.position.col})</small>` : '<br><small>Not placed</small>'}
            </div>
        `;
        list.appendChild(item);
    });
    RecalculateTileAndGrid();
}

function clearSelectedPlayerForMovement() {
    console.log('clearSelectedPlayerForMovement');
    selectedPlayer = null;
    selectedPlayerForMovement = null;
    document.querySelectorAll('.player-token').forEach(token => token.classList.remove('selected-token'));
}



function toggleSelectPlayerForMovement(player, element) {
    console.log('toggleSelectPlayerForMovement for', player.name);
    selectedPlayer = player;
    selectedPlayerForMovement = player;
    if (element.classList.contains('selected-player')) {
        // Deselect
        clearSelectedPlayerForMovement();
        document.querySelectorAll('.player-item').forEach(item => item.classList.remove('selected-player'));
        showNotification(`Deselected ${player.name}.`);
        return;
    }
    document.querySelectorAll('.player-item').forEach(item => item.classList.remove('selected-player'));
    element.classList.add('selected-player');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight player token if on map
    document.querySelectorAll('.player-token').forEach(token => {
        if (parseInt(token.dataset.playerId) === player.id && token.classList.contains('selected-player') === false ) {
            token.classList.add('selected-token');
        }             
    });
    
    showNotification(`Selected ${player.name}. Click a tile to move! 🎯`);
}

// Select player for movement
function selectPlayerForMovement(player, element) {
    console.log('selectPlayerForMovement for', player.name);
    selectedPlayer = player;
    selectedPlayerForMovement = player;
    document.querySelectorAll('.player-item').forEach(item => item.classList.remove('selected-player'));
    element.classList.add('selected-player');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight player token if on map
    document.querySelectorAll('.player-token').forEach(token => {
        if (parseInt(token.dataset.playerId) === player.id && token.classList.contains('selected-player') === false ) {
            token.classList.add('selected-token');
        }             
    });
    
    showNotification(`Selected ${player.name}. Click a tile to move! 🎯`);
}

function GetTilePlayerTokens(row, col) 
{
    const tile = document.querySelector(`.map-tile[data-row="${row}"][data-col="${col}"]`);
    return tile?.querySelectorAll('.player-token');
}

function TileContainsAnotherPlayer(player, row, col) 
{            
    const oldTokens = GetTilePlayerTokens(row, col);
    if (oldTokens) {
        for (const token of oldTokens) {
            if (parseInt(token.dataset.playerId) !== player.id) {
                return true;
        }
        }
    }
    return false;
}

// Move player to tile
function movePlayerToTile(player, row, col) {
    console.log(`movePlayerToTile: Moving ${player.name} to (${row}, ${col})`);
    // Remove old position
    if (player.position) {
        const oldTile = document.querySelector(`.map-tile[data-row="${player.position.row}"][data-col="${player.position.col}"]`);
        const oldTokens = oldTile?.querySelectorAll('.player-token');
        if (oldTokens) oldTokens.forEach(token => {
            if (parseInt(token.dataset.playerId) === player.id) token.remove();
        });
    }

    // Set new position
    player.position = { row, col };

    // Add token to new position
    const tile = document.querySelector(`.map-tile[data-row="${row}"][data-col="${col}"]`);
    const token = document.createElement('div');
    token.className = 'player-token' + (selectedPlayer?.id === player.id ? ' selected-token' : '');
    token.style.background = player.type.color;
    token.style.width = `${TILE_SIZE - 10}px`;
    token.style.height = `${TILE_SIZE - 10}px`;
    token.textContent = player.type.icon;
    token.dataset.playerId = player.id;
    tile.appendChild(token);

    clearSelectedPlayerForMovement();
    updatePlayerList();            
    showNotification(`${player.name} moved to (${row}, ${col})! 🏃`);
}

// Remove selected player
function removeSelectedPlayer() {
    if (!selectedPlayer) {
        showNotification('Please select a player first! ⚠️');
        return;
    }

    if (confirm(`Remove ${selectedPlayer.name} from the game?`)) {
        // Remove token from map
        if (selectedPlayer.position) {
            const tile = document.querySelector(`.map-tile[data-row="${selectedPlayer.position.row}"][data-col="${selectedPlayer.position.col}"]`);
            const token = tile?.querySelector('.player-token');
            if (token) token.remove();
        }

        players = players.filter(p => p.id !== selectedPlayer.id);
        selectedPlayer = null;
        selectedPlayerForMovement = null;
        updatePlayerList();
        showNotification('Player removed! 👋');
    }
}

function clearPositionSelectedPlayer()
{
    if (!selectedPlayer) {
        showNotification('Please select a player first! ⚠️');
        return;
    }

    if (selectedPlayer.position === null) {
        showNotification('Selected player is not on the map! ⚠️');
        return;
    }

    if (confirm(`Clear ${selectedPlayer.name}'s position on the map?`)) {
        // Remove token from map
        if (selectedPlayer.position) {
            const tile = document.querySelector(`.map-tile[data-row="${selectedPlayer.position.row}"][data-col="${selectedPlayer.position.col}"]`);
            const token = tile?.querySelector('.player-token');
            if (token) token.remove();
        }

        selectedPlayer.position = null;
        selectedPlayer = null;
        selectedPlayerForMovement = null;
        updatePlayerList();
        showNotification('Player position cleared! 🧹');
    }
}

function clearGameState() {
    if (confirm('Are you sure you want to clear the saved game state? This will remove all players and their positions.')) {
        localStorage.removeItem('dndGameState');
        players = [];
        selectedPlayer = null;
        selectedPlayerForMovement = null;
        
        // Remove all player tokens from map
        document.querySelectorAll('.player-token').forEach(token => token.remove());
        
        updatePlayerList();
        showNotification('Game state cleared! 🗑️');
    }
}

// Save game state
function saveGameState() {
    const gameState = {
        map: mapData,
        players: players
    };
    localStorage.setItem('dndGameState', JSON.stringify(gameState));
    showNotification('Game state saved! 💾');
}

// Load game state
function loadGameState() {
    const saved = localStorage.getItem('dndGameState');
    if (saved) {
        const gameState = JSON.parse(saved);
        mapData = gameState.map;
        players = gameState.players;
        
        updateMapDisplay();
        updatePlayerList();
        
        ReplaceAllPlayerTokens();
        
        showNotification('Game state loaded! 📂');
    }
}

function ReplaceAllPlayerTokens() {
        // Re-place all player tokens
        players.forEach(player => {
            if (player.position) {
                const tile = document.querySelector(`.map-tile[data-row="${player.position.row}"][data-col="${player.position.col}"]`);
                if (tile) {
                    const token = document.createElement('div');
                    token.className = 'player-token';
                    token.style.background = player.type.color;
                    token.style.width = `${TILE_SIZE - 10}px`;
                    token.style.height = `${TILE_SIZE - 10}px`;
                    token.textContent = player.type.icon;
                    token.dataset.playerId = player.id;
                    tile.appendChild(token);
                }
            }
        }); 
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Export map to JSON file
function exportMap() {
    const mapExport = {
        version: '1.0',
        gridSize: {
            rows: GRID_ROWS,
            cols: GRID_COLS
        },
        mapData: mapData,
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(mapExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dungeon-map-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Map exported successfully! 💾');
}

// Import map from JSON file
function importMap(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Validate import data
            if (!imported.mapData || !Array.isArray(imported.mapData)) {
                throw new Error('Invalid map data format');
            }

            // Check if grid sizes match
            if (imported.gridSize && 
                (imported.gridSize.rows !== GRID_ROWS || 
                 imported.gridSize.cols !== GRID_COLS)) {
                if (!confirm(`This map was created with different dimensions (${imported.gridSize.rows}x${imported.gridSize.cols}). Current grid is ${GRID_ROWS}x${GRID_COLS}. Import anyway? (May cause issues)`)) {
                    event.target.value = '';
                    return;
                }
            }

            // Import the map data
            mapData = imported.mapData;
            
            // Ensure the map data matches current grid size
            while (mapData.length < GRID_ROWS) {
                mapData.push(Array(GRID_COLS).fill(null).map(() => ({ type: 'grass', icon: '' })));
            }
            mapData = mapData.slice(0, GRID_ROWS);
            mapData.forEach(row => {
                while (row.length < GRID_COLS) {
                    row.push({ type: 'grass', icon: '' });
                }
                row.splice(GRID_COLS);
            });

            updateMapDisplay();                    
            showNotification('Map imported successfully! 📁');
        } catch (error) {
            showNotification('Error importing map: ' + error.message + ' ⚠️');
            console.error('Import error:', error);
        }
        
        // Reset file input
        event.target.value = '';
    };
    
    reader.onerror = function() {
        showNotification('Error reading file! ⚠️');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

// Toggle import map menu
function toggleImportMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('importMapMenu');
    menu.classList.toggle('show');
}

function toggleStateMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('stateMenu');
    menu.classList.toggle('show');
}

function clearStateMenu() {
    const menu = document.getElementById('stateMenu');
    menu.classList.remove('show');
}

// Handle import option selection
function selectImportOption(value) {
    const menu = document.getElementById('importMapMenu');
    menu.classList.remove('show');
    
    if (value === 'file') {
        // "Import from File" option selected - trigger file input
        document.getElementById('importMapFile').click();
    } else {
        // One of the preset maps selected
        loadStoredMap(value);
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const importMenu = document.getElementById('importMapMenu');
    const importContainer = document.querySelector('.import-map-container');
    if (importMenu && !importContainer?.contains(event.target)) {
        importMenu.classList.remove('show');
    }

    const stateMenu = document.getElementById('stateMenu');
    if (stateMenu && !importContainer?.contains(event.target)) {
        stateMenu.classList.remove('show');
    }
});

// Initialize on load
init();
