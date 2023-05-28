// 階段三:讓生成的 4*4 卡牌皆為卡背，點擊時會變成正面
// => Phaser setFrame 使用、Phaser Interactive 使用
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
    // 用於儲存卡牌的 Id
    cardList: null,
    // 用於儲存點擊的第一張 card
    firstCard: null,
    // 用於儲存點擊的第二張 card
    secondCard: null,
    // 用於記錄點擊次數
    moves: 0,
    // 用於記錄是否完成（兩兩一對只要完成 row * col / 2 次配對，代表已完成）
    match: 0,
    winMatch: 0,
}

const boardInformation = {
    // 設定棋盤行數
    row: 4,
    // 設定棋盤列數
    col: 4,
    // 設定卡牌開始生成的 X 位置
    startX: 100,
    // 設定卡牌開始生成的 Y 位置
    startY: 100,
    // 設定每張卡牌的 X 間隔
    offsetX: 130,
    //設定每張卡牌的 Y 間隔
    offsetY: 170,
    // 用於是否鎖定棋盤（在選中卡片後會暫時鎖住棋盤避免重複點擊）
    lockBoard: false,
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

    // 將 cardList 內塞入兩兩一組的卡牌並且打亂
    // Phaser.Utils.Array.Shuffle() 該 function 能夠將傳入之陣列打亂並輸出為一個新的陣列
    cardInformation.cardList = Phaser.Utils.Array.Shuffle([
        2, 2, 4, 4,
        10, 10, 15, 15,
        30, 30, 36, 36,
        46, 46, 50, 50
    ])

    // 建立翻牌 依照設定的順序建立 row * col 的牌組陣列
    for (let i = 0; i < boardInformation.row; i++) {
        for (let j = 0; j < boardInformation.col; j++) {
            // 建立卡牌生成在指定位置
            let card = cardInformation.cards.create(
                boardInformation.startX + i * boardInformation.offsetX,
                boardInformation.startY + j * boardInformation.offsetY, "Cards", 56).setScale(0.3, 0.3)

            // 在每個 card 的 object 底下定義其 Id 為相對 cardList 上的 Id
            card.cardId = cardInformation.cardList[i + j * boardInformation.row]
            // 設定是否處於翻牌狀態
            card.flip = false
            // 設定該 card 具有互動功能
            card.setInteractive()
            // 設定該 card 在 pointer-up 時會觸發 flipCard 的 function
            card.on("pointerup", () => flipCard(card, this.tweens))
        }
    }

    // 列出所有牌組
    // 每組牌共有 13 張，因此每列 0 ~ 12 共 13 張
    // 四花色 + Joker 等特殊牌組共 5 行
    // for (let row = 0; row < 13; i++) {
    //     for (let col = 0; col < 5; j++) {
    //         cards.create(100 + i * 100, 100 + j * 140, "Cards", i + j * 13).setScale(0.25, 0.25);
    //     }
    // }
}

// 更新遊戲狀態
function update() {

}


// 翻牌函數
function flipCard(card, Tweens) {
    // 如果已鎖定棋盤或點擊的牌已翻過，則不執行任何動作
    if (boardInformation.lockBoard || card.flip) return

    // 在動畫過程中 持續鎖定棋盤
    boardInformation.lockBoard = true
    card.flip = true;
    card.setFrame(card.cardId)
    boardInformation.lockBoard = false
    
}