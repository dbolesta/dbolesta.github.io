var loadState = {
    
    preload: function() {
        // Add a loading label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
            { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        // Display the progress bar
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar); //preload sprite loads image proportionally to game loading
        
        // Load all assets for the game
        // game.load.image('player', 'assets/player.png');
        game.load.spritesheet('player', 'assets/player2.png', 20, 20); // load spritesheet for animations
        game.load.image('enemy', 'assets/enemy.png');
        game.load.image('coin', 'assets/coin.png'); 
        
        // new way to create gameworld, no longer load wall images
        game.load.image('tileset', 'assets/tileset.png');
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        // game.load.image('wallV', 'assets/wallVertical.png');
        // game.load.image('wallH', 'assets/wallHorizontal.png');
        
        // Load new asset for menu state
        game.load.image('background', 'assets/background.png');
        
        // Load spritesheet for mute button
        game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        
        
        // Load sounds
        // sound when player jumps
        game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
        // sound when play takes a coin
        game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
        // sound when the player dies
        game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
        
        // Load particals
        game.load.image('pixel', 'assets/pixel.png');
        
        
        // Load images for touch controls
        game.load.image('jumpButton', 'assets/jumpButton.png');
        game.load.image('rightButton', 'assets/rightButton.png');
        game.load.image('leftButton', 'assets/leftButton.png');
        
        
    },
    
    create: function() {
        // Go to the menu state
        game.state.start('menu');
        
    }
    
}