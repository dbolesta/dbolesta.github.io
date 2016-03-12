var menuState = {
    
    create: function() {
        // Add a background image preloaded from load.js
        // Added first because Z-Index is cascading
        game.add.image(0, 0, 'background');
        
        //Display the name of the game
        var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box',
            { font: '70px Geo', fill: '#ffffff' }); // y was 80 before tween
        nameLabel.anchor.setTo(0.5, 0.5);
        
         /* tween the name label */
         // create a tween on the label
            // var tween = game.add.tween(nameLabel);
         // change the y position of the label to 80, in 1000 ms
            // tween.to({y: 80}, 1000);
            // tween.start();
        
        /* above code in one line, adding the easing function */
        game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Exponential.Out).start();
        
        
        
        
        // Show the score at the center of the screen
            // game.global.score is used because score is a global variable, defined in game.js
        // use text variable to display both best and current score in one swing
        var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
            { font: '25px Arial', fill: '#ffffff' });
        scoreLabel.anchor.setTo(0.5, 0.5);
        
        // Explain how to start the game (instructions)
        // Store the relevent text based on the devide used 
        if (game.device.desktop) {
            var text = 'press the up arrow to start';
        }
        else {
            var text = 'touch the screen to start';
        }
        var startLabel = game.add.text(game.world.centerX, game.world.height - 80, text,
            { font: '25px Arial', fill: '#fff' });
        startLabel.anchor.setTo(0.5, 0.5);
        
         /* tween the start Label */
        game.add.tween(startLabel).to({angle: 2}, 500).to({angle: -2}, 500).loop().start();
        
        
        
        // Create new Phaser keyboard variable: the up arrow key
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        // When the 'upKey' is pressed, it will call the 'start' function once
        upKey.onDown.addOnce(this.start, this);
        // Add option for mobile, to call 'start' function when finger taps (prevent mouse click by checking device)
        if (!game.device.desktop) {
            game.input.onDown.addOnce(this.start, this);
        }
        
        
        // Create a Best Score
        // If 'bestScore' is not defined
        // It means that this is the first time the game is played
        if (!localStorage.getItem('bestScore')) {
            // Then set the best score to 0
            localStorage.setItem('bestScore', 0);
        }
        
        if (game.global.score > localStorage.getItem('bestScore')) {
            // Then update the best score
            localStorage.setItem('bestScore', game.global.score);
        }
        
        
        // Add mute button to menu
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        if (game.sound.mute) {
            // If game is muted, make default frame the 'off' image
            this.muteButton.frame = 1;
        }
        // If mouse is over the button, it becomes a hand cursor
        this.muteButton.input.useHandCursor = true;
        
        // Damon music cause why not
        /* ADD TO A FUNCTION MAYBE TO CONTROL IT
        this.music = game.add.audio('music');
        this.music.volume = 0.1;
        var makeItStop = 0;
        if (makeItStop == 0){
           this.music.play(); 
           makeItStop++;
            console.log(makeItStop);
        }
        */
        
        
        
    },
    
    // Function called when the 'muteButton' is pressed
    toggleSound: function() {
        // Switch the Phaser sound variable from true to false, or false to true
        // When 'game.sound.mute = true', Phaser will mute the game
        game.sound.mute = ! game.sound.mute;
        
        // Change the frame of the button
        this.muteButton.frame = game.sound.mute ? 1: 0;
        
    },
    
    start: function() {
        // Start the actual game
        game.state.start('play');
    },
    
    
    
}