const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', () => {
mainWindow = new BrowserWindow({
    frame: true, //false in production
    icon: path.join(__dirname, 'img/icon.png'),
});
mainWindow.maximize();
mainWindow.loadFile('index.html');
mainWindow.on('closed', function(){
    app.quit();
});
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu); //null in production
});

//create menu
const mainMenuTemplate = [];

//mac thingy 
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu:[
            {
            label: 'Toggle DevTools',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
         },
         {
            role: 'reload'
         }
        ]
    });
}