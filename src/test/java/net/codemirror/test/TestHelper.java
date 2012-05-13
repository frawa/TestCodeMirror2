package net.codemirror.test;

import static org.testng.AssertJUnit.assertNotNull;

import java.net.URL;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;

public class TestHelper {
	private static String defaultBrowser = System.getProperty("browser",
			"firefox");

	public static WebDriver getDriver(String browser) {
		WebDriver driver = null;
		if (browser == null) {
			browser = defaultBrowser;
		}
		if ("firefox".equals(browser)) {
			FirefoxProfile profile = new FirefoxProfile();
			//profile.setEnableNativeEvents(true);
			profile.setEnableNativeEvents(false);
			driver = new FirefoxDriver(profile);
		} else if ("chrome".equals(browser)) {
			DesiredCapabilities capabilities = DesiredCapabilities.chrome();
			String chromePath = System.getProperty("chrome.path",
					"/opt/google/chrome/chrome");
			if ( chromePath.indexOf(';')>=0) {
				chromePath = chromePath.substring(0,chromePath.indexOf(';'));
			}
			capabilities.setCapability("chrome.binary", chromePath);
			driver = new ChromeDriver(capabilities);
		}
		return driver;
	}

	public static URL getURL(String file) {
		URL url = TestHelper.class.getClassLoader().getResource(file);
		assertNotNull(url);
		return url;
	}

}
