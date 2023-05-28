// 階段一:列印出所有卡牌並整齊排列
// => sprite 圖片使用、scale 使用
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 750,
    backgroundColor: '#4488aa',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: "container",
});

// 定義遊戲變數
const cardInformation = {
    // 用於儲存遊戲內的 card
    cards: null,
}

function preload() {
    // 預載圖片
    // 0 ~ 12 為黑桃 A ~ K
    // 13 ~ 25 為愛心 A ~ K
    // 26 ~ 38 為菱形 A ~ K
    // 39 ~ 51 為梅花 A ~ K
    // 52 藍藍怪怪卡
    // 53、54 為 Joker
    // 55 白卡
    // 56 卡背
    this.load.spritesheet('Cards', '../media/img/PockerCard.png', {
        frameWidth: 389.5,
        frameHeight: 569.6
    })
}
function create() {
    // 將 cards 設為 phaser 的 group
    cardInformation.cards = this.add.group()

    // 列出所有牌組
    // 每組牌共有 13 張，因此每列 0 ~ 12 共 13 張
    // 四花色 + Joker 等特殊牌組共 5 行
    for (let row = 0; row < 13; row++) {
        for (let col = 0; col < 5; col++) {
            cardInformation.cards.create(100 + row * 100, 100 + col * 140, "Cards", row + col * 13).setScale(0.25, 0.25);
        }
    }
}

// 更新遊戲狀態
function update() {

}