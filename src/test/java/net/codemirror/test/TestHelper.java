package net.codemirror.test;

import java.net.URL;
import java.util.ArrayList;

import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import com.opera.core.systems.OperaDriver;

public class TestHelper {
	private static boolean firefoxWithNativeEvents = Boolean.getBoolean("firefox.native.events");
	private static WebDriver currentDriver = null;

	public static ArrayList<Object[]> getBrowsers() {
		ArrayList<Object[]> browsers = new ArrayList<Object[]>();
		if (System.getProperty("TestChrome", "").length() > 0l) {
			browsers.add(new Object[] { "chrome" });
		}
		if (System.getProperty("TestFirefox", "").length() > 0) {
			browsers.add(new Object[] { "firefox" });
		}
		if (System.getProperty("TestOpera", "").length() > 0) {
			browsers.add(new Object[] { "opera" });
		if (System.getProperty("TestIExplorer", "").length() > 0) {
			browsers.add(new Object[] { "iexplorer" });
		}
		// default is firefox
		if (browsers.isEmpty()) {
			browsers.add(new Object[] { "firefox" });
		}
		return browsers;
	}

	public static void close() {
		if (currentDriver != null) {
			currentDriver.close();
			currentDriver = null;
		}
	}

	public static WebDriver getDriver(String browser) {
		Assert.assertNotNull(browser);

		if (currentDriver != null) {
			if (reuseableDriver(currentDriver, browser)) {
				return currentDriver;
			} else {
				close();
			}
		}

		WebDriver driver = null;
		if ("firefox".equals(browser)) {
			FirefoxProfile profile = new FirefoxProfile();
			profile.setEnableNativeEvents(firefoxWithNativeEvents);
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
		} else if ("opera".equals(browser)) {
			DesiredCapabilities capabilities = DesiredCapabilities.opera();
			// capabilities.setCapability("opera.binary", "/usr/bin/opera");
			// capabilities.setCapability("opera.log.level", "CONFIG");
			capabilities.setCapability("opera.port", -1);
			capabilities.setCapability("opera.profile", "");
			driver = new OperaDriver(capabilities);
			// driver = new OperaDriver();
		} else if ("iexplorer".equals(browser)) {
			DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();  
			capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);			
			driver = new InternetExplorerDriver(capabilities);
		}
		currentDriver = driver;
		return driver;
	}

	private static boolean reuseableDriver(WebDriver reuse, String browser) {
		return ("firefox".equals(browser) && reuse instanceof FirefoxDriver)
				|| ("chrome".equals(browser) && reuse instanceof ChromeDriver)
				|| ("iexplorer".equals(browser) && reuse instanceof InternetExplorerDriver)
				|| ("opera".equals(browser) && reuse instanceof OperaDriver);
	}

	public static URL getURL(String file) {
		URL url = TestHelper.class.getClassLoader().getResource(file);
		Assert.assertNotNull(url);
		return url;
	}

	public static boolean hasNativeEvents(WebDriver driver) {
		if (driver instanceof FirefoxDriver) {
			return firefoxWithNativeEvents;
		}
		return true;
	}

}
