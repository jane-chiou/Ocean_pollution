// board的變數
let board;
let boardwidth = 1000;// 320
let boardheight = 562;// 640 562
let context;
// 主角變數
let birdwidth = 51;// 34 51
let birdheight = 36;// 24 36
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let birdImg;

let bird = {
    x : birdx, y : birdy, width : birdwidth, height : birdheight
}

let hbwidth = 300;
let hbheight = 30;
let hbx = boardwidth / 16;
let hby = boardheight / 32;
let hbImg;

let hb = {
    x : hbx, y : hby, width : hbwidth, height : hbheight
}

let linewidth = 300;
let lineheight = 30;
let linex = boardwidth / 16;
let liney = boardheight / 32;
let lineImg;

let line = {
    x : linex, y : liney, width : linewidth, height : lineheight
}

// 水管變數
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;

let randompipey = 0; //pipey - pipeheight / 4 - Math.random()*(pipeheight / 1.75);
let openingspace = 0; //board.height / 4;

let toppipeImg;
let bottompipeImg;

// 水管向左飄移速度
let velocityx = -4;

// 鳥的跳動速度
let velocityy = 0;

//let gravity = 0.4;

let gameover = false;

let hp = 10;
let Invincibletime = false;// 受擊保護時間判定

let score = 0;

//let isMoving = false;// 判斷是不是在按下按鍵後的0.5秒內
let isKeyPressed = false;// 判斷是否按住按鍵
let keyPressStart = 0;// 按鍵按下的開始時間

let isPaused = false;// 控制水管暫停生成，我要用來做放題目的格子

let currentQuestionIndex = 0;

let truearray = [];
let trueImages = [];
let trueImage;

let trueX = boardwidth;// + 80 + 1290 + 330; // 圖片的初始 x 座標（從右側出現）
let trueY = 0;//randompipey; // 圖片的 y 座標200
let trueWidth = 10; // 圖片的寬度430
//let trueHeight = openingspace / 2; // 圖片的高度155

let falsearray = [];
let falseImages = [];
let falseImage;

let falseX = boardwidth;// + 80 + 1290 + 330; // 圖片的初始 x 座標（從右側出現）
let falseY = 0;//randompipey + openingspace / 2; // 圖片的 y 座標395
let falseWidth = 10; // 圖片的寬度430
//let falseHeight = openingspace / 2; // 圖片的高度352

let questionarray = [];
let questionImages = [];

let imageX = boardwidth + 80; // 圖片的初始 x 座標（從右側出現）
let imageY = 0; // 圖片的 y 座標
let imageWidth = 430 * 4; // 圖片的寬度430
let imageHeight = boardheight; // 圖片的高度352

// 題目照片
let question1Image;
let question2Image;
let question3Image;
let question4Image;
let question5Image;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");// 決定繪圖方式

    // 畫出主角
    // 加入照片的部分在11:02
    //context.fillStyle = "yellow";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);
    hbImg = new Image(); 
    hbImg.src = "./hb.png";// 照片之後加  
    hbImg.onload = function(){
        context.drawImage(hbImg, hb.x, hb.y, hb.width, hb.height);
    }

    lineImg = new Image(); 
    lineImg.src = "./line.png";// 照片之後加  
    lineImg.onload = function(){
        context.drawImage(lineImg, line.x, line.y, line.width, line.height);
    }

    birdImg = new Image();
    birdImg.src = "./OceanGate.png";// 照片之後加
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeImg = new Image();
    toppipeImg.src = "./top_pipe.png";// 照片之後加

    bottompipeImg = new Image();
    bottompipeImg.src = "./bottom_pipe.png";

    question1Image = new Image();
    question1Image.src = "./question1.png";
    questionImages.push(question1Image);

    question2Image = new Image();
    question2Image.src = "./question2.png";
    questionImages.push(question2Image);

    question3Image = new Image();
    question3Image.src = "./question3.png";
    questionImages.push(question3Image);

    question4Image = new Image();
    question4Image.src = "./question4.png";
    questionImages.push(question4Image);

    question5Image = new Image();
    question5Image.src = "./question5.png";
    questionImages.push(question5Image);

    trueImage = new Image();
    trueImage.src = "./cat.png";
    //trueImage.onload = function(){
        trueImages.push(trueImage);
    //}

    falseImage = new Image();
    falseImage.src = "./cat1.png";
    //falseImage.onload = function(){
        falseImages.push(falseImage);
    //}

    requestAnimationFrame(update);
    setInterval(placepipes, 900);// 每1.5秒放一根水管
    setInterval(togglePause, 7200);// 讓水管每6000停止生成一段時間
    setInterval(questionAppear, 7200);
    //setInterval(answerAppear, 7200);
    
    document.addEventListener("keydown", movebird);
}

function update() {
    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);
    if(gameover){
        context.fillStyle = "Black";
        context.font = "100px sans-serif";
        context.fillText("GAME OVER", 180, 270);
        context.fillText("Your score: ", 170, 360);
        context.fillText(score, 720, 365);
        return;
    }

    for(let i = 0; i < questionarray.length; i++){
        let question = questionarray[i];
        question.x += velocityx;
        context.drawImage(question.img, question.x, question.y, question.width, question.height);

        let isQuestion3 = question.img === question3Image; // 檢查當前題目是否為第三題

        if(i < truearray.length){
            let truee = truearray[i];
            truee.x += velocityx;
            context.drawImage(truee.img, truee.x, truee.y, truee.width, truee.height);

            if(detectCollision(bird, truee) && Invincibletime == false){
                if(isQuestion3){// 因為第三題答案是false所以判定要反過來
                    hp -= 3;
                    score -= 7;
                    hb.width -= 90;
                    
                }
                else{
                    score += 7;
                    if(hp <= 7){
                        hp += 3;
                        hb.width = hp * 30;// 用hbwidth不行
                    }
                    else {
                        hp = 10;
                        hb.width = 300;
                    }
                }

                Invincibletime = true;
                if(hp == 0 || score < 0){
                    gameover = true;
                }
            }
        }

        if(i < falsearray.length){
            let falsee = falsearray[i];
            falsee.x += velocityx;
            context.drawImage(falsee.img, falsee.x, falsee.y, falsee.width, falsee.height);

            if(detectCollision(bird, falsee)  && Invincibletime == false){
                if(isQuestion3){
                    score += 7;
                    if(hp <= 7){
                        hp += 3;
                        
                        hb.width = hp * 30;// 用hbwidth不行
                    }
                    else {
                        hp = 10;
                        hb.width = 300;
                    }
                    
                }
                else{
                    hp -= 3;
                    score -= 7;
                    hb.width -= 90;// 用hbwidth不行
                }

                Invincibletime = true;
                if(hp == 0 || score < 0){
                    gameover = true;
                }
            }
        }
    }
    while(questionarray.length > 0 && questionarray[0].x < -imageWidth){
        questionarray.shift();
        truearray.shift();
        falsearray.shift();
    }
    
    // 主角
    //velocityy += gravity;
    bird.y = Math.max(bird.y + velocityy, 0);// 0是畫布的最頂端
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);// birdImg

    // 掉下去直接死
    if(bird.y > board.height){
        hp = 0;
        //Invincibletime = true;
        if(hp == 0 || score < 0){
            gameover = true;
        }
    }

    // 水管
    for(let i = 0; i < pipearray.length; i++){
        let pipe = pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);// pipe.img

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            Invincibletime = false;// 用一個水管滑過的時間來定義受擊保護時間的時長
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe) && Invincibletime == false){
            hp--;
            hb.width -= 30;// 用hbwidth不行
            Invincibletime = true;
            if(hp == 0 || score < 0){
                gameover = true;
            }
        }
    }

    // 清除陣列中已經滑出board外的水管
    while(pipearray.length > 0 && pipearray[0].x < -pipewidth){
        pipearray.shift();
    }

    // hb的背景，還附帶空血槽功能，酷
    context.fillStyle = "DarkRed";
    context.fillRect(hb.x - 50, hb.y - 1, hbwidth + 51, hbheight + 2);
    // hb
    context.drawImage(hbImg, hb.x, hb.y, hb.width, hb.height);
    // line
    context.drawImage(lineImg, line.x, line.y, line.width, line.height);

    context.fillStyle = "White";
    context.font = "30px sans-serif";
    context.fillText("HP|", 15, 44);

    // 分數
    context.fillStyle = "Black";
    context.font = "40px sans-serif";
    context.fillText("Score: ", 15, 100);
    context.fillText(score, 135, 100);// 分數、離board左邊的距離、離board上方邊邊的距離

    context.fillStyle = "Black";
    context.font = "40px sans-serif";
    //context.fillText(hp, 50, 100);
}

function questionAppear() {
    if(gameover || isPaused == false){
        return;
    }

    let selectedImage = questionImages[currentQuestionIndex];
    let question = {
        img : selectedImage,
        x : imageX, 
        y : imageY, 
        width : imageWidth,// 672
        height : imageHeight,// 384
        //passed : false
    }

    questionarray.push(question);

    //let selectedImage0 = trueImages[currentQuestionIndex];
    let truee = {
        img : trueImages[0],
        x : imageX + 1710, 
        y : 0,
        width : trueWidth,
        height : 261
    }

    truearray.push(truee);

    //let selectedImage1 = falseImages[currentQuestionIndex];
    let falsee = {
        img : falseImages[0],
        x : imageX + 1710, 
        y : 301,
        width : falseWidth,
        height : 261
    }

    falsearray.push(falsee);
    
    currentQuestionIndex = (currentQuestionIndex + 1) % questionImages.length;
}

// 切換狀態的函式
function togglePause() {
    isPaused = !isPaused;
}

function placepipes() {
    if(gameover || isPaused){
        return;
    }

    randompipey = pipey - pipeheight / 4 - Math.random()*(pipeheight / 1.75);
    openingspace = board.height / 4;

    let toppipe = {
        img : toppipeImg,
        x : pipex, 
        y : randompipey, 
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(toppipe);

    let bottompipe = {
        img : bottompipeImg,
        x : pipex, 
        y : randompipey + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(bottompipe);

    //questionAppear(randompipey, openingspace);
}

document.addEventListener("keydown", function(e) {
    if (!isKeyPressed && (e.code === "KeyW" || e.code === "ArrowUp" || e.code === "KeyS" || e.code === "ArrowDown")) {
        isKeyPressed = true;  // 標記按鍵已按下
        keyPressStart = Date.now();  // 記錄按下的時間戳

        // 根據按鍵方向設置初始速度方向
        if (e.code === "KeyW" || e.code === "ArrowUp") {
            velocityy = -6;  // 初始向上速度
        } else if (e.code === "KeyS" || e.code === "ArrowDown") {
            velocityy = 6;   // 初始向下速度
        }
    }
});

document.addEventListener("keyup", function(e) {
    if (isKeyPressed && (e.code === "KeyW" || e.code === "ArrowUp" || e.code === "KeyS" || e.code === "ArrowDown")) {
        isKeyPressed = false;  // 標記按鍵已釋放
       
        // 設置延遲清零機制，讓鳥保持運動一段時間後停止
        setTimeout(() => {
            velocityy = 0;  // 速度清零
        });  // 運動時間和按住時長成正比, pressDuration * 1
    }
});


function movebird(e){
    if(e.code == "KeyW" || e.code == "ArrowUp"){
        // 鳥的y軸為零，往上是負往下為正
        
            velocityy = -6;
            //gravity = 0.4;
        
        //bird.y += velocityy;

        if(gameover){
            bird.y = birdy;
            pipearray = [];
            questionarray = [];
            truearray = [];
            falsearray = [];
            isPaused = false;
            score = 0;
            gameover = false;
            hp = 10;
            hb.width = 300;
        }
    }
    else if(e.code == "KeyS" || e.code == "ArrowDown"){
        // 鳥的y軸為零，往上是負往下為正
       
            velocityy = +6;
            //gravity = 0.4;
        
        //bird.y += 60;
        //bird.y += velocityy;

        if(gameover){
            bird.y = birdy;
            pipearray = [];
            questionarray = [];
            truearray = [];
            falsearray = [];
            isPaused = false;
            score = 0;
            gameover = false;
            hp = 10;
            hb.width = 300;
        }
    }
    else{
        return;
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && a.x + a.width > b.x
        && a.y < b.y + b.height && a.y + a.height > b.y;
}