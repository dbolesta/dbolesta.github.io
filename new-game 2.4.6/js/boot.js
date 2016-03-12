var bootState = {
    
    preload: function() {
        // Load the image
        game.load.image('progressBar', 'assets/progressBar.png');
    },
    
    create: function() {
        // Set some game settings
        game.stage.backgroundColor = "#3498db";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // If the device is not a desktop, it's a mobile device. So we need to scale
        if (!game.device.desktop) {
            // Set the type of scaling to 'show all' (no distortion)
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            // Add a blue color to the page, to hide the white 
            document.body.style.backgroundColor = '#3498db';
            
            // Set the min and max width/height of the game
            game.scale.minWidth = 250;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 1000;
            game.scale.maxHeight = 680;
        
            
            // Center the game on the screen
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        
            // !!!!!! After 2.2, some weird scaling issue occured where bottom would cut off
            // Use this line to keep bottom of game a visual constrant
            game.scale.windowConstraints.bottom = "visual";
            
            // Apply the scale changes
            //game.scale.setScreenSize(true);
            game.scale.updateLayout(true);
                // SETSCREENSIZE HAS BEEN DEPRECIATED. USE updateLayout INSTEAD!!!!!
            
        }
        
        game.state.start('load');
    }
    
};