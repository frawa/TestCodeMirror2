package net.codemirror.test;

import java.util.List;

import org.junit.AfterClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.openqa.selenium.WebDriver;

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
