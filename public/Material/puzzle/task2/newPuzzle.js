// 階段二:能夠讓程式隨機打印其中一張 sprite
// => JS Random 使用 
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

//定義遊戲變數
const puzzleInformation = {
    // 每一個 puzzle 的大小
    scale: {
        width: 300,
        height: 300,
    },
    // 用於儲存在遊戲中的 crop
    crop: null
}


function preload() {
    this.load.spritesheet('puzzle', '../media/img/Aus.jpg', {
        frameHeight: puzzleInformation.scale.height,
        frameWidth: puzzleInformation.scale.width,
    })
}
function create() {
    //將 crop 設為 Phaser 的群組
    puzzleInformation.crop = this.add.group()

    // 隨機從 0 ~ 8 選擇一塊生成
    let randomPick = Math.floor(Math.random() * 9)


    // 則生成該 puzzle
    // 使用 group 時 使用 create 建立資料
    puzzleInformation.crop.create(150, 150, 'puzzle', randomPick)
}

function update() {

}