// Initialise Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');


// Define new global variable (as property of game.global object?)
game.global = {
    score: 0
};

// Add all the states (every state gets its own .js file?)
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);


// And finally we tell Phaser to add and start our 'main' state
game.state.start('boot');