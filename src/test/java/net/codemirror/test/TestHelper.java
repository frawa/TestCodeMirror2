package net.codemirror.test;

import java.net.URL;

import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

public class TestHelper {
	public static WebDriver getDriver(String browser, WebDriver reuse) {
		Assert.assertNotNull(browser);

		if (reuse != null) {
			if (reuseableDriver(reuse, browser)) {
				return reuse;
			} else {
				closeDriver(reuse);
			}
		}

		WebDriver driver = null;
		if ("firefox".equals(browser)) {
			FirefoxProfile profile = new FirefoxProfile();
			// profile.setEnableNativeEvents(true);
			profile.setEnableNativeEvents(false);
			driver = new FirefoxDriver(profile);
		} else if ("chrome".equals(browser)) {
			DesiredCapabilities capabilities = DesiredCapabilities.chrome();
			String chromePath = System.getProperty("chrome.path",
					"/opt/google/chrome/chrome");
			if (chromePath.indexOf(';') >= 0) {
				chromePath = chromePath.substring(0, chromePath.indexOf(';'));
			}
			capabilities.setCapability("chrome.binary", chromePath);
			driver = new ChromeDriver(capabilities);
		} else if ("iexplorer".equals(browser)) {
			driver = new InternetExplorerDriver();
		}
		return driver;
	}

	private static boolean reuseableDriver(WebDriver reuse, String browser) {
		return ("firefox".equals(browser) && reuse instanceof FirefoxDriver)
				|| ("chrome".equals(browser) && reuse instanceof ChromeDriver)
				|| ("iexplorer".equals(browser) && reuse instanceof InternetExplorerDriver);
	}

	public static void closeDriver(WebDriver driver) {
		driver.close();
	}

	public static URL getURL(String file) {
		URL url = TestHelper.class.getClassLoader().getResource(file);
		Assert.assertNotNull(url);
		return url;
	}

}
