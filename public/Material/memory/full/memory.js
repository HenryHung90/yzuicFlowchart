// 階段一: 列印出所有卡牌並整齊排列
// => sprite 使用, scale
// 階段二: 利用預設 array 生成隨機 4*4 的卡牌(兩兩成對的8副牌)
// => Phaser Shuffle 使用, 程式邏輯
// 階段三: 讓生成的 4*4 卡牌皆為卡背，點擊時會變成正面
// => Phaser setFrame, Phaser Interactive, Object 應用
// 階段四: 點擊兩張卡牌後程式會做比對，正確會保持正面，錯誤則會翻回卡背 並且在比對時鎖定牌面，不能點擊其他卡牌
// => 程式邏輯, 程式切割
// 階段五: 程式能夠判斷是否完成遊戲，並將翻牌加入動畫
// => 程式規劃、程式邏輯、Phaser timeline


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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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

    //初始化勝利的 Match 數量（兩兩一對只要完成 row * col / 2 次配對，代表已完成）
    cardInformation.winMatch = boardInformation.row * boardInformation.col / 2

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
    // 將牌翻面並增加移動次數
    card.flip = true;
    cardInformation.moves++;

    // 如果是第一張牌，將其儲存在 firstCard 變數中
    if (!cardInformation.firstCard) {
        cardInformation.firstCard = card
        // 設定並執行補間動畫
        Tweens.timeline({
            // 設定對象為點擊的 card
            targets: card,
            // 設定 ease 的效果
            ease: 'Power2',
            // 設定要重複幾次
            loop: 0,
            // 設定動畫鏈接
            tweens: [
                {
                    scale: 0.35,
                    duration: 200,

                },
                {
                    scaleX: 0,
                    duration: 200,
                    //該步驟結束時 將卡牌的 frame 設定該 cardId 的牌面
                    onComplete: () => {
                        card.setFrame(card.cardId)
                    }
                },
                {
                    scaleX: 0.35,
                    duration: 200,
                },
                {
                    scale: 0.3,
                    duration: 300,
                    //補間動畫結束後，解鎖棋盤
                    onComplete: () => {
                        boardInformation.lockBoard = false
                    }
                }
            ]
        })
        // 跳出程式
        return
    }

    // 如果是第二張牌，將其儲存在 secondCard 變數中
    cardInformation.secondCard = card;
    Tweens.timeline({
        targets: card,
        ease: 'Power2',
        loop: 0,
        tweens: [
            {
                scale: 0.35,
                duration: 200,

            },
            {
                scaleX: 0,
                duration: 200,
                onComplete: () => {
                    //該步驟結束時 將卡牌的 frame 設定該 cardId 的牌面
                    card.setFrame(card.cardId)
                }
            },
            {
                scaleX: 0.35,
                duration: 200,
            },
            {
                scale: 0.3,
                duration: 200,
                //補間動畫結束後，確認兩張卡牌是否相同
                onComplete: () => {
                    checkCard(cardInformation.firstCard, cardInformation.secondCard, Tweens)
                }
            }
        ]
    })
}

// 檢查卡牌
function checkCard(firstCard, secondCard, Tweens) {
    // 若兩張牌 cardId 不同，則鎖定棋盤一段時間並重置 firstCard 和 secondCard
    if (firstCard.cardId !== secondCard.cardId) {
        Tweens.timeline({
            //同時指定兩個物件進行補間動畫
            targets: [firstCard, secondCard],
            ease: 'Power2',
            loop: 0,
            tweens: [
                {
                    scale: 0.35,
                    duration: 200,
                    delay: 500,

                },
                {
                    scaleX: 0,
                    duration: 200,
                    // 此步驟時將兩張卡牌的牌面換成卡背的樣式
                    onComplete: () => {
                        firstCard.setFrame(56)
                        secondCard.setFrame(56)
                    }
                },
                {
                    scaleX: 0.35,
                    duration: 200,
                },
                {
                    scale: 0.3,
                    duration: 200,
                    // 此步驟時將兩張卡牌的 flip 改回 false
                    // 將紀錄的 firstCard secondCard 清空並解鎖棋盤
                    onComplete: () => {
                        firstCard.flip = false
                        secondCard.flip = false
                        cardInformation.firstCard = null
                        cardInformation.secondCard = null
                        boardInformation.lockBoard = false
                    }
                }
            ]
        })
        return
    }
    // 如果這兩張牌的 cardId 相同，則增加匹配次數
    cardInformation.match++
    Tweens.timeline({
        targets: [firstCard, secondCard],
        ease: 'Power2',
        loop: 2,
        tweens: [
            {
                scale: 0.35,
                duration: 100,
            },
            {
                scale: 0.3,
                duration: 100,
            }
        ],
        onComplete: () => {
            cardInformation.firstCard = null
            cardInformation.secondCard = null
            boardInformation.lockBoard = false
            // 如果已經完成所有匹配，顯示遊戲結束訊息
            if (cardInformation.match === cardInformation.winMatch) {
                window.alert("遊戲結束！您用了 " + cardInformation.moves + " 次移動完成所有匹配。");
            }
        }
    })

   

}