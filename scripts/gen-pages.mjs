// Builds data/techniques.json (registry) from ledger-techniques + assign + palettes, and writes t/<slug>/index.html
import fs from 'node:fs';
const led = JSON.parse(fs.readFileSync('data/ledger-techniques.json', 'utf8'));
const assign = JSON.parse(fs.readFileSync('data/assign.json', 'utf8'));
const pal = fs.existsSync('data/ref-palettes.json') ? JSON.parse(fs.readFileSync('data/ref-palettes.json', 'utf8')) : {};
const engineOf = {}; for (const [e, list] of Object.entries(assign)) for (const s of list) engineOf[s] = e;
// Korean category label for each clone. Resolution order (first hit wins):
//   1. explicit `category` on the ledger entry (Korean label or an engine key), if the ledger ever supplies one
//   2. LABEL_OVERRIDE by slug (hand-fixed cases where the engine is a poor description of the technique)
//   3. the curated engine from data/assign.json (except the catch-all 'saas' engine)
//   4. whole-word keyword RULES on the technique name (\b-bounded; no bare 'os' / 'sim' / 'data' / 'sand' substrings)
//   5. fallback '인터랙션'
const ENGINE_LABEL = { gradient: '그라디언트', palette: '컬러', paint: '드로잉', seq: '사운드', audio: '사운드', nodes: '노드 그래프', type: '타이포',
  pixel: '그리드/타일', globe: '지도/지구', cssfx: 'CSS 생성기', svggen: 'SVG 생성기', imagefx: '이미지 스튜디오', puzzle: '퍼즐/게임', code: '라이브 코딩',
  three: '3D 스테이지', desk: '레트로 데스크톱', sim: '시뮬레이션', chart: '데이터/타임라인', gen: '제너레이티브 아트' };
const LABEL_OVERRIDE = { 'exf-ascii-scatter-work-universe-grid-toggle-bracket-chrome-timezone-scramble': 'ASCII 스캐터 워크 유니버스 · 브래킷 크롬 · 그리드/스캐터 토글', 'godn-particle-mixed-type-hero-lab-four-instruments-8d-sound-nodes': '파티클 워드마크 혼합 서체 히어로 · 랩 4 인스트루먼트 · 8D 사운드', 'sanrita-dual-column-terraforming-hud-trail-map-pin-legend-layers': '듀얼 칼럼 테라포밍 HUD · 3D 트레일 맵 · 핀 범례 레이어', 'heron-architectural-drawing-sheet-elevation-loader-title-block-orange-redline-chat-widget': '건축 도면 시트 · 입면 로더 · 오렌지 레드라인', 'maria-vasilyeva-five-line-score-stave-tracklist-nav-sound-annotations-project-bars': '오선지 포트폴리오 · 트랙리스트 내비 · 사운드/주석 토글', 'nickho-giant-car-number-hero-greyscale-photo-scroll-helmet-360-six-column-hairlines': '거대 카넘버 히어로 · 스크롤 헬멧 360 · 6 헤어라인',
  'fishwife-illustrated-tin-bundle-builder-size-pills-discount-badges-slot-progress-track': '일러스트 틴 번들 빌더 · 사이즈 필 · 슬롯 진행 트랙', 'cashapp-neon-green-phone-mockup-hero-balance-cards-section-story-stats-row': '네온 그린 폰 목업 히어로 · 섹션 스토리', 'devolver-dark-game-hub-auto-rotating-hero-thumbnail-strip-new-hotness-grid-snarky-newsletter-band': '다크 게임 허브 · 자동 회전 히어로 · 썸네일 스트립',
  'oatly-hatched-retro-window-chrome-bento-news-grid-pixel-to-sharp-image-reveal-cheeky-cookie-modal': '해치 레트로 윈도우 벤토 브랜드 그리드', 'analogue-3d-black-product-launch-scroll-story-numbered-feature-stepper-crt-mode-sections': '블랙 하드웨어 런치 스크롤 · 번호 스테퍼 · CRT', 'liveblocks-multiplayer-cursor-name-tag-headline-3d-glass-logo-like-x-use-case-card-rail': '멀티플레이어 네임태그 헤드라인 · 3D 글래스 로고',
  'webcam-class-train-studio': '인터랙션', 'mondrian-partition-canvas': '드로잉', 'social-meta-preview-studio': '인터랙션',
  'cuberto-context-cursor-agency-home': '랜딩 페이지', 'rauno-craft-interaction-shelf': '인터랙션', 'lofi-cafe-station-tv-room': '사운드',
  'drifting-art-attic-canvas': '인터랙션', 'partiful-invite-theme-customizer': '인터랙션', 'zenpen-zen-writing-editor': '타이포',
  'mmm-page-sticker-site-builder': '인터랙션', 'lospec-pixel-palette-browser': '컬러', 'waveform-audio-editor': '사운드', 'ladybug-effects-studio': '이미지 스튜디오',
  'duolingo-mascot-onboarding-quiz-flow': '온보딩 플로우', 'slowroads-zen-title-procedural-drive': '3D 스테이지', 'pixelthoughts-star-shrink-60s-ritual': '명상 인터랙션',
  'ia-writer-focus-mode-typewriter-hero': '글쓰기 에디터', 'devouring-details-scroll-ruler-reference-manual': '스크롤 인터랙션', 'hey-screener-yes-no-gradient-inbox': '인박스 인터랙션',
  'stripe-press-3d-book-stack-catalog': '3D 카탈로그', 'airpods-pro-highlights-carousel-sticky-localnav': '제품 스토리 캐러셀', 'opal-scroll-word-reveal-odometer-gems': '스크롤 인터랙션',
  'polestar-4-configurator-swatch-gallery-price-rail': '차량 컨피규레이터', 'mercury-demo-banking-dashboard-persona-tour': '뱅킹 대시보드', 'zed-blueprint-grid-kbd-hint-command-palette': '커맨드 팔레트 랜딩',
  'globle-hot-cold-3d-globe-guess-game': '지구본 추리 게임', 'arc-stitched-banner-grain-blue-quote-marquee': '브랜드 랜딩', 'screen-studio-editor-timeline-hero-tabbed-zoom-clips': '에디터 목업 랜딩',
  'flocus-gradient-focus-dashboard-mode-toggle': '집중 대시보드', 'dinamo-favorit-fullscreen-variable-axis-tester': '가변 폰트 테스터', 'rhode-lip-tint-pdp-swatch-route-cart-drawer': '뷰티 상품 상세(PDP)',
  'airbnb-segmented-search-pill-calendar-guests-map-pins': '숙소 검색 플로우', 'nts-dual-live-channel-bar-expand-schedule-mixtape-rail': '라이브 라디오 플레이어', 'basement-human-machine-toggle-3d-hq-ascii-index': '3D 에이전시 사이트',
  'a24-title-stack-hover-hero-swap-masonry-films': '영화 스튜디오 히어로', 'rijksmuseum-floating-search-dock-masonry-filter-drawer-deep-zoom': '미술관 컬렉션 탐색', 'copilot-blurred-tilted-category-pills-hero-split-glass-nav': '핀테크 앱 랜딩',
  'lando-topo-hero-scroll-signature-draw-two-tone-manifesto': '선수 포트폴리오', 'brilliant-autoplay-demo-card-hero-koji-onboarding-steps': '학습 앱 온보딩', 'mschf-numbered-drop-index-bottom-anchored-redacted-rows': '브루탈리스트 인덱스',
  'daylight-sunlit-hero-leaf-shadow-scroll-word-fill-glass-pill-nav': '하드웨어 제품 랜딩', 'wetransfer-floating-upload-panel-expiry-menu-wallpaper-swap': '파일 전송 업로드 플로우', 'readymag-cycling-collage-hero-floating-cta-card-bento-stickers': '디자인 툴 랜딩',
  'mynoise-ten-band-spectrum-slider-mixer-presets-animate': '스펙트럼 사운드 믹서',
  'arnaud-story-progress-fluid-drag-scramble-title-portfolio': '스토리 포트폴리오',
  'fromanother-agency-studio-collective-cycle-section-rail-blob': '에이전시 랜딩',
  'nightride-crt-scanline-eq-station-rail-milkdrop-tabs': 'CRT 신스웨이브 라디오',
  'grilli-flexa-jump-rail-subfamily-pill-editable-specimen': '타입 파운드리 스페시먼',
  'groovepizza-radial-slice-sequencer-shape-polygon-sliders': '라디얼 드럼 시퀀서',
  'rabbit-r1-orange-device-stacked-app-card-screen-buy-bar': '하드웨어 제품 랜딩',
  'skia-shaders-thumb-rail-split-editor-canvas-run-itime': '셰이더 플레이그라운드',
  'hoverstat-framed-site-preview-year-tag-pill-archive': '웹 아카이브',
  'ghostty-ascii-frame-ghost-terminal-window-hero': 'ASCII 터미널 히어로',
  'samwho-loadbalancer-sim-card-play-speed-slider-dots': '로드밸런서 시뮬레이션 해설',
  'lynnfisher-book-toc-dot-leader-roman-numeral-paper-portfolio': '고서 목차 포트폴리오',
  'maggie-garden-topic-rail-growth-stage-filter-illustrated-card-masonry': '디지털 가든 인덱스',
  'sbs-theboat-rain-particle-click-start-ink-comic-chapter-scroll': '그래픽노블 스크롤리텔링',
  'sanctuary-blur-photo-hero-swash-wordmark-glass-pill-nav-diagram-card': '스튜디오 히어로 랜딩',
  'metademolab-animated-drawings-4-step-upload-box-mask-joint-motion-wizard': '드로잉 애니메이션 위저드',
  'infinitemac-beige-bezel-year-timeline-os-launcher-customize-run': '클래식 맥 OS 런처',
  'watabou-parchment-ink-city-map-curved-ward-labels-compass-regenerate': '판타지 도시 지도 생성기',
  'shopify-editions-3d-cover-shelf-season-timeline-archive': '3D 커버 선반 아카이브',
  'waffle-drag-swap-letter-grid-color-feedback-swap-counter': '드래그 스왑 단어 퍼즐',
  'lux-dark-fullscreen-feature-carousel-chromatic-wordmark-pill-search': '다크 풀스크린 캐러셀',
  'ipodjs-click-wheel-scroll-split-pane-menu-cover-flow': '클릭휠 아이팟 플레이어',
  'weatherstar-4000-retro-broadcast-auto-slide-forecast-player': '레트로 기상 방송 슬라이드쇼',
  '16personalities-illustrated-step-cards-7-circle-agree-scale-focus-progression': '7단계 동의 척도 설문',
  'cameronsworld-geocities-layered-collage-scroll-zones-gif-parallax-sound-toggle': '지오시티즈 콜라주 롱스크롤',
  'csszengarden-single-markup-theme-switcher-design-list-skin-swap': '단일 마크업 스킨 스위처',
  'locomotive-stacked-echo-typing-preloader-glyph-scramble-wordmark': '에코 타이핑 프리로더',
  'io808-tr808-skeuomorphic-step-sequencer-knob-drag-16-step-pads': 'TR-808 드럼머신 시퀀서',
  'robin-noguier-curved-webgl-project-ribbon-serif-title-dot-pager': '커브 WebGL 리본 포트폴리오',
  'adarkroom-minimal-text-survival-cooldown-buttons-fading-log-lights-off': '미니멀 텍스트 서바이벌 게임',
  'skribbl-doodle-lobby-avatar-arrow-customizer-randomize-dice-pixel-logo': '두들 게임 로비 아바타 빌더',
  'bureau-cool-mono-studio-rotating-glass-ring-live-traffic-labels': '회전 글래스 링 실시간 트래픽',
  'dia-sunlit-serif-wordmark-hero-sticky-scroll-feature-browser-mock': '햇살 세리프 히어로 스티키 스크롤',
  'graza-dtc-olive-oil-shop-condensed-serif-hero-slides-flavor-tag-product-trio-fact-ticker': 'DTC 푸드 쇼핑몰 히어로',
  'mapiful-map-poster-editor-dark-icon-rail-tab-panels-live-poster-preview-coords': '지도 포스터 에디터',
  'plink-starfield-multiplayer-music-lobby-tilted-condensed-sticker-words-orbit-rings': '별밭 멀티플레이 음악 로비',
  'dialed-color-memory-game-tilted-card-hub-countdown-reveal-hue-slider-recall': '컬러 기억 게임',
  'humanssince1982-clock-wall-kinetic-hands-grid-live-since-counter-mono-nav': '키네틱 시계벽 히어로',
  'ryanmulligan-skewed-bento-pen-strip-range-scrubber-unskew-theme-machine': '스큐 벤토 데모 스트립',
  'gsap-kinetic-letter-assembly-hero-shape-confetti-scroll-tool-cards': '키네틱 레터 조립 히어로',
  'zoomquilt-infinite-zoom-painting-layered-scale-loop-arrow-keys': '무한 줌 페인팅 루프',
  'pixelspace-horizontal-scale-solar-map-km-counter-planet-jump-lightspeed': '1픽셀 달 스케일 태양계',
  'imissmycafe-line-art-cafe-ambient-mixer-sound-rows-volume-pan-playlist-card': '라인아트 카페 앰비언트 믹서',
  'sennep-color-block-case-study-scroll-heavy-serif-floating-3d-objects': '컬러 블록 케이스 스터디 스크롤',
  'lightphone-cinematic-photo-scroll-quote-hero-device-tool-menu-starfield': '시네마틱 포토 스크롤 하드웨어 스토리',
  'histography-dot-grid-history-timeline-resizable-era-range-bar-bodoni-hover-cards': '도트 그리드 역사 타임라인',
  'atlas-of-emotions-morphing-emotion-continents-fullpage-chapters-state-intensity-bands': '모핑 감정 대륙 챕터 스토리',
  'unseen-audio-enter-gate-spaced-letter-loader-click-hold-drag-world-project-filter': '오디오 게이트 · 홀드 · 드래그 월드',
  'lumon-mdr-crt-number-grid-cursor-magnify-lasso-refine-bins-progress': 'CRT 매크로데이터 정제 숫자 그리드',
  'monaspace-type-specimen-outline-node-logo-font-cards-axis-playground-texture-healing': '코드 폰트 스페시먼 · 축 플레이그라운드',
  'dropbox-brand-guidelines-color-block-mosaic-tile-hover-invert-fullscreen-chapter-transition': '컬러 블록 브랜드 모자이크 · 챕터 전환',
  'minitokyo3d-realtime-3d-transit-map-underground-mode-playback-clock-tracking-camera-modes': '실시간 3D 교통 지도 · 지하 모드 · 추적 카메라',
  'underd0g-watch-customiser-dial-strap-swap-color-dot-lists-serif-hero': '시계 커스터마이저 · 다이얼/스트랩 스왑',
  'isleoftune-isometric-island-road-sequencer-tile-toolbar-drag-roads-car-play': '아이소메트릭 섬 도로 시퀀서',
  'santatracker-illustrated-village-hero-countdown-flip-play-cta-game-card-grid-menu': '일러스트 마을 히어로 · 플립 카운트다운 · 게임 카드 메뉴',
  'phosphor-icons-illustrated-desk-hero-sticky-toolbar-weight-size-color-search-icon-detail-drawer': '아이콘 탐색기 · 굵기/크기/색 툴바 · 상세 드로어',
  'notboring-playful-app-catalog-3d-icon-cards-serial-labels-skins-series-shelf': '플레이풀 앱 카탈로그 · 3D 아이콘 카드 · 스킨 시리즈',
  'kidpix-retro-mac-paint-tool-column-pattern-option-bar-palette-splash-canvas': '레트로 1비트 페인트 앱 · 툴별 옵션 바',
  'cydstumpel-giant-condensed-wordmark-rotating-serif-role-sticker-badges-rounded-work-tiles-pastel-blog-cards': '거대 워드마크 포트폴리오 · 회전 세리프 역할 · 스티커 배지',
  'gta6-cover-art-collage-hero-sunset-extended-look-trailer-cards-fullbleed-character-scroll': '커버아트 콜라주 히어로 · 선셋 트레일러 · 풀블리드 스크롤',
  'dungeonscrawl-preset-rail-dual-sidebar-floating-draw-toolbar-hatching-map-inspector': '잉크 해칭 배틀맵 데스크 · 프리셋 레일 · 레이어 인스펙터',
  'hookpad-roman-numeral-chord-palette-dual-staff-melody-chord-properties-transport': '로마숫자 코드 팔레트 작곡 데스크 · 이중 스태프',
  'satus-darkroom-fluid-webgl-tracked-features-grid-transition-debug-overlay': '다크 플루이드 피처 스테이지 · 트랜지션 디버그',
  'tweek-paper-weekly-planner-ruled-day-columns-inline-task-edit-color-chip-drag-someday-row': '페이퍼 위클리 플래너 · 인라인 편집 · 컬러칩 · 드래그',
  'arena-brutalist-channel-grid-view-switcher-blocks-table-index-meta-rail': '브루탈리스트 채널 그리드 · 뷰 스위처 · 메타 레일',
  'panic-rotating-game-takeover-hero-icon-shelf-popover-cards-slanted-section-bands': '로테이팅 게임 테이크오버 · 아이콘 선반 팝오버',
  'ohnotype-drawer-family-rail-giant-variable-specimen-inline-type-tester-option-chips': '타입 파운드리 패밀리 레일 · 거대 가변 스페시먼 · 인라인 테스터',
  'henryheffernan-bios-boot-start-gate-3d-desk-camera-zoom-into-crt-monitor-os': 'BIOS 부팅 게이트 · 3D 데스크 · CRT 모니터 줌 OS',
  'endel-monochrome-device-lineup-hero-mode-cards-generative-line-visual-dark-sections': '모노크롬 디바이스 라인업 · 모드 카드 · 제너레이티브 라인',
  'santioni-comic-scroll-age-gate-hold-pour-notturno-collection-vortex-story': '코믹북 WebGL 브랜드 여정 · 연령 게이트 · 홀드 투 푸어',
  'noho-energy-rating-dark-mode-reduce-motion-3d-explore-color-picker-stories-rail': '에너지 등급 컨트롤 · 다크/애니메이션 절감 · 3D 가구 컬러 피커',
  'trionn-hold-to-blast-3d-hero-slide-menu-stats-cards-lion-imagery-sound': '홀드 투 블라스트 3D 히어로 · 슬라이드 메뉴 · 라이언 스탯 카드',
  'aevion-lidar-scan-resolve-scramble-labels-tabbed-webgl-capabilities-fold-compact': 'LiDAR 스캔-리졸브 · 스크램블 라벨 · 탭 WebGL',
  'colonia-zacamil-past-present-3d-map-mural-pins-night-mode-slide-panel': '과거/현재 3D 단지 맵 · 뮤럴 핀 · 나이트 모드',
  'odyssee-split-edge-headline-full-bleed-film-serif-sans-section-dot-index': '엣지 스플릿 헤드라인 · 풀블리드 필름 · 닷 인덱스',
  'neutomni-retro-os-windows-faq-md-line-numbered-editor-tear-along-line-package-tickets': '레트로 OS 윈도 · 줄번호 FAQ.md · 절취선 패키지 티켓',
  'butter-text-effect-block-library-dials-sliders-live-preview-remix-describe-code-tabs': '텍스트 이펙트 블록 · 다이얼/슬라이더 라이브 프리뷰 · 3가지 제작 탭',
  'tiebreak-threejs-tennis-tiebreak-game-random-nickname-flags-first-to-seven-lookbook-reveal': '테니스 타이브레이크 미니게임 · 랜덤 닉네임/국기 · 룩북 리빌',
  'weekend-maxmara-tuscan-journey-illustrated-chapter-stages-feather-wipe-subtitles-gift-unlock': '토스카나 챕터 여정 · 페더 와이프 · 자막/기프트 언락',
  'boc-studio-coordinate-marquee-hero-filter-chip-work-grid-tumbling-404-letters': '좌표 마키 히어로 · 필터 칩 워크 그리드 · 텀블링 404',
  'pensatori-universe-option-set-spec-diagram-modules-t1-t7-scale-status-rows-percent-loader': 'OPTION SET 스펙 다이어그램 · T1–T7 · % 로더',
  'leoparpeix-clay-atelier-world-per-page-horizontal-project-ledger-feedable-bee-playground': '점토 아틀리에 월드 · 가로 작업 원장 · 벌 먹이 플레이그라운드',
  'artefakt-ascii-particle-mouse-3d-gallery-image-focus-pixel-reveal': 'ASCII 파티클 마우스 · 3D 갤러리 포커스 · 픽셀 리빌',
  'milledollars-split-wordmark-fullscreen-reel-contact-sheet-intro-case-role-labels': '스플릿 워드마크 릴 · 콘택트 시트 인트로 · ROLE 라벨',
  'paper-connected-canvas-vinyl-playlist-demo-inspector-xywh-agent-mcp-loop': 'HTML/CSS 커넥티드 캔버스 · Vinyl Sundays 플레이리스트 · XYWH 인스펙터 · MCP 에이전트 루프',
  'theatrejs-sequence-dope-sheet-graph-editor-easing-presets-butterfly-demo': '시퀀스 도프시트 · 그래프 에디터 · 이징 프리셋 · 나비 데모',
  'neuemontreal-tomato-red-travel-guide-specimen-pinned-pill-toc-text-display-pair': '토마토 레드 트래블 가이드 스페시먼 · 고정 필 목차 · Text/Display 페어' };
const RULES = [
  [/\b(pricing|checkout|billing|booking|wallet|cart)\b/i, 'SaaS 화면'],
  [/\b(explainer|scrollytelling|scroll-depth|smooth scroll)\b/i, '스크롤 인터랙션'],
  [/\b(desktop|win95|windows 9[58]|retro os|vaporwave os)\b/i, '레트로 데스크톱'],
  [/\b(landing|hero|product (page|story)|brand store|feature tour|agency home|marketing site)\b/i, '랜딩 페이지'],
  [/\b(puzzles?|games?|quiz)\b/i, '퍼즐/게임'],
  [/\b(3d|three\.js|voxels?|isometric|origami|gltf)\b/i, '3D 스테이지'],
  [/\bgradients?\b/i, '그라디언트'],
  [/\b(pixel|ascii|mosaic|tiles?)\b/i, '그리드/타일'],
  [/\b(colou?rs?|(?<!command-)palettes?|hues?)\b/i, '컬러'],
  [/\b(paint|brush(es)?|drawing|sketch(es)?|whiteboard)\b/i, '드로잉'],
  [/\b(sequencer|drums?|synth|audio|music|sound|piano|melody|radio)\b/i, '사운드'],
  [/\b(node[- ]graph|node editor|patcher|schema|circuit)\b/i, '노드 그래프'],
  [/\b(fonts?|typography|typeface|glyphs?|kerning|type[- ]scale)\b/i, '타이포'],
  [/\b(maps?|geospatial|globe|earth|star-map|solar-system|orbital)\b/i, '지도/지구'],
  [/\b(css|clip-path|box-shadow|glassmorphism|neumorphi\w*|claymorphi\w*|border-radius|easing|bezier)\b/i, 'CSS 생성기'],
  [/\b(svg|blobs?|waves?|qr|icons?|avatars?)\b/i, 'SVG 생성기'],
  [/\b(photo|image|dither|duotone|mockup|screenshot)\b/i, '이미지 스튜디오'],
  [/\b(repl|live-?cod(e|ing)|code editor|regex|api)\b/i, '라이브 코딩'],
  [/\b(simulat\w*|sandbox|fluid|reaction-diffusion|ecosystem|physics|particles?)\b/i, '시뮬레이션'],
  [/\b(charts?|timeline|data-?viz|visuali[sz]ation|heatmap)\b/i, '데이터/타임라인'],
  [/\b(generative|procedural)\b/i, '제너레이티브 아트'],
];
const ruleLabel = (name) => (RULES.find(([re]) => re.test(name)) || [])[1] || null;
const categoryOf = (t, engine) => {
  if (t.category) { const c = String(t.category).trim(); if (ENGINE_LABEL[c]) return ENGINE_LABEL[c]; if (/[가-힣]/.test(c)) return c; }
  return LABEL_OVERRIDE[t.slug] || (engine && engine !== 'saas' && ENGINE_LABEL[engine]) || ruleLabel(t.name) || '인터랙션';
};
// "Things 3 — Cultured Code task manager for Mac & iOS" -> "Things 3"; "Igloo Inc. (WebGL by Abeto)" -> "Igloo Inc."
const brandOf = (t) => (String(t.product || t.domain).split(/\s+[—–|]\s+/)[0].replace(/\s*\([^)]*\)\s*$/, '').trim() || t.domain);
const koOf = (t) => { if (t.lens === 'foundational-principle' || !t.id.startsWith('clone-')) return 'UX 원칙 데모'; return `${brandOf(t)} 스타일 ${categoryOf(t, engineOf[t.slug])} 클론`; };
const shortOf = (t) => t.name.replace(/^Clone\s+/i, '').split(':')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
const out = led.map((t) => ({ ...t, short: shortOf(t), ko: koOf(t), engine: engineOf[t.slug] || null, variant: t.slug, theme: pal[t.slug] || null,
  path: `/t/${t.slug}/`, built: !!engineOf[t.slug] }));
fs.writeFileSync('data/techniques.json', JSON.stringify(out, null, 1));
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/palettes.json', JSON.stringify(pal));
fs.writeFileSync('public/techniques.json', JSON.stringify(out.map(({ theme, prompt, ...r }) => r), null, 1));
fs.rmSync('t', { recursive: true, force: true });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
for (const t of out) {
  if (!t.engine) continue;
  fs.mkdirSync(`t/${t.slug}`, { recursive: true });
  const { prompt, ...pub } = t;
  fs.writeFileSync(`t/${t.slug}/index.html`, `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.short)} · ${esc(t.product)} — UX Technique Gallery</title><meta name="description" content="${esc(t.name)}">
<script type="application/json" id="tg-data">${JSON.stringify(pub).replace(/</g, '\\u003c')}</script></head>
<body><div id="demo"></div><noscript>${esc(t.name)}</noscript><script type="module" src="/src/page.js"></script></body></html>\n`);
}
console.log('pages', out.filter((t) => t.engine).length, '/', out.length);
