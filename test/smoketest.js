SmokeTest = AsyncTestCase("SmokeTest");

// SmokeTest.prototype.setUp = function(queue) {
// };

SmokeTest.prototype.loadStyle = function(path, queue) {
	queue.call('load ' + path, function(callbacks) {
		var doc = window.document;
		var element = doc.createElement('link');
		element.rel = 'stylesheet';
		element.href = path;
		doc.body.appendChild(element);
		callbacks.add(function() {
			jstestdriver.console.log("loaded " + path);
		})();
	});
};

SmokeTest.prototype.loadScript = function(path, queue) {
	queue.call('load ' + path, function(callbacks) {
		var doc = window.document;
		var element = doc.createElement('script');
		element.src = path;
		var handler = callbacks.add(function() {
			jstestdriver.console.log("loaded " + path);
		});
		element.onload = element.onreadystatechange = function() {
			if (this.readyState==undefined || this.readyState == 'complete' || this.readyState == 'loaded') {
				element.onreadystatechange = element.onload = null;
				handler();
			}
		};
		doc.body.appendChild(element);
	});
};

SmokeTest.prototype.testTestJS = function(queue) {
	this.loadStyle('/test/lib/codemirror.css', queue);
	this.loadScript('/test/lib/codemirror.js', queue);
	this.loadScript('/test/mode/javascript/javascript.js', queue);
	this.loadScript('/test/test/test.js', queue);

	queue.call('runTests', function(callbacks) {
		/*:DOC +=
		 * 
		 * <pre id=output></pre>
		 * 
		 * <div style="visibility: hidden" id=testground> <form><textarea
		 * id="code" name="code"></textarea><input type=submit value=ok
		 * name=submit></form> </div>
		 */

		assertNotNull("empty output",document.getElementById('output'));
		assertNotNull("code",document.getElementById('code'));

		window.runTests();

		var output = document.getElementById('output');
		assertNotNull("result output",output);

		var text = output.textContent;
		jstestdriver.console.log('testTestJS', text);

		assertMatch("test.js failed", /All passed/, text);

		callbacks.noop()();
	});

};
