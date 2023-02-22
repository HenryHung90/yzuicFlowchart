// 階段一:使用 spritesheet 載入圖片並且能夠印出來
// => sprite 圖片使用 
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: '#4488aa',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "container",
});

function preload() {
    // 使用 spritesheet 載入
    this.load.spritesheet('puzzle', '../media/img/Aus.jpg', {
        frameHeight: 300,
        frameWidth: 300,
    })
}

function create() {
    // 新增一個 Sprite 在場地上 [x位置,y位置,使用的圖片,第幾張]
    this.add.sprite(150, 150, 'puzzle', 0)
}

function update() {

}