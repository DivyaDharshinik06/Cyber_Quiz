-- ============================================
-- Cyber Awareness Quiz Game - Database Script
-- Run this in PostgreSQL to set up the database
-- ============================================

-- Create the database (run this separately if needed)
-- CREATE DATABASE cyber_quiz;

-- Connect to the database before running the rest
-- \c cyber_quiz;

-- ============================================
-- TABLE: users
-- Stores registered user accounts
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  credits INT DEFAULT 0,
  current_level INT DEFAULT 1,       -- current unlocked level
  levels_completed INT DEFAULT 0,    -- how many levels finished
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: questions
-- Stores all quiz questions with explanations
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  level INT NOT NULL,                -- 1, 2, or 3
  question TEXT NOT NULL,
  option1 VARCHAR(255) NOT NULL,
  option2 VARCHAR(255) NOT NULL,
  option3 VARCHAR(255) NOT NULL,
  option4 VARCHAR(255) NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,  -- must match one of the options exactly
  explanation TEXT NOT NULL              -- shown when user answers wrong
);

-- ============================================
-- TABLE: progress
-- Tracks each user's quiz attempt history
-- ============================================
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  level INT NOT NULL,
  score INT NOT NULL,               -- number of correct answers
  total INT NOT NULL,               -- total questions in that level
  credits_earned INT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SEED DATA: Level 1 Questions (Beginner)
-- Topic: Basic Cyber Awareness
-- ============================================
INSERT INTO questions (level, question, option1, option2, option3, option4, correct_answer, explanation) VALUES

(1, 'What does "HTTPS" stand for?',
 'HyperText Transfer Protocol Secure',
 'High Transfer Text Protocol System',
 'HyperText Transmission Protocol Standard',
 'Hosted Text Transfer Protocol Service',
 'HyperText Transfer Protocol Secure',
 'HTTPS stands for HyperText Transfer Protocol Secure. It uses SSL/TLS encryption to protect data transmitted between your browser and the website, preventing eavesdropping and man-in-the-middle attacks.'),

(1, 'What is phishing?',
 'A type of fishing sport',
 'A cyberattack using fake emails or websites to steal information',
 'A method to speed up internet connection',
 'A way to encrypt files',
 'A cyberattack using fake emails or websites to steal information',
 'Phishing is a social engineering attack where cybercriminals send deceptive emails or create fake websites that look legitimate to trick users into revealing sensitive information like passwords or credit card numbers.'),

(1, 'Which of the following is the strongest password?',
 'password123',
 'john1990',
 'P@ssw0rd!#92xZ',
 'qwerty',
 'P@ssw0rd!#92xZ',
 'A strong password should be at least 12 characters long and include uppercase letters, lowercase letters, numbers, and special characters. Avoid using personal information or common words that can be easily guessed.'),

(1, 'What is two-factor authentication (2FA)?',
 'Using two different passwords',
 'A security process requiring two forms of verification',
 'Logging in from two devices',
 'Having two email accounts',
 'A security process requiring two forms of verification',
 '2FA adds an extra layer of security by requiring something you know (password) plus something you have (phone OTP) or something you are (fingerprint). Even if your password is stolen, attackers cannot access your account without the second factor.'),

(1, 'What should you do if you receive a suspicious email asking for your password?',
 'Reply with your password',
 'Click the link to verify',
 'Delete it and report it as phishing',
 'Forward it to friends',
 'Delete it and report it as phishing',
 'Legitimate organizations never ask for your password via email. Always report suspicious emails as phishing to your email provider. Never click links or download attachments from unknown senders.'),

(1, 'What is malware?',
 'A type of hardware component',
 'Software designed to harm or exploit systems',
 'A secure programming language',
 'A network monitoring tool',
 'Software designed to harm or exploit systems',
 'Malware (malicious software) includes viruses, worms, trojans, ransomware, and spyware. It is designed to damage, disrupt, or gain unauthorized access to computer systems. Always keep antivirus software updated.'),

(1, 'Which of the following is a safe practice on public Wi-Fi?',
 'Online banking without VPN',
 'Sharing personal files',
 'Using a VPN to encrypt your connection',
 'Disabling your firewall',
 'Using a VPN to encrypt your connection',
 'Public Wi-Fi networks are unsecured and vulnerable to eavesdropping. A VPN (Virtual Private Network) encrypts your internet traffic, making it unreadable to anyone on the same network who might be trying to intercept your data.'),

(1, 'What does a firewall do?',
 'Speeds up your internet',
 'Monitors and controls incoming and outgoing network traffic',
 'Stores your passwords',
 'Removes viruses from files',
 'Monitors and controls incoming and outgoing network traffic',
 'A firewall acts as a security barrier between your trusted internal network and untrusted external networks. It filters traffic based on predefined security rules, blocking unauthorized access while allowing legitimate communication.'),

(1, 'What is ransomware?',
 'Software that speeds up your PC',
 'A tool for backing up files',
 'Malware that encrypts your files and demands payment',
 'A type of antivirus',
 'Malware that encrypts your files and demands payment',
 'Ransomware encrypts the victim''s files and demands a ransom payment (usually cryptocurrency) to restore access. Prevention includes regular backups, keeping software updated, and avoiding suspicious email attachments.'),

(1, 'What is the safest way to store passwords?',
 'Write them on sticky notes',
 'Use the same password everywhere',
 'Use a reputable password manager',
 'Save them in a text file on your desktop',
 'Use a reputable password manager',
 'Password managers securely store and encrypt all your passwords, allowing you to use unique, complex passwords for every account without memorizing them. They also alert you to reused or compromised passwords.');

-- ============================================
-- SEED DATA: Level 2 Questions (Intermediate)
-- Topic: Network & Web Security
-- ============================================
INSERT INTO questions (level, question, option1, option2, option3, option4, correct_answer, explanation) VALUES

(2, 'What is a SQL injection attack?',
 'Injecting SQL into a database backup',
 'Inserting malicious SQL code into input fields to manipulate a database',
 'A method to speed up database queries',
 'Encrypting SQL databases',
 'Inserting malicious SQL code into input fields to manipulate a database',
 'SQL injection occurs when an attacker inserts malicious SQL statements into input fields. This can allow them to view, modify, or delete database data. Prevention includes using parameterized queries and input validation.'),

(2, 'What does VPN stand for?',
 'Virtual Private Network',
 'Verified Public Node',
 'Virtual Protocol Network',
 'Validated Private Node',
 'Virtual Private Network',
 'A VPN (Virtual Private Network) creates an encrypted tunnel between your device and a VPN server, masking your IP address and encrypting your internet traffic. This protects your privacy and security, especially on public networks.'),

(2, 'What is Cross-Site Scripting (XSS)?',
 'A method to style websites',
 'Injecting malicious scripts into web pages viewed by other users',
 'A cross-browser compatibility technique',
 'A way to share scripts between websites',
 'Injecting malicious scripts into web pages viewed by other users',
 'XSS attacks inject malicious client-side scripts into web pages. When other users view the page, the script executes in their browser, potentially stealing cookies, session tokens, or redirecting users to malicious sites. Prevention includes input sanitization and Content Security Policy headers.'),

(2, 'What is a DDoS attack?',
 'A method to download data faster',
 'Overwhelming a server with traffic to make it unavailable',
 'A type of encryption algorithm',
 'A database optimization technique',
 'Overwhelming a server with traffic to make it unavailable',
 'A Distributed Denial of Service (DDoS) attack floods a target server with massive amounts of traffic from multiple sources (often a botnet), making it unable to respond to legitimate requests. Mitigation includes rate limiting, traffic filtering, and CDN services.'),

(2, 'What is the purpose of SSL/TLS certificates?',
 'To speed up website loading',
 'To encrypt data transmitted between browser and server',
 'To store website passwords',
 'To block malware downloads',
 'To encrypt data transmitted between browser and server',
 'SSL/TLS certificates enable HTTPS by encrypting data in transit between the user''s browser and the web server. They also verify the server''s identity, preventing man-in-the-middle attacks. Look for the padlock icon in your browser.'),

(2, 'What is a brute force attack?',
 'Physically breaking into a server room',
 'Systematically trying all possible passwords until the correct one is found',
 'Using social engineering to get passwords',
 'Exploiting software vulnerabilities',
 'Systematically trying all possible passwords until the correct one is found',
 'Brute force attacks try every possible combination of characters until the correct password is found. Protection includes account lockout policies, CAPTCHA, rate limiting, and using long complex passwords that would take too long to crack.'),

(2, 'What is a man-in-the-middle (MITM) attack?',
 'An attack where someone physically stands between two computers',
 'An attacker secretly intercepts and possibly alters communication between two parties',
 'A type of social engineering attack',
 'An attack targeting middleware software',
 'An attacker secretly intercepts and possibly alters communication between two parties',
 'In a MITM attack, the attacker positions themselves between two communicating parties, intercepting and potentially modifying messages without either party knowing. HTTPS, VPNs, and certificate pinning help prevent these attacks.'),

(2, 'What does "zero-day vulnerability" mean?',
 'A vulnerability that has existed for zero days',
 'A software flaw unknown to the vendor with no available patch',
 'A vulnerability that causes zero damage',
 'A bug that only affects old software',
 'A software flaw unknown to the vendor with no available patch',
 'A zero-day vulnerability is a security flaw that is unknown to the software vendor and therefore has no patch available. Attackers exploit these before developers can fix them. Keeping software updated and using behavior-based security tools helps mitigate risk.'),

(2, 'What is social engineering in cybersecurity?',
 'Building social media platforms',
 'Manipulating people psychologically to reveal confidential information',
 'Engineering social networks',
 'A type of network protocol',
 'Manipulating people psychologically to reveal confidential information',
 'Social engineering exploits human psychology rather than technical vulnerabilities. Attackers use tactics like pretexting, baiting, and impersonation to trick people into revealing passwords or granting access. Security awareness training is the best defense.'),

(2, 'What is the principle of least privilege?',
 'Giving all users administrator access',
 'Users should only have the minimum access rights needed for their job',
 'Privileged users should have fewer responsibilities',
 'Administrators should have limited working hours',
 'Users should only have the minimum access rights needed for their job',
 'The principle of least privilege limits user access rights to only what is necessary for their specific job function. This minimizes the potential damage from accidents, errors, or security breaches by reducing the attack surface.');

-- ============================================
-- SEED DATA: Level 3 Questions (Advanced)
-- Topic: Advanced Threats & Best Practices
-- ============================================
INSERT INTO questions (level, question, option1, option2, option3, option4, correct_answer, explanation) VALUES

(3, 'What is a botnet?',
 'A network of robots in a factory',
 'A network of infected computers controlled remotely by an attacker',
 'A secure network for bots',
 'An automated testing framework',
 'A network of infected computers controlled remotely by an attacker',
 'A botnet is a collection of internet-connected devices infected with malware and controlled by an attacker (botmaster). Botnets are used for DDoS attacks, spam campaigns, cryptocurrency mining, and data theft. Keep devices updated and use reputable security software.'),

(3, 'What is cryptojacking?',
 'Stealing physical cryptocurrency hardware',
 'Unauthorized use of someone''s computer to mine cryptocurrency',
 'Hacking cryptocurrency exchanges',
 'Encrypting files for ransom',
 'Unauthorized use of someone''s computer to mine cryptocurrency',
 'Cryptojacking involves secretly using a victim''s computing resources to mine cryptocurrency without their knowledge. It can occur through malicious browser scripts or malware. Signs include slow performance and high CPU usage. Use ad blockers and keep software updated.'),

(3, 'What is the difference between symmetric and asymmetric encryption?',
 'Symmetric is faster; asymmetric uses the same key for both encryption and decryption',
 'Symmetric uses one key for both operations; asymmetric uses a public/private key pair',
 'Symmetric is more secure; asymmetric uses multiple keys',
 'There is no difference',
 'Symmetric uses one key for both operations; asymmetric uses a public/private key pair',
 'Symmetric encryption uses the same key to encrypt and decrypt (fast, used for bulk data). Asymmetric encryption uses a public key to encrypt and a private key to decrypt (slower, used for key exchange and digital signatures). HTTPS uses both: asymmetric for key exchange, symmetric for data transfer.'),

(3, 'What is a penetration test?',
 'Testing how fast a network can transfer data',
 'An authorized simulated cyberattack to find security vulnerabilities',
 'Testing software for bugs before release',
 'A stress test for servers',
 'An authorized simulated cyberattack to find security vulnerabilities',
 'Penetration testing (ethical hacking) involves authorized security professionals attempting to breach systems using the same techniques as malicious hackers. The goal is to identify and fix vulnerabilities before real attackers can exploit them.'),

(3, 'What is OWASP?',
 'A government cybersecurity agency',
 'An open-source project providing web application security resources',
 'A type of firewall technology',
 'A programming language for security',
 'An open-source project providing web application security resources',
 'OWASP (Open Web Application Security Project) is a nonprofit foundation that works to improve software security. Their OWASP Top 10 list identifies the most critical web application security risks and is widely used as a security standard.'),

(3, 'What is multi-factor authentication (MFA)?',
 'Using multiple passwords',
 'Authentication requiring two or more verification factors from different categories',
 'Logging in from multiple devices simultaneously',
 'Having multiple user accounts',
 'Authentication requiring two or more verification factors from different categories',
 'MFA requires verification from multiple independent categories: something you know (password), something you have (hardware token, phone), and something you are (biometrics). This dramatically reduces the risk of unauthorized access even if one factor is compromised.'),

(3, 'What is data exfiltration?',
 'Deleting data from a database',
 'Unauthorized transfer of data from a system to an external location',
 'Backing up data to the cloud',
 'Encrypting data for storage',
 'Unauthorized transfer of data from a system to an external location',
 'Data exfiltration is the unauthorized copying, transfer, or retrieval of data from a computer or server. It is a primary goal of many cyberattacks. Prevention includes Data Loss Prevention (DLP) tools, network monitoring, and strict access controls.'),

(3, 'What is a security information and event management (SIEM) system?',
 'A system for managing employee security badges',
 'A tool that collects and analyzes security logs for threat detection',
 'Software for encrypting sensitive information',
 'A firewall management interface',
 'A tool that collects and analyzes security logs for threat detection',
 'SIEM systems aggregate and analyze log data from across an organization''s IT infrastructure in real time. They detect anomalies, correlate events, and alert security teams to potential threats, enabling faster incident response.'),

(3, 'What is the CIA triad in cybersecurity?',
 'Central Intelligence Agency''s cybersecurity division',
 'Confidentiality, Integrity, and Availability - core principles of information security',
 'Cyber Incident Analysis framework',
 'A classification system for malware',
 'Confidentiality, Integrity, and Availability - core principles of information security',
 'The CIA triad is the foundation of information security: Confidentiality (only authorized users can access data), Integrity (data is accurate and unaltered), and Availability (systems and data are accessible when needed). All security controls are designed to protect one or more of these principles.'),

(3, 'What is a supply chain attack?',
 'An attack on a company''s physical supply chain',
 'Compromising software or hardware during the development or distribution process',
 'Stealing products from warehouses',
 'A DDoS attack on e-commerce sites',
 'Compromising software or hardware during the development or distribution process',
 'Supply chain attacks target less-secure elements in the supply chain to compromise the final target. The SolarWinds attack is a famous example where attackers inserted malware into software updates distributed to thousands of organizations. Vetting third-party vendors and monitoring software integrity are key defenses.');
