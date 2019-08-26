// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
// document.getElementById('button').addEventListener('click', () => {
//   window.postMessage('nativeLog', 'Called from the webview')
// })

// call the wevbiew from the plugin
window.sendMessage = (message) => {
  console.log('updateMessage ')
  displayMessage(message)
  clearDropdowns();
}

function displayMessage(message) {
  document.getElementById('answer').innerHTML = message
}

function clearMessage() {
    document.getElementById('answer').innerHTML = ''
}

window.loadDropdowns = (dropdownArray) => {
  clearMessage();
  clearDropdowns();

  var container = document.createElement("div");
  container.id = "container";


  for(var i = 0; i < dropdownArray.length; i++) {
    var div = document.createElement("div");
    var select = document.createElement("select");
    select.addEventListener("change",dropdownChanged)

    for(var j = 0; j < dropdownArray[i].length; j++) {
      var option = document.createElement("option");
      option.text = dropdownArray[i][j];
      option.value = dropdownArray[i][j];
      select.add(option)
    }

    if(select.length == 1) {
      select.disabled = true

    }
    div.appendChild(select)
    container.appendChild(div)
  }
  document.body.appendChild(container)

}

function clearDropdowns() {
  var existingContainer = document.getElementById("container");

  if(existingContainer) {
    existingContainer.parentNode.removeChild(existingContainer);
  }
}

function dropdownChanged() {

  var dropdowns = document.getElementsByTagName("select")
  //document.getElementById('answer').innerHTML = dropdowns.length;
  var symbolStringArray = [];
  for(var i = 0; i < dropdowns.length; i++) {
    var e = dropdowns[i];
    symbolStringArray.push(e.value);
  }
  var symbolString = symbolStringArray.join('/')

  window.postMessage('dropdownChanged', symbolString)

  //document.getElementById('answer').innerHTML = symbolString;
}
