var canvas;
var context;
var isWhite = true;//设置是否该轮到白棋
var isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
var img_b = new Image();
//白棋图片
img_b.src = "images/b.png";
var img_w = new Image();
//黑棋图片
img_w.src = "images/w.png";
var lastChess ;
var chessData;//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
function initChessData(){
    chessData = new Array(16);
    for (var x = 0; x < 16; x++) {
        chessData[x] = new Array(16);
        for (var y = 0; y < 16; y++) {
            chessData[x][y] = 0;
        }
    }
}
//初始化棋盘
function drawBoard() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    for (var i = 0; i <= 640; i += 40) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(640, i);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, 640);
        context.closePath();
        context.stroke();
    }
    initChessData();
}
function play(e) {
    var x = parseInt((e.clientX - 20) / 40);
    var y = parseInt((e.clientY - 20)/ 40);
    if (chessData[x][y] != 0) {
        alert("不能在这个位置下棋");
        return;
    }
    document.getElementById("cancel").disabled=true;
    if (isWhite) {
        isWhite = false;
        drawChess(1, x, y);
        lastChess = [1, x, y];
    }
    else {
        isWhite = true;
        drawChess(2, x, y);
        lastChess = [2, x, y];
    }
}
function drawChess(chess, x, y) {//参数为，棋（1为白棋，2为黑棋），数组位置
    if (isWell == true) {
        alert("已经结束了，如果需要重新玩，请点击重新开始或者刷新");
        return;
    }
    if (x >= 0 && x <= 15 && y >= 0 && y <= 15) {
        if (chess == 1) {
            context.drawImage(img_w, x * 40 + 20 , y * 40 + 20 );//绘制白棋
            chessData[x][y] = 1;
        }
        else {
            context.drawImage(img_b, x * 40 + 20 , y * 40 + 20 );
            chessData[x][y] = 2;
        }
        judge(x, y, chess);
    }
}
//悔棋
function takeBack(){
    if(lastChess.length == 3){
        if(confirm(lastChess[0] == 1 ? "白棋确定要悔棋吗？" :"黑棋确定要悔棋吗？")){
            context.clearRect(lastChess[1] * 40 + 20, lastChess[2] * 40 + 20, 36, 36);
            context.beginPath();
            context.moveTo(lastChess[1] * 40 + 40, lastChess[2] * 40 + 20);
            context.lineTo(lastChess[1] * 40 + 40, lastChess[2] * 40 + 60);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(lastChess[1] * 40 + 20, lastChess[2] * 40 + 40);
            context.lineTo(lastChess[1] * 40 + 60, lastChess[2] * 40 + 40);
            context.closePath();
            context.stroke();
            chessData[lastChess[1]][lastChess[2]] = 0;
            document.getElementById("cancel").disabled=false;
            isWhite = lastChess[0] == 1;
        }
    }else{
        alert("您还没有下棋，不能悔棋！");
    }
}
//撤销悔棋
function cancel(){
    if(lastChess.length == 3){
        if(lastChess[0] == 1 && confirm("白棋确定要撤销悔棋吗？")){
            context.drawImage(img_w, lastChess[1] * 40 + 20, lastChess[2] * 40 + 20);
            chessData[lastChess[1]][lastChess[2]] = 1;
            document.getElementById("cancel").disabled=true;
            isWhite = false;
        }
        else if(lastChess[0] == 2 && confirm("黑棋确定要撤销悔棋吗？")){
            context.drawImage(img_b, lastChess[1] * 40 + 20, lastChess[2] * 40 + 20);
            chessData[lastChess[1]][lastChess[2]] = 2;
            document.getElementById("cancel").disabled=true;
            isWhite = true;
        }
    }else{
        alert("不能撤销悔棋！");
    }
}
//重新开始
function reset(){
    context.clearRect(20, 20, 640, 640);
    drawBoard();
    initChessData();
    isWell = false;
    lastChess = [];
}
//判断棋局
function judge(x, y, chess) {
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
//左右判断
    for (var i = x; i >= 0; i--) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    for (var i = x + 1; i <= 15; i++) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
//上下判断
    for (var i = y; i >= 0; i--) {
        if (chessData[x][i]!= chess) {
            break;
        }
        count2++;
    }
    for (var i = y + 1; i <= 15; i++) {
        if (chessData[x][i]!= chess) {
            break;
        }
        count2++;
    }
//左上右下判断
    for (var i = x, j = y; i >= 0&&j >= 0; i--, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    for (var i = x + 1, j = y + 1; i <= 15&&j <= 15; i++, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
//右上左下判断
    for (var i = x, j = y; i >= 0&&j <= 15; i--, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; i < 15&&j >= 0; i++, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {
        if (chess == 1) {
            alert("白棋赢了");
        }
        else {
            alert("黑棋赢了");
        }
        isWell = true;//设置该局棋盘已经赢了，不可以再走了
        document.getElementById("takeBack").disabled=true;
    }
}