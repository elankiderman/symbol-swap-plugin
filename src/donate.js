const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const selection = document.selectedLayers;

var pluginName = __command.pluginBundle().name();
var debugMode = false;

export default function() {
	openUrl('https://www.paypal.me/sonburn');

}

function openUrl(url) {
	NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}
