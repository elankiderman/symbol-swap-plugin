/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/webview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}); // call the plugin from the webview
// document.getElementById('button').addEventListener('click', () => {
//   window.postMessage('nativeLog', 'Called from the webview')
// })
// call the wevbiew from the plugin

window.sendMessage = function (message) {
  console.log('updateMessage ');
  displayMessage(message);
  clearDropdowns();
};

function displayMessage(message) {
  document.getElementById('answer').innerHTML = message;
}

function clearMessage() {
  document.getElementById('answer').innerHTML = '';
}

window.loadDropdowns = function (dropdownArray) {
  clearMessage();
  clearDropdowns();
  var container = document.createElement("div");
  container.id = "container";

  for (var i = 0; i < dropdownArray.length; i++) {
    var div = document.createElement("div");
    var select = document.createElement("select");
    select.addEventListener("change", dropdownChanged);
    var sortedOptions = dropdownArray[i].slice();

    if (isNaN(sortedOptions[0])) {
      sortedOptions.sort();
    } else {
      sortedOptions.sort(function (a, b) {
        return a - b;
      });
    }

    var selectedIndex = 0;
    var selectedValue = dropdownArray[i][0];

    for (var j = 0; j < sortedOptions.length; j++) {
      var option = document.createElement("option");
      option.text = sortedOptions[j];
      option.value = sortedOptions[j];

      if (sortedOptions[j] == selectedValue) {
        selectedIndex = j;
      }

      select.add(option);
    }

    if (select.length == 1) {
      select.disabled = true;
    }

    select.selectedIndex = selectedIndex;
    div.appendChild(select);
    container.appendChild(div);
  }

  document.body.appendChild(container);
};

function clearDropdowns() {
  var existingContainer = document.getElementById("container");

  if (existingContainer) {
    existingContainer.parentNode.removeChild(existingContainer);
  }
}

function dropdownChanged() {
  var dropdowns = document.getElementsByTagName("select"); //document.getElementById('answer').innerHTML = dropdowns.length;

  var symbolStringArray = [];

  for (var i = 0; i < dropdowns.length; i++) {
    var e = dropdowns[i];
    symbolStringArray.push(e.value);
  }

  var symbolString = symbolStringArray.join('/');
  window.postMessage('dropdownChanged', symbolString); //document.getElementById('answer').innerHTML = symbolString;
}

/***/ })

/******/ });
//# sourceMappingURL=webview.js.map