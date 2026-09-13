(function () {
  'use strict';

  var PROVIDERS = [
    { key: 'bibishort', label: 'BibiShort', note: 'Direct MP4 sources may require MP4Box when the file is not fast-start optimized.' },
    { key: 'candyjar', label: 'CandyJar' },
    { key: 'cubetv', label: 'CubeTV' },
    { key: 'dotdrama', label: 'DotDrama' },
    { key: 'dramabite', label: 'Dramabite' },
    { key: 'dramabox', label: 'DramaBox', note: 'Playback commonly uses expiring or proxied sources. Test only a URL you are authorized to access.' },
    { key: 'dramanova', label: 'DramaNova' },
    { key: 'dramashorts', label: 'DramaShorts', note: 'Some sources use master HLS playlists with multiple audio and quality tracks.' },
    { key: 'dramawave', label: 'DramaWave' },
    { key: 'flareflow', label: 'FlareFlow' },
    { key: 'flextv', label: 'FlexTV' },
    { key: 'flickreels', label: 'FlickReels' },
    { key: 'freereels', label: 'FreeReels' },
    { key: 'fundrama', label: 'FunDrama' },
    { key: 'goodshort', label: 'GoodShort', note: 'GoodShort/GoodReels sources are often HLS. A valid playlist must allow cross-origin playback.' },
    { key: 'happyshort', label: 'HappyShort' },
    { key: 'idrama', label: 'iDrama' },
    { key: 'joyreels', label: 'JoyReels' },
    { key: 'kalostv', label: 'KalosTV' },
    { key: 'melolo', label: 'Melolo' },
    { key: 'microdrama', label: 'MicroDrama' },
    { key: 'moboreels', label: 'MoboReels' },
    { key: 'mydrama', label: 'My Drama' },
    { key: 'myrelle', label: 'MyRelle' },
    { key: 'netshort', label: 'NetShort' },
    { key: 'pinedrama', label: 'PineDrama' },
    { key: 'playlet', label: 'Playlet' },
    { key: 'rapidtv', label: 'RapidTV' },
    { key: 'reelala', label: 'Reelala' },
    { key: 'reelbuzz', label: 'ReelBuzz' },
    { key: 'reelife', label: 'Reelife' },
    { key: 'reelshort', label: 'ReelShort' },
    { key: 'sarostv', label: 'SAROS TV' },
    { key: 'serealplus', label: 'Sereal+' },
    { key: 'shortical', label: 'Shortical' },
    { key: 'shortmax', label: 'ShortMax' },
    { key: 'stardusttv', label: 'StardustTV' },
    { key: 'starshort', label: 'StarShort' },
    { key: 'velolo', label: 'Velolo' },
    { key: 'vigloo', label: 'Vigloo' },
    { key: 'vyntage', label: 'Vyntage' }
  ];

  var STORAGE_KEY = 'provider_playback_lab_v1';
  var SAMPLE_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  var state = loadState();
  var activeProviderKey = state.activeProvider || 'bibishort';
  var activeFilter = 'all';
  var hlsInstance = null;
  var testStartedAt = 0;
  var testTimeout = null;
  var eventRows = [];
  var toastTimeout = null;
  var streamReadyMarked = false;

  var els = {
    providerList: document.getElementById('providerList'),
    providerSearch: document.getElementById('providerSearch'),
    providerCount: document.getElementById('providerCount'),
    selectedProvider: document.getElementById('selectedProvider'),
    providerNote: document.getElementById('providerNote'),
    selectedStatus: document.getElementById('selectedStatus'),
    workingCount: document.getElementById('workingCount'),
    failedCount: document.getElementById('failedCount'),
    untestedCount: document.getElementById('untestedCount'),
    video: document.getElementById('video'),
    playerEmpty: document.getElementById('playerEmpty'),
    playerLoading: document.getElementById('playerLoading'),
    sourceForm: document.getElementById('sourceForm'),
    streamUrl: document.getElementById('streamUrl'),
    playbackMode: document.getElementById('playbackMode'),
    autoplayToggle: document.getElementById('autoplayToggle'),
    sampleBtn: document.getElementById('sampleBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyLogBtn: document.getElementById('copyLogBtn'),
    formatMetric: document.getElementById('formatMetric'),
    hostMetric: document.getElementById('hostMetric'),
    resolutionMetric: document.getElementById('resolutionMetric'),
    loadTimeMetric: document.getElementById('loadTimeMetric'),
    durationMetric: document.getElementById('durationMetric'),
    engineMetric: document.getElementById('engineMetric'),
    testResult: document.getElementById('testResult'),
    eventLog: document.getElementById('eventLog'),
    eventCount: document.getElementById('eventCount'),
    toast: document.getElementById('toast')
  };

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (!parsed || typeof parsed !== 'object') return { providers: {} };
      if (!parsed.providers || typeof parsed.providers !== 'object') parsed.providers = {};
      return parsed;
    } catch (error) {
      return { providers: {} };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* storage can be disabled */ }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function providerByKey(key) {
    for (var i = 0; i < PROVIDERS.length; i += 1) {
      if (PROVIDERS[i].key === key) return PROVIDERS[i];
    }
    return PROVIDERS[0];
  }

  function providerState(key) {
    return state.providers[key] || { status: 'untested', url: '', mode: 'auto' };
  }

  function initials(label) {
    return label.replace(/[^a-z0-9 ]/gi, '').split(/\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 2).toUpperCase() || 'P';
  }

  function renderProviders() {
    var query = els.providerSearch.value.trim().toLowerCase();
    var visible = PROVIDERS.filter(function (provider) {
      var status = providerState(provider.key).status || 'untested';
      var queryMatch = !query || provider.label.toLowerCase().indexOf(query) !== -1 || provider.key.indexOf(query) !== -1;
      var filterMatch = activeFilter === 'all' || status === activeFilter;
      return queryMatch && filterMatch;
    });

    els.providerCount.textContent = String(visible.length);
    els.providerList.innerHTML = visible.length ? visible.map(function (provider) {
      var itemState = providerState(provider.key);
      return '<button type="button" class="provider-item' + (provider.key === activeProviderKey ? ' is-active' : '') + '" role="option" aria-selected="' + (provider.key === activeProviderKey ? 'true' : 'false') + '" data-provider-key="' + escapeHtml(provider.key) + '">' +
        '<span class="provider-avatar">' + escapeHtml(initials(provider.label)) + '</span>' +
        '<span class="provider-copy"><span class="provider-name">' + escapeHtml(provider.label) + '</span><span class="provider-key">' + escapeHtml(provider.key) + '</span></span>' +
        '<span class="provider-state ' + escapeHtml(itemState.status || 'untested') + '" aria-label="' + escapeHtml(itemState.status || 'untested') + '"></span>' +
      '</button>';
    }).join('') : '<p class="privacy-note">No matching providers.</p>';

    updateSummary();
  }

  function updateSummary() {
    var working = 0;
    var failed = 0;
    PROVIDERS.forEach(function (provider) {
      var status = providerState(provider.key).status;
      if (status === 'working') working += 1;
      if (status === 'failed') failed += 1;
    });
    els.workingCount.textContent = String(working);
    els.failedCount.textContent = String(failed);
    els.untestedCount.textContent = String(PROVIDERS.length - working - failed);
  }

  function selectProvider(key) {
    activeProviderKey = providerByKey(key).key;
    state.activeProvider = activeProviderKey;
    saveState();
    var provider = providerByKey(activeProviderKey);
    var saved = providerState(activeProviderKey);
    els.selectedProvider.textContent = provider.label;
    els.providerNote.textContent = provider.note || 'Paste an authorized stream URL to check playback, format support, load time and browser errors.';
    els.streamUrl.value = saved.url || '';
    els.playbackMode.value = saved.mode || 'auto';
    setStatusBadge(saved.status || 'untested');
    resetDiagnostics(false);
    renderProviders();
  }

  function setStatusBadge(status) {
    els.selectedStatus.className = 'status-badge status-' + status;
    els.selectedStatus.innerHTML = '<i></i> ' + status.charAt(0).toUpperCase() + status.slice(1);
  }

  function setProviderResult(status, message, manual) {
    var saved = providerState(activeProviderKey);
    state.providers[activeProviderKey] = {
      status: status,
      url: els.streamUrl.value.trim(),
      mode: els.playbackMode.value,
      testedAt: new Date().toISOString(),
      manual: Boolean(manual)
    };
    saveState();
    setStatusBadge(status);
    renderProviders();

    els.testResult.className = 'test-result is-' + status;
    els.testResult.innerHTML = '<span class="result-icon" aria-hidden="true">' + (status === 'working' ? '✓' : '×') + '</span><div><strong>' + (status === 'working' ? 'Stream is playable' : 'Playback failed') + '</strong><p>' + escapeHtml(message || (status === 'working' ? 'The browser reached the playing state.' : 'Check the event log for the reported media error.')) + '</p></div>';
    if (saved.status !== status || manual) showToast(providerByKey(activeProviderKey).label + ' marked ' + status + '.');
  }

  function showLoading(message) {
    els.testResult.className = 'test-result is-loading';
    els.testResult.innerHTML = '<span class="result-icon" aria-hidden="true">…</span><div><strong>Testing stream</strong><p>' + escapeHtml(message) + '</p></div>';
    els.playerEmpty.hidden = true;
    els.playerLoading.hidden = false;
  }

  function showToast(message) {
    window.clearTimeout(toastTimeout);
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    toastTimeout = window.setTimeout(function () { els.toast.classList.remove('is-visible'); }, 2300);
  }

  function detectMode(url, requestedMode) {
    if (requestedMode !== 'auto') return requestedMode;
    var lower = url.toLowerCase().split('#')[0];
    if (/\.m3u8(?:$|\?)/.test(lower) || lower.indexOf('/manifest') !== -1 || lower.indexOf('m3u8') !== -1) return 'hls';
    return 'mp4';
  }

  function readableMediaError(error) {
    if (!error) return 'The browser did not provide a media error code.';
    var messages = {
      1: 'Playback was aborted.',
      2: 'Network error while downloading the video.',
      3: 'The browser could not decode this video or codec.',
      4: 'Format, CORS policy, URL or source is not supported.'
    };
    return messages[error.code] || 'Unknown media error (code ' + error.code + ').';
  }

  function destroyPlayer() {
    window.clearTimeout(testTimeout);
    testTimeout = null;
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (error) { /* ignore */ }
      hlsInstance = null;
    }
    try { els.video.pause(); } catch (error) { /* ignore */ }
    els.video.removeAttribute('src');
    els.video.load();
    streamReadyMarked = false;
  }

  function resetDiagnostics(clearUrl) {
    destroyPlayer();
    eventRows = [];
    renderEventLog();
    els.formatMetric.textContent = '—';
    els.hostMetric.textContent = '—';
    els.resolutionMetric.textContent = '—';
    els.loadTimeMetric.textContent = '—';
    els.durationMetric.textContent = '—';
    els.engineMetric.textContent = '—';
    els.playerLoading.hidden = true;
    els.playerEmpty.hidden = false;
    els.testResult.className = 'test-result';
    els.testResult.innerHTML = '<span class="result-icon" aria-hidden="true">?</span><div><strong>Waiting for a stream</strong><p>Select a provider, paste its authorized URL, then run the test.</p></div>';
    if (clearUrl) els.streamUrl.value = '';
  }

  function addEvent(name, detail) {
    var now = new Date();
    eventRows.push({ time: now.toLocaleTimeString([], { hour12: false }), name: name, detail: detail || '—' });
    if (eventRows.length > 80) eventRows.shift();
    renderEventLog();
  }

  function renderEventLog() {
    els.eventCount.textContent = eventRows.length + (eventRows.length === 1 ? ' event' : ' events');
    if (!eventRows.length) {
      els.eventLog.innerHTML = '<li class="log-empty">No playback events yet.</li>';
      return;
    }
    els.eventLog.innerHTML = eventRows.map(function (row) {
      return '<li><time>' + escapeHtml(row.time) + '</time><span class="event-name">' + escapeHtml(row.name) + '</span><span>' + escapeHtml(row.detail) + '</span></li>';
    }).join('');
    els.eventLog.scrollTop = els.eventLog.scrollHeight;
  }

  function applyUrlMetrics(url, mode) {
    var parsed;
    try { parsed = new URL(url); } catch (error) { parsed = null; }
    els.formatMetric.textContent = mode === 'hls' ? 'HLS / M3U8' : 'MP4 / direct';
    els.hostMetric.textContent = parsed ? parsed.hostname : 'Invalid URL';
    els.engineMetric.textContent = mode === 'hls' && window.Hls && window.Hls.isSupported() ? 'hls.js' : 'Native video';
  }

  function playIfAllowed() {
    if (!els.autoplayToggle.checked) return;
    var promise = els.video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function (error) { addEvent('autoplay', error.name || 'Browser blocked autoplay'); });
    }
  }

  function startTest() {
    var url = els.streamUrl.value.trim();
    var mode;
    if (!url) { showToast('Paste a stream URL first.'); return; }
    try {
      var parsed = new URL(url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('Unsupported protocol');
    } catch (error) {
      showToast('Enter a valid HTTP or HTTPS URL.');
      return;
    }

    destroyPlayer();
    eventRows = [];
    renderEventLog();
    mode = detectMode(url, els.playbackMode.value);
    streamReadyMarked = false;
    testStartedAt = performance.now();
    applyUrlMetrics(url, mode);
    els.resolutionMetric.textContent = 'Waiting…';
    els.loadTimeMetric.textContent = 'Waiting…';
    els.durationMetric.textContent = 'Waiting…';
    showLoading(mode === 'hls' ? 'Loading the HLS manifest and media segments.' : 'Loading video metadata and checking codec support.');
    addEvent('start', providerByKey(activeProviderKey).label + ' · ' + mode.toUpperCase());

    var current = providerState(activeProviderKey);
    state.providers[activeProviderKey] = {
      status: current.status || 'untested',
      url: url,
      mode: els.playbackMode.value,
      testedAt: current.testedAt || '',
      manual: false
    };
    saveState();

    if (mode === 'hls' && window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        manifestLoadingTimeOut: 15000,
        levelLoadingTimeOut: 15000,
        fragLoadingTimeOut: 20000
      });
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function (event, data) {
        addEvent('manifest', (data.levels ? data.levels.length : 0) + ' quality level(s)');
        playIfAllowed();
      });
      hlsInstance.on(window.Hls.Events.LEVEL_SWITCHED, function (event, data) {
        var level = hlsInstance && hlsInstance.levels ? hlsInstance.levels[data.level] : null;
        if (level && level.width && level.height) {
          els.resolutionMetric.textContent = level.width + '×' + level.height;
          addEvent('quality', level.height + 'p');
        }
      });
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        addEvent(data.fatal ? 'hls fatal' : 'hls warning', (data.type || 'error') + ' · ' + (data.details || 'unknown'));
        if (data.fatal) {
          els.playerLoading.hidden = true;
          setProviderResult('failed', 'HLS fatal error: ' + (data.details || data.type || 'unknown'));
          try { hlsInstance.destroy(); } catch (error) { /* ignore */ }
          hlsInstance = null;
        }
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(els.video);
    } else if (mode === 'hls' && els.video.canPlayType('application/vnd.apple.mpegurl')) {
      els.engineMetric.textContent = 'Native HLS';
      els.video.src = url;
      playIfAllowed();
    } else if (mode === 'hls') {
      els.playerLoading.hidden = true;
      addEvent('unsupported', 'hls.js failed to load and native HLS is unavailable');
      setProviderResult('failed', 'HLS is not available because the hls.js library did not load and this browser has no native HLS support.');
      return;
    } else {
      els.video.src = url;
      playIfAllowed();
    }

    testTimeout = window.setTimeout(function () {
      if (els.video.readyState < 3) {
        addEvent('timeout', 'No playable media after 25 seconds');
        els.playerLoading.hidden = true;
        setProviderResult('failed', 'Timed out before the stream became playable. The URL may be expired, blocked by CORS, or unavailable.');
      } else if (!streamReadyMarked) {
        streamReadyMarked = true;
        els.playerLoading.hidden = true;
        els.playerEmpty.hidden = true;
        setProviderResult('working', 'The stream loaded successfully. Press Play if autoplay is blocked by your browser.');
      }
    }, 25000);
  }

  function bindVideoEvents() {
    ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'play', 'playing', 'pause', 'waiting', 'stalled', 'suspend', 'ended', 'abort', 'emptied'].forEach(function (name) {
      els.video.addEventListener(name, function () {
        var detail = 'readyState ' + els.video.readyState;
        if (name === 'loadedmetadata') {
          detail = els.video.videoWidth + '×' + els.video.videoHeight + ' · ' + formatDuration(els.video.duration);
          els.resolutionMetric.textContent = els.video.videoWidth && els.video.videoHeight ? els.video.videoWidth + '×' + els.video.videoHeight : 'Unknown';
          els.durationMetric.textContent = formatDuration(els.video.duration);
          els.loadTimeMetric.textContent = Math.round(performance.now() - testStartedAt) + ' ms';
        }
        if (name === 'canplay' && !streamReadyMarked) {
          streamReadyMarked = true;
          window.clearTimeout(testTimeout);
          els.playerLoading.hidden = true;
          els.playerEmpty.hidden = true;
          els.loadTimeMetric.textContent = Math.round(performance.now() - testStartedAt) + ' ms';
          setProviderResult('working', els.video.paused ? 'The stream loaded successfully. Press Play if autoplay is blocked by your browser.' : 'The browser loaded and decoded the stream.');
        }
        if (name === 'playing') {
          streamReadyMarked = true;
          window.clearTimeout(testTimeout);
          els.playerLoading.hidden = true;
          els.playerEmpty.hidden = true;
          els.loadTimeMetric.textContent = Math.round(performance.now() - testStartedAt) + ' ms';
          setProviderResult('working', 'The browser reached the playing state and decoded the stream.');
        }
        addEvent(name, detail);
      });
    });

    els.video.addEventListener('error', function () {
      var message = readableMediaError(els.video.error);
      window.clearTimeout(testTimeout);
      els.playerLoading.hidden = true;
      addEvent('media error', message);
      setProviderResult('failed', message);
    });
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds) || seconds < 0) return 'Unknown';
    var total = Math.round(seconds);
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var secs = total % 60;
    return (hours ? hours + ':' + String(minutes).padStart(2, '0') : minutes) + ':' + String(secs).padStart(2, '0');
  }

  function copyLog() {
    var provider = providerByKey(activeProviderKey);
    var report = [
      'Provider Playback Lab',
      'Provider: ' + provider.label + ' (' + provider.key + ')',
      'URL: ' + (els.streamUrl.value.trim() || '—'),
      'Mode: ' + els.formatMetric.textContent,
      'Host: ' + els.hostMetric.textContent,
      'Resolution: ' + els.resolutionMetric.textContent,
      'Duration: ' + els.durationMetric.textContent,
      'Load time: ' + els.loadTimeMetric.textContent,
      'Engine: ' + els.engineMetric.textContent,
      '',
      'Events:',
      eventRows.map(function (row) { return row.time + '  ' + row.name + '  ' + row.detail; }).join('\n') || 'No events'
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(report).then(function () { showToast('Diagnostic log copied.'); }).catch(function () { fallbackCopy(report); });
    } else {
      fallbackCopy(report);
    }
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); showToast('Diagnostic log copied.'); } catch (error) { showToast('Copy failed. Select the log manually.'); }
    document.body.removeChild(area);
  }

  els.providerList.addEventListener('click', function (event) {
    var button = event.target.closest('[data-provider-key]');
    if (button) selectProvider(button.getAttribute('data-provider-key'));
  });

  els.providerSearch.addEventListener('input', renderProviders);

  document.querySelectorAll('[data-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (item) { item.classList.toggle('is-active', item === button); });
      renderProviders();
    });
  });

  els.sourceForm.addEventListener('submit', function (event) { event.preventDefault(); startTest(); });
  els.sampleBtn.addEventListener('click', function () { els.streamUrl.value = SAMPLE_HLS; els.playbackMode.value = 'hls'; startTest(); });
  els.clearBtn.addEventListener('click', function () { resetDiagnostics(true); });
  els.copyLogBtn.addEventListener('click', copyLog);

  document.querySelectorAll('[data-manual-status]').forEach(function (button) {
    button.addEventListener('click', function () {
      var status = button.getAttribute('data-manual-status');
      setProviderResult(status, status === 'working' ? 'Manually confirmed by the tester.' : 'Manually marked as unavailable or blocked.', true);
    });
  });

  window.addEventListener('beforeunload', destroyPlayer);
  bindVideoEvents();
  selectProvider(activeProviderKey);
}());
