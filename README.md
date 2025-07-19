

```markdown
# 🏴‍☠️ PirateCove

**PirateCove** is a pirate-themed web application for securely sharing encrypted secrets and self-destructing treasure vaults. With client-side AES-256 encryption, one-time access, PIN-locks, and a cyber-pirate flair, your secrets are buried deep until the right scallywag digs them up.

---

## ⚓ Features

- 🔐 **AES-256 Client-Side Encryption** — Your secrets never leave the browser unencrypted.
- 💣 **Self-Destructing Links** — Vaults can vanish immediately after use or after a configurable timer.
- 📁 **File Uploads or Text** — Hide messages, files, images, or videos (up to 10MB).
- 🧾 **Optional PIN Protection** — Require a 4-digit PIN for vault unlock.
- 🏴‍☠️ **Immersive Pirate UI** — Custom fonts, colors, emojis, and smooth animations.
- 🗃 **No Login, No Tracking** — Create and share secrets quickly and anonymously.

---

## 📸 Demo (Local)

> After installing (see below), open in your browser:  
> [http://localhost:3000](http://localhost:3000)

---

## 🌴 Project Structure

- `piratecove/`
  - `client/`
    - `index.html`
    - `encrypt.html`
    - `vault.html`
    - `styles.css`
    - `encrypt.js`
    - `vault.js`
    - `pirate-logo.jpg`
    - `pirate-full-logo.jpg`
  - `server/`
    - `app.js`
    - `db.json`
    - `routes/`
      - `encrypt.js`
      - `vault.js`
    - `utils/`
      - `neatbandit.js`
  - `package.json`


````

---

## 🚀 Installation & Usage

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or newer  
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/piratecove.git
cd piratecove
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

> Visit [http://localhost:3000](http://localhost:3000) in your browser after the server starts.

---

## 💡 How It Works

1. The pirate selects **Create Vault**, provides a secret (text or file), adds a timer and optional PIN.
2. The browser encrypts the secret using AES-256 before sending anything to the server.
3. A unique, one-time-use vault link is generated and shared manually.
4. The recipient opens the link, enters the secret PIN (if set), and decrypts the message in-browser.
5. The vault self-destructs after first use or after the expiry timeout.

---

## 🔧 Customization

| You Want To Customize | What To Edit                 |
| --------------------- | ---------------------------- |
| Colors/Fonts/Style    | `client/styles.css`          |
| Pirate Text & Emojis  | HTML/JS files (`index.html`) |
| Vault Expiry Limits   | JS and `routes/encrypt.js`   |
| Maximum File Size     | `encrypt.js` (frontend)      |
| Frontend JS/HTML      | `client/` folder             |

---

## ✍️ Authors

Built with love and rum by:

* 🎩 **Jyotirmoy Karmakar**
* 🦜 **Kabyik Paul**
* 🔗 **Jeet Biswas**

---

> “‘Tis the secrets buried in shadows that hold the greatest treasure. Use wisely, matey!”
> — 🏴‍☠️ PirateCove


