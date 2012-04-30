SmokeTest = TestCase("SmokeTest");

SmokeTest.prototype.testTestJS = function() {
	/*:DOC +=
	<pre id=output></pre>

	<div style="visibility: hidden" id=testground>
	      <form><textarea id="code" name="code"></textarea><input type=submit value=ok name=submit></form>
	</div>
	*/

	assertNotNull(document.getElementById('output'));
	assertNotNull(document.getElementById('code'));
	runTests();

	var output = document.getElementById('output');
	assertNotNull(output);
	var text = output.textContent;
	console.log('testTestJS',text);
	assertMatch("test.js failed",/All passed/,text);
};
