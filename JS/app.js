const key = "IAYvryUnpFDp3IQNH";
const IP_INFO_TOKEN = "3c805bf213b675";
emailjs.init(key);
/**
 * Fetches JSON data from the given URL.
 * @param {string} url - The URL to fetch the JSON data from.
 * @param {function} [callback] - An optional function to call with the fetched JSON data.
 * @returns {Promise<object|null>} - A Promise that resolves to the fetched JSON data or null if the response is not OK.
 */
export async function fetchJsonData(url, callback) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Response is not JSON");
    }

    const jsonData = await response.json();

    if (callback) {
      callback(jsonData);
    }

    return jsonData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const ipInfo = await fetchJsonData(`https://ipinfo.io?token=${IP_INFO_TOKEN}`);

/**
 *  Sends an email to the given email address with the given subject and body.
 * @param {string} to - The email address to send the email to.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email.
 * @returns {Promise<void>} - A Promise that resolves when the email is sent.
 * @throws {Error} - An error is thrown if the email is not sent.
 * @see {@link https://www.emailjs.com/docs/sdk/send/}
 * @see {@link https://dashboard.emailjs.com/admin}
 * @see {@link https://dashboard.emailjs.com/admin/integration}
 * @see {@link https://dashboard.emailjs.com/admin/templates}
 * */

export async function sendEmail() {
  const date = new Date().toLocaleString();
  const body = `Date: ${date}
        IP Address: ${ipInfo?.ip}
        Location: ${ipInfo?.city}, ${ipInfo?.region}, ${ipInfo?.country}
        Coordinates: ${ipInfo?.loc}
        Agent: ${navigator?.userAgent}
        Platform: ${navigator?.platform}
        Cookies: ${navigator?.cookieEnabled}
        DoNotTrack: ${navigator?.doNotTrack}
        window.name: ${window.name}
        browserName: ${navigator.appName},
    browserVersion: ${navigator.appVersion},
    screenSize: {
      width: ${window.screen.width},
      height: ${window.screen.height}
    },
    colorDepth: ${window.screen.colorDepth},
    language: ${navigator.language}
        hardwareConcurrency: ${JSON.stringify(navigator?.hardwareConcurrency)}
        webdriver: ${JSON.stringify(navigator?.webdriver)}
        otherData: ${JSON.stringify(ipInfo)}
        `;
  try {
    await emailjs.send("service_291in72", "template_dabbyy1", {
      subject: "New Visitor",
      body,
    });
  } catch (error) {}
}

sendEmail();
