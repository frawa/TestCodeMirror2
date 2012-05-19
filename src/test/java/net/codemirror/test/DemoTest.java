package net.codemirror.test;

import java.net.URL;
import java.util.List;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Assume;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

@RunWith(Parameterized.class)
public class DemoTest {

	// @Parameters(testDescription="{0}[{2}]")
	@Parameters
	public static List<Object[]> browsers() {
		return TestHelper.getBrowsers();
	}

	private WebDriver driver;

	public DemoTest(String browser) {
		driver = TestHelper.getDriver(browser);
	}

	@AfterClass
	public static void afterClass() {
		TestHelper.close();
	}

	private int getLinesToSkip(List<WebElement> lines) {
		// skip to zero line pre, of class CodeMirror-cursor
		int skip = 0;
		for (; skip < lines.size(); skip++) {
			if ("CodeMirror-cursor".equals(lines.get(skip)
					.getAttribute("class"))) {
				break;
			}
		}
		return skip;
	}

	private WebElement getTextLine(List<WebElement> lines, int lineno) {
		int skip = getLinesToSkip(lines);
		for (int i=skip+lineno; i<lines.size(); i++) {
			WebElement line = lines.get(i);
			// pre's for meta purposes have classes set
			if ( line.getAttribute("class").length()==0 ) {
				return line;
			}
		}
		Assert.fail("no test line #"+lineno);
		return null;
	}
	
	private WebElement findWord(int lineno, String colText, int occurence) {
		WebElement linesContainer = driver.findElements(
				By.className("CodeMirror-lines")).get(0);
		Assert.assertNotNull(linesContainer);

		List<WebElement> lines = linesContainer.findElements(By.tagName("pre"));
		WebElement line = getTextLine(lines,lineno);

		List<WebElement> found = line.findElements(By.xpath("*[text()=\""
				+ colText + "\"]"));
		Assert.assertTrue("row #" + lineno + " does not contain " + colText,
				found.size() > 0);
		Assert.assertTrue("row #" + lineno + " does not contain " + occurence
				+ " times " + colText, found.size() > occurence);

		WebElement result = found.get(occurence);
		Assert.assertTrue(result.getText().equals(colText));

		return result;
	}

	@Test
	public void complete() {
		Assume.assumeTrue(TestHelper.hasNativeEvents(driver));

		URL url = TestHelper.getURL("demo/complete.html");
		driver.get(url.toString());

		WebElement v = findWord(30, "v", 0);

		Actions actions = new Actions(driver);
		int w = v.getSize().width;
		actions.moveToElement(v, w + 1, 1).click()
				.sendKeys(Keys.chord(Keys.CONTROL, Keys.SPACE)).perform();

		List<WebElement> completions = driver.findElements(By
				.className("CodeMirror-completions"));
		Assert.assertTrue("completions missing", completions.size() == 1);
	}

	@Test
	public void complete2() {
		URL url = TestHelper.getURL("demo/complete.html");
		driver.get(url.toString());

		WebElement v = findWord(30, "v", 0);

		Actions actions = new Actions(driver);
		actions.click(v).sendKeys(Keys.ARROW_RIGHT)
				.sendKeys(Keys.chord(Keys.CONTROL, Keys.SPACE)).perform();

		List<WebElement> completions = driver.findElements(By
				.className("CodeMirror-completions"));
		Assert.assertTrue("completions missing", completions.size() == 1);
	}

	private WebElement assertClass(String className, int lineno) {
		WebElement linesContainer = driver.findElements(
				By.className("CodeMirror-lines")).get(0);
		Assert.assertNotNull(linesContainer);

		List<WebElement> lines = linesContainer.findElements(By.tagName("pre"));

		WebElement line = lines.get(getLinesToSkip(lines) + lineno);
		Assert.assertNotNull("no line #" + lineno, line);
		Assert.assertEquals(className, line.getAttribute("class"));

		return line;
	}

	private void assertNotClass(String className, int lineno) {
		WebElement linesContainer = driver.findElements(
				By.className("CodeMirror-lines")).get(0);
		Assert.assertNotNull(linesContainer);

		List<WebElement> lines = linesContainer.findElements(By.tagName("pre"));
		WebElement line = lines.get(getLinesToSkip(lines) + lineno);
		Assert.assertNotNull("no line #" + lineno, line);
		Assert.assertTrue("unexpected class " + className,
				!className.equals(line.getAttribute("class")));
	}

	private Actions sendKeys(Actions actions, Keys keys, int count) {
		for (int i = 0; i < count; i++) {
			actions = actions.sendKeys(keys);
		}
		return actions;
	}

	@Test
	public void activeline() {
		URL url = TestHelper.getURL("demo/activeline.html");
		driver.get(url.toString());

		assertClass("activeline", 1);

		WebElement c = findWord(5, "<channel>", 0);
		c.click();
		assertNotClass("activeline", 1);
		assertClass("activeline", 5);

		c = findWord(5, "<channel>", 0);
		Actions actions = new Actions(driver);
		actions.click(c).sendKeys(Keys.ARROW_DOWN).build().perform();
		assertNotClass("activeline", 5);
		assertClass("activeline", 6);
		
		c = findWord(5, "<channel>", 0);
		Actions actions2 = new Actions(driver);
		actions2.click(c).sendKeys(Keys.DOWN).build().perform();
		assertNotClass("activeline", 5);
		assertClass("activeline", 6);

		c = findWord(5, "<channel>", 0);
		Actions actions3 = new Actions(driver);
		sendKeys(actions3.click(c), Keys.ARROW_DOWN, 5).build().perform();
		assertNotClass("activeline", 5);
		assertClass("activeline", 10);
	}
}
