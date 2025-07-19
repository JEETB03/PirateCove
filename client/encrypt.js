function toggleContentInput() {
  const contentType = document.getElementById('contentType').value;
  const textInput = document.getElementById('textInput');
  const fileInput = document.getElementById('fileInput');
  if (contentType === 'text') {
    textInput.style.display = 'block';
    fileInput.style.display = 'none';
  } else {
    textInput.style.display = 'none';
    fileInput.style.display = 'block';
  }
}

function togglePinInput() {
  const pinToggle = document.getElementById('pinToggle');
  const pinInput = document.getElementById('pin');
  if (pinToggle.checked) {
    pinInput.disabled = false;
    pinInput.classList.remove('pin-disabled');
    pinInput.focus();
  } else {
    pinInput.disabled = true;
    pinInput.classList.add('pin-disabled');
    pinInput.value = '';
  }
}

function generateKey() {
  return CryptoJS.lib.WordArray.random(256 / 8);
}

function generateIV() {
  return CryptoJS.lib.WordArray.random(128 / 8);
}

function generateAccessToken(length = 12) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return token;
}

function encryptContent(content, key, iv) {
  return CryptoJS.AES.encrypt(content, key, { iv: iv }).toString();
}

function encryptKeyMaterial(key, iv, accessToken) {
  const keyBlob = key.toString(CryptoJS.enc.Base64) + '|' + iv.toString(CryptoJS.enc.Base64);
  const derivedKey = CryptoJS.SHA256(accessToken);
  const blobIv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(keyBlob, derivedKey, { iv: blobIv });
  return {
    encryptedKeyBlob: encrypted.toString(),
    blobIv: blobIv.toString(CryptoJS.enc.Base64)
  };
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// File upload handlers
const fileUpload = document.getElementById('fileUpload');
const fileDropZone = document.getElementById('fileDropZone');
const fileStatus = document.getElementById('fileStatus');

fileDropZone.addEventListener('click', () => fileUpload.click());

fileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileStatus.textContent = `🧾 Loot selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }
});

fileDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileDropZone.style.borderColor = 'var(--accent-gold)';
});

fileDropZone.addEventListener('dragleave', () => {
  fileDropZone.style.borderColor = 'var(--border)';
});

fileDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  fileDropZone.style.borderColor = 'var(--border)';
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileUpload.files = files;
    fileStatus.textContent = `🧾 Loot selected: ${files[0].name} (${(files[0].size / 1024 / 1024).toFixed(2)}MB)`;
  }
});

document.getElementById('encryptForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const loading = document.getElementById('loading');
  const result = document.getElementById('result');
  loading.style.display = 'block';
  result.style.display = 'none';

  try {
    let pin = document.getElementById('pin').value;
    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      throw new Error('⚠️ Yer PIN must be exactly 4 digits, or walk the plank!');
    }
    pin = pin || null;

    const expiryTime = parseFloat(document.getElementById('expiryTime').value);
    const destructTimer = parseInt(document.getElementById('destructTimer').value) || 120;

    const textContent = document.getElementById('secretText').value;
    const fileInput = document.getElementById('fileUpload');

    let content, contentType;
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('☠️ File too big! Max size be 10MB.');
      }
      content = await fileToBase64(file);
      contentType = file.type.startsWith('image/') ? 'image' : 'video';
    } else if (textContent.trim()) {
      content = textContent;
      contentType = 'text';
    } else {
      throw new Error('⚠️ Ye forgot to bury a secret or hoist a file!');
    }

    const key = generateKey();
    const iv = generateIV();
    const accessToken = generateAccessToken();
    const encryptedContent = encryptContent(content, key, iv);
    const keyMaterial = encryptKeyMaterial(key, iv, accessToken);

    const response = await fetch('/api/encrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encryptedContent,
        encryptedKeyBlob: keyMaterial.encryptedKeyBlob,
        blobIv: keyMaterial.blobIv,
        contentType,
        pin: pin,
        expiryHours: expiryTime,
        destructTimer: destructTimer
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '☠️ Could not lock yer vault.');
    }

    const vaultLink = `${window.location.origin}/vault/${data.vaultId}#${accessToken}`;
    result.innerHTML = `
      <div class="result-card">
        <div class="logo">🏴‍☠️ PirateCove</div>
        <p>Vault forged! Hand this scroll to a worthy matey:</p>
        <div class="vault-link">${vaultLink}</div>
        <p><em>This vault will self-scuttle after first opening or time runs out!</em></p>
      </div>
    `;

  } catch (error) {
    result.innerHTML = `<div class="error">${error.message}</div>`;
  } finally {
    loading.style.display = 'none';
    result.style.display = 'block';
  }
});
