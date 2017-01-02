'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');
var shell = require('shell');
var mkdirp = require('mkdirp');
var storage = require('./assets/js/storage');

require('crash-reporter').start();
// require('electron-debug')();

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  /** Create Log Directory **/
  mkdirp(__dirname + '/logs', function (err) {
    if (err) {
      console.error(err);
    }
  });

  /** Application Menu **/
  Menu.setApplicationMenu(menu);

  /** Tray Icon **/
  var appIcon = new Tray(__dirname + '/assets/favicon/favicon-16x16.png');
  /** Add context menu **/
  var contextMenu = Menu.buildFromTemplate([
    {label: 'Open Web Site', accelerator: 'Command+O', click: function() {
      shell.openExternal('http://slide.meguro.ryuzee.com');
    }},
    {type: 'separator'},
    {label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); }}
  ]);
  appIcon.setContextMenu(contextMenu);
  // Show tip when mouseover
  appIcon.setToolTip('SlideHub / No Sushi, No Life');

  processWindow();

});

function processWindow() {
  var lastWindowState = storage.get("lastWindowState");
  if (lastWindowState === null) {
    lastWindowState = {
      width: 800,
      height: 720,
      maximized: false
    };
  }

  var win = new BrowserWindow({
    // frame: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height});

  if (lastWindowState.maximized) {
    win.maximize();
  }

  win.loadUrl('file://' + __dirname + '/index.html');
  win.on('closed', function () {
    win = null;
  });

  win.on('close', function () {
    var bounds = win.getBounds();
    storage.set("lastWindowState", {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: win.isMaximized()
    });
    console.log("Save configuration completed...");
  });
}

/** Create menu **/
var template = [
  {
    label: 'SlideHub',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit(); }
      }
    ]
  }, {
    label: 'File',
    submenu: [
      {label: 'Open Web Site', accelerator: 'Command+O', click: function() {
        shell.openExternal('http://slide.meguro.ryuzee.com');
      }}
    ]
  }
];
var menu = Menu.buildFromTemplate(template);

// vim: ts=2 sts=2 sw=2 expandtab
