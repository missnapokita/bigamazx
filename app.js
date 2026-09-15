(function () {
  'use strict';

  var SHARED_BASE = 'https://drakula.goodbos.online';
  var LOGO_BASE = 'https://api.dramabuzz.sbs/logos/';
  var KEY_SESSION = 'dramabos_key_session_v1';
  var KEY_LOCAL = 'dramabos_key_local_v1';
  var PREFS_KEY = 'dramabos_player_prefs_v1';

  var PROVIDERS = [
    {
      id: 'starshort', name: 'StarShort', base: SHARED_BASE, logo: 'starshort.png', docs: 'https://drakula.goodbos.online/starshort-api.html',
      searchPath: '/api/starshort/search', searchParam: 'keyword', langParam: 'locale', pageParam: 'page',
      detailPath: '/api/starshort/show/:id', episodesPath: '/api/starshort/show/:id/episodes', playPath: '/api/starshort/watch/:id/:ep',
      note: 'Search, episode list and playable streams from StarShort.'
    },
    {
      id: 'freereels', name: 'FreeReels', base: SHARED_BASE, logo: 'freereels.svg', docs: 'https://drakula.goodbos.online/freereels-api.html',
      searchPath: '/api/freereels/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/freereels/drama/:id', playPath: '/api/freereels/drama/:id/play/:ep',
      note: 'Search FreeReels and resolve an episode when it is selected.'
    },
    {
      id: 'fundrama', name: 'FunDrama', base: SHARED_BASE, logo: 'fundrama.svg', docs: 'https://drakula.goodbos.online/fundrama-api.html',
      searchPath: '/api/fundrama/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/fundrama/drama/:id', episodesPath: '/api/fundrama/drama/:id/episodes',
      note: 'FunDrama search, details and full episode list.'
    },
    {
      id: 'microdrama', name: 'MicroDrama', base: SHARED_BASE, logo: 'microdrama.png', docs: 'https://drakula.goodbos.online/microdrama-api.html',
      searchPath: '/api/microdrama/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/microdrama/drama/:id', playPath: '/api/microdrama/play/:id/:ep',
      note: 'MicroDrama search, metadata and per-episode playback.'
    },
    {
      id: 'cubetv', name: 'CubeTV', base: 'https://cubetv.goodbos.online', logo: 'cubetv.webp', docs: 'https://cubetv.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/detail/:id', episodesPath: '/api/episodes/:id',
      note: 'CubeTV drama and anime search with HLS episode URLs.'
    },
    {
      id: 'dotdrama', name: 'DotDrama', base: 'https://dotdrama.goodbos.online', logo: 'dotdrama.svg', docs: 'https://dotdrama.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/drama/:id', playPath: '/api/drama/:id/:ep',
      note: 'DotDrama title search, metadata and episode video resolver.'
    },
    {
      id: 'dramabite', name: 'DramaBite', base: 'https://dramabite.goodbos.online', logo: 'dramabite.svg', docs: 'https://dramabite.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/drama/:id', episodesPath: '/episodes/:id', playPath: '/play/:id/:episodeId',
      note: 'DramaBite search, episode list and HLS playback.'
    },
    {
      id: 'dramanova', name: 'DramaNova', base: 'https://dramanova.goodbos.online', logo: 'dramanova.webp', docs: 'https://dramanova.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/detail/:id', episodesPath: '/api/episodes/:id', playPath: '/api/video/:fileId',
      note: 'Multilingual DramaNova search with episode and subtitle data.'
    },
    {
      id: 'dramawave', name: 'DramaWave', base: 'https://dramawave.goodbos.online', logo: 'dramawave.svg', docs: 'https://dramawave.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'next',
      detailPath: '/api/drama/:id',
      note: 'DramaWave search; detail responses include episodes and HLS URLs.'
    },
    {
      id: 'flareflow', name: 'FlareFlow', base: 'https://plerplow.goodbos.online', logo: 'flareflow.svg', docs: 'https://plerplow.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang',
      detailPath: '/api/detail', detailQuery: { id: 'dramaId' }, episodesPath: '/api/episodes', episodesQuery: { id: 'dramaId' },
      note: 'FlareFlow search with batch episode video resolution.'
    },
    {
      id: 'goodshort', name: 'GoodShort', base: 'https://goodshort.goodbos.online', logo: 'goodshort.svg', docs: 'https://goodshort.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/book/:id', episodesPath: '/batchload/:id',
      note: 'GoodShort search, book metadata and batch-loaded episode URLs.'
    },
    {
      id: 'happyshort', name: 'HappyShort', base: 'https://happyshort.goodbos.online', logo: 'happyshort.png', docs: 'https://happyshort.goodbos.online/api',
      searchPath: '/api/hs/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/hs/detail', detailQuery: { id: 'dramaId' }, episodesPath: '/api/hs/episodes', episodesQuery: { id: 'dramaId' },
      playPath: '/api/hs/play', playQuery: { id: 'dramaId', ep: 'episodeNumber' },
      note: 'HappyShort search, episode list and unlocked stream resolver.'
    },
    {
      id: 'idrama', name: 'iDrama', base: 'https://idrama.goodbos.online', logo: 'idrama.svg', docs: 'https://idrama.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/drama/:id', playPath: '/unlock/:id/:ep',
      note: 'iDrama multilingual search with episode unlock playback.'
    },
    {
      id: 'melolo', name: 'Melolo', base: 'https://melolo.goodbos.online', logo: 'melolo.svg', docs: 'https://melolo.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/detail/:id', playPath: '/api/video', playQuery: { id: 'episodeId', ep: 'episodeNumber' },
      note: 'Melolo search and per-episode video resolution.'
    },
    {
      id: 'rapidtv', name: 'RapidTV', base: 'https://rapidtv.goodbos.online', logo: 'rapidtv.webp', docs: 'https://rapidtv.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/drama/:id', playPath: '/api/drama/:id/:ep',
      note: 'RapidTV search, drama details and episode data.'
    },
    {
      id: 'reelife', name: 'Reelife', base: 'https://reelife.goodbos.online', logo: 'reelife.svg', docs: 'https://reelife.goodbos.online/api.html',
      searchPath: '/api/v1/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/v1/book/:id', episodesPath: '/api/v1/book/:id/chapters', playPath: '/api/v1/play/:id/:episodeId',
      note: 'Reelife search, chapters and direct video URL resolver.'
    },
    {
      id: 'serialplus', name: 'Serial+', base: 'https://serealplus.goodbos.online', logo: 'serialplus.png', docs: 'https://serealplus.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/detail', detailQuery: { id: 'dramaId' }, episodesPath: '/api/episodes', episodesQuery: { id: 'dramaId' },
      note: 'Serial+ search with complete episode video URLs.'
    },
    {
      id: 'shortmax', name: 'ShortMax', base: 'https://shortmax.goodbos.online', logo: 'shortmax.svg', docs: 'https://shortmax.goodbos.online/api.html',
      searchPath: '/api/v1/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/v1/detail/:id', episodesPath: '/api/v1/alleps/:id',
      note: 'ShortMax search, drama details and all episode video data.'
    },
    {
      id: 'shortswave', name: 'ShortsWave', base: 'https://shortwave.goodbos.online', logo: 'shortwave.png', docs: 'https://shortwave.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      episodesPath: '/api/drama/:id/episodes', playPath: '/api/unlock', playQuery: { drama_id: 'dramaId', chapter_id: 'episodeId' },
      note: 'ShortsWave search, chapters and episode stream unlocking.'
    },
    {
      id: 'flextv', name: 'FlexTV', base: 'https://flextv.goodbos.online', logo: 'flextv.svg', docs: 'https://flextv.goodbos.online/api.html',
      searchPath: '/api/drama/search', searchParam: 'keyword', pageParam: 'page',
      detailPath: '/api/drama/detail', detailQuery: { series_id: 'dramaId' }, episodesPath: '/api/allepisodes', episodesQuery: { id: 'dramaId' },
      note: 'FlexTV search, series details and complete episode video URLs.'
    },
    {
      id: 'vigloo', name: 'Vigloo', base: 'https://vigloo.goodbos.online', logo: 'vigloo.svg', docs: 'https://vigloo.goodbos.online/api.html', authHeader: 'x-token',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/detail', detailQuery: { id: 'dramaId' }, episodesPath: '/api/episodes', episodesQuery: { id: 'dramaId' },
      playPath: '/api/play', playQuery: { seasonId: 'dramaId', ep: 'episodeNumber' },
      note: 'Vigloo search and season-based episode playback.'
    },
    {
      id: 'dramabox', name: 'DramaBox', base: 'https://dramabox.goodbos.online', logo: 'dramabox.svg', docs: 'https://dramabox.goodbos.online', authHeader: 'x-token',
      searchPath: '/api/dramabox/search', searchParam: 'query', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/dramabox/detail', detailQuery: { bookId: 'dramaId' }, episodesPath: '/api/dramabox/allepisode', episodesQuery: { bookId: 'dramaId' },
      note: 'DramaBox search, full metadata and Akamai episode URLs. Browser CORS depends on the provider server.'
    },
    {
      id: 'netshort', name: 'NetShort', base: 'https://netshort.goodbos.online', logo: 'netshort.svg', docs: 'https://netshort.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/drama/:id', playPath: '/api/watch/:id/:ep',
      note: 'NetShort multilingual search, drama details and episode resolver.'
    },
    {
      id: 'velolo', name: 'Velolo', base: 'https://velolo.goodbos.online', logo: 'velolo.svg', docs: 'https://velolo.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page', detailPath: '/drama/:id',
      note: 'Velolo title search with drama details and embedded episodes.'
    },
    {
      id: 'reelshort', name: 'ReelShort', base: 'https://reelshort.goodbos.online', logo: 'reelshort.svg', docs: 'https://reelshort.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/detail/:id', episodesPath: '/allepisodes/:id',
      note: 'ReelShort search, series details and all playable episodes.'
    },
    {
      id: 'flickreels', name: 'FlickReels', base: 'https://flickreels.goodbos.online', logo: 'flickreels.svg', docs: 'https://flickreels.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page', episodesPath: '/batchload/:id',
      note: 'FlickReels search with batch-loaded episode video URLs.'
    },
    {
      id: 'stardusttv', name: 'StardustTV', base: 'https://stardusttv2.goodbos.online', logo: 'stardusttv.svg', docs: 'https://stardusttv2.goodbos.online/', authHeader: 'x-token',
      searchPath: '/video/search', searchParam: 'keyword', langParam: 'lang', pageParam: 'page',
      languageMap: { en: 'en_US', fil: 'en_US', id: 'id_ID', es: 'es_ES', pt: 'pt_BR', th: 'th_TH' },
      detailPath: '/video/summary-info', detailQuery: { vid: 'dramaId' }, episodesPath: '/video/episodes', episodesQuery: { vid: 'dramaId' },
      note: 'StardustTV multilingual search, video summaries and episode data.'
    },
    {
      id: 'reelbuzz', name: 'ReelBuzz', base: 'https://reelbuzz.goodbos.online', logo: 'reelbuzz.svg', docs: 'https://reelbuzz.goodbos.online/api.html',
      searchPath: '/api/search', searchParam: 'q',
      detailPath: '/api/drama/detail', detailQuery: { id: 'dramaId' }, playPath: '/api/drama/play', playQuery: { dramaId: 'dramaId', ep: 'episodeNumber' },
      note: 'ReelBuzz search, drama metadata and episode playback.'
    },
    {
      id: 'moboreels', name: 'MoboReels', base: 'https://moboreels.goodbos.online', logo: 'moboreels.svg', docs: 'https://moboreels.goodbos.online',
      searchPath: '/api/v1/search', searchParam: 'q', langParam: 'lang', languageMap: { en: 3, fil: 15, id: 11, es: 4, pt: 5, th: 12 }, detailPath: '/api/v1/series/:id',
      note: 'MoboReels search; series details include all episode media URLs.'
    },
    {
      id: 'pinedrama', name: 'PineDrama', base: 'https://pinedrama.goodbos.online', logo: 'pinedrama.jpeg', docs: 'https://pinedrama.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/detail', detailQuery: { id: 'dramaId' }, playPath: '/episode', playQuery: { id: 'dramaId', ep: 'episodeNumber' },
      note: 'PineDrama search, complete drama information and episode video URLs.'
    },
    {
      id: 'raptdrama', name: 'RaptDrama', base: 'https://raptdrama.goodbos.online', logo: 'raptdrama.jpeg', docs: 'https://raptdrama.goodbos.online/', authHeader: 'x-token',
      searchPath: '/api/raptdrama/search', searchParam: 'query', pageParam: 'page',
      detailPath: '/api/raptdrama/detail', detailQuery: { id: 'dramaId' }, episodesPath: '/api/raptdrama/episodes', episodesQuery: { id: 'dramaId' },
      note: 'RaptDrama search, full details and unlocked HLS episode URLs.'
    },
    {
      id: 'kalostv', name: 'KalosTV', base: 'https://kalostv.goodbos.online', logo: 'kalostv.jpeg', docs: 'https://kalostv.goodbos.online/api.html',
      searchPath: '/search', searchParam: 'q', pageParam: 'page',
      detailPath: '/video-info', detailQuery: { video_id: 'dramaId' }, episodesPath: '/unlock-all', episodesQuery: { video_id: 'dramaId' },
      note: 'KalosTV search, video metadata and unlocked episode streams.'
    },
    {
      id: 'vibeshort', name: 'VibeShort', base: 'https://vibeshort.goodbos.online', logo: 'vibeshort.jpeg', docs: 'https://vibeshort.goodbos.online/', authHeader: 'x-token',
      searchPath: '/api/v1/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/v1/detail/:id', episodesPath: '/api/v1/alleps/:id',
      note: 'VibeShort search, metadata and complete episode video URLs.'
    },
    {
      id: 'storyreel', name: 'StoryReel', base: 'https://storyreel.goodbos.online', logo: 'storyreel.png', docs: 'https://storyreel.goodbos.online/', authHeader: 'x-token',
      searchPath: '/api/v1/search', searchParam: 'q', langParam: 'lang', pageParam: 'page',
      detailPath: '/api/v1/detail/:id', episodesPath: '/api/v1/alleps/:id',
      note: 'StoryReel search, metadata and complete episode video URLs.'
    }
  ];

  // Public catalog/home routes documented by each provider. The API usually
  // returns these in newest/recommended order; timestamp fields are sorted
  // again below when a provider includes them.
  var PROVIDER_FEEDS = {
    starshort: { path: '/api/starshort/content/latest' },
    freereels: { path: '/api/freereels/popular' },
    fundrama: { path: '/api/fundrama/dramas' },
    microdrama: { path: '/api/microdrama/list' },
    cubetv: { path: '/api/home' },
    dotdrama: { path: '/api/drama/list', pageParam: 'page', paginated: true },
    dramabite: { path: '/home' },
    dramanova: { path: '/api/home' },
    dramawave: { path: '/api/home' },
    flareflow: { path: '/api/home' },
    goodshort: { path: '/home' },
    happyshort: { path: '/api/hs/home', pageParam: 'page', paginated: true },
    idrama: { path: '/home' },
    melolo: { path: '/api/home' },
    rapidtv: { path: '/api/drama/list', pageParam: 'page', paginated: true },
    reelife: { path: '/api/v1/home' },
    serialplus: { path: '/api/latest' },
    shortmax: { path: '/api/v1/new' },
    shortswave: { path: '/api/home' },
    flextv: { path: '/api/drama/newest', pageParam: 'page', paginated: true },
    vigloo: { path: '/api/home', pageParam: 'page', staticQuery: { size: 20 }, paginated: true },
    dramabox: { path: '/api/dramabox/latest' },
    netshort: { path: '/api/home/:page', paginated: true },
    velolo: { path: '/home' },
    reelshort: { path: '/home' },
    flickreels: { path: '/api/home' },
    stardusttv: { path: '/video/hot-list', pageParam: 'page', staticQuery: { page_size: 20 }, paginated: true },
    reelbuzz: { path: '/api/dramas', query: { offset: 'offset' }, staticQuery: { limit: 20 }, paginated: true },
    moboreels: { path: '/api/v1/series' },
    pinedrama: { path: '/home' },
    raptdrama: { path: '/api/raptdrama/home' },
    kalostv: { path: '/new-releases' },
    vibeshort: { path: '/api/v1/home', staticQuery: { tab: 1 } },
    storyreel: { path: '/api/v1/home', staticQuery: { tab: 1 } }
  };

  PROVIDERS.forEach(function (provider) {
    var feed = PROVIDER_FEEDS[provider.id];
    if (!feed) return;
    provider.feedPath = feed.path;
    provider.feedPageParam = feed.pageParam || '';
    provider.feedQuery = feed.query || {};
    provider.feedStaticQuery = feed.staticQuery || {};
    provider.feedPaginated = Boolean(feed.paginated);
  });

  var state = {
    providerId: 'starshort',
    language: 'en',
    apiKey: '',
    proxyUrl: '',
    remember: false,
    viewMode: 'idle',
    query: '',
    page: 1,
    results: [],
    providerTests: {},
    activeDrama: null,
    activeEpisodes: [],
    hls: null,
    playbackActive: false,
    requestSerial: 0
  };

  var els = {
    connectionPill: document.getElementById('connectionPill'),
    sidebar: document.getElementById('sidebar'),
    mobileSettingsBtn: document.getElementById('mobileSettingsBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    settingsScrim: document.getElementById('settingsScrim'),
    apiKey: document.getElementById('apiKey'),
    proxyUrl: document.getElementById('proxyUrl'),
    toggleKeyBtn: document.getElementById('toggleKeyBtn'),
    rememberKey: document.getElementById('rememberKey'),
    saveKeyBtn: document.getElementById('saveKeyBtn'),
    testAllBtn: document.getElementById('testAllBtn'),
    testSummary: document.getElementById('testSummary'),
    providerFilter: document.getElementById('providerFilter'),
    providerList: document.getElementById('providerList'),
    providerCount: document.getElementById('providerCount'),
    selectedProviderKey: document.getElementById('selectedProviderKey'),
    selectedProviderName: document.getElementById('selectedProviderName'),
    selectedProviderNote: document.getElementById('selectedProviderNote'),
    providerDocs: document.getElementById('providerDocs'),
    searchForm: document.getElementById('searchForm'),
    searchQuery: document.getElementById('searchQuery'),
    languageSelect: document.getElementById('languageSelect'),
    searchBtn: document.getElementById('searchBtn'),
    notice: document.getElementById('notice'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsMeta: document.getElementById('resultsMeta'),
    resultsGrid: document.getElementById('resultsGrid'),
    clearResultsBtn: document.getElementById('clearResultsBtn'),
    loadMoreWrap: document.getElementById('loadMoreWrap'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    detailModal: document.getElementById('detailModal'),
    detailPoster: document.getElementById('detailPoster'),
    detailProvider: document.getElementById('detailProvider'),
    detailTitle: document.getElementById('detailTitle'),
    detailMeta: document.getElementById('detailMeta'),
    detailDescription: document.getElementById('detailDescription'),
    videoSection: document.getElementById('videoSection'),
    videoPlayer: document.getElementById('videoPlayer'),
    videoLoading: document.getElementById('videoLoading'),
    videoStatus: document.getElementById('videoStatus'),
    episodeMeta: document.getElementById('episodeMeta'),
    episodeGrid: document.getElementById('episodeGrid'),
    rawResponse: document.getElementById('rawResponse'),
    toast: document.getElementById('toast')
  };

  var toastTimer = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function inferredProxyUrl() {
    try {
      var hostname = window.location.hostname || '';
      if (/\.vercel\.app$/i.test(hostname) || hostname === 'localhost' || hostname === '127.0.0.1') {
        return window.location.origin + '/api/proxy';
      }
    } catch (error) { /* no same-origin proxy can be inferred */ }
    return '';
  }

  function normalizeProxyUrl(value) {
    var input = String(value || '').trim();
    if (!input) return '';
    if (!/^https?:\/\//i.test(input)) input = 'https://' + input;
    var parsed = new URL(input);
    var local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) {
      throw new Error('Proxy URL must use HTTPS.');
    }
    if (parsed.username || parsed.password) throw new Error('Proxy URL cannot contain login details.');
    if (!parsed.pathname || parsed.pathname === '/') parsed.pathname = '/api/proxy';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  }

  function readPrefs() {
    try {
      var prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      if (prefs.providerId) state.providerId = prefs.providerId;
      if (prefs.language) state.language = prefs.language;
      state.proxyUrl = normalizeProxyUrl(prefs.proxyUrl || inferredProxyUrl());
    } catch (error) { /* unavailable storage is harmless */ }

    if (!state.proxyUrl) state.proxyUrl = inferredProxyUrl();

    try {
      var permanentKey = localStorage.getItem(KEY_LOCAL) || '';
      var temporaryKey = sessionStorage.getItem(KEY_SESSION) || '';
      state.apiKey = permanentKey || temporaryKey;
      state.remember = Boolean(permanentKey);
    } catch (error) { /* unavailable storage is harmless */ }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ providerId: state.providerId, language: state.language, proxyUrl: state.proxyUrl }));
    } catch (error) { /* unavailable storage is harmless */ }
  }

  function storeApiKey() {
    try {
      if (state.remember) {
        localStorage.setItem(KEY_LOCAL, state.apiKey);
        sessionStorage.removeItem(KEY_SESSION);
      } else {
        sessionStorage.setItem(KEY_SESSION, state.apiKey);
        localStorage.removeItem(KEY_LOCAL);
      }
    } catch (error) {
      showNotice('The browser blocked storage. The key will work until this page is refreshed.', 'error');
    }
  }

  function providerById(id) {
    for (var i = 0; i < PROVIDERS.length; i += 1) {
      if (PROVIDERS[i].id === id) return PROVIDERS[i];
    }
    return null;
  }

  function activeProvider() {
    return providerById(state.providerId) || PROVIDERS[0];
  }

  function providerIsSearchable(provider) {
    return Boolean(provider && provider.status === 'active' && provider.searchPath);
  }

  function loadProviderCatalog() {
    return fetch('providers.json?v=20260914-all', { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('Provider catalog returned HTTP ' + response.status + '.');
      return response.json();
    }).then(function (catalog) {
      if (!catalog || !Array.isArray(catalog.platforms)) throw new Error('Provider catalog is invalid.');
      var adapters = {};
      PROVIDERS.forEach(function (provider) { adapters[provider.id] = provider; });
      PROVIDERS = catalog.platforms.map(function (metadata) {
        var adapter = adapters[metadata.id] || {};
        var merged = {};
        Object.keys(adapter).forEach(function (key) { merged[key] = adapter[key]; });
        merged.id = metadata.id;
        merged.name = metadata.name || adapter.name || metadata.id;
        merged.status = metadata.status || 'active';
        merged.logo = metadata.logo || adapter.logo || '';
        merged.docs = metadata.api || adapter.docs || 'https://dramabos.live/providers/';
        merged.hasApi = Boolean(metadata.has_api);
        return merged;
      });
    }).catch(function () {
      PROVIDERS.forEach(function (provider) { provider.status = provider.status || 'active'; });
    });
  }

  function initials(name) {
    var bits = String(name).replace(/[^a-z0-9 ]/gi, ' ').split(/\s+/);
    var output = '';
    for (var i = 0; i < bits.length; i += 1) output += bits[i].charAt(0);
    return output.slice(0, 2).toUpperCase() || 'DB';
  }

  function renderProviders() {
    var filter = els.providerFilter.value.trim().toLowerCase();
    var visible = PROVIDERS.filter(function (provider) {
      return !filter || provider.name.toLowerCase().indexOf(filter) !== -1 || provider.id.indexOf(filter) !== -1;
    });
    els.providerCount.textContent = String(visible.length);
    els.providerList.innerHTML = visible.map(function (provider) {
      var status = provider.status || 'active';
      var searchable = providerIsSearchable(provider);
      var statusLabel = status === 'coming' ? 'coming soon' : status;
      var dotClass = status === 'active' ? (searchable ? 'active' : 'unavailable') : status;
      var test = state.providerTests[provider.id];
      if (test && test.state === 'testing') { statusLabel = 'testing'; dotClass = 'testing'; }
      if (test && test.state === 'passed') { statusLabel = 'API passed'; dotClass = 'active'; }
      if (test && test.state === 'failed') { statusLabel = 'API failed'; dotClass = 'failed'; }
      return '<button class="provider-item' + (provider.id === state.providerId ? ' is-active' : '') + (searchable ? '' : ' is-unavailable') + '" type="button" role="option" aria-selected="' + (provider.id === state.providerId ? 'true' : 'false') + '" data-provider="' + escapeHtml(provider.id) + '" title="' + escapeHtml(test && test.error ? test.error : statusLabel) + '">' +
        '<span class="provider-logo provider-initial">' + escapeHtml(initials(provider.name)) + '</span>' +
        '<span class="provider-copy"><strong>' + escapeHtml(provider.name) + '</strong><small>' + escapeHtml(provider.id + ' · ' + statusLabel) + '</small></span>' +
        '<span class="provider-dot ' + escapeHtml(dotClass) + '" aria-label="' + escapeHtml(statusLabel) + '"></span>' +
      '</button>';
    }).join('') || '<p class="security-note">No matching provider.</p>';
  }

  function renderProviderHeader() {
    var provider = activeProvider();
    els.selectedProviderKey.textContent = provider.id.toUpperCase();
    els.selectedProviderName.textContent = 'Search ' + provider.name;
    if (provider.status === 'maintenance') {
      els.selectedProviderNote.textContent = provider.name + ' is currently under maintenance according to DramaBuzz.';
    } else if (provider.status === 'coming') {
      els.selectedProviderNote.textContent = provider.name + ' is listed as coming soon.';
    } else if (!provider.searchPath) {
      els.selectedProviderNote.textContent = provider.name + ' is active, but its browser search documentation is currently unavailable.';
    } else {
      els.selectedProviderNote.textContent = provider.note;
    }
    els.providerDocs.href = provider.docs || 'https://dramabos.live/providers/';
    els.searchQuery.placeholder = 'Search ' + provider.name + '…';
    els.searchBtn.disabled = !providerIsSearchable(provider);
  }

  function selectProvider(id) {
    if (!providerById(id)) return;
    state.providerId = id;
    state.results = [];
    state.page = 1;
    savePrefs();
    renderProviders();
    renderProviderHeader();
    clearResults(false);
    closeSettings();
    if (state.apiKey && activeProvider().feedPath) loadProviderFeed(false);
  }

  function updateConnection(kind, text) {
    els.connectionPill.className = 'connection-pill is-' + kind;
    els.connectionPill.querySelector('span').textContent = text;
  }

  function showNotice(message, kind) {
    els.notice.hidden = false;
    els.notice.className = 'notice' + (kind ? ' is-' + kind : '');
    els.notice.textContent = message;
  }

  function hideNotice() {
    els.notice.hidden = true;
    els.notice.textContent = '';
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    toastTimer = window.setTimeout(function () { els.toast.classList.remove('is-visible'); }, 2400);
  }

  function openSettings() {
    els.sidebar.classList.add('is-open');
    els.settingsScrim.hidden = false;
  }

  function closeSettings() {
    els.sidebar.classList.remove('is-open');
    els.settingsScrim.hidden = true;
  }

  function queryString(values) {
    var pairs = [];
    Object.keys(values).forEach(function (key) {
      var value = values[key];
      if (value == null || value === '') return;
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
    });
    return pairs.join('&');
  }

  function valueByKeys(object, keys) {
    if (!object || typeof object !== 'object') return null;
    var objectKeys = Object.keys(object);
    for (var i = 0; i < keys.length; i += 1) {
      var wanted = keys[i].toLowerCase();
      for (var j = 0; j < objectKeys.length; j += 1) {
        if (objectKeys[j].toLowerCase() === wanted) {
          var value = object[objectKeys[j]];
          if (value !== null && value !== undefined && value !== '') return value;
        }
      }
    }
    return null;
  }

  function nestedValueByKeys(object, keys, depth) {
    var direct = valueByKeys(object, keys);
    if (direct !== null) return direct;
    if (!object || typeof object !== 'object' || depth <= 0) return null;
    var objectKeys = Object.keys(object);
    for (var i = 0; i < objectKeys.length; i += 1) {
      var child = object[objectKeys[i]];
      if (child && typeof child === 'object' && !Array.isArray(child)) {
        var found = nestedValueByKeys(child, keys, depth - 1);
        if (found !== null) return found;
      }
    }
    return null;
  }

  function endpointContextValue(name, context) {
    var lower = name.toLowerCase();
    if (lower === 'id' || lower === 'cid' || lower === 'videoid' || lower === 'dramaid' || lower === 'bookid') return context.dramaId;
    if (lower === 'ep' || lower === 'episodeno') return context.episodeNumber;
    if (lower === 'vid' || lower === 'episodeid' || lower === 'chapterid') return context.episodeId || context.episodeNumber;
    if (lower === 'fileid') return context.fileId || context.episodeId;
    return context[name];
  }

  function providerLanguage(provider, language) {
    if (!provider.languageMap) return language;
    return provider.languageMap[language] == null ? language : provider.languageMap[language];
  }

  function buildEndpoint(provider, type, context, includeAuth) {
    var path = provider[type + 'Path'];
    if (!path) return null;
    var query = {};
    path = path.replace(/:([a-zA-Z0-9_]+)/g, function (match, name) {
      var value = endpointContextValue(name, context);
      if (value === null || value === undefined || value === '') throw new Error('The API response is missing ' + name + '.');
      return encodeURIComponent(String(value));
    });

    if (type === 'search') {
      query[provider.searchParam || 'q'] = context.query;
      if (provider.pageParam) query[provider.pageParam] = context.page || 1;
    }
    if (type === 'feed' && provider.feedPageParam) {
      query[provider.feedPageParam] = context.page || 1;
    }
    if (provider.langParam && context.language) query[provider.langParam] = providerLanguage(provider, context.language);

    var mapped = provider[type + 'Query'] || {};
    Object.keys(mapped).forEach(function (name) {
      query[name] = endpointContextValue(mapped[name], context);
    });
    var staticQuery = provider[type + 'StaticQuery'] || {};
    Object.keys(staticQuery).forEach(function (name) {
      query[name] = staticQuery[name];
    });
    if (includeAuth !== false && !provider.authHeader && provider.authMode !== 'none') query.code = state.apiKey;
    return provider.base + path + (path.indexOf('?') === -1 ? '?' : '&') + queryString(query);
  }

  function safeErrorMessage(error) {
    var message = error && error.message ? String(error.message) : 'Unknown API error.';
    if (state.apiKey) message = message.split(state.apiKey).join('••••••••');
    return message;
  }

  function parseApiResponse(response) {
    return response.text().then(function (text) {
      var data;
      try { data = JSON.parse(text); } catch (error) { throw new Error('The provider returned an invalid JSON response.'); }
      var apiError = valueByKeys(data, ['error', 'errorMessage']);
      var success = valueByKeys(data, ['success', 'status']);
      if (!response.ok || apiError || success === false) {
        throw new Error(String(apiError || valueByKeys(data, ['message', 'msg']) || ('Request failed with HTTP ' + response.status)));
      }
      return data;
    });
  }

  function directApiFetch(provider, url) {
    var headers = {};
    if (provider.authHeader) headers[provider.authHeader] = state.apiKey;
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', referrerPolicy: 'no-referrer', headers: headers }).then(function (response) {
      return parseApiResponse(response);
    }).catch(function (error) {
      if (/Failed to fetch|NetworkError|Load failed/i.test(safeErrorMessage(error))) {
        throw new Error('Provider request was blocked or unavailable. Check your connection, API key, or provider CORS status.');
      }
      throw error;
    });
  }

  function proxyApiFetch(provider, url) {
    return fetch(state.proxyUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: provider.id,
        url: url,
        apiKey: provider.authMode === 'none' ? '' : state.apiKey
      })
    }).then(function (response) {
      return parseApiResponse(response);
    }).catch(function (error) {
      if (/Failed to fetch|NetworkError|Load failed/i.test(safeErrorMessage(error))) {
        throw new Error('Vercel proxy is unreachable or its CORS origin list needs updating.');
      }
      throw error;
    });
  }

  function apiFetch(provider, type, context) {
    var url;
    try { url = buildEndpoint(provider, type, context, !state.proxyUrl); } catch (error) { return Promise.reject(error); }
    if (!url) return Promise.reject(new Error(provider.name + ' does not publish a ' + type + ' endpoint.'));
    return state.proxyUrl ? proxyApiFetch(provider, url) : directApiFetch(provider, url);
  }

  function collectArrays(value, depth, output) {
    if (depth < 0 || value == null) return;
    if (Array.isArray(value)) {
      if (value.length) output.push(value);
      for (var i = 0; i < Math.min(value.length, 3); i += 1) collectArrays(value[i], depth - 1, output);
      return;
    }
    if (typeof value === 'object') {
      Object.keys(value).forEach(function (key) { collectArrays(value[key], depth - 1, output); });
    }
  }

  function arrayScore(array, purpose) {
    if (!array.length || typeof array[0] !== 'object') return -1;
    var sample = array.slice(0, 4);
    var score = Math.min(array.length, 20) / 20;
    sample.forEach(function (item) {
      if (purpose === 'episodes') {
        if (valueByKeys(item, ['episode', 'episodeNo', 'episodeNumber', 'chapterIndex', 'chapterId', 'ep', 'number', 'vid'])) score += 4;
        if (findMediaUrl(item)) score += 3;
        if (valueByKeys(item, ['chapterName', 'episodeTitle', 'title', 'name'])) score += 1;
      } else {
        if (valueByKeys(item, ['title', 'name', 'bookName', 'dramaName', 'showName', 'videoName'])) score += 4;
        if (valueByKeys(item, ['id', 'bookId', 'dramaId', 'showId', 'videoId', 'cid', 'code'])) score += 3;
        if (valueByKeys(item, ['cover', 'poster', 'image', 'coverUrl', 'bookCover', 'thumbnail'])) score += 2;
      }
    });
    return score;
  }

  function bestArray(payload, purpose) {
    if (Array.isArray(payload)) return payload;
    var arrays = [];
    collectArrays(payload, 5, arrays);
    var best = [];
    var bestScore = -1;
    arrays.forEach(function (array) {
      var score = arrayScore(array, purpose);
      if (score > bestScore) { best = array; bestScore = score; }
    });
    return best;
  }

  function absoluteUrl(value, base) {
    if (!value || typeof value !== 'string') return '';
    if (/^https?:\/\//i.test(value)) return value;
    if (/^\/\//.test(value)) return 'https:' + value;
    try { return new URL(value, base).href; } catch (error) { return ''; }
  }

  function normalizedDrama(raw, index, provider) {
    var id = nestedValueByKeys(raw, ['id', 'bookId', 'book_id', 'dramaId', 'drama_id', 'showId', 'show_id', 'videoId', 'video_id', 'cid', 'code', 'contentId', 'content_id', 'seriesId', 'series_id', 'seasonId', 'season_id', 'vid'], 3);
    var title = nestedValueByKeys(raw, ['title', 'name', 'bookName', 'book_name', 'dramaName', 'drama_name', 'showName', 'show_name', 'videoName', 'video_name', 'seriesName', 'series_name', 'contentName', 'content_name'], 3);
    var cover = nestedValueByKeys(raw, ['cover', 'poster', 'image', 'pic', 'coverUrl', 'cover_url', 'coverImage', 'cover_image', 'bookCover', 'book_pic', 'thumbnail', 'thumb', 'verticalCover', 'vertical_cover', 'posterUrl', 'poster_url'], 3);
    var description = nestedValueByKeys(raw, ['description', 'desc', 'synopsis', 'summary', 'introduction', 'intro', 'brief', 'abstract'], 3);
    var episodes = nestedValueByKeys(raw, ['episodeCount', 'episode_count', 'episodes', 'totalEpisodes', 'total_episodes', 'chapterCount', 'chapter_count', 'total'], 2);
    var language = nestedValueByKeys(raw, ['language', 'lang', 'locale'], 1);
    var dateValue = nestedValueByKeys(raw, ['updatedAt', 'updated_at', 'updateTime', 'update_time', 'createdAt', 'created_at', 'createTime', 'create_time', 'publishTime', 'publish_time', 'releaseDate', 'release_date', 'releaseTime', 'release_time', 'onlineTime', 'online_time', 'timestamp'], 2);
    if (Array.isArray(episodes)) episodes = episodes.length;
    return {
      id: id == null ? String(index) : String(id),
      title: title == null ? ('Untitled drama ' + (index + 1)) : String(title),
      cover: absoluteUrl(String(cover || ''), provider.base),
      description: description == null ? '' : String(description),
      episodes: typeof episodes === 'number' || typeof episodes === 'string' ? String(episodes) : '',
      language: language == null ? '' : String(language),
      timestamp: normalizeTimestamp(dateValue),
      raw: raw
    };
  }

  function normalizeTimestamp(value) {
    if (value == null || value === '') return 0;
    if (typeof value === 'number') return value < 100000000000 ? value * 1000 : value;
    var text = String(value).trim();
    if (/^\d{10,13}$/.test(text)) {
      var numeric = Number(text);
      return text.length <= 10 ? numeric * 1000 : numeric;
    }
    var parsed = Date.parse(text);
    return isNaN(parsed) ? 0 : parsed;
  }

  function newestFirst(results) {
    return results.map(function (item, index) {
      return { item: item, index: index };
    }).sort(function (a, b) {
      if (a.item.timestamp && b.item.timestamp && a.item.timestamp !== b.item.timestamp) {
        return b.item.timestamp - a.item.timestamp;
      }
      if (a.item.timestamp && !b.item.timestamp) return -1;
      if (!a.item.timestamp && b.item.timestamp) return 1;
      return a.index - b.index;
    }).map(function (entry) { return entry.item; });
  }

  function normalizeResults(payload, provider) {
    var items = bestArray(payload, 'dramas');
    return items.map(function (item, index) { return normalizedDrama(item, index, provider); });
  }

  function renderLoading(text) {
    els.resultsGrid.innerHTML = '<div class="loading-state"><span class="loading-spinner"></span><span>' + escapeHtml(text) + '</span></div>';
  }

  function bindBrokenImages(root) {
    Array.prototype.slice.call(root.querySelectorAll('img')).forEach(function (image) {
      image.addEventListener('error', function () {
        image.style.display = 'none';
        if (image.nextElementSibling) image.nextElementSibling.hidden = false;
      });
    });
  }

  function renderResults(append) {
    var provider = activeProvider();
    var html = state.results.map(function (drama, index) {
      var episodeText = drama.episodes ? drama.episodes + ' eps' : provider.name;
      return '<button class="drama-card" type="button" data-result-index="' + index + '">' +
        '<span class="card-poster">' +
          (drama.cover ? '<img src="' + escapeHtml(drama.cover) + '" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="poster-placeholder" hidden>▶</span>' : '<span class="poster-placeholder">▶</span>') +
          '<span class="card-chip">' + escapeHtml(episodeText) + '</span>' +
        '</span>' +
        '<span class="card-copy"><strong>' + escapeHtml(drama.title) + '</strong><p>' + escapeHtml(drama.language || provider.name) + '</p></span>' +
      '</button>';
    }).join('');
    els.resultsGrid.innerHTML = html || '<div class="empty-state"><span class="empty-icon"></span><strong>No dramas found</strong><p>Try another title, provider, or language.</p></div>';
    bindBrokenImages(els.resultsGrid);
    els.resultsTitle.textContent = state.viewMode === 'feed' ? 'Newest on ' + provider.name : (state.query ? 'Results for “' + state.query + '”' : 'Search results');
    els.resultsMeta.textContent = state.results.length + ' result' + (state.results.length === 1 ? '' : 's') + ' from ' + provider.name;
    els.clearResultsBtn.hidden = !state.results.length;
    els.loadMoreWrap.hidden = !state.results.length || (state.viewMode === 'feed' ? !provider.feedPaginated : !provider.pageParam);
    if (!append) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSearchError(message) {
    var action = state.viewMode === 'feed' ? 'Provider feed failed' : 'Search failed';
    els.resultsGrid.innerHTML = '<div class="error-state"><span class="empty-icon"></span><strong>' + action + '</strong><p>' + escapeHtml(message) + '</p></div>';
    els.resultsTitle.textContent = 'Unable to load results';
    els.resultsMeta.textContent = activeProvider().name + ' did not return usable data.';
    els.clearResultsBtn.hidden = false;
    els.loadMoreWrap.hidden = true;
  }

  function renderTestSummary() {
    var failedProviders = PROVIDERS.filter(function (provider) {
      return state.providerTests[provider.id] && state.providerTests[provider.id].state === 'failed';
    });
    if (!failedProviders.length) {
      els.testSummary.hidden = true;
      els.testSummary.innerHTML = '';
      return;
    }
    els.testSummary.hidden = false;
    els.testSummary.innerHTML = '<strong>Failed providers (' + failedProviders.length + ')</strong><ul>' + failedProviders.map(function (provider) {
      var message = state.providerTests[provider.id].error || 'Unknown provider error.';
      return '<li>' + escapeHtml(provider.name) + ': <span>' + escapeHtml(message) + '</span></li>';
    }).join('') + '</ul>';
  }

  function loadProviderFeed(append) {
    var provider = activeProvider();
    if (provider.status !== 'active' || !provider.feedPath || !state.apiKey) return Promise.resolve();

    if (!append || state.viewMode !== 'feed') {
      state.viewMode = 'feed';
      state.query = '';
      state.page = 1;
      state.results = [];
      els.searchQuery.value = '';
    } else {
      state.page += 1;
    }

    var serial = ++state.requestSerial;
    hideNotice();
    if (!append) renderLoading('Loading newest items from ' + provider.name + '…');
    els.searchBtn.disabled = true;
    els.loadMoreBtn.disabled = true;

    return apiFetch(provider, 'feed', {
      page: state.page,
      offset: (state.page - 1) * 20,
      language: state.language
    }).then(function (payload) {
      if (serial !== state.requestSerial) return;
      var newResults = newestFirst(normalizeResults(payload, provider));
      if (append) state.results = state.results.concat(newResults);
      else state.results = newResults;
      renderResults(append);
      updateConnection('online', state.proxyUrl ? 'Proxy connected' : 'API connected');
      if (!newResults.length && append) {
        state.page -= 1;
        els.loadMoreWrap.hidden = true;
        showToast('No more items from this provider.');
      }
    }).catch(function (error) {
      if (serial !== state.requestSerial) return;
      if (append) state.page -= 1;
      renderSearchError(safeErrorMessage(error));
      updateConnection('error', 'Feed error');
    }).then(function () {
      els.searchBtn.disabled = !providerIsSearchable(activeProvider());
      els.loadMoreBtn.disabled = false;
    });
  }

  function runSearch(append) {
    var query = els.searchQuery.value.trim();
    var provider = activeProvider();
    if (provider.status !== 'active') {
      showNotice(provider.name + ' is currently ' + (provider.status === 'coming' ? 'coming soon' : provider.status) + '.', 'error');
      return Promise.resolve();
    }
    if (!provider.searchPath) {
      showNotice(provider.name + ' has no browser search adapter available yet.', 'error');
      return Promise.resolve();
    }
    if (!state.apiKey) {
      showNotice('Paste and save your purchased API key first.', 'error');
      openSettings();
      els.apiKey.focus();
      return Promise.resolve();
    }
    if (!query) return Promise.resolve();

    if (!append || query !== state.query) {
      state.viewMode = 'search';
      state.query = query;
      state.page = 1;
      state.results = [];
    } else {
      state.page += 1;
    }

    var serial = ++state.requestSerial;
    hideNotice();
    if (!append) renderLoading('Searching ' + provider.name + '…');
    els.searchBtn.disabled = true;
    els.loadMoreBtn.disabled = true;

    return apiFetch(provider, 'search', { query: state.query, page: state.page, language: state.language }).then(function (payload) {
      if (serial !== state.requestSerial) return;
      var newResults = normalizeResults(payload, provider);
      if (append) state.results = state.results.concat(newResults);
      else state.results = newResults;
      renderResults(append);
      updateConnection('online', state.proxyUrl ? 'Proxy connected' : 'API connected');
      if (!newResults.length && append) {
        state.page -= 1;
        els.loadMoreWrap.hidden = true;
        showToast('No more results from this provider.');
      }
    }).catch(function (error) {
      if (append) state.page -= 1;
      var message = safeErrorMessage(error);
      renderSearchError(message);
      updateConnection('error', 'API error');
    }).then(function () {
      els.searchBtn.disabled = !providerIsSearchable(activeProvider());
      els.loadMoreBtn.disabled = false;
    });
  }

  function clearResults(clearQuery) {
    state.requestSerial += 1;
    state.results = [];
    state.page = 1;
    state.viewMode = 'idle';
    if (clearQuery) {
      state.query = '';
      els.searchQuery.value = '';
    }
    els.resultsTitle.textContent = 'Discover dramas';
    els.resultsMeta.textContent = state.apiKey ? 'Choose a provider and start a search.' : 'Connect your API key, then start a search.';
    els.resultsGrid.innerHTML = '<div class="empty-state"><span class="empty-icon"></span><strong>Your API search results will appear here</strong><p>' + (state.proxyUrl ? 'Requests are routed through your allowlisted Vercel proxy.' : 'Direct API mode is active. Add a Vercel proxy URL if CORS blocks a provider.') + '</p></div>';
    els.clearResultsBtn.hidden = true;
    els.loadMoreWrap.hidden = true;
    hideNotice();
  }

  function testAllProviders() {
    if (!state.apiKey) {
      showNotice('Paste and save your purchased API key first.', 'error');
      openSettings();
      els.apiKey.focus();
      return;
    }
    if (!state.proxyUrl) {
      showNotice('Add your Vercel proxy URL before testing all providers. Direct browser tests can fail because of CORS.', 'error');
      openSettings();
      els.proxyUrl.focus();
      return;
    }

    var providers = PROVIDERS.filter(providerIsSearchable);
    var nextIndex = 0;
    var completed = 0;
    var passed = 0;
    var failed = 0;
    state.providerTests = {};
    renderTestSummary();
    providers.forEach(function (provider) {
      state.providerTests[provider.id] = { state: 'waiting', error: '' };
    });
    els.testAllBtn.disabled = true;
    els.testAllBtn.textContent = 'Testing 0/' + providers.length + '…';
    showNotice('Running one search request per active provider through your proxy.', '');
    renderProviders();

    function worker() {
      var provider = providers[nextIndex];
      nextIndex += 1;
      if (!provider) return Promise.resolve();

      state.providerTests[provider.id] = { state: 'testing', error: '' };
      renderProviders();
      return apiFetch(provider, 'feed', { page: 1, offset: 0, language: state.language }).then(function (payload) {
        if (!normalizeResults(payload, provider).length) throw new Error('The feed returned no readable drama items.');
        passed += 1;
        state.providerTests[provider.id] = { state: 'passed', error: '' };
      }).catch(function (error) {
        failed += 1;
        state.providerTests[provider.id] = { state: 'failed', error: safeErrorMessage(error) };
      }).then(function () {
        completed += 1;
        els.testAllBtn.textContent = 'Testing ' + completed + '/' + providers.length + '…';
        renderProviders();
        renderTestSummary();
        return worker();
      });
    }

    Promise.all([worker(), worker(), worker()]).then(function () {
      els.testAllBtn.disabled = false;
      els.testAllBtn.textContent = 'Test all provider APIs';
      updateConnection(failed ? 'error' : 'online', passed + ' passed · ' + failed + ' failed');
      showNotice('Provider API test finished: ' + passed + ' passed and ' + failed + ' failed. This checks API access only; video playback is tested per episode.', failed ? 'error' : 'success');
      renderTestSummary();
    });
  }

  function objectForDetail(payload) {
    if (!payload || typeof payload !== 'object') return null;
    var candidate = valueByKeys(payload, ['drama', 'detail', 'book', 'show', 'data', 'result']);
    if (candidate && !Array.isArray(candidate) && typeof candidate === 'object') return candidate;
    return Array.isArray(payload) ? (payload[0] || null) : payload;
  }

  function episodeNumber(raw, index) {
    var value = valueByKeys(raw, ['episode', 'episodeNo', 'episodeNumber', 'chapterIndex', 'chapterNum', 'index', 'ep', 'number', 'sort']);
    return value == null ? index + 1 : value;
  }

  function normalizeEpisodes(payload) {
    var items = bestArray(payload, 'episodes');
    return items.map(function (raw, index) {
      var number = episodeNumber(raw, index);
      var title = valueByKeys(raw, ['chapterName', 'episodeTitle', 'title', 'name']);
      var episodeId = valueByKeys(raw, ['chapterId', 'episodeId', 'episode_id', 'vid', 'videoId', 'fileId', 'id']);
      var fileId = valueByKeys(raw, ['fileId', 'file_id', 'videoId']);
      return {
        number: number,
        title: title == null ? 'Episode ' + number : String(title),
        episodeId: episodeId == null ? String(number) : String(episodeId),
        fileId: fileId == null ? '' : String(fileId),
        raw: raw
      };
    });
  }

  function mediaCandidates(value, depth, keyName, output) {
    if (depth < 0 || value == null) return;
    if (typeof value === 'string') {
      if (/^https?:\/\//i.test(value) || /^\/\//.test(value)) {
        var key = String(keyName || '').toLowerCase();
        var lower = value.toLowerCase();
        var score = 0;
        if (/image|cover|poster|thumb|avatar|logo|subtitle|\.vtt|\.srt/.test(key + ' ' + lower)) score -= 20;
        if (/\.m3u8(?:$|\?)/.test(lower) || lower.indexOf('m3u8') !== -1) score += 12;
        if (/\.mp4(?:$|\?)/.test(lower)) score += 10;
        if (/hls|video|play|stream|source|url/.test(key)) score += 5;
        output.push({ url: value, score: score });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.slice(0, 20).forEach(function (item) { mediaCandidates(item, depth - 1, keyName, output); });
      return;
    }
    if (typeof value === 'object') {
      Object.keys(value).forEach(function (key) { mediaCandidates(value[key], depth - 1, key, output); });
    }
  }

  function findMediaUrl(payload) {
    var candidates = [];
    mediaCandidates(payload, 6, '', candidates);
    candidates.sort(function (a, b) { return b.score - a.score; });
    if (!candidates.length || candidates[0].score < 1) return '';
    return candidates[0].url;
  }

  function safeJson(payload) {
    var output;
    try { output = JSON.stringify(payload, null, 2); } catch (error) { output = String(payload); }
    if (state.apiKey) output = output.split(state.apiKey).join('••••••••');
    return output.length > 80000 ? output.slice(0, 80000) + '\n… response truncated' : output;
  }

  function renderDetailCopy(drama, detailPayload) {
    var provider = activeProvider();
    var detail = objectForDetail(detailPayload) || drama.raw;
    var normalized = normalizedDrama(detail, 0, provider);
    els.detailTitle.textContent = normalized.title && normalized.title.indexOf('Untitled drama') !== 0 ? normalized.title : drama.title;
    els.detailPoster.src = normalized.cover || drama.cover || '';
    els.detailPoster.alt = els.detailTitle.textContent;
    els.detailPoster.style.display = (normalized.cover || drama.cover) ? 'block' : 'none';
    els.detailDescription.textContent = normalized.description || drama.description || 'No synopsis was returned by this provider.';
    var meta = [];
    if (normalized.episodes || drama.episodes) meta.push((normalized.episodes || drama.episodes) + ' episodes');
    if (normalized.language || drama.language) meta.push(normalized.language || drama.language);
    els.detailMeta.textContent = meta.join(' · ');
  }

  function renderEpisodes(episodes) {
    state.activeEpisodes = episodes;
    els.episodeMeta.textContent = episodes.length ? episodes.length + ' episode' + (episodes.length === 1 ? '' : 's') + ' available' : 'No episode list returned';
    if (!episodes.length) {
      els.episodeGrid.innerHTML = '<div class="episode-empty">This provider did not return an episode list for this title.</div>';
      return;
    }
    els.episodeGrid.innerHTML = episodes.map(function (episode, index) {
      return '<button class="episode-button" type="button" data-episode-index="' + index + '" title="' + escapeHtml(episode.title) + '">EP ' + escapeHtml(episode.number) + '</button>';
    }).join('');
  }

  function openDrama(index) {
    var drama = state.results[index];
    if (!drama) return;
    var provider = activeProvider();
    state.activeDrama = drama;
    destroyPlayer();
    els.detailModal.hidden = false;
    document.body.style.overflow = 'hidden';
    els.detailProvider.textContent = provider.name.toUpperCase();
    els.detailTitle.textContent = drama.title;
    els.detailPoster.src = drama.cover || '';
    els.detailPoster.alt = drama.title;
    els.detailPoster.style.display = drama.cover ? 'block' : 'none';
    els.detailMeta.textContent = drama.episodes ? drama.episodes + ' episodes' : '';
    els.detailDescription.textContent = drama.description || 'Loading drama details…';
    els.episodeMeta.textContent = 'Loading episodes…';
    els.episodeGrid.innerHTML = '<span class="inline-loader"></span>';
    els.rawResponse.textContent = 'Loading API response…';
    els.videoSection.hidden = true;

    var context = { dramaId: drama.id, language: state.language };
    var detailPayload = drama.raw;
    var episodePayload = null;
    var detailRequest = provider.detailPath ? apiFetch(provider, 'detail', context).catch(function (error) {
      return { _detailError: safeErrorMessage(error), original: drama.raw };
    }) : Promise.resolve(drama.raw);

    detailRequest.then(function (payload) {
      detailPayload = payload;
      renderDetailCopy(drama, payload.original || payload);
      var embeddedEpisodes = normalizeEpisodes(payload.original || payload);
      if (!provider.episodesPath && embeddedEpisodes.length) {
        episodePayload = payload.original || payload;
        renderEpisodes(embeddedEpisodes);
      }
      if (provider.episodesPath) {
        return apiFetch(provider, 'episodes', context).then(function (episodesResponse) {
          episodePayload = episodesResponse;
          var episodes = normalizeEpisodes(episodesResponse);
          if (!episodes.length) episodes = embeddedEpisodes;
          renderEpisodes(episodes);
        }).catch(function (error) {
          if (embeddedEpisodes.length) renderEpisodes(embeddedEpisodes);
          else renderEpisodes([]);
          episodePayload = { _episodeError: safeErrorMessage(error) };
        });
      }
      if (!embeddedEpisodes.length && !provider.episodesPath) {
        var direct = findMediaUrl(payload.original || payload);
        renderEpisodes((direct || provider.playPath) ? [{ number: 1, title: 'Episode 1', episodeId: '1', fileId: '', raw: payload.original || payload }] : []);
      }
      return null;
    }).then(function () {
      els.rawResponse.textContent = safeJson({ detail: detailPayload, episodes: episodePayload });
    }).catch(function (error) {
      renderEpisodes([]);
      els.detailDescription.textContent = safeErrorMessage(error);
      els.rawResponse.textContent = safeJson({ error: safeErrorMessage(error) });
    });
  }

  function destroyPlayer() {
    state.playbackActive = false;
    if (state.hls) {
      try { state.hls.destroy(); } catch (error) { /* ignore */ }
      state.hls = null;
    }
    try { els.videoPlayer.pause(); } catch (error) { /* ignore */ }
    els.videoPlayer.removeAttribute('src');
    els.videoPlayer.load();
    els.videoLoading.hidden = true;
  }

  function closeDetail() {
    destroyPlayer();
    els.detailModal.hidden = true;
    document.body.style.overflow = '';
    state.activeDrama = null;
    state.activeEpisodes = [];
  }

  function playUrl(url, episode) {
    var absolute = absoluteUrl(url, activeProvider().base);
    if (!absolute) throw new Error('The API response did not contain a valid video URL.');
    destroyPlayer();
    state.playbackActive = true;
    els.videoSection.hidden = false;
    els.videoStatus.className = 'video-status';
    els.videoStatus.textContent = episode.title + ' · Loading stream…';
    var lower = absolute.toLowerCase();

    if ((lower.indexOf('.m3u8') !== -1 || lower.indexOf('m3u8') !== -1) && window.Hls && window.Hls.isSupported()) {
      state.hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
      state.hls.loadSource(absolute);
      state.hls.attachMedia(els.videoPlayer);
      state.hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        els.videoStatus.textContent = episode.title + ' · HLS ready';
        var promise = els.videoPlayer.play();
        if (promise && promise.catch) promise.catch(function () { /* Android may require a second tap */ });
      });
      state.hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          els.videoStatus.className = 'video-status is-error';
          els.videoStatus.textContent = 'Playback error: ' + (data.details || data.type || 'HLS failed') + '. The provider API responded, but this media host may require a dedicated stream-edge or CORS rule.';
        }
      });
    } else {
      els.videoPlayer.src = absolute;
      els.videoPlayer.load();
      var playPromise = els.videoPlayer.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () { /* user gesture fallback */ });
      els.videoStatus.textContent = episode.title + ' · Direct video';
    }
    els.videoSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function playEpisode(index) {
    var episode = state.activeEpisodes[index];
    var drama = state.activeDrama;
    var provider = activeProvider();
    if (!episode || !drama) return;
    Array.prototype.slice.call(els.episodeGrid.querySelectorAll('.episode-button')).forEach(function (button, buttonIndex) {
      button.classList.toggle('is-active', buttonIndex === index);
    });
    els.videoSection.hidden = false;
    els.videoLoading.hidden = false;
    els.videoStatus.className = 'video-status';
    els.videoStatus.textContent = 'Resolving ' + episode.title + '…';

    var directUrl = findMediaUrl(episode.raw);
    if (directUrl) {
      els.videoLoading.hidden = true;
      try { playUrl(directUrl, episode); } catch (error) {
        els.videoStatus.className = 'video-status is-error';
        els.videoStatus.textContent = safeErrorMessage(error);
      }
      return;
    }

    if (!provider.playPath) {
      els.videoLoading.hidden = true;
      els.videoStatus.className = 'video-status is-error';
      els.videoStatus.textContent = 'No playable URL or play endpoint was returned for this episode.';
      return;
    }

    apiFetch(provider, 'play', {
      dramaId: drama.id,
      episodeNumber: episode.number,
      episodeId: episode.episodeId,
      fileId: episode.fileId,
      language: state.language
    }).then(function (payload) {
      els.videoLoading.hidden = true;
      var url = findMediaUrl(payload);
      if (!url) throw new Error('The play endpoint returned no HLS or MP4 URL.');
      els.rawResponse.textContent = safeJson({ play: payload });
      playUrl(url, episode);
    }).catch(function (error) {
      els.videoLoading.hidden = true;
      els.videoStatus.className = 'video-status is-error';
      els.videoStatus.textContent = safeErrorMessage(error);
    });
  }

  function testAndSaveKey() {
    var key = els.apiKey.value.trim();
    if (!key) {
      showNotice('Paste your purchased API key first.', 'error');
      return;
    }
    var normalizedProxy;
    try {
      normalizedProxy = normalizeProxyUrl(els.proxyUrl.value);
    } catch (error) {
      showNotice(safeErrorMessage(error), 'error');
      els.proxyUrl.focus();
      return;
    }
    state.apiKey = key;
    state.proxyUrl = normalizedProxy;
    state.remember = els.rememberKey.checked;
    els.proxyUrl.value = state.proxyUrl;
    storeApiKey();
    savePrefs();
    updateConnection('testing', 'Testing key…');
    els.saveKeyBtn.disabled = true;
    els.saveKeyBtn.textContent = 'Testing…';
    var provider = providerById('starshort');
    apiFetch(provider, 'search', { query: 'love', page: 1, language: state.language }).then(function () {
      updateConnection('online', state.proxyUrl ? 'Proxy connected' : 'API connected');
      showNotice('API key connected successfully through ' + (state.proxyUrl ? 'the Vercel proxy' : 'direct API mode') + '.', 'success');
      showToast('API and proxy settings saved on this device.');
      closeSettings();
      loadProviderFeed(false);
    }).catch(function (error) {
      updateConnection('error', 'API error');
      showNotice(safeErrorMessage(error), 'error');
    }).then(function () {
      els.saveKeyBtn.disabled = false;
      els.saveKeyBtn.textContent = 'Save & test key';
    });
  }

  els.mobileSettingsBtn.addEventListener('click', openSettings);
  els.closeSettingsBtn.addEventListener('click', closeSettings);
  els.settingsScrim.addEventListener('click', closeSettings);
  els.toggleKeyBtn.addEventListener('click', function () {
    var hidden = els.apiKey.type === 'password';
    els.apiKey.type = hidden ? 'text' : 'password';
    els.toggleKeyBtn.textContent = hidden ? 'Hide' : 'Show';
    els.toggleKeyBtn.setAttribute('aria-label', hidden ? 'Hide API key' : 'Show API key');
  });
  els.saveKeyBtn.addEventListener('click', testAndSaveKey);
  els.testAllBtn.addEventListener('click', testAllProviders);
  els.videoPlayer.addEventListener('error', function () {
    if (!state.playbackActive || els.videoSection.hidden) return;
    els.videoStatus.className = 'video-status is-error';
    els.videoStatus.textContent = 'Playback failed. The API returned a stream, but the media host or format is blocked. This provider may need a dedicated stream edge before Sketchware integration.';
  });
  els.apiKey.addEventListener('keydown', function (event) { if (event.key === 'Enter') testAndSaveKey(); });
  els.providerFilter.addEventListener('input', renderProviders);
  els.providerList.addEventListener('click', function (event) {
    var button = event.target.closest('[data-provider]');
    if (button) selectProvider(button.getAttribute('data-provider'));
  });
  els.languageSelect.addEventListener('change', function () {
    state.language = els.languageSelect.value;
    savePrefs();
    if (state.viewMode === 'feed') loadProviderFeed(false);
  });
  els.searchForm.addEventListener('submit', function (event) { event.preventDefault(); runSearch(false); });
  els.loadMoreBtn.addEventListener('click', function () {
    if (state.viewMode === 'feed') loadProviderFeed(true);
    else runSearch(true);
  });
  els.clearResultsBtn.addEventListener('click', function () { clearResults(true); });
  els.resultsGrid.addEventListener('click', function (event) {
    var button = event.target.closest('[data-result-index]');
    if (button) openDrama(Number(button.getAttribute('data-result-index')));
  });
  els.episodeGrid.addEventListener('click', function (event) {
    var button = event.target.closest('[data-episode-index]');
    if (button) playEpisode(Number(button.getAttribute('data-episode-index')));
  });
  els.detailModal.addEventListener('click', function (event) {
    if (event.target.closest('[data-close-modal]')) closeDetail();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!els.detailModal.hidden) closeDetail();
      else closeSettings();
    }
  });
  window.addEventListener('beforeunload', destroyPlayer);

  readPrefs();
  els.apiKey.value = state.apiKey;
  els.proxyUrl.value = state.proxyUrl;
  els.rememberKey.checked = state.remember;
  els.languageSelect.value = state.language;
  updateConnection('offline', state.apiKey ? (state.proxyUrl ? 'Key + proxy saved' : 'Key saved') : 'No API key');
  loadProviderCatalog().then(function () {
    if (!providerById(state.providerId)) state.providerId = 'starshort';
    renderProviders();
    renderProviderHeader();
    clearResults(false);
    if (state.apiKey && activeProvider().feedPath) loadProviderFeed(false);
    if (!state.apiKey && window.innerWidth <= 820) openSettings();
  });
}());
