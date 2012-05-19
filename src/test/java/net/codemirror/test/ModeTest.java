package net.codemirror.test;

import java.net.URL;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

@RunWith(Parameterized.class)
public class ModeTest {

	// @Parameters(testDescription="{0}[{2}]")
	@Parameters
	public static List<Object[]> browsers() {
		return TestHelper.getBrowsers();
	}

	private WebDriver driver;

	public ModeTest(String browser) {
		driver = TestHelper.getDriver(browser);
	}

	@AfterClass
	public static void afterClass() {
		TestHelper.close();
	}

	private int countLines(String text) {
		return StringUtils.countMatches(text, "\n") + 1;
		// return text.split("\n").length;
	}

	private int countSourceLines() {
		WebElement code = driver.findElement(By.id("code"));
		String text = code.getAttribute("value");
		return countLines(text);
	}

	private int countCodeMirrorLines() {
		WebElement codeMirror = driver.findElement(By
				.className("CodeMirror-lines"));
		return codeMirror.findElements(By.tagName("pre")).size() - 1;
	}

	private void assertLineCount() {
		int sourceLines = countSourceLines();
		int codeMirrorLines = countCodeMirrorLines();
		Assert.assertEquals("number of lines", sourceLines, codeMirrorLines);
	}

	private void loadMode(String mode) {
		URL url = TestHelper.getURL("mode/" + mode + "/index.html");
		Assert.assertNotNull(url);
		driver.get(url.toString());
		assertLineCount();
	}

	@Test
	public void clike() {
		loadMode("clike");
	}

	@Test
	public void clojure() {
		loadMode("clojure");
	}

	@Test
	@Ignore
	public void coffeescript() {
		loadMode("coffeescript");
	}

	@Test
	public void css() {
		loadMode("css");
	}

	@Test
	public void diff() {
		loadMode("diff");
	}

	@Test
	public void ecl() {
		loadMode("ecl");
	}

	@Test
	public void gfm() {
		loadMode("gfm");
	}

	@Test
	public void go() {
		loadMode("go");
	}

	@Test
	public void groovy() {
		loadMode("groovy");
	}

	@Test
	public void haskell() {
		loadMode("haskell");
	}

	@Test
	public void htmlembedded() {
		loadMode("htmlembedded");
	}

	@Test
	public void htmlmixed() {
		loadMode("htmlmixed");
	}

	@Test
	public void javascript() {
		loadMode("javascript");
	}

	@Test
	public void jinja2() {
		loadMode("jinja2");
	}

	@Test
	@Ignore
	public void less() {
		loadMode("less");
	}

	@Test
	public void lua() {
		loadMode("lua");
	}

	@Test
	@Ignore
	public void markdown() {
		loadMode("markdown");
	}

	@Test
	public void mysql() {
		loadMode("mysql");
	}

	@Test
	@Ignore
	public void ntriples() {
		loadMode("ntriples");
	}

	@Test
	public void pascal() {
		loadMode("pascal");
	}

	@Test
	public void perl() {
		loadMode("perl");
	}

	@Test
	public void php() {
		loadMode("php");
	}

	@Test
	public void pig() {
		loadMode("pig");
	}

	@Test
	public void plsql() {
		loadMode("plsql");
	}

	@Test
	public void properties() {
		loadMode("properties");
	}

	@Test
	public void python() {
		loadMode("python");
	}

	@Test
	public void r() {
		loadMode("r");
	}

	@Test
	public void rpm_changes() {
		loadMode("rpm/changes");
	}

	@Test
	public void rpm_spec() {
		loadMode("rpm/spec");
	}

	@Test
	@Ignore
	public void rst() {
		loadMode("rst");
	}

	@Test
	@Ignore
	public void ruby() {
		loadMode("ruby");
	}

	@Test
	public void rust() {
		loadMode("rust");
	}

	@Test
	public void scheme() {
		loadMode("scheme");
	}

	@Test
	public void shell() {
		loadMode("shell");
	}

	@Test
	public void smalltalk() {
		loadMode("smalltalk");
	}

	@Test
	public void smarty() {
		loadMode("smarty");
	}

	@Test
	public void sparql() {
		loadMode("sparql");
	}

	@Test
	public void stex() {
		loadMode("stex");
	}

	@Test
	public void tiddlywiki() {
		loadMode("tiddlywiki");
	}

	@Test
	public void tiki() {
		loadMode("tiki");
	}

	@Test
	public void vbscript() {
		loadMode("vbscript");
	}

	@Test
	public void velocity() {
		loadMode("velocity");
	}

	@Test
	@Ignore
	public void verilog() {
		loadMode("verilog");
	}

	@Test
	public void xml() {
		loadMode("xml");
	}

	@Test
	@Ignore
	public void xquery() {
		loadMode("xquery");
	}

	@Test
	public void yaml() {
		loadMode("yaml");
	}

	@Test
	public void erlang() {
		loadMode("erlang");
	}
}
