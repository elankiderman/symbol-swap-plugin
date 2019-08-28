import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from 'sketch'
const Style = sketch.Style
const symbolMaster = sketch.symbolMaster
const document = sketch.getSelectedDocument();
const deviceKey = ['desktop (2000)', 'desktop (1440)', 'desktop (1200)', 'desktop', 'tablet', 'mobile'];
const themeKey = ['light', 'dark'];
const sizeKey = ['small', 'medium', 'large'];

const webviewIdentifier = 'my-plugin.webview'
const doc = sketch.getSelectedDocument()
var selectedLayers;

export default function () {
  selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;
  var dropdownArray;

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected')
  }
  else if(selectedCount > 1) {
    sketch.UI.message('Please select a single layer')
  }
  else {
    dropdownArray = iterateLayers(selectedLayers);
  }

  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
    alwaysOnTop: true,
    x:200,
    y:800,
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents


  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!!!!')
    webContents
      .executeJavaScript(`loadDropdowns(${JSON.stringify(dropdownArray)})`)
      .catch(console.error)
  })

  //add a handler for a call from web content's javascript
  webContents.on('dropdownChanged', symbolString => {
    //replace the symbol
    selectedLayers = doc.selectedLayers;

    var layer = selectedLayers.layers[0]

    var isSymbol = (layer.type == 'SymbolInstance')

    var master = getMasterFromLayer(layer);
    var originLibrary = master.getLibrary();
    var symbolReferences = getReferencesFromMaster(master);

    var newSymbols = symbolReferences.filter(symbol => {
      return symbol.name === symbolString;
    })





    if(originLibrary) {
      var newMaster = newSymbols[0].import();
    }
    else {
      var newMaster = newSymbols[0];
    }

    if(isSymbol) {
      layer.master = newMaster;

      layer.frame.width = newMaster.frame.width;
      layer.frame.height = newMaster.frame.height;
    }
    else {
      layer.sharedStyle = newMaster;
      layer.style.fontFamily = newMaster.style.fontFamily;
      layer.style.fontWeight = newMaster.style.fontWeight;
      layer.style.fontSize = newMaster.style.fontSize;
      layer.style.lineHeight = newMaster.style.lineHeight;
    }



    var newSelectedLayers = doc.selectedLayers;

    dropdownArray = iterateLayers(newSelectedLayers);

    webContents
      .executeJavaScript(`loadDropdowns(${JSON.stringify(dropdownArray)})`)
      .catch(console.error)

    sketch.UI.message(symbolString)
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

function iterateLayers(selectedLayers) {
  var dropdownArray;
  var layer = selectedLayers.layers[0]
  if (layer.type == 'SymbolInstance' || layer.type == 'Text') {
    dropdownArray = swapSymbol(layer)
  }
  else {
    sketch.UI.message('not a symbol or text with style')
  }

  return dropdownArray;

}

function swapSymbol(layer) {
  var master = getMasterFromLayer(layer);

  var name = master.name;
  var splitName = name.split('/')

  var symbolReferences = getReferencesFromMaster(master);


  var relatedSymbols = [];
  for(var i = 0; i < symbolReferences.length; i++) {
    var relatedName = symbolReferences[i].name;
    var splitRelatedName = relatedName.split("/")
    var difference = compare(splitName,splitRelatedName);
    if(difference) {
      relatedSymbols.push(difference);
    }
  }

  var dropdownArray = [];
  for(var i = 0; i < splitName.length; i++) {
    dropdownArray.push([splitName[i]])
  }

  for(var i = 0; i < relatedSymbols.length; i++) {
    var relatedSymbol = relatedSymbols[i];
    var index = relatedSymbol[0]
    var name = relatedSymbol[1]
    dropdownArray[index].push(name)
  }


  return dropdownArray;
}

function compare(arr1,arr2){
  //return true if there is exactly one different element
  var difference;

  var count = 0;
  if(arr1.length != arr2.length) {
    return false
  }
  else {
    for(var i = 0; i < arr1.length; i++) {
      if(arr1[i] != arr2[i]) {
        difference =[i,arr2[i]];
        count++;
      }
    }
  }

  if(count == 1) {
    return difference;
  }
  else {
    return null;
  }


}

function getMasterFromLayer(layer){
  var isSymbol = (layer.type == 'SymbolInstance');

  if (isSymbol) {
    var key = deviceKey;
    var master = layer.master;
  }
  else {
    var styleId = layer.sharedStyleId;
    var master = document.getSharedTextStyleWithID(styleId);
  }

  return master;
}

function getReferencesFromMaster(master){
  var isSymbol = (master.type == 'SymbolMaster');


  var existingSymbolsArray = [];

  var originLibrary = master.getLibrary();


  //get all of the symbols from the library
  var symbolReferences;
  if(isSymbol) {
    if(originLibrary) {
      symbolReferences = originLibrary.getImportableSymbolReferencesForDocument(document);
    }
    else {
      symbolReferences = document.getSymbols();
    }
  }
  else {
    if(originLibrary) {
      symbolReferences = originLibrary.getImportableTextStyleReferencesForDocument(document);
    }
    else {
      sketch.UI.message('doesn\'t have a library text style')
    }
  }


  return symbolReferences;
}


export function onSelectionChanged() {
  if (isWebviewPresent(webviewIdentifier)) {
    const doc = sketch.getSelectedDocument()
    selectedLayers = doc.selectedLayers;
    const selectedCount = selectedLayers.length;
    var dropdownArray;


    if (selectedCount === 0) {
      showMessage('No layers are selected')
    }
    else if(selectedCount > 1) {
      showMessage('Please select a single layer')
    }
    else {
      dropdownArray = iterateLayers(selectedLayers);

      sendToWebview(webviewIdentifier, `loadDropdowns(${JSON.stringify(dropdownArray)})`)
    }
  }
}

export function showMessage(message) {
  if (isWebviewPresent(webviewIdentifier)) {
    sendToWebview(webviewIdentifier, `sendMessage(${JSON.stringify(message)})`)
  }
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
