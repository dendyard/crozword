// let base_url = 'http://localhost:8888/apisdecolgen/';

if (window.location.hostname == 'localhost') {
    base_url = 'http://localhost:8888/crozword_backend/';
}else{
     base_url = 'https://croz.ompaseries.xyz/';    
}

let uname_active = '-'
let gameid_active = 1;
let active_board_for_all = '';
let premium_user = 0;

var boardcol = 0;
var boardrow = 0;
var boardboxsize = 24;

let board_set = [];
let mendatar_list = [];
let menurun_list = [];
let jwb_hor = [];
let jwb_ver = [];

let onedgedelete = false;
let board_map = [];

let questpost = 0;
let questorient = 'hor';
let activebox = '';
let active_quest = [];
let active_jwb = [];

let cursorbox;
let activestiles = [];
let cpos = 0;
let submitrequest = false;
let arrboardgame = [];
let arrboardgame_curr = 0;

let game_user_active = '0129-dendy';

const findValue = (list, number) => {
    const item = list.find(entry => entry[0] === number);
    return item ? list.indexOf(item) : null; // Kembalikan null jika tidak ditemukan
};

const findQuestionValue = (list, number) => {
    const item = list.find(entry => entry[0] === number);
    return item ? list.indexOf(item) : null; // Kembalikan null jika tidak ditemukan
};

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// let qparamlevel = getParameterByName('v'); // "lorem"
// if (qparamlevel != null) {
//     //Check board load
//     gameid_active = qparamlevel;
// }

gameplay.style.display = 'none';
statusq.style.display = 'none';
boardnum.style.display = 'none';
qdisp.style.display = 'none';
magnifybox.style.display = 'none';
ckeyboard.style.display = 'none';

gameinitstart();

function gameinitstart(){
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has('uid')) {
        uname_active = searchParams.get('uid');
        premium_user = searchParams.get('sub');
        // console.log(premium_user);
        getboardinfo();
    }else{
        //User not logged in
        nologinuser.style.display = 'block';
    }
    //getboardinfo();
}
function getboardinfo() {
    var mydata = {
        idgame: '',
        actmonth: '04',
        uname: uname_active,
    };

    $.ajax({
        url: base_url + "index.php/adv/boardinfo",
        type: "POST",
        data: mydata,
        dataType: "JSON",
        success: function(response) {
            boardinffill(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Gagal menyimpan, refresh browser')
        }
    });  
}

function boardinffill(r){
    let pastboard = false;
    let tempbrd = '';
    let cwinfotemp = '';
    let prgcolor;

    infotts.innerHTML = '<h1 id="brdtittle">Croz/Word minggu ini</h1>';
    for (let i=0; i<r.length; i++) {
        arrboardgame.push(r[i].idgame);
        
        if (r[i].prggame == 0) {
            prgcolor = "#D9D9D9";
        }else if (r[i].prggame > 0 && r[i].prggame < 100) {
            prgcolor = "#E55225";
        }else if (r[i].prggame == 100) {
            prgcolor = "#00F076";
        }
        
        infotts.innerHTML += "<div class=cardboard id='card" + r[i].idgame +  "'><div class=brdpic><img src='board/" + r[i].idgame + ".png' id='boardpic'></div><div class='brdinfo'><div class='brdname' id='cwname" + r[i].idgame +  "'>Board " + r[i].idgame +  "</div><div class=brdinfo id='cwinfo" + r[i].idgame + "'>" + r[i].ttsinfo +  "</div><div class=brdprog><div class=prgbox><div class=prgval style='width:" + r[i].prggame +  "%; background-color:" + prgcolor + " !important;'></div></div><div class=prgtext id='prgtext" + r[i].idgame + "'>" + (r[i].prggame != null ? r[i].prggame : '0') + "%</div></div></div><div class=brdbutton><img src='images/brdarrow.svg' class=brdarr></div></div>";
        if (r.length > 1) {
            if (!pastboard) { infotts.innerHTML += "<h1 id='brdpast'>Croz/Word sebelumnya</h1>"; pastboard = true; active_board_for_all = r[i].idgame }
        }
    }
    
    document.querySelectorAll('.cardboard').forEach(box => 
      box.addEventListener('click', () => {brdtittle
        let prginfo = "Ayo taklukkan Croz/Word ini!";
        tempbrd = box.id;

        gameid_active = tempbrd.substr(4, tempbrd.length);
        
        if (document.getElementById('prgtext' + gameid_active).innerHTML != "0%") {
            prginfo = "Kamu menaklukkan " + document.getElementById('prgtext' + gameid_active).innerHTML + "<br>dari Croz/Word ini!"; 
        }
        
        cwinfotemp = document.getElementById('cwname' + gameid_active).innerHTML + ", " +document.getElementById('cwinfo' + gameid_active).innerHTML;
        brdtittlepop.innerHTML = "<h1 id=brdtittle class=confboxplay><span id=brdconss>Mainkan <br></span>" + cwinfotemp + "?</h1><div id='prgconf'>" + prginfo + "</div>"
        
        // console.log(cwinfotemp)
        if ((gameid_active != active_board_for_all) && (premium_user != '1')) {
            //console.log('user free');
            showsubscribepopup();
            
        }else{
            btnclick.currentTime = 0;
            btnclick.play();
            openconfirmationbox();
        }
      })
    );

    boardpic.src = 'board/'  + arrboardgame[arrboardgame_curr] + ".png";
    gameid_active = arrboardgame[arrboardgame_curr];
}

TweenMax.to(modalnonprem, 0, {alpha: 0, scale:.7, y:10, ease: Expo.easeOut});
function showsubscribepopup(){
    nonpremium.currentTime = 0;
    nonpremium.play();
    nonprem.style.display = 'block';
    TweenMax.to(modalnonprem, .3, {alpha: 1, scale:1, y:0, ease: Expo.easeOut});
}

conyesnonprem.addEventListener('click', ()=>{
    TweenMax.to(modalnonprem, 0, {alpha: 0, scale:.7, y:10, ease: Expo.easeOut});
    nonprem.style.display = 'none';

    window.open('https://plus.kompas.com/detail?source=crozword','blank');
})

btnpremclose.addEventListener('click', ()=>{
    TweenMax.to(modalnonprem, 0, {alpha: 0, scale:.7, y:10, ease: Expo.easeOut});
    nonprem.style.display = 'none';
    btncancel.currentTime = 0;
    btncancel.play();
})

function openconfirmationbox(){

    imgconfbrd.src = 'board/' + gameid_active + '.png';
    confibox.style.display='block';

    TweenMax.to(modalconf, .3, {alpha: 1, scale:1, y:0, ease: Expo.easeOut});
}

conyes.addEventListener('click',()=>{
    reguser_todb();
    TweenMax.to(modalconf, .2, {alpha: 0, scale:.8, y:-10, ease: Expo.easeOut});
})
conno.addEventListener('click', ()=>{
    confibox.style.display='none';
    TweenMax.to(modalconf, 0, {alpha: 0, scale:.8, y:-10, ease: Expo.easeOut});
    btncancel.currentTime = 0;
    btncancel.play();
})

// barr_right.addEventListener('click', navboardselect);
// barr_left.addEventListener('click', navboardselect);

function navboardselect(e) {
    if (e.target.id =='barr_right') {
        //next board
        arrboardgame_curr++;

        if (arrboardgame_curr > (arrboardgame.length-1)) {
            arrboardgame_curr = 0;
        }
    }else{
        //Prev
        arrboardgame_curr--;

        if (arrboardgame_curr < 0) {
            arrboardgame_curr = (arrboardgame.length-1);
        }
        //console.log(arrboardgame_curr);
    }
    gameid_active = arrboardgame[arrboardgame_curr];
    //boardpic.src = 'https://ompaseries.xyz/boardtts/' + arrboardgame[arrboardgame_curr] + ".png";
    boardpic.src = 'board/' + arrboardgame[arrboardgame_curr] + ".png";
}

function fillgameboard(r){
    let gamedata = r;
             
    board_set = JSON.parse(gamedata[0].boardset); 
    mendatar_list =JSON.parse(gamedata[0].hor_set); 
    mendatar_list =JSON.parse(gamedata[0].hor_set); 
    menurun_list =JSON.parse(gamedata[0].ver_set); 
    jwb_hor =JSON.parse(gamedata[0].j_hor); 
    jwb_ver =JSON.parse(gamedata[0].j_ver); 

    let bs = gamedata[0].boardsize.split(',');
    boardcol = bs[0];
    boardrow = bs[1];
    boardboxsize = bs[2];

    createboard();
    showquest();
    setListenerBoxes();

    ingame.currentTime = 0;
    ingame.play();

    TweenMax.to(cover, 1, {alpha: 0, ease: Expo.easeOut, onComplete:()=>{
        cover.style.display = 'none';
        gameplay.style.display = 'block';
                statusq.style.display = 'block';
                boardnum.style.display = 'inline-block';
                qdisp.style.display = 'flex';
                magnifybox.style.display = 'flex';
                ckeyboard.style.display = 'block';
    }});

}


function newgame() {
        var mydata = {
            uname_reg: uname_active,
            idgame: gameid_active,
        };

        console.log(mydata);
        $.ajax({
            url: base_url + "index.php/adv/addnew_tts_user",
            type: "POST",
            data: mydata,
            dataType: "JSON",
            success: function(response) {
                fillgameboard(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Gagal menyimpan, refresh browser')
            }
        });  
}


larr.addEventListener('click',()=>{
    showquest('left');
})

rarr.addEventListener('click',()=>{
    showquest('right');
})

function createboard(){
    var r = document.querySelector(':root');

    r.style.setProperty('--sizecol', boardboxsize + 'px');
    r.style.setProperty('--sizerow', boardboxsize + 'px');

    r.style.setProperty('--boxcol', boardcol);
    r.style.setProperty('--boxrow', boardrow);
    
    const board = document.querySelector('.board');

    for (let i = 0; i < boardrow; i++) {
        for (let j = 0; j < boardcol; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board_set[i][j] == null){
                cell.setAttribute('class', 's-b-black');
            }else if (board_set[i][j] == 0){
                board_map.push(['tiles_' + i + '_' + j, i, j, null,null,null,null]);
                cell.setAttribute('class', 's-board');
                cell.innerHTML = "<span class=anwbox id=anw_" + i + "_" + j + ">&nbsp;</span>";
            }else{
                board_map.push(['tiles_' + i + '_' + j,i,j, null,null,null,null]);
                cell.setAttribute('class', 's-board');
                cell.innerHTML = "<span class=anwbox id=anw_" + i + "_" + j + ">&nbsp;</span>";
                cell.innerHTML += "<span class=lblnum>" + board_set[i][j] + "</span>";
                get_cordinate(board_set[i][j],i,j)
            }
            cell.setAttribute('id', 'tiles_' + i + '_' + j);
            board.appendChild(cell);
        }
    }

    optimize_finder();
}

function setListenerBoxes(){
    for (let i = 0; i < board_map.length; i++) {
        document.getElementById(board_map[i][0]).addEventListener('click', boxesClick);
    }
}

function get_cordinate(val_q, row, col){
    let hor_q 

    if (mendatar_list.length > 0) {
        for (let i = 0; i<mendatar_list.length; i++){
            if (mendatar_list[i][0] == val_q) {
                mendatar_list[i].splice(2, 0, row);
                mendatar_list[i].splice(3, 0, col);
                create_tiles_map(col,row, 'hor', mendatar_list[i][0], i);
            }
        }
        
        for (let i = 0; i<menurun_list.length; i++){
            if (menurun_list[i][0] == val_q) {
                menurun_list[i].splice(2, 0, row);
                menurun_list[i].splice(3, 0, col);
                create_tiles_map(col,row, 'ver', menurun_list[i][0], i);
            }
        }
    }
}

function create_tiles_map(_col, _row, _qorient, _indquest, _ordarr){
    let tempwjbid;
    let lghttiles;
    let arrtmp = [];

    if (_qorient == 'hor') {
        lghttiles = jwb_hor[findValue(jwb_hor, _indquest)][1].length;
        for (let j = _col; j < (lghttiles + _col) ; j++){
            arrtmp.push('anw_' + _row  + '_' + j);
        }
        mendatar_list[_ordarr].splice(4, 0, arrtmp);
    }else{
        lghttiles = jwb_ver[findValue(jwb_ver, _indquest)][1].length;
        for (let j = _row; j < (lghttiles + _row) ; j++){
            arrtmp.push('anw_' + j  + '_' + _col);
        }
        menurun_list[_ordarr].splice(4, 0, arrtmp);
    }
}

function optimize_finder(){
    let hortiles='';
    let vertiles='';
    let temparr = [];
    let temphor = [];

    //['tiles_0_0', 0, 0,  <id pernyataaan hor>, <posisi char hor>,  <id pernyataaan ver>, <posisi char ver>]
    //Optimize calculation to make better performance 

    for (let i = 0; i < board_map.length; i++){
        //find in hor that has this tiles  
        hortiles = board_map[i][0].split('_');

        //check horizontal 
        for (let h=0; h<mendatar_list.length; h++){
            temparr = mendatar_list[h][4];
            //console.log('temparr : ' + temparr);

            for (let j=0; j<temparr.length; j++) {
                if (temparr[j] == ('anw_' + hortiles[1] + '_' + hortiles[2])) {
                    //ID Pertanyaan
                    board_map[i][3] = h;
                    board_map[i][4] = j;
                }
            }
        }

        //check vertical 
        for (let h=0; h<menurun_list.length; h++){
            temphor = menurun_list[h][4];
            for (let j=0; j<temphor.length; j++) {
                if (temphor[j] == ('anw_' + hortiles[1] + '_' + hortiles[2])) {
                    //ID Pertanyaan
                    board_map[i][5] = h;
                    board_map[i][6] = j;
                }
            }
        }
    }
}

function showquest(runto = 0){
    if (questorient == 'hor') {
        //Horizontal Line
        qcont.innerHTML = findquestions(mendatar_list, runto);
    }else{
        //Vertical Line
        qcont.innerHTML = findquestions(menurun_list, runto);
    }
}

function cursorposition(boxclicked = ''){
    //Check active Box
    let activeansarr;
    let strarr = activebox.split('_');
    let getindexq, temstr, cfind = false;
    let currpost = 0;

    findedrootbox = board_set[strarr[1]][strarr[2]];

    (questorient == 'hor' ? activeansarr = jwb_hor:activeansarr = jwb_ver);
    getindexq = findValue((questorient == 'hor' ? mendatar_list : menurun_list), findedrootbox);
    active_jwb = [];

    if (questorient == 'hor') {        
        //Horizontal Cursor
        currpost = parseInt(strarr[2]) + parseInt(activeansarr[getindexq][2].length-1)
        
        temstr = activeansarr[getindexq][2];
        cfind = false;

        if (boxclicked == '') {
            for(let blankspot = 0; blankspot < activeansarr[getindexq][2].length-1; blankspot++){
                if (!cfind){
                    if (temstr.substr(blankspot, 1) == "*") {
                        currpost = parseInt(strarr[2])+ blankspot;
                        cfind = true;
                    }
                }
            }
            document.getElementById('tiles_' + strarr[1] + "_" + currpost).style.backgroundColor = "#FFE240";            
            document.getElementById('mag_' + strarr[1] + "_" + currpost).style.backgroundColor = "#FFE240";

            cursorbox = 'anw_' + strarr[1] + "_" + currpost;
        }else{
            let bxcl = boxclicked.split('_');
            console.log('box click : ' + 'tiles_' + bxcl[1] + "_" + bxcl[2]);
            document.getElementById('tiles_' + bxcl[1] + "_" + bxcl[2]).style.backgroundColor = "#FFE240";
            document.getElementById('mag_' + bxcl[1] + "_" + bxcl[2]).style.backgroundColor = "#FFE240";
        }
        
        qcont.innerHTML = mendatar_list[getindexq][1];
    }else{
        //Vertical Cursor
        currpost = parseInt(strarr[1]) + parseInt(activeansarr[getindexq][2].length-1)
        
        temstr = activeansarr[getindexq][2];
        cfind = false;


        if (boxclicked == '') {
            for(let blankspot = 0; blankspot < activeansarr[getindexq][2].length-1; blankspot++){
                if (!cfind){
                    if (temstr.substr(blankspot, 1) == "*") {
                        currpost = parseInt(strarr[1]) + blankspot;
                        cfind = true;
                    }
                }
            }
            document.getElementById('tiles_' + currpost + "_" + strarr[2]).style.backgroundColor = "#FFE240";
            document.getElementById('mag_' + currpost + "_" + strarr[2]).style.backgroundColor = "#FFE240";

            cursorbox = 'anw_' + currpost + "_" + strarr[2];
        }else{
            let bxcl = boxclicked.split('_');
            console.log('box click : ' + 'tiles_' + bxcl[1] + "_" + bxcl[2]);
            document.getElementById('tiles_' + bxcl[1] + "_" + bxcl[2]).style.backgroundColor = "#FFE240";
            document.getElementById('mag_' + bxcl[1] + "_" + bxcl[2]).style.backgroundColor = "#FFE240";
        }
        
        qcont.innerHTML = menurun_list[getindexq][1];
        //--------------------------------------------
        // for(let blankspot = 0; blankspot < activeansarr[getindexq][2].length-1; blankspot++){
        //     if (!cfind){
        //         if (temstr.substr(blankspot, 1) == "*") {
        //             currpost = parseInt(strarr[1]) + blankspot;
        //             cfind = true;
        //         }
        //     }
        // }

        // document.getElementById('tiles_' + currpost + "_" + strarr[2]).style.backgroundColor = "#FFE240";
        // document.getElementById('mag_' + currpost + "_" + strarr[2]).style.backgroundColor = "#FFE240";
        // qcont.innerHTML = menurun_list[getindexq][1];
        // cursorbox = 'anw_' + currpost + "_" + strarr[2];
    }

    
    active_jwb.push(activeansarr[getindexq]);
}

function findquestions(active_set, direction){
    const isMendatar = active_set === mendatar_list;

    if (direction === 'right') {
        questpost = (questpost + 1) % active_set.length;
        if (questpost === 0) {
            active_set = isMendatar ? menurun_list : mendatar_list;
            questorient = isMendatar ? 'ver' : 'hor';
        }
    } else if (direction === 'left') {
        questpost = (questpost - 1 + active_set.length) % active_set.length;
        
        if (questpost === active_set.length - 1) {
            active_set = isMendatar ? menurun_list : mendatar_list;
            questorient = isMendatar ? 'ver' : 'hor';
            questpost = active_set.length-1;
        }
    }

    highlight_boxes(questorient, questpost)
    return active_set[questpost][1];
}

function highlight_boxes(direction_q, positionq, resetbox = true, dontcallcursorupdate = false){

    let start_x, start_y;
    if (resetbox) {clear_highlight_board()};
    activestiles = [];
    active_quest = [];

    questpost = positionq;
    if (direction_q == 'hor') {
        start_x = mendatar_list[positionq][2];
        start_y = mendatar_list[positionq][3];
        active_quest.push(mendatar_list[positionq]);

        statusq.innerHTML = "<div id='boardnum'>" + mendatar_list[positionq][0] + "</div> Mendatar - " + mendatar_list[positionq][4].length + " Huruf";
        for (let i = 0; i < jwb_hor[positionq][1].length; i++){
            document.getElementById("tiles_" + start_x + "_" + (start_y + i)).style.backgroundColor = "#D9EAFD";
            activestiles.push(["anw_" + start_x + "_" + (start_y + i), start_x, (start_y + i)]);
            if (i==0) {
                activebox = "tiles_" + start_x + "_" + (start_y + i);
            }
        }
        
    }else{
        // console.log('you call ' + direction_q + ',' + positionq);
        start_x = menurun_list[positionq][2];
        start_y = menurun_list[positionq][3];
        active_quest.push(mendatar_list[positionq]);

        statusq.innerHTML = "<div id='boardnum'>" + menurun_list[positionq][0] + "</div> Menurun - " + menurun_list[positionq][4].length + " Huruf";
        for (let i = 0; i < jwb_ver[positionq][1].length; i++){
            document.getElementById("tiles_" + (start_x + i) + "_" + start_y).style.backgroundColor = "#D9EAFD";
            activestiles.push(["anw_" + (start_x + i) + "_" + start_y, (start_x + i), start_y]);    
            if (i==0) {
                activebox = "tiles_" + start_x + "_" + (start_y + i);
            }
        }
    }

    updateboard();
    openmagnify();
    if (!dontcallcursorupdate) cursorposition();
}

function openmagnify(){
    document.getElementById('magnifybox').innerHTML ='';

    const magnicell = document.querySelector('#magnifybox');

    for (let i=0; i < activestiles.length; i++) {
        const cell = document.createElement('div');       
        cell.setAttribute('class', 'magtiles');
        cell.setAttribute('id', 'mag_' + activestiles[i][1] + '_' + activestiles[i][2]);
        magnicell.appendChild(cell);
    }

    for (let i = 0; i < activestiles.length; i++){
        document.getElementById('mag_' + activestiles[i][1] + '_' + activestiles[i][2]).addEventListener('click', magnifyclick);
        document.getElementById('mag_' + activestiles[i][1] + '_' + activestiles[i][2]).innerHTML = document.getElementById(activestiles[i][0]).innerHTML;
    }
}

function magnifyclick(e){
    let boxtile = e.target.id;
    let strarr = boxtile.split('_');

    cursorbox = 'anw_' + strarr[1] + '_' + strarr[2];
    console.log('berfor : ' + cursorbox);
    highlight_boxes(questorient, findValue((questorient == 'hor' ? mendatar_list : menurun_list), findedrootbox), true, true);
    cursorposition(cursorbox);
    
    // console.log('after  : ' + cursorbox);
    // console.log("tiles_" + strarr[1] + "_" + strarr[2]);
    // document.getElementById("tiles_" + strarr[1] + "_" + strarr[2]).style.backgroundColor = "#D9EAFD";
}

function clear_highlight_board() {
    //console.log(board_map.length);
    for (let i = 0; i<board_map.length; i++){
        document.getElementById(board_map[i][0]).style.backgroundColor = "#FFF";  
    }
}

function updateboard(){
    let quest_index, start_x, start_y, tmpstr='';

    //Check hor progress
    for (let i = 0; i <= jwb_hor.length-1; i++) {
        //Find box to fill user input
        //console.log(mendatar_list);
        quest_index = findQuestionValue(mendatar_list, jwb_hor[i][0]);        
        start_x = mendatar_list[quest_index][2];
        start_y = mendatar_list[quest_index][3];
        // console.log('X : ' + start_x);
        // console.log('Y : ' + start_y);
        
        tmpstr = String(jwb_hor[i][2]);
        for (let j=0; j < tmpstr.length; j++) {
            if (tmpstr.substr(j,1).toUpperCase() != '*') {
                    document.getElementById('anw_' + start_x + '_' + (start_y+j)).innerHTML =  tmpstr.substr(j,1).toUpperCase();
            }else{
                if (document.getElementById('anw_' + start_x + '_' + (start_y+j)).innerHTML != '&nbsp;') {
                    document.getElementById('anw_' + start_x + '_' + (start_y+j)).innerHTML =  "&nbsp;";
                }
            }
        }
    }
    //Check ver progress
    for (let i = 0; i <= jwb_ver.length-1; i++) {
        //Find box to fill user input
        quest_index = findQuestionValue(menurun_list, jwb_ver[i][0]);
        start_x = menurun_list[quest_index][2];
        start_y = menurun_list[quest_index][3];
        tmpstr = String(jwb_ver[i][2]);
        // console.log(menurun_list[i]);
        for (let j=0; j < tmpstr.length; j++) {
            if (tmpstr.substr(j,1).toUpperCase() != '*') {
                document.getElementById('anw_' + (start_x +j) + '_' + (start_y)).innerHTML =  tmpstr.substr(j,1).toUpperCase();
            }else{
                // console.log('anw_' + (start_x +j) + '_' + (start_y));
                if (document.getElementById('anw_' + (start_x +j) + '_' + (start_y)).innerHTML ==  "&nbsp;") {
                    document.getElementById('anw_' + (start_x +j) + '_' + (start_y)).innerHTML =  "&nbsp;";
                }
            }
        }
    }
}

// boardupdate();
function boardupdate(){
    for (let i=0; i < board_map.length-1; i++) {
        if (document.getElementById('anw_' + board_map[i][2] + '_' + board_map[i][3]).innerHTML != '&nbsp;'){
            board_map[i][1] = document.getElementById('anw_' + board_map[i][2] + '_' + board_map[i][3]).innerHTML;
        }
    }
}

function inpkey(e) {

    let updateanw = '';
    let isfull = true;
    let currboxinquest;

    // pilih.currentTime = 0;
    // pilih.play();
    
    TweenMax.to(d(e.target.id), 0.1, {scale: 1.8, ease: Expo.easeOut});
    TweenMax.to(d(e.target.id), 0.1, {scale: 1, ease: Expo.easeOut, delay:0.1});
    
    if (e.target.id != 'del'){
        //Put words 
        document.getElementById(cursorbox).innerHTML = e.target.id.toUpperCase();
        //Update Data user
        for (let i = 0; i < activestiles.length; i++) {
            if (document.getElementById(activestiles[i][0]).innerHTML != '&nbsp;') {
                updateanw += document.getElementById(activestiles[i][0]).innerHTML;
            }else{
                updateanw += "*"
                isfull = false;
            }
        }
    
        active_jwb[0][2] = updateanw;
        update_cross_anw(cursorbox, e.target.id.toUpperCase());
        if (isfull) {
            
            showquest('right');
            autosaved_tts();
            
            btnclick.currentTime = 0;
            btnclick.play();
            TweenLite.to(magnifybox, .1, {
                scaleX: .7,
                ease: Expo.easeOut
            });
            
            TweenLite.to(magnifybox, .3, {
                scaleX: 1,
                ease: Back.easeOut,
                delay:.1
            });

            
        }
    }else{
        //Delete
        currboxinquest = (findValue(activestiles, cursorbox)-1);
        if ((currboxinquest+1) == (activestiles.length-1) && (!onedgedelete)){
            onedgedelete = true;
            for (let i = 0; i < activestiles.length; i++) {
                if (i == (activestiles.length-1)) {                        
                        updateanw += "*"
                    }else{
                        if (document.getElementById(activestiles[i][0]).innerHTML != '&nbsp;') {
                            updateanw += document.getElementById(activestiles[i][0]).innerHTML;
                        }else{
                            updateanw += "*"
                        }
                    }
                }
            active_jwb[0][2] = updateanw;
        }else {
            onedgedelete = false;
            if (currboxinquest >= 0) {
                for (let i = 0; i < activestiles.length; i++) {
                    if (currboxinquest == i) {
                        updateanw += "*"
                        document.getElementById(activestiles[i][0]).innerHTML = '&nbsp;';
                    }else{
                        if (document.getElementById(activestiles[i][0]).innerHTML != '&nbsp;') {
                            updateanw += document.getElementById(activestiles[i][0]).innerHTML;
                            document.getElementById(activestiles[i][0]).innerHTML = '&nbsp;';
                        }else{
                            updateanw += "*"
                            document.getElementById(activestiles[i][0]).innerHTML = '&nbsp;';
                        }
                    }
                }
                active_jwb[0][2] = updateanw;
            }
        }
        update_cross_anw(cursorbox, e.target.id.toUpperCase());
    }
    
}

function update_cross_anw(active_b, inst_string='') {
    let strarr = active_b.split('_');   
    for (let i=0; i < board_map.length; i++) {
        if (board_map[i][0] == ('tiles_' + strarr[1] + '_' + strarr[2])) {
            if (board_map[i][5] != null) {
                let newstr = jwb_ver[board_map[i][5]][2].split('');
                newstr[board_map[i][6]] = (inst_string != 'DEL' ? inst_string : '*') ;
                jwb_ver[board_map[i][5]][2] = newstr.join('');
            }
            if (board_map[i][3] != null) {
                let newstr2 = jwb_hor[board_map[i][3]][2].split('');
                newstr2[board_map[i][4]] = (inst_string != 'DEL' ? inst_string : '*');
                jwb_hor[board_map[i][3]][2] = newstr2.join('');
            }
        }
    }
    
    highlight_boxes(questorient, questpost, true);
}

function gen_jwb(){
    let tamp = '';
    let jj = '';
    
    for (let s=0; s < jwb_ver.length; s++){
        jj = '';
        for (let d=0; d < jwb_ver[s][1].length; d++) {
            jj += "*"
        }
        tamp += "[" + jwb_ver[s][0] + ",'" + jwb_ver[s][1] + "','" + jj + "'],";
    }
    console.log(tamp);
}

// btnsave1.addEventListener('click', reguser_todb);
// btncancel1.addEventListener('click', refreshgame);

btnmulai.addEventListener('click', startnewgame);

function reguser_todb(){
    gosubmit();
}

function refreshgame(e){
    bouncinganimation(e.target);
}

function startnewgame(e){
    //bouncinganimation(e.target);
    loading_game();
    analyticplay();
}

function analyticplay() {
    
    $.ajax({
            url: base_url + "index.php/adv/playuser",
            type: "POST",
            success: function(response) {},
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log(textStatus, errorThrown);
                //console.log(errorThrown);
            }
        });
    }

function boxesClick(e) {
    const boxtile = e.target.id;
    const strarr = boxtile.split('_');
    let findedRootBox = null;
    let possibleHor, possibleVer;

    clear_highlight_board();

    const currentBoxValue = board_set[strarr[1]][strarr[2]];

    // Jika kotak yang diklik memiliki angka
    if (currentBoxValue != null && currentBoxValue != 0) {
        findedRootBox = currentBoxValue;
        possibleHor = findValue(mendatar_list, findedRootBox);
        possibleVer = findValue(menurun_list, findedRootBox);

        // Ubah orientasi jika tidak ada kemungkinan dalam orientasi saat ini
        if (questorient === 'hor' && possibleHor == null) {
            questorient = 'ver';
        } else if (questorient === 'ver' && possibleVer == null) {
            questorient = 'hor';
        }

        // Toggle highlight jika mengklik kotak yang sama
        if (possibleHor != null && possibleVer != null && activebox === boxtile) {
            questorient = questorient === 'hor' ? 'ver' : 'hor';
        }

        cursorbox = `anw_${strarr[1]}_${strarr[2]}`;
        highlight_boxes(
            questorient,
            findValue(questorient === 'hor' ? mendatar_list : menurun_list, findedRootBox),
            true,
            true
        );
        cursorposition(cursorbox);
    } else {
        // Cari secara horizontal ke kiri
        findedRootBox = horizontalLookup(strarr[1], strarr[2]);

        // Jika tidak ditemukan, cari secara vertikal ke atas
        if (findedRootBox === 0) {
            findedRootBox = verticalLookup(strarr[1], strarr[2]);
        }

        cursorbox = `anw_${strarr[1]}_${strarr[2]}`;
        highlight_boxes(
            questorient,
            findValue(questorient === 'hor' ? mendatar_list : menurun_list, findedRootBox),
            true,
            true
        );
        cursorposition(cursorbox);
    }
}

// Fungsi untuk pencarian horizontal ke kiri
function horizontalLookup(row, col) {
    for (let i = col; i >= 0; i--) {
        if (board_set[row][i] == null) {
            return 0;
        } else if (board_set[row][i] != 0) {
            questorient = 'hor';
            return board_set[row][i];
        }
    }
    return 0;
}

// Fungsi untuk pencarian vertikal ke atas
function verticalLookup(row, col) {
    for (let i = row; i >= 0; i--) {
        if (board_set[i][col] == null) {
            return 0;
        } else if (board_set[i][col] != 0) {
            questorient = 'ver';
            return board_set[i][col];
        }
    }
    return 0;
}

function loading_game(){
    TweenMax.to(logo_kom, .3, {alpha: 0, y:-5, ease: Sine.easeOut});
    TweenMax.to(logogame, .3, {alpha: 0, y:-5, ease: Sine.easeOut,delay:0.1});
    TweenMax.to(infotts, .3, {alpha: 0, y:-5, ease: Sine.easeOut,delay:0.1});
    TweenMax.to(btnmulai, .3, {alpha: 0, y:-5, ease: Sine.easeOut,delay:0.3, onComplete:()=>{
        reguser.style.display = 'block';
        TweenMax.to(reguser, .3, {alpha: 1, y:0, ease: Sine.easeOut, delay:.5});
        document.getElementById("uname").focus();
    }});
    // TweenMax.to(btncon, .3, {alpha: 0, y:-5, ease: Sine.easeOut,delay:0.3, onComplete:newgame});
}

function bouncinganimation(obj){
    TweenMax.to(obj, .1, {scale: 1.2, ease: Sine.easeOut});
    TweenMax.to(obj, .3, {scale: 1, ease: Back.easeOut, delay: .2});
}

TweenMax.to(logo_kom, 0, {alpha: 0, y:-8, ease: Sine.easeOut});
TweenMax.to(logogame, 0, {alpha: 0, y:-8, ease: Sine.easeOut});
TweenMax.to(infotts, 0, {alpha: 0, y:-8, ease: Sine.easeOut});
TweenMax.to(reguser, 0, {alpha: 0, y:-8, ease: Sine.easeOut});
TweenMax.to(modalconf, 0, {alpha: 0, scale:.8, y:-8, ease: Sine.easeOut});

TweenMax.to(btnmulai, 0, {scale: 0, ease: Sine.easeOut, onComplete:()=>{
    midcov.style.opacity = 1;
}});

opening();

function opening(){
    TweenMax.to(logo_kom, 0.4, {alpha: 1,y:0, ease: Sine.easeOut});
    TweenMax.to(logogame, 0.4, {alpha: 1,y:0, ease: Sine.easeOut, delay: .3});
    TweenMax.to(infotts, 0.4, {alpha: 1,y:0, ease: Sine.easeOut, delay: .4});

    TweenMax.to(btnmulai, 0.5, {scale: 1, ease: Back.easeOut, delay: .5});
}

function d(id) {
    return document.getElementById(id);
}

function anschecker(){
    let chcarr;
    let totalq = jwb_hor.length + jwb_ver.length;
    let totalcorrect = 0;
    
    //Check Horizontal
    for(let i=0; i<jwb_ver.length; i++){
        chcarr = md5(jwb_ver[i][2]);
        if (jwb_ver[i][3] == chcarr) {
            totalcorrect++;
        }
    }
    //Check Vertical
    for(let i=0; i<jwb_hor.length; i++){
        chcarr = md5(jwb_hor[i][2]);
        if (jwb_hor[i][3] == chcarr) {
            totalcorrect++;
        }
    }
    return Math.ceil((totalcorrect/ totalq) * 100);
}

function autosaved_tts(){
    var mydata = {
        uname_reg: uname_active,
        idgame: gameid_active,
        j_hor: JSON.stringify(jwb_hor),
        j_ver: JSON.stringify(jwb_ver),
        prggame : anschecker(),
    };

    $.ajax({
        url: base_url + "index.php/adv/update_tts_game",
        type: "POST",
        data: mydata,
        dataType: "JSON",
        success: function(response) {
            console.log('Auto Saved!')
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Gagal menyimpan, refresh browser')
        }
    });
}

function gosubmit() {
    
    if (!submitrequest) { 
        submitrequest = true;
        
        var mydata = {
            uname_reg: uname_active,
            idgame: gameid_active,
        };

        $.ajax({
            url: base_url + "index.php/adv/addnew_tts_user",
            type: "POST",
            data: mydata,
            dataType: "JSON",
            success: function(response) {
                fillgameboard(response);
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('mengapa')
            }
        });
    }
}

d('q').addEventListener('click', inpkey);
d('w').addEventListener('click', inpkey);
d('e').addEventListener('click', inpkey);
d('r').addEventListener('click', inpkey);
d('t').addEventListener('click', inpkey);
d('y').addEventListener('click', inpkey);
d('u').addEventListener('click', inpkey);
d('i').addEventListener('click', inpkey);
d('o').addEventListener('click', inpkey);
d('p').addEventListener('click', inpkey);

d('a').addEventListener('click', inpkey);
d('s').addEventListener('click', inpkey);
d('d').addEventListener('click', inpkey);
d('f').addEventListener('click', inpkey);
d('g').addEventListener('click', inpkey);
d('h').addEventListener('click', inpkey);
d('j').addEventListener('click', inpkey);
d('k').addEventListener('click', inpkey);
d('l').addEventListener('click', inpkey);

d('z').addEventListener('click', inpkey);
d('x').addEventListener('click', inpkey);
d('c').addEventListener('click', inpkey);
d('v').addEventListener('click', inpkey);
d('b').addEventListener('click', inpkey);
d('n').addEventListener('click', inpkey);
d('m').addEventListener('click', inpkey);
// d('ent').addEventListener('click', goword);
d('del').addEventListener('click', inpkey);


var $el = $(".board");
var elHeight = $el.outerHeight();
var elWidth = $el.outerWidth();

function doResize(event, ui) {
        
    var scale, origin;
        
    scale = Math.min(
        ui.size.width / (elWidth),
    );
    
    $el.css({
        transform: "scale(" + (scale/1.8) + ")",
        transformOrigin: "top"
    });

    console.log("scale(" + scale + ")");
}

var starterData = { 
    size: {
        width: window.screen.width,
        height: window.screen.height
    }
}
if (window.screen.width < 471) {
    doResize(null, starterData);
}