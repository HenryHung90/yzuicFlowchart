console.log("------------------------")
            console.log("Phaser is running now !!!")
            console.log("------------------------")
            //global variable writing here



            //config
            //Config writing here
let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent:'container',
};
let game = new Phaser.Game(config);

            //preload function
            //function preload writing here
function preload(){

}

            //create function
            //function create writing here
function create(){

}

            //update function
            //function update writing here
function update(){

}

            //custom function
            //all custom function writing here

            