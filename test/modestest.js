ModesTest = AsyncTestCase("ModesTest");

ModesTest.prototype.loadModeIndexHtml = function(mode, queue, codeNodeId) {
	var path = '/test/mode/' + mode + '/index.html';
	var frame = null;
	queue.call('load ' + path, function(callbacks) {
		var doc = window.document;

		frame = doc.createElement('iframe');
		frame.id = mode;
		var handler = callbacks.add(function() {
			//jstestdriver.console.log("loaded " + path);
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

ModesTest.prototype.test_go = function(queue) {
	var mode = 'go';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(42,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('// Prime Sieve in Go.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_groovy = function(queue) {
	var mode = 'groovy';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(45,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('//Pattern for groovy script','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_haskell = function(queue) {
	var mode = 'haskell';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(33,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('-- | Find all unique permutations of a list where there might be duplicates.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_htmlmixed = function(queue) {
	var mode = 'htmlmixed';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(23,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('<!-- this is a comment -->','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_htmlembedded = function(queue) {
	var mode = 'htmlembedded';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(11,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('// also colored','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_javascript = function(queue) {
	var mode = 'javascript';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(48,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('/\\s/','cm-string-2');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_jinja2 = function(queue) {
	var mode = 'jinja2';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(17,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass(' this is a comment ','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_less = function(queue) {
	var mode = 'less';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		// IE 109, others 123
		assertTrue(119<=lines<=123);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('/* Some LESS code */','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_lua = function(queue) {
	var mode = 'lua';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(40,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('--single line comment','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_perl = function(queue) {
	var mode = 'perl';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(37,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('#!/usr/bin/perl','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_php = function(queue) {
	var mode = 'php';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(10,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('// also colored','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_pig = function(queue) {
	var mode = 'pig';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(11,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('This is a multiline comment.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_plsql = function(queue) {
	var mode = 'plsql';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(31,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('-- Oracle PL/SQL Code Demo','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_properties = function(queue) {
	var mode = 'properties';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(18,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# Unicode sequences','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_python = function(queue) {
	var mode = 'python';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(88,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# Literals','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_r = function(queue) {
	var mode = 'r';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(42,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# FUNCTIONS --','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_rpm_changes = function(queue) {
	var mode = 'rpm/changes';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(26,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('misterx@example.com','cm-string');
		assertEquals(3, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_rpm_spec = function(queue) {
	var mode = 'rpm/spec';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(72,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# spec file for package minidlna','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_rst = function(queue) {
	var mode = 'rst';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		// IE 109, others 123
		assertTrue(119<=lines<=123);

		var count;
		
		count = this.assertCodeMirrorTextHasClass(':duref:','cm-builtin');
		assertEquals(5, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_ruby = function(queue) {
	var mode = 'ruby';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		// IE 109, others 123
		assertTrue(119<=lines<=123);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('# If no more, done entirely.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_rust = function(queue) {
	var mode = 'rust';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(22,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('// Demo code.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_scheme = function(queue) {
	var mode = 'scheme';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(43,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('; Allow a sequence of patterns.','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_shell = function(queue) {
	var mode = 'shell';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(23,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('#!/bin/bash','cm-meta');
		assertEquals(1, count);

		count = this.assertCodeMirrorTextHasClass('# clone the repository','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_smalltalk = function(queue) {
	var mode = 'smalltalk';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(22,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('#MyCounter','cm-string-2');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_smarty = function(queue) {
	var mode = 'smarty';
	this.loadModeIndexHtml(mode, queue);

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(20,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('{* some example Smarty content *}','cm-comment');
		assertEquals(1, count);

		callbacks.noop()();
	});
};

ModesTest.prototype.test_smarty2 = function(queue) {
	var mode = 'smarty';
	this.loadModeIndexHtml(mode, queue,'code2');

	queue.call('assert', function(callbacks) {
		var lines = this.countCodeMirrorLines();
		assertEquals(20,lines);

		var count;
		
		count = this.assertCodeMirrorTextHasClass('"string"','cm-string');
		assertEquals(1, count);

		callbacks.noop()();
	});
};
