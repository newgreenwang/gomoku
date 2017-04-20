/**
 * Created by wangfan on 2017/4/5.
 */
var isWhite = true;//设置是否该轮到白棋
var isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
var lastChess ;
var chessData;//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的

//初始化棋盘
function drawBoard() {
    chessData = new Array(16);
    //broad = document.getElementById("broad");
    var tr = "";
    for (var x = 0; x < 16; x++) {
        chessData[x] = new Array(16);
        for (var y = 0; y < 16; y++) {
            chessData[x][y] = 0;
            tr += '<td id=' + y + '_' + x+'></td>';
        }
        tr +='</tr>';
    }
    document.getElementById("broad").innerHTML = tr;
}

function play(e) {
    var ids = e.target.id.split("_");
    var x = parseInt(ids[0]);
    var y = parseInt(ids[1]);
    if (chessData[x][y] != 0) {
        alert("不能在这个位置下棋");
        return;
    }
    document.getElementById("cancel").disabled=true;
    if (isWhite) {
        isWhite = false;
        drawChess(1, x, y);
    }
    else {
        isWhite = true;
        drawChess(2,x,y);
    }

}
function drawChess(chess, x, y) {//参数为，棋（1为白棋，2为黑棋），数组位置
    if (isWell == true) {
        alert("已经结束了，如果需要重新玩，请点击重新开始或者刷新");
        return;
    }
    if (x >= 0 && x < 16 && y >= 0 && y < 16) {
        if (chess == 1) {
            //绘制白棋
            document.getElementById(x+"_"+y).style.background = 'url(images/w.png) no-repeat scroll center center';
            chessData[x][y] = 1;
        }
        else {
            //绘制黑棋
            document.getElementById(x+"_"+y).style.background = 'url(images/b.png) no-repeat scroll center center';
            chessData[x][y] = 2;
        }
        lastChess = [chess, x, y];
        judge(x, y, chess);
    }
}

//悔棋
function takeBack(){
    if(lastChess.length == 3){
        if(confirm(lastChess[0] == 1 ? "白棋确定要悔棋吗？" :"黑棋确定要悔棋吗？")){
            document.getElementById(lastChess[1]+"_"+lastChess[2]).style.background = '';
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
            document.getElementById(lastChess[1]+"_"+lastChess[2]).style.background = 'url(images/w.png) no-repeat scroll center center';
            chessData[lastChess[1]][lastChess[2]] = 1;
            document.getElementById("cancel").disabled=true;
            isWhite = false;
        }
        else if(lastChess[0] == 2 && confirm("黑棋确定要撤销悔棋吗？")){
            document.getElementById(lastChess[1]+"_"+lastChess[2]).style.background = 'url(images/b.png) no-repeat scroll center center';
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
    drawBoard();
    isWell = false;
    document.getElementById("takeBack").disabled=false;
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
    for (var i = x, j = y; i >= 0 &&j >= 0; i--, j--) {
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
    for (var i = x, j = y; i >= 0&& j <= 15; i--, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; i <= 15&&j >= 0; i++, j--) {
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

