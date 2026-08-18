// Static Cookie Policy for Kartsquare Pvt. Ltd.
// Compliant with:
//   - Information Technology Act, 2000 & IT Rules, 2021
//   - Digital Personal Data Protection Act, 2023 (DPDP Act)
//   - Indian Contract Act, 1872 (consent framework)
//
// Note: India does not yet have a standalone cookie law equivalent to the EU ePrivacy
// Directive, but the DPDP Act 2023 requires informed consent for processing personal
// data — which includes data collected via cookies. This policy reflects that standard.

import { KARTSQUARE_COMPANY_INFO } from "./privacyPolicyContent";

export const COOKIE_POLICY_LAST_UPDATED = "18 August 2026";

export const COOKIE_POLICY_HTML = `
<div>
  <h2>1. What Are Cookies?</h2>
  <p>Cookies are small text files placed on your device (computer, smartphone, or tablet) when you visit a website or use a web-based application. They are widely used to make websites work efficiently, remember your preferences, and provide information to the site owner.</p>
  <p>In addition to cookies, we may use similar tracking technologies such as <strong>web beacons</strong> (pixel tags), <strong>local storage</strong>, and <strong>session storage</strong>. All references to "cookies" in this policy include these similar technologies unless stated otherwise.</p>
</div>

<div>
  <h2>2. Who Sets Cookies on kartsquare?</h2>
  <p>Cookies on the kartsquare Platform are set by two parties:</p>
  <ul>
    <li><strong>First-party cookies</strong> — set directly by Kartsquare Pvt. Ltd. to operate the Platform.</li>
    <li><strong>Third-party cookies</strong> — set by our trusted service partners (e.g., analytics providers, payment gateways, authentication services) when you interact with features powered by them. We do not control third-party cookies; please refer to the respective third party's privacy and cookie policy for details.</li>
  </ul>
</div>

<div>
  <h2>3. Categories of Cookies We Use</h2>

  <h3>3.1 Strictly Necessary Cookies</h3>
  <p>These cookies are essential for the Platform to function and cannot be switched off. They are set in response to actions you take, such as logging in, adding items to a cart, or filling in forms. Without these cookies, services you have requested cannot be provided.</p>
  <ul>
    <li><strong>Session authentication:</strong> Keeps you logged in securely during your session.</li>
    <li><strong>CSRF protection:</strong> Prevents cross-site request forgery attacks.</li>
    <li><strong>Load balancing:</strong> Distributes traffic across our servers for reliability.</li>
    <li><strong>Cookie consent state:</strong> Remembers your cookie preferences so we do not ask repeatedly.</li>
  </ul>
  <p><em>Legal basis: Legitimate interest / contractual necessity. These cookies do not require your consent as they are technically indispensable.</em></p>

  <h3>3.2 Functional / Preference Cookies</h3>
  <p>These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.</p>
  <ul>
    <li><strong>Theme preference:</strong> Remembers your light/dark mode selection.</li>
    <li><strong>Language preference:</strong> Stores your selected language.</li>
    <li><strong>Location preference:</strong> Stores your last-used city or region to speed up search results.</li>
    <li><strong>Recently viewed:</strong> Remembers services and products you have recently viewed.</li>
  </ul>
  <p><em>Legal basis: Your consent. You may disable these via your browser settings; doing so may reduce Platform functionality.</em></p>

  <h3>3.3 Analytics & Performance Cookies</h3>
  <p>These cookies help us understand how visitors interact with the Platform by collecting aggregated, anonymized information. This data helps us improve page performance, fix errors, and optimize the user experience.</p>
  <ul>
    <li><strong>Google Analytics (Google LLC):</strong> Tracks page views, session duration, traffic sources, and user flows. Data is anonymized before transmission. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
    <li><strong>Internal telemetry:</strong> Crash reports and performance metrics collected by our own infrastructure.</li>
  </ul>
  <p><em>Legal basis: Your consent. You may opt out of Google Analytics at any time using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</em></p>

  <h3>3.4 Authentication Cookies (Third-Party)</h3>
  <p>When you sign in using Google or use Firebase-based OTP authentication, the respective provider may set cookies on your device to manage your authentication session.</p>
  <ul>
    <li><strong>Firebase / Google Identity Platform:</strong> Manages OTP-based phone authentication and Google Sign-In sessions. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a>.</li>
  </ul>
  <p><em>Legal basis: Contractual necessity (required to provide the login service you requested).</em></p>

  <h3>3.5 Payment Gateway Cookies (Third-Party)</h3>
  <p>When you make a payment, our RBI-authorized payment gateway partners may set cookies to process the transaction securely, detect fraud, and comply with financial regulations.</p>
  <p><em>Legal basis: Contractual necessity / legal obligation. These cookies are set by the payment provider and are governed by their own privacy policies.</em></p>

  <h3>3.6 Marketing & Retargeting Cookies</h3>
  <p>We currently <strong>do not</strong> use marketing or retargeting cookies to serve you advertisements on third-party websites. If we introduce such cookies in the future, we will update this policy and seek your explicit consent before setting them.</p>
</div>

<div>
  <h2>4. Cookie Retention Periods</h2>
  <p>Cookies are either <strong>session cookies</strong> (deleted when you close your browser) or <strong>persistent cookies</strong> (remain on your device for a set period). The retention periods for our key cookies are:</p>
  <ul>
    <li><strong>Authentication session cookie:</strong> Session (deleted on browser close) or up to 30 days if "Remember me" is selected.</li>
    <li><strong>Cookie consent preference:</strong> 12 months.</li>
    <li><strong>Theme / language preference:</strong> 12 months.</li>
    <li><strong>Google Analytics (_ga):</strong> 2 years (as set by Google).</li>
    <li><strong>Google Analytics (_gid):</strong> 24 hours (as set by Google).</li>
  </ul>
</div>

<div>
  <h2>5. Your Cookie Choices & How to Manage Them</h2>
  <p>You have several options to control or limit how cookies are used:</p>

  <h3>5.1 Browser Settings</h3>
  <p>Most browsers allow you to refuse or delete cookies through their settings. Please note that disabling strictly necessary cookies will prevent the Platform from functioning correctly. Instructions for common browsers:</p>
  <ul>
    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
    <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
    <li><a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
    <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
  </ul>

  <h3>5.2 Mobile Device Settings</h3>
  <p>On mobile devices, you can manage cookie-equivalent storage (such as app local storage) through your device's app settings or by uninstalling and reinstalling the app.</p>

  <h3>5.3 Opt-Out of Analytics</h3>
  <p>You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>
</div>

<div>
  <h2>6. Cookies & Personal Data</h2>
  <p>Some cookies collect data that, alone or in combination with other information, may constitute personal data under the Digital Personal Data Protection Act, 2023 (DPDP Act). Where cookies process your personal data, that processing is governed by our <a href="/privacy-policy">Privacy Policy</a>. You have the right to access, correct, and request erasure of personal data collected via cookies by contacting us at <a href="mailto:${KARTSQUARE_COMPANY_INFO.email.privacy}">${KARTSQUARE_COMPANY_INFO.email.privacy}</a>.</p>
</div>

<div>
  <h2>7. Do Not Track (DNT)</h2>
  <p>Some browsers offer a "Do Not Track" (DNT) signal. As there is currently no universally accepted standard for responding to DNT signals in India or globally, kartsquare does not alter its data collection practices in response to DNT signals. We will revisit this position if a legal standard is established.</p>
</div>

<div>
  <h2>8. Changes to This Cookie Policy</h2>
  <p>We may update this Cookie Policy from time to time to reflect changes in the technologies we use, our business practices, or applicable law. Material changes will be communicated via an in-app notice or email before they take effect. The "Last Updated" date at the top of this page will always reflect the most recent revision.</p>
</div>

<div>
  <h2>9. Contact Us</h2>
  <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
  <ul>
    <li><strong>Privacy Inquiries:</strong> <a href="mailto:${KARTSQUARE_COMPANY_INFO.email.privacy}">${KARTSQUARE_COMPANY_INFO.email.privacy}</a></li>
    <li><strong>General Support:</strong> <a href="mailto:${KARTSQUARE_COMPANY_INFO.email.support}">${KARTSQUARE_COMPANY_INFO.email.support}</a></li>
    <li><strong>Phone:</strong> ${KARTSQUARE_COMPANY_INFO.phone}</li>
    <li><strong>Registered Office:</strong> ${KARTSQUARE_COMPANY_INFO.name}, ${KARTSQUARE_COMPANY_INFO.address}</li>
  </ul>
</div>

<hr />
<p><em>By continuing to use the kartsquare Platform, you acknowledge that you have read and understood this Cookie Policy.</em></p>
`;
