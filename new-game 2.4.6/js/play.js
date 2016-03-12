// We create our only state
var playState = {

    create: function() {
        // MAIN GAME INFO (initilizing stuff now found in boot.js)
        
        // PLAYER STUFF
        this.cursor = game.input.keyboard.createCursorKeys(); // makes the arrow keys active
        
        
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        
        
         /* animations from sprite sheet */
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        
        // PLAYER KEYBOARD MOVEMENT STUFF
        // this captures the arrow keys and doesnt allow browser to access them (to avoid screen movement)
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, 
            Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        // Creates new variables that will work like cursor keys
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        
        
        // ENEMY STUFF
        this.enemies = game.add.group();
        this.enemies.enableBody = true; // simply enable physics (collision detection) on a group
        this.enemies.createMultiple(10, 'enemy');
        
        
        // COIN STUFF
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); // need physics for collision detection
        this.coin.anchor.setTo(0.5, 0.5);
        
    
        // SCOREBOARD STUFF
        this.scoreLabel = game.add.text(30,30, 'score: 0', 
            {font: '18px Arial', fill: '#fff'});
        game.global.score = 0;
        
        
        // SOUND STUFF
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        this.jumpSound.volume = 0.1;
        this.coinSound.volume = 0.1;
        this.deadSound.volume = 0.1;
        
        
        
        
        
        
        // EMITTER STUFF (for particle effects)
        // create emitter with 15 particles. Dont set x and y because 
        // we dont knoww here they're going to explode yet
        this.emitter = game.add.emitter(0, 0, 15);
        
        // Set the 'pixel' image for the particles
        this.emitter.makeParticles('pixel');
        
        // Set the y speed of the partilcles betwen -150 and 150
        // The speed will be randomly picked between -150 and 150 for each particle
        this.emitter.setYSpeed(-150, 150);
        // Same for x speed
        this.emitter.setXSpeed(-150, 150);
        
        // Set scale for particles
        this.emitter.minParticleScale = 0.2;
        this.emitter.maxParticleScale = 0.7;
        
        // Use no gravity for the particles
        this.emitter.gravity = 1000;
        // emitter started in playerDie function
        
        // damon: for fun, have emitter land on floor
        game.physics.arcade.enable(this.emitter);
        
        
        // MOBILE INPUT BUTTON STUFF
        // If the game is running on a mobile device
        if (!game.device.desktop) {
            // Display the mobile inputs
            this.addMobileInputs();
        }
        

        // MAIN GAME STUFF
        this.createWorld();
        this.nextEnemy = 0;
        // game.time.events.loop(2200, this.addEnemy, this);
        
    },
    
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        
        // tell Phaser that the player and the walls should collide
        // COLLISION CODE SHOULD ALWAYS BE FIRST IN UPDATE FUNCTION (or else bugs)
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.enemies, this.layer);
        // damon: for fun, have emitter land on floor
        game.physics.arcade.collide(this.emitter, this.layer);
        
        // constantly be calling 'movePlayer' to check if player should move
        this.movePlayer();
        
        // If the player leaves the world, start main state again (from function below)
        // damon: should update so that jumping into top hole doesnt kill player
        if (!this.player.inWorld) {
            this.playerDie();
        }
    
        // check if player and coin overlap, if so call the takeCoin function below
        // check arcade.overlap documentation if need help
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        
        // Call the playerDie function (start main state) when enemies and player overlap
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        
        
        // Add enemies in new, dynamic way
        // If the 'nextEnemy' time has passed
        if (this.nextEnemy < game.time.now) {
            // Define our variables
            var start = 4000, end = 1000, score = 100;
            
            // Formula to decrease the delay between enemies over time
            var delay = Math.max(start - (start-end)*game.global.score/score, end);
                // confusing formula, but works out to have global.score continually decrease left parameter

            // We add a new enemy, and have next nextEnemy appear based on delay formula above
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
        
    },
    
    
    
    movePlayer: function(){
        // If the left arrow or A key is pressed
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            // Move the player to the left
            this.player.body.velocity.x = -200;
            this.player.animations.play('left'); // Start the left animation
        }
        
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            // Move the player to the right
            this.player.body.velocity.x = 200;
            
            this.player.animations.play('right'); // Start the left animation
            
        }
        
        else {
            // if nothing is pressed, stop the player
            this.player.body.velocity.x = 0;
            
            this.player.animations.stop(); // Stop the animation
            this.player.frame = 0; // Set the player frame to 0 (stand still) 
        }
        
        
        // If the up arrow key is pressed and the player is touching the ground
        if (this.cursor.up.isDown || this.wasd.up.isDown) {
            // Move the player upward (jump)
            /*  CODE BELOW MOVED TO ITS OWN FUNCTION 'jumpPlayer'
            this.jumpSound.play();
            this.player.body.velocity.y = -320;
            */
            // no longer need to check if onFloor, since thats handeled in 'jumpPlayer'
            this.jumpPlayer();
        }
        // DAMON: variable jump height, sonic method
        if (this.cursor.up.isUp && this.player.body.velocity.y < -85 ) {
            this.player.body.velocity.y = -85;
        }
        
    },
    
    createWorld: function() {
        // Create the tilemap
        this.map = game.add.tilemap('map');
        
        // Add the tileset to the map
        this.map.addTilesetImage('tileset');
        
        // Create the layer, by specifying the name of the Tiled layer
        this.layer = this.map.createLayer('Tile Layer 1');
        
        // Set the world size to match the size of the layer
        // this.layer.resizeWorld();
        
        // Enable collisions for the first element of our tileset (the blue wall)
        this.map.setCollision(1);
        
        
        
        
        
        // NO LONGER NEED BELOW CODE SINCE USING TILESET
        // Create our wall group with Arcade physics
        // game.physics.arcade.enable(this.walls); 
        // above line was my personal attempt and assumption, which seemingly is not correct
        /*
        this.walls = game.add.group();
        this.walls.enableBody = true;
        
        // Create the 10 walls
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left wall
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right wall
        
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left wall
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right wall
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left wall
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom wall
        
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left wall
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right wall
        
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);
        
        
        // Set all the walls to be immovable
        this.walls.setAll('body.immovable', true);
        */
        
    },
    
    playerDie: function() {
        // If the player is already dead, do nothing
        // This prevents code below from executing multiple times when player dies
        // from leaving the world bounds
        if (!this.player.alive) {
            return;
        }
        
        
        // Kill the player to make it disappear from the screen
        this.player.kill();
        // game.state.start('menu'); Moved to its own function so it can be delayed for emitter below
        
        // Start the sound and the particles
        this.deadSound.play();
        // Set the position of the emitter on the player
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        // Start the emitter, by exploding 15 particles that will live for 1000ms
        this.emitter.start(true, 1000, null, 15);
        
        // Call the 'startMenu' function in 1000ms (add delay after dying)
        game.time.events.add(1000, this.startMenu, this);
    },
    
    takeCoin: function() {
        // play sound
        this.coinSound.play();
        
        // tween coin
        this.coin.scale.setTo(0, 0); // Scale coin to 0 size to make it invisible
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start(); // Grown coin back to original scale in 300ms
        // tween player
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 50).start();
        
        // Update the score
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score; // edit the .text property of scoreLabel
        
        // Change the coin position using function below
        this.updateCoinPosition();
        
    },
    
    updateCoinPosition: function() {
        // Store all the possible coin positions in an array
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, // Top row
            {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
            {x: 130, y: 300}, {x: 370, y: 300}  // Bottom row
        ];
        
        // Remove the current coin position from the array
        // Otherwise the coin could appear at the same spot twice in a row
        for (var i = 0; i < coinPosition.length; i++){
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }
        
        // Randomly select a position from the array
        var newPos = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)]; 
            //use coinPosition.length - 1 in case the coin is in fact spliced above. Also makes it scalable
        
        // Set new position for coin
        this.coin.reset(newPos.x, newPos.y);
        
    },
    
    addEnemy: function() {
        // Get the first dead enemy of the group
        var enemy = this.enemies.getFirstDead();
        
        // If there isn't any dead enemy, do nothing
        if (!enemy) {
            return;
        }
        
        // Initialise the enemy
        enemy.anchor.setTo(0.5, 1);
        
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Utils.randomChoice(1, -1); 
            // THIS IS DEPRECIATED IN CURRENT VERSION. SHOULD BE: Phaser.Utils.randomChoice(1, -1);
        enemy.body.bounce.x = 1; // maintaining velocity in oposite direction when touching wall. 0.5 will slow down bounce
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
        
    },
    
    addMobileInputs: function(){
        // Add the jump button
        this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        this.jumpButton.alpha = 0.5;
        
        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        
        // Add the move left button
        this.leftButton = game.add.sprite(50, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        // Have movements be true when button is active (or hovered over?), for mobile
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        this.leftButton.alpha = 0.5;
        
        //Add the move right button
        this.rightButton = game.add.sprite(130, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
        this.rightButton.alpha = 0.5;
        
        
        // Call 'jumpPlayer' function when the 'jumpButton' is pressed
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
    },
    
    jumpPlayer: function() {
        // If the player is touching the ground
       
        
        if (this.player.body.onFloor()) {
            // Jump with sound
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
        
    },
    
    startMenu: function() {
        game.state.start('menu');
        
    },
    
};