package net.codemirror.test;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Assume;
import org.junit.Rule;
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

	//@Parameters(testDescription="{0}[{2}]")
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

	private WebElement findWord(int row, String colText, int occurence) {
		WebElement linesContainer = driver.findElements(
				By.className("CodeMirror-lines")).get(0);
		Assert.assertNotNull(linesContainer);

		List<WebElement> lines = linesContainer.findElements(By.tagName("pre"));
		// row is zero-based, lines.get(0) is a helper pre
		WebElement line = lines.get(row);

		List<WebElement> found = line.findElements(By.xpath("*[text()=\""
				+ colText + "\"]"));
		Assert.assertTrue("row #" + row + " does not contain " + colText,
				found.size() > 0);
		Assert.assertTrue("row #" + row + " does not contain " + occurence
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
		int w = v.getSize().width;
		actions.click(v).sendKeys(Keys.ARROW_RIGHT)
				.sendKeys(Keys.chord(Keys.CONTROL, Keys.SPACE)).perform();

		List<WebElement> completions = driver.findElements(By
				.className("CodeMirror-completions"));
		Assert.assertTrue("completions missing", completions.size() == 1);
	}
}
