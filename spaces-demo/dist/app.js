/**
 * Apple Spaces — High-Fidelity OS Prototype
 * iOS 18 & tvOS 18 System Architecture
 * 
 * Features:
 * - Guided Storyboard Walkthrough (1. Planning -> 2. Invite/Vote -> 3. Live Space -> 4. Apple TV Hub -> 5. Teardown)
 * - Dual-Device Stage Mode (iPhone 16 Pro + Apple TV 4K "Party Billboard" Live Sync)
 * - Authentic Dynamic Island (Compact capsule -> Expandable Live Activity overlay with backdrop dismissal)
 * - Privacy-First Architecture: Location defaults to OFF with manual "I'm here" fallback
 * - Apple Cash Wallet Tab ($32 Pizza / $8 each) with Apple Pay settlement
 * - Collaborative SharePlay Music Queue & Live Photo Slideshow
 * - Native Web Audio API Synthesizer for tactile Apple UI sound effects
 */

(function () {
  'use strict';

  // --- Prototype Data Store ---
  const SPACE_DATA = {
    name: 'Movie Night',
    where: "Maya's apt",
    timeSpan: '8:00 – 11:30 PM',
    costItem: 'Pizza & Drinks',
    costTotal: 32.00,
    costPerPerson: 8.00,
    isSpaceActive: true,
    locationOptIn: false,
    userPaid: false,
    votedTime: '8pm',
    currentTrackIndex: 0,
    photoIndex: 0,
    currentStep: 3,
    stageMode: 'dual', // dual | phoneOnly | android
    persona: 'host', // host (Maya) | guest (Jordan)

    guests: [
      { id: 'maya', name: 'Maya', role: 'Host', status: 'Here', statusClass: 'here', avatar: 'M', gradient: 'linear-gradient(135deg, #FF6B6B, #EE5253)' },
      { id: 'jordan', name: 'Jordan', role: 'Guest', status: '5 min away', statusClass: 'eta', avatar: 'J', gradient: 'linear-gradient(135deg, #4834D4, #686DE0)' },
      { id: 'sam', name: 'Sam', role: 'Guest', status: 'Location Off', statusClass: 'off', avatar: 'S', gradient: 'linear-gradient(135deg, #F0932B, #FFBE76)', showCheckIn: true },
      { id: 'priya', name: 'Priya', role: 'Guest', status: 'Pending', statusClass: 'off', avatar: 'P', gradient: 'linear-gradient(135deg, #6AB04C, #BADC58)' }
    ],

    playlist: [
      { title: 'Interstellar Theme', artist: 'Hans Zimmer', album: 'Soundtrack', addedBy: 'Jordan', artGradient: 'linear-gradient(135deg, #1f2733, #0b0f19)', tvGlow: 'rgba(10, 132, 255, 0.25)' },
      { title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', addedBy: 'Maya', artGradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', tvGlow: 'rgba(255, 105, 180, 0.25)' },
      { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', addedBy: 'Sam', artGradient: 'linear-gradient(135deg, #ff0844, #ffb199)', tvGlow: 'rgba(255, 69, 58, 0.25)' }
    ],

    photos: ['🍿🎬', '🍕🎉', '🥂✨', '🛋️🍿']
  };

  // Helper DOM selectors
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // --- Web Audio API Synthesizer ---
  let audioCtx = null;
  let audioEnabled = false;

  function playAppleSound(type) {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'expand') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'cash') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now);
        osc.frequency.setValueAtTime(1318.5, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio playback unavailable:', e);
    }
  }

  // --- Toast Notification ---
  let toastTimer = null;
  function showToast(title, message, icon = '🍿') {
    const toast = $('appleToast');
    if (!toast) return;
    $('toastTitle').textContent = title;
    $('toastMessage').textContent = message;
    $('toastIcon').textContent = icon;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }

  // --- RENDER FUNCTIONS ---

  function renderWhoIsHere() {
    const container = $('guestsListContainer');
    if (!container) return;

    container.innerHTML = SPACE_DATA.guests.map(g => `
      <div class="guest-item-row">
        <div class="guest-left-cluster">
          <div class="guest-avatar-circle" style="background:${g.gradient}">${g.avatar}</div>
          <div>
            <strong>${g.name}</strong>
            <span class="guest-role-tag">${g.role}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;">
          <span class="guest-status-badge ${g.statusClass}">${g.status}</span>
          ${g.showCheckIn ? `<button class="manual-checkin-action" data-guest="${g.id}">I'm here</button>` : ''}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.manual-checkin-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const guest = SPACE_DATA.guests.find(x => x.id === btn.dataset.guest);
        if (guest) {
          guest.status = 'Here ✓';
          guest.statusClass = 'here';
          guest.showCheckIn = false;
          playAppleSound('click');
          showToast("Sam: I'm here", "Checked in manually without sharing location.", '👋');
          renderAll();
        }
      });
    });
  }

  function renderCosts() {
    const paidCount = SPACE_DATA.userPaid ? 4 : 3;
    const total = SPACE_DATA.costTotal.toFixed(2);
    const perPerson = SPACE_DATA.costPerPerson.toFixed(2);

    $('cashTotalAmount').textContent = `$${total}`;
    $('cashSplitSub').textContent = `${SPACE_DATA.costItem} → $${perPerson} / each`;
    $('cashContributorsCount').textContent = `${paidCount} of 4 paid`;
    $('cashProgressFill').style.width = `${(paidCount / 4) * 100}%`;

    const payBtn = $('btnPayCashShare');
    const payText = $('btnPayCashShareText');
    if (SPACE_DATA.userPaid) {
      payText.textContent = '✓ Paid $8';
      payBtn.style.background = '#30D158';
      payBtn.style.color = '#fff';
    } else {
      payText.textContent = `Pay $${SPACE_DATA.costPerPerson.toFixed(0)}`;
      payBtn.style.background = '#ffffff';
      payBtn.style.color = '#000000';
    }
  }

  function renderMusic() {
    const track = SPACE_DATA.playlist[SPACE_DATA.currentTrackIndex];
    if (!track) return;

    // iPhone Platter
    $('platterTrackTitle').textContent = track.title;
    $('platterArtist').textContent = `${track.artist} · ${track.album}`;
    $('platterAddedBy').textContent = `Queued by ${track.addedBy}`;
    $('nowPlayingArt').style.background = track.artGradient;
    $('chipNowPlaying').textContent = track.title;

    // Up Next Queue
    const upNext = SPACE_DATA.playlist.filter((_, i) => i !== SPACE_DATA.currentTrackIndex);
    $('queueMiniList').innerHTML = upNext.map(t => `
      <div class="queue-track-row">
        <span><strong>${t.title}</strong> · ${t.artist}</span>
        <small>by ${t.addedBy}</small>
      </div>
    `).join('');

    // Dynamic Island Expanded Player
    $('islandTrackName').textContent = track.title;
    $('islandTrackArtist').textContent = `${track.artist} · Queued by ${track.addedBy}`;

    // Apple TV Billboard
    $('tvTrackName').textContent = track.title;
    $('tvArtistName').textContent = track.artist;
    $('tvAlbumTitle').textContent = track.album;
    $('tvQueueByBadge').textContent = `Queued by ${track.addedBy}`;
    $('tvAlbumArt').style.background = track.artGradient;

    const nextTrack = SPACE_DATA.playlist[(SPACE_DATA.currentTrackIndex + 1) % SPACE_DATA.playlist.length];
    $('tvUpNextTrack').textContent = `${nextTrack.title} · ${nextTrack.artist}`;
    $('tvUpNextBy').textContent = `(${nextTrack.addedBy})`;

    // Apple TV Ambient Mesh Glow
    $('tvAmbientGlow').style.background = `radial-gradient(circle at 30% 40%, ${track.tvGlow} 0%, rgba(138, 35, 135, 0.2) 40%, transparent 70%)`;
  }

  function renderPhotos() {
    $('photoStreamCount').textContent = `${SPACE_DATA.photos.length} Photos`;
    $('tvPhotoCountBadge').textContent = `${SPACE_DATA.photos.length} Photos`;

    $('photosGrid').innerHTML = SPACE_DATA.photos.map(p => `
      <div class="photo-cell">
        <span>${p}</span>
        <small>LIVE</small>
      </div>
    `).join('');

    // TV Slideshow
    const activePhoto = SPACE_DATA.photos[SPACE_DATA.photoIndex % SPACE_DATA.photos.length];
    $('tvPolaroidImg').innerHTML = `<span class="polaroid-big-emoji">${activePhoto}</span>`;
  }

  function renderTvPresenceAndDial() {
    const paidCount = SPACE_DATA.userPaid ? 4 : 3;
    $('tvPiggyAmount').textContent = `$${(paidCount * SPACE_DATA.costPerPerson).toFixed(0)}`;
    $('tvPiggyPercent').textContent = `${(paidCount / 4) * 100}% Paid`;

    $('tvPresenceAvatars').innerHTML = SPACE_DATA.guests.map(g => `
      <div class="tv-chip">
        <span class="tv-chip-dot"></span>
        <span>${g.name}</span>
      </div>
    `).join('');
  }

  function renderLocationSubtext() {
    const label = $('locationSubtextLabel');
    if (!label) return;
    if (SPACE_DATA.locationOptIn) {
      label.textContent = 'On · Ephemeral Find My ETA sharing active';
      label.style.color = '#30D158';
    } else {
      label.textContent = 'Off · Tap "I\'m here" check-in instead';
      label.style.color = 'rgba(235, 235, 245, 0.65)';
    }
  }

  function renderAll() {
    renderWhoIsHere();
    renderCosts();
    renderMusic();
    renderPhotos();
    renderTvPresenceAndDial();
    renderLocationSubtext();
  }

  // --- NAVIGATION & SURFACE SWITCHING ---

  function setPhoneSurface(surfaceName) {
    $$('.surface-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.surface === surfaceName);
    });

    $('surfaceSpacesApp').classList.toggle('hidden', surfaceName !== 'spacesApp');
    $('surfaceImessage').classList.toggle('hidden', surfaceName !== 'imessage');
    $('surfaceLockscreen').classList.toggle('hidden', surfaceName !== 'lockscreen');
    $('surfaceCreateSpace').classList.toggle('hidden', surfaceName !== 'createSpace');

    playAppleSound('click');
  }

  function setWalkthroughStep(stepNum) {
    SPACE_DATA.currentStep = parseInt(stepNum, 10);
    $$('.step-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step, 10) === SPACE_DATA.currentStep);
    });

    playAppleSound('click');

    if (SPACE_DATA.currentStep === 1) {
      // Step 1: Planning in Messages + menu
      setPhoneSurface('createSpace');
      setStageMode('dual');
      showToast('Step 1: Planning', 'Starting a Space in Messages with 3 time options.', '📝');
    } else if (SPACE_DATA.currentStep === 2) {
      // Step 2: iMessage Card & Availability Voting
      setPhoneSurface('imessage');
      setStageMode('dual');
      showToast('Step 2: Invite & Vote', 'Friends vote on times. Locks in 8pm consensus.', '📅');
    } else if (SPACE_DATA.currentStep === 3) {
      // Step 3: Space Live on iPhone
      setPhoneSurface('spacesApp');
      setStageMode('dual');
      showToast('Step 3: Space Live', 'Orchestrating music, photos, and pizza tab.', '🍿');
    } else if (SPACE_DATA.currentStep === 4) {
      // Step 4: Apple TV Focus
      setStageMode('dual');
      setPhoneSurface('spacesApp');
      showToast('Step 4: Living Room TV', 'Apple TV ambient display syncing live with phones.', '📺');
    } else if (SPACE_DATA.currentStep === 5) {
      // Step 5: Teardown Summary
      openTeardownModal();
      showToast('Step 5: Teardown', 'Automatic cleanup. Instant Apple Pay settlement.', '✓');
    }
  }

  function setStageMode(mode) {
    SPACE_DATA.stageMode = mode;
    $$('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    const stage = $('viewportStage');
    stage.classList.toggle('dual-mode', mode === 'dual');
    stage.classList.toggle('phone-only-mode', mode === 'phoneOnly');
    stage.classList.toggle('android-mode', mode === 'android');

    playAppleSound('click');
  }

  function setPersona(persona) {
    SPACE_DATA.persona = persona;
    $('btnPersonaHost').classList.toggle('active', persona === 'host');
    $('btnPersonaGuest').classList.toggle('active', persona === 'guest');

    playAppleSound('click');
    if (persona === 'guest') {
      showToast('Persona: Jordan', 'Lowkey Joiner view: Private joining & cost check.');
      setPhoneSurface('imessage');
    } else {
      showToast('Persona: Maya', 'Social Coordinator view: Organizer controls.');
      setPhoneSurface('spacesApp');
    }
  }

  // --- MODALS ---

  function openTeardownModal() {
    const modal = $('teardownModal');
    if (modal) modal.showModal();
  }

  function closeTeardownModal() {
    const modal = $('teardownModal');
    if (modal) modal.close();
  }

  function openAddCostModal() {
    const modal = $('addCostModal');
    if (modal) modal.showModal();
  }

  function closeAddCostModal() {
    const modal = $('addCostModal');
    if (modal) modal.close();
  }

  // --- INITIALIZATION & EVENT LISTENERS ---

  function initListeners() {
    // Walkthrough Step Buttons
    $$('.step-btn').forEach(btn => {
      btn.addEventListener('click', () => setWalkthroughStep(btn.dataset.step));
    });

    // Stage Mode Buttons
    $$('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => setStageMode(btn.dataset.mode));
    });

    // Persona Switcher
    $('btnPersonaHost').addEventListener('click', () => setPersona('host'));
    $('btnPersonaGuest').addEventListener('click', () => setPersona('guest'));

    // Audio Toggle
    $('audioToggle').addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      document.querySelector('.audio-icon-on').classList.toggle('hidden', !audioEnabled);
      document.querySelector('.audio-icon-off').classList.toggle('hidden', audioEnabled);
      playAppleSound('click');
      showToast('Sound Effects', audioEnabled ? 'Apple UI sounds enabled' : 'Sounds muted', '🔊');
    });

    // iPhone Surface Tabs
    $$('.surface-tab').forEach(tab => {
      tab.addEventListener('click', () => setPhoneSurface(tab.dataset.surface));
    });

    // Dynamic Island Tap to Expand
    $('dynamicIsland').addEventListener('click', () => {
      $('islandExpandedOverlay').classList.remove('hidden');
      playAppleSound('expand');
    });

    // Dynamic Island Backdrop Click to Dismiss
    $('islandBackdrop').addEventListener('click', () => {
      $('islandExpandedOverlay').classList.add('hidden');
      playAppleSound('click');
    });

    $('btnIslandEnd').addEventListener('click', () => {
      $('islandExpandedOverlay').classList.add('hidden');
      openTeardownModal();
    });

    $('btnIslandNextTrack').addEventListener('click', advanceTrack);

    // Quick Simulation Chips in Sub-Bar
    $('chipSimArrival').addEventListener('click', () => {
      const jordan = SPACE_DATA.guests.find(g => g.name === 'Jordan');
      if (jordan) {
        jordan.status = 'Here ✓';
        jordan.statusClass = 'here';
      }
      playAppleSound('expand');
      showToast('Jordan Arrived', 'Jordan reached the living room via Find My.', '📍');
      renderAll();
    });

    $('chipSimSong').addEventListener('click', advanceTrack);
    $('chipSimPhoto').addEventListener('click', snapLivePhoto);

    $('chipSimCash').addEventListener('click', payCashShare);
    $('chipEndSpace').addEventListener('click', openTeardownModal);

    // In-App Buttons
    $('btnPayCashShare').addEventListener('click', payCashShare);
    $('btnAddCostAction').addEventListener('click', openAddCostModal);
    $('btnCancelAddCost').addEventListener('click', closeAddCostModal);

    $('btnConfirmAddCost').addEventListener('click', () => {
      const item = $('inputCostItem').value || 'Snacks';
      const amount = parseFloat($('inputCostAmount').value) || 32.00;
      SPACE_DATA.costItem = item;
      SPACE_DATA.costTotal = amount;
      SPACE_DATA.costPerPerson = amount / 4;
      closeAddCostModal();
      playAppleSound('cash');
      showToast('Expense Added', `${item} ($${amount}) split 4 ways ($${(amount/4).toFixed(0)}/ea).`, '💳');
      renderAll();
    });

    $('btnAddSongToQueue').addEventListener('click', advanceTrack);
    $('btnSnapLivePhoto').addEventListener('click', snapLivePhoto);

    // Location Toggle
    $('chkLocationOptIn').addEventListener('change', e => {
      SPACE_DATA.locationOptIn = e.target.checked;
      playAppleSound('click');
      renderLocationSubtext();
      showToast('Location Privacy', SPACE_DATA.locationOptIn ? 'Broadcasting Find My proximity' : 'Location sharing turned OFF', '⌖');
    });

    // iMessage Screen Buttons
    $('btnImessageBack').addEventListener('click', () => {
      setPhoneSurface('spacesApp');
    });

    const timeButtons = $$('#timePillRow .time-btn');
    timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SPACE_DATA.votedTime = btn.dataset.time;
        playAppleSound('click');

        const label = $('votingConsensusLabel');
        if (SPACE_DATA.votedTime === '8pm') {
          label.textContent = '4 of 5 free at 8pm (Consensus)';
          label.style.color = '#30D158';
        } else if (SPACE_DATA.votedTime === '7pm') {
          label.textContent = '2 of 5 free at 7pm';
          label.style.color = '#FF9F0A';
        } else {
          label.textContent = '3 of 5 free at 9pm';
          label.style.color = '#FF9F0A';
        }
      });
    });

    $('btnImessageJoin').addEventListener('click', () => {
      playAppleSound('chime');
      $('imessageJoinBtnText').textContent = '✓ Joined Space';
      showToast('Joined via iMessage', 'You are now part of Movie Night!', '🍿');
      setPhoneSurface('spacesApp');
    });

    $('btnPreviewAndroidLink').addEventListener('click', () => {
      setStageMode('android');
      showToast('Android Link Preview', 'Testing how friends on Android view the plan & costs.', '🤖');
    });

    $('btnOpenCreateSpacePlus').addEventListener('click', () => {
      setPhoneSurface('createSpace');
    });

    // Create Space Form Buttons
    $('btnCancelCreateSpace').addEventListener('click', () => {
      setPhoneSurface('imessage');
    });

    $('btnSendSpaceToChat').addEventListener('click', sendSpaceToChat);
    $('btnSendToChatAction').addEventListener('click', sendSpaceToChat);

    function sendSpaceToChat() {
      const name = $('inputSpaceName').value || 'Movie Night';
      const where = $('inputSpaceWhere').value || "Maya's apt";
      SPACE_DATA.name = name;
      SPACE_DATA.where = where;

      playAppleSound('chime');
      showToast('Space Created', `"${name}" card posted to Roommates chat.`, '🍿');
      setPhoneSurface('imessage');
    }

    // Teardown Sheet Actions
    $('btnPhoneEndSpace').addEventListener('click', openTeardownModal);

    $('btnPayMayaApplePay').addEventListener('click', () => {
      playAppleSound('cash');
      $('btnPayMayaApplePay').innerHTML = '<span>✓ Paid</span>';
      $('btnPayMayaApplePay').style.background = '#30D158';
      $('btnPayMayaApplePay').style.color = '#fff';
      showToast('Apple Pay Settled', 'Sent $8.00 to Maya via Apple Pay.', '💳');
    });

    $('btnPlanNextOne').addEventListener('click', () => {
      closeTeardownModal();
      playAppleSound('chime');
      setPhoneSurface('createSpace');
      showToast('Plan Next Space', 'Starting a new Space draft in Messages.', '🍿');
    });

    $('btnCloseTeardown').addEventListener('click', closeTeardownModal);

    // Android Web Checkout Buttons
    $('btnAndroidPay').addEventListener('click', () => {
      playAppleSound('cash');
      $('btnAndroidPay').textContent = '✓ Paid $8.00';
      showToast('Web Payment', 'Alex paid $8 share via web checkout.', '💳');
    });

    $('btnAndroidAddPhoto').addEventListener('click', snapLivePhoto);
    $('btnAndroidAddSong').addEventListener('click', advanceTrack);

    // Help Modal
    $('btnHelp').addEventListener('click', () => {
      $('aboutModal').showModal();
    });

    $('btnCloseAbout').addEventListener('click', () => {
      $('aboutModal').close();
    });
  }

  // --- CORE SIMULATION HANDLERS ---

  function advanceTrack() {
    SPACE_DATA.currentTrackIndex = (SPACE_DATA.currentTrackIndex + 1) % SPACE_DATA.playlist.length;
    playAppleSound('click');
    const track = SPACE_DATA.playlist[SPACE_DATA.currentTrackIndex];
    showToast('Queue Updated', `Now playing "${track.title}" on Living Room TV`, '🎵');
    renderMusic();
  }

  function snapLivePhoto() {
    const emojis = ['🍿🎬', '🍕🎉', '🥂✨', '🛋️🍿', '🎸🌟', '📸💛'];
    const nextEmoji = emojis[SPACE_DATA.photos.length % emojis.length];
    SPACE_DATA.photos.unshift(nextEmoji);
    SPACE_DATA.photoIndex = 0;
    playAppleSound('click');
    showToast('Photo Streamed', 'New photo streamed live to Apple TV Billboard.', '📷');
    renderPhotos();
  }

  function payCashShare() {
    SPACE_DATA.userPaid = true;
    playAppleSound('cash');
    showToast('Apple Pay Settled', 'Paid $8.00 to Maya for pizza via Apple Pay.', '💳');
    renderCosts();
    renderTvPresenceAndDial();
  }

  // --- Clock Updater ---
  function initClock() {
    function tick() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const el = $('statusClock');
      if (el) el.textContent = timeStr;
      const tvEl = $('tvClock');
      if (tvEl) tvEl.textContent = `${timeStr} PM`;
    }
    tick();
    setInterval(tick, 30000);
  }

  // --- App Entry Point ---
  function init() {
    initListeners();
    initClock();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
