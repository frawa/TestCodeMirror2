ModesTest = AsyncTestCase("ModesTest");

ModesTest.prototype.loadModeIndexHtml = function(mode, queue, codeNodeId) {
	var path = '/test/mode/' + mode + '/index.html';
	var frame = null;
	queue.call('load ' + path, function(callbacks) {
		var doc = window.document;

		frame = doc.createElement('iframe');
		frame.id = mode;
		var handler = callbacks.add(function() {
			jstestdriver.console.log("loaded " + path);
		});
		frame.src = path;
		frame.onload = function() {
			if (this.readyState == undefined || this.readyState == 'complete'
					|| this.readyState == 'loaded') {
				frame.onload = null;
				handler();
			}
		};
		doc.body.appendChild(frame);
		if (jstestdriver.global.LCOV) {
			frame.contentWindow.LCOV = jstestdriver.global.LCOV;
		}
	});

	/*
	 * queue.call('wait CodeMirror', function(callbacks) { // wait some more var
	 * t = null; var done = callbacks.add(function() { if (t) {
	 * window.clearInterval(t); t = null; } }); var doc =
	 * frame.contentWindow.document; assertNotNull(doc); var that = this; t =
	 * window.setInterval(function() { var codeMirror =
	 * that.getElementsByClassName(doc, 'div', 'CodeMirror')[0]; if (codeMirror) {
	 * done(); } }, 500); });
	 */

	queue.call('discover CodeMirror', function(callbacks) {
		assertNotNull(frame);
		var doc = frame.contentWindow.document;
		assertNotNull(doc);
		this.discoverCodeMirror(doc,codeNodeId);
		callbacks.noop()();
	});
};

ModesTest.prototype._code = null;
ModesTest.prototype._codeMirror = null;
ModesTest.prototype._lines = null;

ModesTest.prototype.discoverCodeMirror = function(doc,codeNodeId) {
	var id = codeNodeId?codeNodeId:'code'
	var code = doc.getElementById(id);
	assertNotNull('code missing with id '+id, code);
	this._code = code;

	var codeMirror = this.getElementsByClassName(doc, 'div', 'CodeMirror')[0];
	assertNotNull('CodeMirror missing', codeMirror);
	assertNotUndefined('CodeMirror missing', codeMirror);
	this._codeMirror = codeMirror;

	var lines = this.getElementsByClassName(codeMirror, 'div',
			'CodeMirror-lines')[0];
	assertNotNull('CodeMirror-lines missing', lines);
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

ModesTest.prototype.getElementsByText = function(element, tag, text) {
	var result = [];
	var candidates = element.getElementsByTagName(tag);
	for ( var i = 0; i < candidates.length; i++) {
		if (text === candidates[i].textContent) {
			result.push(candidates[i]);
		}
	}
	return result;
};

ModesTest.prototype.countCodeMirrorLines = function() {
	var count = this._lines.getElementsByTagName('pre').length;
	return count - 1;
};

ModesTest.prototype.assertCodeMirrorTextHasClass = function(text, className) {
	var match = new RegExp("(^|\\s)" + className + "(\\s|$)");
	var elements = this.getElementsByText(this._lines, 'span', text);
	for (e in elements) {
		// TODO find coord for e
		assertTrue('unexpected "' + elements[e].className + '" for "'
				+ elements[e].textContent + '"', match
				.test(elements[e].className));
	}
	return elements.length;
};

ModesTest.prototype.test_clike = function(queue) {
	var mode = 'clike';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(66, lines);

		var count;

		count = this.assertCodeMirrorTextHasClass('/* C demo code */',
				'cm-comment');
		assertEquals(1, count);

		count = this.assertCodeMirrorTextHasClass('void', 'cm-keyword');
		assertEquals(8, count);

		count = this.assertCodeMirrorTextHasClass('pthread_create', 'cm-word');
		assertEquals(1, count);

		count = this.assertCodeMirrorTextHasClass('*', 'cm-operator');
		assertEquals(13, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_clojure = function(queue) {
	var mode = 'clojure';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(45, lines);

		var count;

		count = this.assertCodeMirrorTextHasClass(';; Launches an example board',
				'cm-comment');
		assertEquals(1, count);

		count = this.assertCodeMirrorTextHasClass('defn', 'cm-keyword');
		assertEquals(4, count);

		count = this.assertCodeMirrorTextHasClass(':doc', 'cm-atom');
		assertEquals(2, count);

		count = this.assertCodeMirrorTextHasClass('"Conway\'s Game of Life."', 'cm-string');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_coffeescript = function(queue) {
	var mode = 'coffeescript';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		// The document has 697 lines, but only 123 are rendered.
		
		var lines = this.countCodeMirrorLines();
		//assertEquals(697, lines);
		// IE 109, others 123
		assertTrue(119<=lines<=123);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# Current version.','cm-comment');
		assertEquals(1, count);

		count = this.assertCodeMirrorTextHasClass('this', 'cm-keyword');
		assertEquals(1, count);

		// TODO scroll the document
		//count = this.assertCodeMirrorTextHasClass('# Aliases','cm-comment');		
		
		count = this.assertCodeMirrorTextHasClass('true', 'cm-atom');
		assertEquals(0, count);

		count = this.assertCodeMirrorTextHasClass('/\\n/', 'cm-string');
		assertEquals(0, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_css = function(queue) {
	var mode = 'css';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(34,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('/* Some example CSS */','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_diff = function(queue) {
	var mode = 'diff';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(77,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('--- a/index.html','cm-minus');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_ecl = function(queue) {
	var mode = 'ecl';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(17,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('//  this is a singleline comment!','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_xml = function(queue) {
	var mode = 'xml';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(11,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('<!-- this is a comment -->','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_markdown = function(queue) {
	var mode = 'markdown';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		// IE 109, others 123
		assertTrue(119<=lines<=123);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('## Paragraphs, Headers, Blockquotes ##','cm-header');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_gfm = function(queue) {
	var mode = 'gfm';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(16,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('// log them','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_mysql = function(queue) {
	var mode = 'mysql';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(16,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('-- Comment for the code','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_ntriples = function(queue) {
	var mode = 'ntriples';
	this.loadModeIndexHtml(mode, queue, 'ntriples');

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(7,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('"literal 2"','cm-string');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_pascal = function(queue) {
	var mode = 'pascal';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(22,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('(* Example Pascal code *)','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};
