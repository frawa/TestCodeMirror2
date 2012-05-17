package net.codemirror.test;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.junit.AfterClass;
import org.junit.Assert;
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

	@Parameters
	public static List<Object[]> browsers() {
		ArrayList<Object[]> browsers = new ArrayList<Object[]>();
		if (System.getProperty("TestChrome", "").length()>0l) {
			browsers.add(new Object[] { "chrome" });
		} 
		if (System.getProperty("TestFirefox", "").length()>0) {
			browsers.add(new Object[] { "firefox" });
		}
		return browsers;
	}

	private static WebDriver driver = null;

	public DemoTest(String browser) {		
		driver = TestHelper.getDriver(browser,driver);
	}

	@AfterClass
	public static void afterClass() {
		if (driver != null) {
			driver.close();
		}
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

	private void moveCursor(WebElement element, int count) {
		Keys arrow = count >= 0 ? Keys.ARROW_RIGHT : Keys.ARROW_LEFT;
		count = count >= 0 ? count : -count;
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < count; i++) {
			builder.append(arrow);
			builder.append(Keys.NULL);
		}
		element.sendKeys(builder.toString());
	}

	private void clickMouseAt(WebElement element) {
		Actions actions = new Actions(driver);
		int w = element.getSize().width;
		actions.moveToElement(element, w + 1, 1).click().perform();
	}

	@Test
	public void complete() {
		URL url = TestHelper.getURL("demo/complete.html");
		driver.get(url.toString());

		WebElement v = findWord(30, "v", 0);
		// v.click();
		// moveCursor(v, 1);
		// clickMouseAt(v);
		// moveCursor(driver.findElements(By.className("CodeMirror")).get(0),1);

		Actions actions = new Actions(driver);
		int w = v.getSize().width;
		actions.moveToElement(v, w + 1, 1).click()
				.sendKeys(Keys.chord(Keys.CONTROL, Keys.SPACE)).perform();

		List<WebElement> completions = driver.findElements(By
				.className("CodeMirror-completions"));
		Assert.assertTrue("completions missing", completions.size() == 1);

		System.err.println("FW");
		// new WebDriverWait(driver, 10).until(null);
	}

	@Test
	public void complete2() {
		URL url = TestHelper.getURL("demo/complete.html");
		driver.get(url.toString());

		WebElement v = findWord(30, "v", 0);
		// v.click();
		// moveCursor(v, 1);
		// clickMouseAt(v);
		// moveCursor(driver.findElements(By.className("CodeMirror")).get(0),1);

		Actions actions = new Actions(driver);
		int w = v.getSize().width;
		actions.click(v).sendKeys(Keys.ARROW_RIGHT)
				.sendKeys(Keys.chord(Keys.CONTROL, Keys.SPACE)).perform();

		List<WebElement> completions = driver.findElements(By
				.className("CodeMirror-completions"));
		Assert.assertTrue("completions missing", completions.size() == 1);

		System.err.println("FW");
		// new WebDriverWait(driver, 10).until(null);
	}
}
