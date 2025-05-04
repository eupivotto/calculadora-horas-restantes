// popup.js - carrega e salva horários via chrome.storage

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['entryTime', 'startLunch', 'endLunch'], (items) => {
      if (items.entryTime) document.getElementById('entryTime').value = items.entryTime;
      if (items.startLunch) document.getElementById('startLunch').value = items.startLunch;
      if (items.endLunch) document.getElementById('endLunch').value = items.endLunch;
    });
  });
  
  function saveTime(key, value) {
    const obj = {};
    obj[key] = value;
    chrome.storage.sync.set(obj);
  }
  
  ['entryTime', 'startLunch', 'endLunch'].forEach(id => {
    document.getElementById(id).addEventListener('change', e => {
      saveTime(id, e.target.value);
    });
  });
  
  document.getElementById('calculateBtn').addEventListener('click', () => {
    const entry = document.getElementById('entryTime').value;
    const startLunch = document.getElementById('startLunch').value;
    const endLunch = document.getElementById('endLunch').value;
    if (!entry || !startLunch || !endLunch) {
      document.getElementById('result').textContent = 'Preencha todos os campos.';
      return;
    }
    function toMinutes(timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    }
    const totalWork = 8 * 60;
    const beforeLunch = toMinutes(startLunch) - toMinutes(entry);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const afterLunch = Math.max(0, currentMinutes - toMinutes(endLunch));
    const worked = beforeLunch + afterLunch;
    const remaining = Math.max(0, totalWork - worked);
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    document.getElementById('result').textContent = `Faltam ${hours}h ${minutes}m para completar 8h.`;
  });