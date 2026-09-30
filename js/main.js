document.addEventListener('DOMContentLoaded', () => {
  initInvitation();
  initAudioPlayer();
  initCountdown();
  initRSVP();
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

function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('rsvp-name');
  const guestGroup = document.getElementById('guest-group');
  const guestInput = document.getElementById('rsvp-guests');
  const statusEl = document.getElementById('rsvp-status');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  const modal = document.getElementById('rsvp-modal');
  const btnModalClose = document.getElementById('btn-modal-close');

    if (!form || !nameInput || !guestGroup || !guestInput || !statusEl || !modal || !btnModalClose) return;

  function openModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    btnModalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  btnModalClose.addEventListener('click', closeModal);

  // Tutup saat klik area gelap di luar kotak popup
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  // Tutup dengan tombol Esc
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = 'rsvp-status' + (type ? ' ' + type : '');
  }

  function getAttendance() {
    const checked = document.querySelector('input[name="attendance"]:checked');
    return checked ? checked.value : '';
  }

  // Sembunyikan Jumlah Tamu jika memilih "Tidak Hadir"
  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      guestGroup.classList.toggle('hidden', getAttendance() === 'Tidak Hadir');
      showStatus('', '');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const attendance = getAttendance();
    const guests = parseInt(guestInput.value, 10);

    // Validasi sederhana
    if (!nameInput.value.trim()) {
      showStatus('Mohon isi nama Anda.', 'error');
      nameInput.focus();
      return;
    }

    if (!attendance) {
      showStatus('Mohon pilih Hadir atau Tidak Hadir.', 'error');
      return;
    }

    if (attendance === 'Hadir' && (!Number.isInteger(guests) || guests < 1)) {
      showStatus('Jumlah tamu minimal 1 orang.', 'error');
      guestInput.focus();
      return;
    }

    // Notifikasi berhasil (tanpa mengirim data ke mana pun)
    showStatus('', '');
    openModal();

    form.reset();
    guestGroup.classList.remove('hidden');
  });
}