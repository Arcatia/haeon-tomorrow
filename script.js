(() => {
      const panelAliases = {
        top: 'home',
        about: 'home',
        home: 'home',
        people: 'people',
        rebuild: 'rebuild',
        map: 'map',
        places: 'map',
        radio: 'home'
      };
      const panels = [...document.querySelectorAll('[data-panel]')];
      const navButtons = [...document.querySelectorAll('[data-panel-target]')];

      function normalizePanelId(value) {
        const key = String(value || '').replace(/^#/, '').trim().toLowerCase();
        return panelAliases[key] || 'home';
      }

      function setAddress(id, replace = false) {
        const nextHash = `#${id}`;
        if (location.hash === nextHash) return;
        try {
          const method = replace ? 'replaceState' : 'pushState';
          history[method](null, '', nextHash);
        } catch {
          location.hash = nextHash;
        }
      }

      function showPanel(value, options = {}) {
        const id = normalizePanelId(value);
        panels.forEach((panel) => {
          const active = panel.dataset.panel === id;
          panel.classList.toggle('is-active', active);
          panel.setAttribute('aria-hidden', String(!active));
          if (active) panel.scrollTop = 0;
        });
        navButtons.forEach((button) => button.setAttribute('aria-selected', String(button.dataset.panelTarget === id)));
        if (options.fromHash) {
          setAddress(id, true);
        } else {
          setAddress(id);
        }
        if (options.focus) document.querySelector(`[data-panel="${id}"]`).focus({ preventScroll: true });
      }

      navButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
          if (button.matches('a[href]')) event.preventDefault();
          showPanel(button.dataset.panelTarget);
        });
        button.addEventListener('keydown', (event) => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
          event.preventDefault();
          const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
          const next = navButtons[(index + delta + navButtons.length) % navButtons.length];
          next.focus();
          showPanel(next.dataset.panelTarget);
        });
      });

      document.querySelectorAll('[data-go-panel]').forEach((button) => button.addEventListener('click', (event) => {
        if (button.matches('a[href]')) event.preventDefault();
        showPanel(button.dataset.goPanel, { focus: true });
      }));
      window.addEventListener('hashchange', () => showPanel(location.hash.slice(1), { fromHash: true }));
      window.addEventListener('popstate', () => showPanel(location.hash.slice(1), { fromHash: true }));
      showPanel(location.hash.slice(1) || 'home', { fromHash: true });

      const tracks = [
        { title: '내일은 분명 맑음', artist: 'HAEON ORIGINAL SOUNDTRACK', src: './assets/audio/01-tomorrow-will-be-sunny.mp3', art: './assets/images/cover.webp', duration: '--:--' },
        { title: '841 Days', artist: '유건하 · CHARACTER THEME', src: './assets/audio/02-841-days.mp3', art: './assets/images/yoo-geonha.webp', duration: '--:--' },
        { title: 'Blueprint for Tomorrow', artist: '서태오 · CHARACTER THEME', src: './assets/audio/03-blueprint-for-tomorrow.mp3', art: './assets/images/seo-taeo.webp', duration: '--:--' },
        { title: 'Vitals at Dawn', artist: '윤해나 · CHARACTER THEME', src: './assets/audio/04-vitals-at-dawn.mp3', art: './assets/images/yoon-haena.webp', duration: '--:--' },
        { title: 'Radio Haeon 91.7', artist: '고라온 · CHARACTER THEME', src: './assets/audio/05-radio-haeon.mp3', art: './assets/images/go-raon.webp', duration: '--:--' },
        { title: 'Sugar After the End', artist: '문해솔 · CHARACTER THEME', src: './assets/audio/06-sugar-after-the-end.mp3', art: './assets/images/moon-haesol.webp', duration: '--:--' }
      ];

      const drawer = document.getElementById('playerDrawer');
      const backdrop = document.getElementById('modalBackdrop');
      const drawerToggles = [document.getElementById('stationButton'), document.getElementById('drawerToggle')];
      const drawerClose = document.getElementById('drawerClose');
      const audio = document.getElementById('audioPlayer');
      const playButtons = [document.getElementById('miniPlay'), document.getElementById('playTrack')];
      const seek = document.getElementById('seekBar');
      const volume = document.getElementById('volumeControl');
      const status = document.getElementById('audioStatus');
      const trackList = document.getElementById('trackList');
      let currentIndex = 0;
      let sourceLoaded = audio.getAttribute('src') === tracks[currentIndex].src;
      let lastFocus = null;

      const formatTime = (seconds) => {
        if (!Number.isFinite(seconds)) return '0:00';
        return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
      };

      function setPlayingUI(playing) {
        playButtons.forEach((button) => {
          button.textContent = playing ? 'Ⅱ' : '▶';
          button.setAttribute('aria-label', playing ? '일시정지' : '재생');
          button.title = playing ? '일시정지' : '재생';
        });
      }

      function renderTracks() {
        trackList.replaceChildren();
        tracks.forEach((track, index) => {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `track-button${index === currentIndex ? ' is-current' : ''}`;
          button.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
          button.innerHTML = `<span class="track-no">${String(index + 1).padStart(2, '0')}</span><span class="track-name"><strong>${track.title}</strong><span>${track.artist}</span></span><span class="track-duration">${track.duration}</span>`;
          button.addEventListener('click', () => selectTrack(index, true));
          item.appendChild(button);
          trackList.appendChild(item);
        });
      }

      function updateTrackUI() {
        const track = tracks[currentIndex];
        document.getElementById('trackTitle').textContent = track.title;
        document.getElementById('trackArtist').textContent = track.artist;
        document.getElementById('playerArtwork').src = track.art;
        document.getElementById('miniTrackName').textContent = `${track.title} — ${track.artist.split(' · ')[0]}`;
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('duration').textContent = track.duration === '--:--' ? '0:00' : track.duration;
        seek.value = 0;
        status.textContent = '재생 버튼을 누르면 방송을 시작합니다.';
        renderTracks();
      }

      function selectTrack(index, autoplay = false) {
        currentIndex = (index + tracks.length) % tracks.length;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        sourceLoaded = false;
        setPlayingUI(false);
        updateTrackUI();
        if (autoplay) playCurrent(false);
      }

      async function playCurrent(toggle = true) {
        if (toggle && !audio.paused) { audio.pause(); return; }
        if (!sourceLoaded) {
          audio.src = tracks[currentIndex].src;
          audio.volume = Number(volume.value);
          sourceLoaded = true;
        }
        status.textContent = '주파수 연결 중…';
        try {
          await audio.play();
          setPlayingUI(true);
          status.textContent = 'ON AIR · 해온 전역 송출 중';
        } catch (error) {
          setPlayingUI(false);
          status.textContent = error?.name === 'NotAllowedError'
            ? '브라우저 정책상 자동재생이 차단되었습니다. 재생 버튼을 눌러 주세요.'
            : '음원 파일을 찾지 못했습니다. assets/audio 폴더를 확인해 주세요.';
        }
      }

      function openDrawer(trigger) {
        lastFocus = trigger || document.activeElement;
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add('is-open'));
        drawerToggles.forEach((button) => button.setAttribute('aria-expanded', 'true'));
        document.body.classList.add('modal-open');
        drawerClose.focus({ preventScroll: true });
      }

      function closeDrawer() {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        backdrop.classList.remove('is-open');
        drawerToggles.forEach((button) => button.setAttribute('aria-expanded', 'false'));
        document.body.classList.remove('modal-open');
        window.setTimeout(() => { backdrop.hidden = true; }, 290);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
      }

      function toggleDrawer(event) { drawer.classList.contains('is-open') ? closeDrawer() : openDrawer(event.currentTarget); }
      drawerToggles.forEach((button) => button.addEventListener('click', toggleDrawer));
      document.querySelectorAll('[data-open-player]').forEach((button) => button.addEventListener('click', () => openDrawer(button)));
      drawerClose.addEventListener('click', closeDrawer);
      backdrop.addEventListener('click', closeDrawer);

      document.addEventListener('keydown', (event) => {
        if (!drawer.classList.contains('is-open')) return;
        if (event.key === 'Escape') { closeDrawer(); return; }
        if (event.key !== 'Tab') return;
        const focusable = [...drawer.querySelectorAll('button:not([disabled]), input:not([disabled])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });

      playButtons.forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); playCurrent(); }));
      const previous = () => selectTrack(currentIndex - 1, !audio.paused);
      const next = () => selectTrack(currentIndex + 1, !audio.paused);
      [document.getElementById('miniPrev'), document.getElementById('prevTrack')].forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); previous(); }));
      [document.getElementById('miniNext'), document.getElementById('nextTrack')].forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); next(); }));

      audio.addEventListener('play', () => { setPlayingUI(true); status.textContent = 'ON AIR · 해온 전역 송출 중'; });
      audio.addEventListener('pause', () => { setPlayingUI(false); if (audio.currentTime > 0 && !audio.ended) status.textContent = '방송 일시정지'; });
      audio.addEventListener('loadedmetadata', () => {
        tracks[currentIndex].duration = formatTime(audio.duration);
        document.getElementById('duration').textContent = tracks[currentIndex].duration;
        renderTracks();
      });
      audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        seek.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => selectTrack(currentIndex + 1, true));
      audio.addEventListener('error', () => { setPlayingUI(false); status.textContent = '음원 파일을 찾지 못했습니다. assets/audio 폴더를 확인해 주세요.'; });
      seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = (Number(seek.value) / 100) * audio.duration; });
      volume.addEventListener('input', () => { audio.volume = Number(volume.value); });

      const timeEl = document.getElementById('localTime');
      const clock = () => { timeEl.textContent = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); };
      clock();
      window.setInterval(clock, 30000);
      updateTrackUI();
      playCurrent(false);
    })();
