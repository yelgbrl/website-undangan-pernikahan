document.addEventListener('DOMContentLoaded', () => {
  initInvitation();
  initAudioPlayer();
  initCountdown();
});

function initInvitation() {
  const btnOpen = document.getElementById('btn-open');
  const coverOverlay = document.getElementById('cover-overlay');
  const mainContent = document.getElementById('main-content');
  const btnAudio = document.getElementById('btn-audio');
  const bgMusic = document.getElementById('bg-music');

  if (!btnOpen || !coverOverlay || !mainContent) return;

  btnOpen.addEventListener('click', () => {
    coverOverlay.classList.add('fade-out');

    mainContent.classList.remove('main-content-locked');
    mainContent.classList.add('main-content-unlocked');

    if (btnAudio) {
      btnAudio.classList.remove('hidden');
    }

    if (bgMusic) {
      bgMusic.play().then(() => {
        if (btnAudio) btnAudio.classList.add('playing');
      }).catch(error => {
        console.warn('Autoplay audio diblokir oleh browser:', error);
      });
    }
  });
}

function initAudioPlayer() {
  const btnAudio = document.getElementById('btn-audio');
  const bgMusic = document.getElementById('bg-music');
  const audioIcon = document.getElementById('audio-icon');

  if (!btnAudio || !bgMusic) return;

  btnAudio.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        btnAudio.classList.add('playing');
        if (audioIcon) audioIcon.textContent = 'music_note';
      }).catch(error => {
        console.warn('Gagal memutar audio:', error);
      });
    } else {
      bgMusic.pause();
      btnAudio.classList.remove('playing');
      if (audioIcon) audioIcon.textContent = 'music_off';
    }
  });
}

function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Tanggal acara: 3 Oktober 2026, 10:00 WIB (UTC+7)
  const targetDate = new Date('2026-10-03T10:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}