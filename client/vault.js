function getVaultIdFromURL() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

function getAccessTokenFromHash() {
  return window.location.hash.substring(1);
}

function decryptKeyMaterial(encryptedKeyBlobB64, blobIvB64, token) {
  const derivedKey = CryptoJS.SHA256(token);
  const blobIv = CryptoJS.enc.Base64.parse(blobIvB64);
  const decrypted = CryptoJS.AES.decrypt(encryptedKeyBlobB64, derivedKey, { iv: blobIv });
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  const [keyB64, ivB64] = decryptedStr.split('|');
  const key = CryptoJS.enc.Base64.parse(keyB64);
  const iv = CryptoJS.enc.Base64.parse(ivB64);
  return { key, iv };
}

function decryptContent(encryptedContent, key, iv) {
  const decrypted = CryptoJS.AES.decrypt(encryptedContent, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

async function accessVault(pin = null) {
  const vaultId = getVaultIdFromURL();
  const accessToken = getAccessTokenFromHash();

  if (!vaultId || !accessToken) {
    showError('🧨 Uh-oh, this treasure map be invalid!');
    return;
  }

  try {
    const url = `/api/vault/${vaultId}${pin ? `?pin=${pin}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        if (pin) {
          showNotification('❌ Wrong code, matey! Try again.', 'error');
          document.getElementById('pinInput').value = '';
          document.getElementById('pinInput').focus();
          return;
        }
        showPinPrompt();
        return;
      }
      throw new Error(data.error || '☠️ Failed to retrieve locker contents.');
    }

    const { key, iv } = decryptKeyMaterial(data.encryptedKeyBlob, data.blobIv, accessToken);
    const decryptedContent = decryptContent(data.encryptedContent, key, iv);

    displayContent(decryptedContent, data.contentType);
    startCountdown(data.destructTimer || 120);

  } catch (error) {
    showError(`🔥 ${error.message}`);
  }
}

function showPinPrompt() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('pinPrompt').style.display = 'block';
  document.getElementById('pinInput').focus();
}

function displayContent(content, contentType) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  const contentDiv = document.getElementById('vaultContent');
  if (contentType === 'image' || content.startsWith('data:image/')) {
    contentDiv.innerHTML = `<div class="media-display"><img src="${content}" alt="vault image" /></div>`;
  } else if (contentType === 'video' || content.startsWith('data:video/')) {
    contentDiv.innerHTML = `<div class="media-display"><video controls src="${content}"></video></div>`;
  } else {
    contentDiv.innerHTML = `<div class="content-display"><code>${escapeHtml(content)}</code></div>`;
  }
}

function startCountdown(seconds) {
  const countdown = document.getElementById('countdown');
  let remaining = seconds;

  const interval = setInterval(() => {
    const mins = String(Math.floor(remaining / 60)).padStart(1, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    countdown.textContent = `${mins}:${secs}`;

    if (remaining === 0) {
      clearInterval(interval);
      triggerVaultDestruction();
    }

    remaining--;
  }, 1000);

  document.getElementById('destroyNowBtn').addEventListener('click', () => {
    clearInterval(interval);
    triggerVaultDestruction();
  });
}

function triggerVaultDestruction() {
  window.location.href = '/destroyed.html';
}

function showError(message) {
  const result = document.getElementById('vaultContent');
  result.innerHTML = `<div class="error">☠️ ${message}</div>`;
}

function showNotification(text, type = 'success') {
  const note = document.createElement('div');
  note.className = `notification show ${type}`;
  note.textContent = text;
  document.body.appendChild(note);
  setTimeout(() => {
    note.classList.remove('show');
    note.remove();
  }, 3500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// Automatically check for vault data if access token is present
document.addEventListener('DOMContentLoaded', () => {
  accessVault();
  document.getElementById('pinSubmit').addEventListener('click', () => {
    const pin = document.getElementById('pinInput').value;
    accessVault(pin);
  });
});
