# PirateCove

**PirateCove** is a secure, pirate-themed web application for sharing confidential messages and files with automatic destruction. With a playful interface, AES-256 encryption, and customizable self-destruction timers, your secrets are always buried deep—only those with the right key (and possibly a PIN!) can access your treasure.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
  - [Create a Vault](#create-a-vault)
  - [Access a Vault](#access-a-vault)
- [Security & Architecture](#security--architecture)
- [Customization](#customization)
- [Authors](#authors)
- [License](#license)

## Features

- **Pirate-Themed User Interface:** Dark, bold colors, original pirate graphics, and playful language.
- **AES-256 End-to-End Encryption:** Secrets are encrypted in the browser before ever reaching the backend.
- **File or Text Secrets:** Hide plain messages or upload files (up to 10MB).
- **One-Time Access:** Secrets vanish (self-destruct) on first access, or after a timer expires.
- **Optional PIN Protection:** Add a 4-digit PIN to guard the vault.
- **No Registration or Tracking:** Fast, anonymous, and safe sharing.
- **Beautiful Animations:** Smooth transitions and effects for an engaging experience.

## Demo

Visit http://localhost:3000 after running locally, or deploy to your favorite cloud platform to go online.

## Project Structure

piratecove/
├── client/
│   ├── index.html
│   ├── encrypt.html
│   ├── vault.html
│   ├── styles.css
│   ├── encrypt.js
│   ├── vault.js
│   ├── pirate-logo.jpg
│   └── pirate-full-logo.jpg
├── server/
│   ├── app.js
│   ├── db.json
│   ├── routes/
│   │   ├── encrypt.js
│   │   └── vault.js
│   └── utils/
│       └── neatbandit.js
├── package.json


- **client/**: All static frontend assets (HTML, CSS, JS, images).
- **server/**: All backend Node.js logic, routes, database, and utilities.

## How It Works

1. **User creates a vault** by submitting a secret (text or file) via the web form.
2. **Encryption is performed client-side** (in-browser). The backend never sees the raw secret.
3. **A vault link and secret access token are generated**. The link is shared with the intended recipient.
4. **On first access**, the recipient provides the secret access token (from the link) and, if set, the PIN. The backend provides the encrypted payload; the frontend decrypts it locally.
5. **Vault is immediately deleted** after first use or destruction timer expiry.

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) (comes with Node)

### Installation

1. **Clone the repository:**
   `ash
   git clone  piratecove
   cd piratecove
   `

2. **Install dependencies:**
   `ash
   npm install
   `

3. **Start the PirateCove server:**
   `ash
   npm start
   `

4. **Open your browser at:**
   `
   http://localhost:3000
   `

## Usage

### Create a Vault

1. Visit the homepage and click **Create Vault**.
2. Choose **text** or **file** as your secret type.
3. Enter your secret or upload a file (max 10MB).
4. (Optional) Set a 4-digit **PIN** for extra protection.
5. Set when the vault should expire and how long after opening it will self-destruct.
6. Click **Create Vault** and share the generated link with your recipient.

### Access a Vault

1. Open the vault link.
2. Enter the PIN if prompted.
3. View your secret—the vault will self-destruct after being accessed.

## Security & Architecture

- **Client-side Encryption:** All secrets are AES-256 encrypted in the browser before network transmission.
- **Short-lived Vaults:** All vaults are deleted after viewing or on expiration.
- **No User Data Storage:** No email/identity or reused keys on the server.
- **Simple JSON File 
DB:** For demonstration and light personal/private use. For a production system, use a robust database.

## Customization

- **Branding:** Edit logos and styles in client/.
- **Time Limits & File Size:** Adjust constraints in front-end and server code.
- **Notifications & Animations:** Add more pirate-flavored UI cues in styles.css, encrypt.js, ault.js.

## Authors

| Name                | Role         |
|---------------------|-------------|
| Jyotirmoy Karmakar  | Developer   |
| Kabyik Paul         | Developer   |
| Jeet Biswas         | Developer   |

**Fair winds and following seas, matey!**
