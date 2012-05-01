ModesTest = AsyncTestCase("ModesTest");

ModesTest.prototype.loadModeIndexHtml = function(mode, queue) {
	var path = '/test/mode/' + mode + '/index.html';
	queue.call('load ' + path, function(callbacks) {
		var doc = window.document;
		var frame = doc.createElement('iframe');
		frame.src = path;
		frame.id = mode;
		var handler = callbacks.add(function() {
			jstestdriver.console.log("loaded " + path);
		});
		frame.onload = function() {
			handler();
		};
		doc.body.appendChild(frame);
	});

	queue.call('discover CodeMirror ', function(callbacks) {
		var frame = window.document.getElementById(mode);
		var doc = frame.contentWindow.document;
		this.discoverCodeMirror(doc);
		callbacks.noop()();
	});
};

ModesTest.prototype._code = null;
ModesTest.prototype._codeMirror = null;
ModesTest.prototype._lines = null;

ModesTest.prototype.discoverCodeMirror = function(doc) {
	var code = doc.getElementById('code');
	assertNotNull('code missing', code);
	this._code = code;

	var codeMirror = this.getElementsByClassName(doc, 'div', 'CodeMirror')[0];
	assertNotNull('CodeMirror missing', codeMirror);
	assertNotUndefined('CodeMirror missing', codeMirror);
	this._codeMirror = codeMirror;

	var lines = this.getElementsByClassName(codeMirror, 'div',
			'CodeMirror-lines')[0];
	assertNotNull('CodeMirror-lines missing', codeMirror);
	this._lines = lines;
};

ModesTest.prototype.getElementsByClassName = function(element, tag, className) {
	var result = [];
	var match = new RegExp("(^|\\s)" + className + "(\\s|$)");
	var candidates = element.getElementsByTagName(tag);
	for ( var i = 0; i < candidates.length; i++) {
		if (match.test(candidates[i].className)) {
			result.push(candidates[i]);
		}
	}
	return result;
};

ModesTest.prototype.countCodeMirrorLines = function() {
	var count = this._lines.getElementsByTagName('pre').length;
	return count - 1;
};

ModesTest.prototype.test_clike = function(queue) {
	var mode = 'clike';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(66, lines);
		callbacks.noop()();
	});
};
