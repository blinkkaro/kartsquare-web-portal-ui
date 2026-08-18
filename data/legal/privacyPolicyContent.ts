// Static Privacy Policy content for Kartsquare.
// Updated for compliance with the Digital Personal Data Protection (DPDP) Act, 2023,
// the Information Technology Act, 2000, and applicable CERT-In guidelines.

export const KARTSQUARE_COMPANY_INFO = {
  name: "Kartsquare Pvt. Ltd.",
  address: "Plot 63-A, Prakash Nagar, Kalwad Road, Jhotwara, Jaipur, Rajasthan, India - 302012",
  email: {
    privacy: "privacy@kartsquare.com",
    support: "contact@kartsquare.com",
  },
  phone: "+91 80056 73985",
};

export const PRIVACY_POLICY_LAST_UPDATED = "18 August 2026";

export const PRIVACY_POLICY_HTML = `
<div class="privacy-policy-container">
  <h2>1. Introduction</h2>
  <p>Kartsquare Pvt. Ltd. ("kartsquare", "we", "us", or "our") operates the kartsquare platform — a digital marketplace connecting customers with local service providers and product suppliers via our website and mobile applications (together, the "Platform").</p>
  <p>Under the Digital Personal Data Protection Act, 2023 (DPDP Act), kartsquare acts as a <strong>Data Fiduciary</strong>. This Privacy Policy explains how we collect, process, share, and protect your personal data (as a <strong>Data Principal</strong>). It applies to all users of the Platform: customers, service providers, and suppliers.</p>
  <p>By registering on or using kartsquare, you provide explicit consent to the processing of your personal data as described in this policy. If you do not agree, you must not use the Platform.</p>
</div>

<div class="privacy-policy-section">
  <h2>2. Information We Collect</h2>
  
  <h3>2.1 Information You Provide Directly</h3>
  <ul>
    <li><strong>Account & Identity Data:</strong> Full name, email address, phone number, date of birth, gender, and profile photo.</li>
    <li><strong>Business & Verification Data (Providers/Suppliers):</strong> Business name, address, GST/tax registration details, government-issued IDs for KYC (e.g., PAN, Aadhaar where legally permitted), trade licenses, and bank account details for payouts.</li>
    <li><strong>User-Generated Content (UGC):</strong> Reviews, ratings, service/product listings, images, videos (including reels), and in-app chat messages. <em>(Note: Content posted in public areas like reviews or reels is visible to all users. Please refrain from sharing sensitive personal data in these spaces.)</em></li>
    <li><strong>Support Data:</strong> Communications with our customer support team or Grievance Officer.</li>
  </ul>
  
  <h3>2.2 Information Collected Automatically (with permissions)</h3>
  <ul>
    <li><strong>Location Data:</strong> Precise GPS location (if consent is granted) to match you with nearby suppliers, providers, and deliveries. If disabled, we rely on approximate location derived from your IP address.</li>
    <li><strong>Device & Hardware Data:</strong> Device model, OS, unique device identifiers (IMEI/MAC), and mobile network. We also request access to your <strong>Camera, Microphone, and Photo Gallery</strong> specifically to enable you to upload listings, reels, or profile photos.</li>
    <li><strong>Usage & Telemetry Data:</strong> Search queries, transaction history, interaction with UI elements, session duration, and crash logs.</li>
  </ul>
  
  <h3>2.3 Information from Third Parties</h3>
  <ul>
    <li><strong>Single Sign-On (SSO):</strong> If you authenticate via Google or Apple, we receive basic profile data (name, email) subject to your authorization with them.</li>
    <li><strong>Authentication Providers:</strong> Firebase (Google) processes your phone number and OTP for login security.</li>
  </ul>
</div>

<div class="privacy-policy-section">
  <h2>3. How We Use Your Information</h2>
  <p>We process your data strictly for legitimate purposes, including to:</p>
  <ul>
    <li><strong>Provide the Service:</strong> Create accounts, verify the identity of providers/suppliers, and process bookings, orders, and payments.</li>
    <li><strong>Platform Matching & Personalization:</strong> Use algorithmic matching to connect customers with relevant providers based on location, ratings, search history, and availability.</li>
    <li><strong>Communications:</strong> Enable in-app messaging between transacting parties and send operational updates (OTPs, order tracking, security alerts).</li>
    <li><strong>Safety & Fraud Prevention:</strong> Detect malicious activity, verify reviews, prevent fake accounts, and enforce our Terms and Conditions.</li>
    <li><strong>Legal Compliance:</strong> Fulfill tax, accounting, and regulatory obligations, including mandatory reporting to law enforcement agencies.</li>
  </ul>
</div>

<div class="privacy-policy-section">
  <h2>4. How We Share Your Information</h2>
  <p>We do not sell your personal data. Data is shared on a strict need-to-know basis:</p>
  <ul>
    <li><strong>Between Users:</strong> When a booking or order is confirmed, we share necessary details (name, phone number, delivery address) between the customer and the respective provider/supplier to fulfill the transaction.</li>
    <li><strong>Payment Aggregators:</strong> Transaction details are shared with RBI-authorized payment gateways. <strong>kartsquare does not capture or store full credit/debit card numbers or UPI PINs.</strong></li>
    <li><strong>Service Providers:</strong> Cloud hosting (e.g., AWS/GCP), SMS/Email delivery partners, and analytics providers act as <strong>Data Processors</strong> under strict confidentiality agreements.</li>
    <li><strong>Law Enforcement & Regulators:</strong> We will disclose data if required by a valid legal order, court warrant, or directive from agencies like CERT-In, or to protect the safety of users and the public.</li>
    <li><strong>Business Reorganization:</strong> In the event of a merger, acquisition, or bankruptcy, your data may be transferred to the new entity under the same privacy commitments.</li>
  </ul>
</div>

<div class="privacy-policy-section">
  <h2>5. Data Retention</h2>
  <p>We retain data only as long as necessary or as legally mandated:</p>
  <ul>
    <li><strong>Account Data:</strong> Retained while active. Upon deletion, data is removed within 30 days, except where retention is legally required.</li>
    <li><strong>Financial & Tax Records:</strong> Retained for up to 8 years under the Companies Act and GST regulations.</li>
    <li><strong>Security Logs:</strong> IP logs, login instances, and critical security telemetry are retained for 180 days on a rolling basis as per CERT-In directives.</li>
    <li><strong>Dispute Retention:</strong> If there is an active legal dispute, fraud investigation, or unpaid balance, relevant data is locked and retained until the matter is resolved.</li>
  </ul>
</div>

<div class="privacy-policy-section">
  <h2>6. Data Security</h2>
  <p>We implement robust technical and organizational measures (TOMs) as required by law, including TLS encryption in transit, AES-256 encryption for sensitive data at rest, Role-Based Access Control (RBAC), and periodic vulnerability assessments. In the event of a legally notifiable data breach, we will inform you and the Data Protection Board of India without undue delay.</p>
</div>

<div class="privacy-policy-section">
  <h2>7. Your Rights Under the DPDP Act</h2>
  <p>As a Data Principal in India, you hold the following rights regarding your personal data:</p>
  <ul>
    <li><strong>Right to Access:</strong> Request a summary of the personal data we process and the identities of third parties it has been shared with.</li>
    <li><strong>Right to Correction & Erasure:</strong> Correct inaccuracies or request deletion of your data via the <a href="/delete-account">Account Deletion</a> page.</li>
    <li><strong>Right to Withdraw Consent:</strong> You may revoke consent for non-essential processing (e.g., marketing emails or location access) at any time via your device or app settings. Withdrawal does not affect past processing but may limit platform functionality.</li>
    <li><strong>Right to Grievance Redressal:</strong> The right to readily available means of registering complaints. You may reach us at privacy@kartsquare.com.</li>
    <li><strong>Right to Nominate:</strong> You may nominate another individual to exercise your privacy rights on your behalf in the event of your death or incapacity. To register a nominee, please email our Support team.</li>
  </ul>
  <p>We fulfill valid rights requests free of charge within the legally mandated timeframe (typically 30 days).</p>
</div>

<div class="privacy-policy-section">
  <h2>8. Children's Privacy</h2>
  <p>The Platform is restricted to individuals aged 18 and older. We do not knowingly collect personal data from, nor do we target behavioral advertising toward, individuals under 18. If we discover that a minor has provided us with personal data without verifiable parental consent, we will promptly delete the data and terminate the account.</p>
</div>

<div class="privacy-policy-section">
  <h2>9. Contact Us</h2>
  <ul>
    <li><strong>Privacy Inquiries:</strong> privacy@kartsquare.com</li>
    <li><strong>General Support:</strong> contact@kartsquare.com</li>
    <li><strong>Phone:</strong> +91 80056 73985</li>
    <li><strong>Registered Entity:</strong> Kartsquare Pvt. Ltd., Plot 63-A, Prakash Nagar, Kalwad Road, Jhotwara, Jaipur, Rajasthan, India - 302012</li>
  </ul>
</div>

<div class="privacy-policy-section">
  <h2>10. International Data Transfers</h2>
  <p>kartsquare's primary servers are located in India. If we utilize cloud infrastructure or third-party processors outside India, we ensure that the destination country is not restricted by the Government of India, and that data is protected via binding corporate rules or standard contractual clauses.</p>
</div>

<div class="privacy-policy-section">
  <h2>11. Policy Updates</h2>
  <p>We may update this policy to reflect changes in our services or legal obligations. If we make material changes, we will notify you via an in-app banner or email prior to the changes taking effect. Your continued use of the Platform signifies acceptance of the updated policy.</p>
</div>

<hr />
<p><em>By continuing to use the kartsquare Platform, you acknowledge that you have read, understood, and consented to this Privacy Policy.</em></p>
</div>
`;
