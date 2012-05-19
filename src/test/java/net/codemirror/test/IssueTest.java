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
public class IssueTest {

	// @Parameters(testDescription="{0}[{2}]")
	@Parameters
	public static List<Object[]> browsers() {
		return TestHelper.getBrowsers();
	}

	private WebDriver driver;

	public IssueTest(String browser) {
		driver = TestHelper.getDriver(browser);
	}

	@AfterClass
	public static void afterClass() {
		TestHelper.close();
	}
	
	@Test
	public void issue1313() {
		
	}

}
