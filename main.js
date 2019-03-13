const $ = require('jQuery');
const date = require('date-and-time');
const wifiList = require('wifi-list-windows');
const si = require('systeminformation');
const vol = require('vol');
 
vol.get().then((level)=> {
    $("#level").html(Math.round(Number(level)*100));
    $("#volumeRange").val(Math.round(Number(level)*100));
});

wifiList((err, networks) => {
    if (err) throw err
    if(networks.length !== 0){
        showNetwork(networks);
    }
});

function showNetwork(wifi){
    for(i = 0; i < wifi.length; i++){
        $("#wifi").append(`<div class="inner-wifi">${wifi[i].ssid}<br><span>${wifi[i].authentication} &nbsp; ${Math.round(Number(wifi[i].signal)*100)}%</span></div>`);
    }
}

let now = new Date();
date.setLocales('en', {
    A: ['AM', 'PM']
});
var day = date.format(now, 'MMM DD YYYY');
var time = date.format(now, 'hh:mm A');
$("#time").html(`${time}<br>${day}`);
setInterval(() => {
let now = new Date();
date.setLocales('en', {
    A: ['AM', 'PM']
});
var day = date.format(now, 'MMM DD YYYY');
var time = date.format(now, 'hh:mm A');
$("#time").html(`${time}<br>${day}`);
},30000);

$("#task_wifi").click(() => {
    $("#volume").addClass("animated zoomOutUp");
    $("#wifi").css("display","inherit");
    $("#wifi").addClass("animated zoomInDown");
    setTimeout(() => {
        $("#wifi").removeClass("animated zoomInDown");
        $("#volume").removeClass("animated zoomOutUp");
        $("#volume").css("display","none");
    },800);
});
$("#task_vol").click(() => {
    $("#wifi").addClass("animated zoomOutUp");
    $("#volume").css("display","inherit");
    $("#volume").addClass("animated zoomInDown");
    setTimeout(() => {
        $("#volume").removeClass("animated zoomInDown");
        $("#wifi").css("display","none");
        $("#wifi").removeClass("animated zoomOutUp");
    },800);
});
//for now this is how it shows/hides but in future there will be close,maximize and minimise buttons
function show_pro(){
    $("#wifi").css("display","none");
    $("#volume").css("display","none");
    $("#processes").css("display", "inherit");
    $("#processes").addClass("animated zoomInDown");
    setTimeout(() => {
        $("#processes").removeClass("animated zoomInDown");
        $("#pro_btn").attr("onclick","hide_pro()");
    },800);
}
function hide_pro() {
    $("#wifi").css("display","none");
    $("#volume").css("display","none");
    $("#processes").addClass("animated zoomOutUp");
    setTimeout(() => {
        $("#processes").removeClass("animated zoomOutUp");
        $("#pro_btn").attr("onclick","show_pro()");
        $("#processes").css("display", "none");
    },800);
}
//processes thingy ends here
$("#volumeRange").on("change , mousemove", () => {
    var nowVolume = $("#volumeRange").val();
    vol.set(nowVolume/100);
    $("#level").html(nowVolume);
});

si.processes().then((data) => {
    $("#pro_number").html(`Processes (${data.all})`);
    for(i = 0; i < data.list.length; i++){
        $("#real_processes").append(`
        <tr>
            <td>${data.list[i].name}</td>
            <td>${data.list[i].pid}</td>
            <td>${data.list[i].priority}</td>
            <td>${data.list[i].started}</td>
        </tr>
        `);
    }
});