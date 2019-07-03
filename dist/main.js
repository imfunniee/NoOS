const date = require('date-and-time');
const si = require('systeminformation');
const vol = require('vol');
const wifiList = require('wifi-list-windows');
const fs = require('fs');
const got = require('got');
const jsdom = require('jsdom').JSDOM,
    options = {
    resources: "usable"
};

//for now this is how it opens or closes windows
function openWindow(whichWindow){
    $(`#${whichWindow}`).css("display", "block");
    $(`#${whichWindow}`).addClass("animated zoomIn");
    setTimeout(() => {
        $(`#${whichWindow}`).removeClass("animated zoomIn");
    },800);
}

function closeWindow(whichWindow) {
    $(`#${whichWindow}`).addClass("animated zoomOut");
    setTimeout(() => {
        $(`#${whichWindow}`).removeClass("animated zoomOut");
        $(`#${whichWindow}`).css("display", "none");
    },800);
}

$("#browserTab").attr("onclick",`openWindow('browser')`);

wifiList((err, wifi) => {
    if (err) throw err
    if(wifi.length !== 0){
        for(i = 0; i < wifi.length; i++){
            $("#wifi").append(`<div class="inner-wifi">${wifi[i].ssid}<br><span>${wifi[i].authentication} &nbsp; ${Math.round(Number(wifi[i].signal)*100)}%</span></div>`);
        }
    }
});

vol.get().then((level)=> {
    $("#level").html(Math.round(Number(level)*100));
    $("#volumeRange").val(Math.round(Number(level)*100));
});


let now = new Date();
date.setLocales('en', {
    A: ['AM', 'PM']
});
var day = date.format(now, 'MMM DD');
var time = date.format(now, 'hh:mm A');
$("#time").html(`${day} &nbsp;${time}`);
setInterval(() => {
let now = new Date();
date.setLocales('en', {
    A: ['AM', 'PM']
});

var day = date.format(now, 'MMM DD');
var time = date.format(now, 'hh:mm A');
$("#time").html(`${day} &nbsp;${time}`);
},60000);

$("#task_wifi").click((e) => {
    e.stopPropagation();
    $("#volume").addClass("animated zoomOut");
    $("#wifi").css("display","inherit");
    $("#wifi").addClass("animated zoomIn");
    setTimeout(() => {
        $("#wifi").removeClass("animated zoomIn");
        $("#volume").removeClass("animated zoomOut");
        $("#volume").css("display","none");
    },800);
});

$("#task_vol").click((e) => {
    e.stopPropagation();
    $("#wifi").addClass("animated zoomOut");
    $("#volume").css("display","inherit");
    $("#volume").addClass("animated zoomIn");
    setTimeout(() => {
        $("#volume").removeClass("animated zoomIn");
        $("#wifi").css("display","none");
        $("#wifi").removeClass("animated zoomOut");
    },800);
});

//processes thingy ends here
$("#volumeRange").on("click , mousemove", (e) => {
    e.stopPropagation();
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

function search(e){
    if(e.keyCode == 13){
        e.preventDefault();
        const urlString = e.target.value;
        var url =  /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        if (url.test(urlString)){
            $("#reload").addClass("wheel");
            var stream = got.stream(urlString).pipe(fs.createWriteStream('./dist/browser.html'));
            stream.on('finish', function (){
                var originOfUrl = new URL(urlString).origin;
                jsdom.fromFile('./dist/browser.html', options).then(function (dom) {
                    let window = dom.window, document = window.document;
                    var base = document.createElement("base");
                    base.setAttribute("href", originOfUrl);
                    document.getElementsByTagName("html")[0].prepend(base);
                    fs.writeFile(`./dist/browser.html`, '<!DOCTYPE html>' + window.document.documentElement.outerHTML, function (error) {
                        if (error) throw error;
                        $("#reload").removeClass("wheel");
                        $("#browser_data").attr("src","browser.html");
                        e.target.value = urlString;
                        e.target.blur();
                    });
                });
            });
        }else{
            $("#reload").addClass("wheel");
            var stream = got.stream(`https://duckduckgo.com?q=${urlString}`).pipe(fs.createWriteStream('./dist/browser.html'));
            stream.on('finish', function (){
                jsdom.fromFile('./dist/browser.html', options).then(function (dom) {
                    let window = dom.window, document = window.document;
                    var base = document.createElement("base");
                    base.setAttribute("href", "https://duckduckgo.com");
                    document.getElementsByTagName("html")[0].prepend(base);
                    fs.writeFile(`./dist/browser.html`, '<!DOCTYPE html>' + window.document.documentElement.outerHTML, function (error) {
                        if (error) throw error;
                        $("#reload").removeClass("wheel");
                        $("#browser_data").attr("src","browser.html");
                        e.target.value = `https://duckduckgo.com?q=${urlString}`;
                        e.target.blur();
                    });
                });
            });
        }
    }
}

$("#reload").click(function(){
    $("#reload").attr("disable",true);
    $("#reload").addClass("wheel");
    setTimeout(function(){
        $("#reload").attr("disable",false);
        $("#reload").removeClass("wheel");
    },1000)
    $("#browser_data").attr("src","browser.html");
});

$("#file_explorer").click(function(){
    var path = "C:/Users/user/Pictures";
    fs.readdirSync(path).forEach(file => {
        fs.lstat(`${path}/${file}`, (err, stats) => {
            if (err) throw err; 
            console.log(`${file}: ${stats.isFile()}`);
        });
    });
});

$('body,html').click(function(){
    $("#wifi").addClass("animated zoomOut");
    $("#volume").addClass("animated zoomOut");
    setTimeout(() => {
        $("#wifi").removeClass("animated zoomIn");
        $("#volume").removeClass("animated zoomIn");
        $("#wifi").removeClass("animated zoomOut");
        $("#volume").removeClass("animated zoomOut");
        $("#wifi").css("display","none");
        $("#volume").css("display","none");
    },800);
});
