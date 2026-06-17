/* ============================================================ CONFIG ============================================================ */
const CONFIG = {
  SUPABASE_URL:        "https://immsmzbvbdpcgtrxgkiq.supabase.co",
  SUPABASE_ANON_KEY:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbXNtemJ2YmRwY2d0cnhna2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDE3NTQsImV4cCI6MjA5NjExNzc1NH0.WwKqIa6R7amfTBsezTyhCEEjwRKa37T5QxMFEiOgq7Q",
  SUPABASE_BUCKET:     "fourcut",
  VIEWER_BASE:         "",
  AI_BACKGROUND_ENDPOINT: "",
  COUNTDOWN_SEC: 3,
  TOTAL_SHOTS:   6,
  PICK_COUNT:    4,
  LINK_EXPIRE_SEC: 7200,   // QR 서명 URL 만료 시간(초). 7200 = 2시간. 바꾸면 안내 문구 qrExpire도 함께 수정하세요.
};

/* 함께할 로봇 10종. 각 폴더 assets/processed/<id>/ 에
   일반 <id>-1..4, 여름 <id>-summer-1..4 (투명 PNG)이 들어 있습니다.
   프로필 사진은 일반 1번. 선택된 4컷에는 1~4번 포즈가 컷마다 하나씩 들어갑니다. */
const ROBOTS = [
  { id:"alice",     ko:"앨리스", en:"Alice",     color:"#FF6B5C" },
  { id:"ameca",     ko:"아메카", en:"Ameca",     color:"#9B8CFF" },
  { id:"g1",        ko:"G1",     en:"G1",        color:"#2E8FC4" },
  { id:"i",         ko:"아이",   en:"I",         color:"#5BC0EB" },
  { id:"love",      ko:"러브",   en:"LOVE",      color:"#FFB020" },
  { id:"raim",      ko:"라임",   en:"RAIM",      color:"#FF6B5C" },
  { id:"liku",      ko:"리쿠",   en:"LiKU",      color:"#FF8FB1" },
  { id:"robot-arm", ko:"로봇팔", en:"Robot Arm", color:"#2BB7B3" },
  { id:"robot-dog", ko:"로봇개", en:"Robot Dog", color:"#6B7A93" },
  { id:"spot",      ko:"스팟",   en:"Spot",      color:"#FFC23C" },
];
/* 로봇 이미지 경로 (version: 'normal' | 'summer', idx: 1..4) */
function robotImgPath(id, version, idx){
  const tag = version==="summer" ? `-summer-${idx}` : `-${idx}`;
  return `assets/processed/${id}/${id}${tag}.png`;
}
const robotProfile = id => robotImgPath(id, "normal", 1);

const THEMES = [
  { id:"tomato",  hex:"#FF6B6B", logo:"red"    }, { id:"sun",   hex:"#F2D97D", logo:"yellow" },
  { id:"mint",    hex:"#7BD0CB", logo:"green"  }, { id:"laven", hex:"#C4BFE8", logo:"purple" },
  { id:"coral",   hex:"#E8CBD3", logo:"pink"   }, { id:"night", hex:"#2A437E", logo:"navy"   },
];
const MUSEUM_LOGO = "assets/seoulraim_logo.png";
const MUSEUM_LOGO_WHITE = "assets/seoulraim_logo_white.png";   // 알파 마스크(로고 색 입히기용)
const MUSEUM_TEXT = "서울로봇인공지능과학관 | Seoul Robot&AI Science Museum";
/* 프레임 색의 진한 톤 — 로고·날짜 글씨색(예: 연보라 → 보라) */
function hslToRgb(h,s,l){
  const f=n=>{ const k=(n+h*12)%12, a=s*Math.min(l,1-l); return l-a*Math.max(-1,Math.min(k-3,9-k,1)); };
  const to=v=>Math.round(v*255);
  return `rgb(${to(f(0))},${to(f(8))},${to(f(4))})`;
}
function deepThemeColor(hex){
  const n=parseInt(hex.slice(1),16); const r=((n>>16)&255)/255,g=((n>>8)&255)/255,b=(n&255)/255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b); let h=0; const l=(mx+mn)/2;
  if(mx!==mn){ const d=mx-mn;
    h = mx===r ? (g-b)/d+(g<b?6:0) : mx===g ? (b-r)/d+2 : (r-g)/d+4; h/=6; }
  return hslToRgb(h, 0.55, 0.42);   // 채도·명도 고정해 또렷하고 읽히는 톤
}
/* 이미지(알파 마스크)를 단색으로 칠해 반환 */
function tintImage(img, color){
  const w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
  const c=document.createElement("canvas"); c.width=w; c.height=h; const x=c.getContext("2d");
  x.drawImage(img,0,0); x.globalCompositeOperation="source-in"; x.fillStyle=color; x.fillRect(0,0,w,h);
  return c;
}
/* 기념 날짜 — 서버 기준(한국시간) YYYY.MM.DD */
function kstDateStr(){
  const p = new Intl.DateTimeFormat("en-CA",{ timeZone:"Asia/Seoul", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date());
  const g = type => p.find(x=>x.type===type).value;
  return `${g("year")}.${g("month")}.${g("day")}`;
}
/* 캔버스에 쓰기 전 웹폰트 로드 보장 */
async function ensureFonts(){
  try{
    await Promise.all([
      document.fonts.load('800 72px Pretendard'),
      document.fonts.load('400 26px Pretendard'),
      document.fonts.load('300 30px Pretendard'),
      document.fonts.load('400 76px Ttobak'),
    ]);
    await document.fonts.ready;
  }catch(e){}
}
const frameLogoPath = theme => `assets/frame-logo/frame-logo-${theme.logo}.png`;

/* ============================================================ i18n ============================================================ */
const I18N = {
  ko:{
    sub:"로봇·인공지능 과학관 네컷",
    startTitle:"라임 로봇들과 함께\n사진을 찍어보아요",
    startLead:"먼저 프레임을 꾸미고, 사진 6장을 찍어요.\nAI가 잘 나온 컷을 추천하고, 얼굴을 인식해 프레임을 꾸며줘요.",
    s1:"① 프레임 만들기", s2:"② 6컷 촬영", s3:"③ 4컷 선택", s4:"④ QR로 받기",
    start:"시작하기",
    allow:"카메라를 허용해 주세요",
    capNote:"화면을 보고 포즈를 취해요!",
    aiwatch:"AI가 얼굴을 인식하는 중",
    analyzing:"AI가 잘 나온 컷을 고르는 중",
    selTitle:"마음에 드는 4장을 골라요",
    selLead:"노란 표시는 AI 추천이에요. 고른 사진이 오른쪽 프레임에 바로 담겨요.",
    rec:"AI 추천", picked:"선택됨", next:"완성하기", preview:"내 프레임",
    wizTitle:"프레임 만들기",
    qColor:"프레임 색을 골라요", qRobot:"함께할 로봇을 골라요",
    qInit:"나만의 문구",
    qVersion:"로봇 버전을 골라요", verNormal:"일반", verSummer:"여름",
    initPh:"예: 라이미 / RAIM", initHint:"이름·문구 자유롭게 (한글/영문). 30자 이내(선택)",
    make:"프레임 완성! 촬영하기 ▶",
    composing:"프레임에 사진을 담는 중",
    resultTitle:"완성!", retake:"처음부터",
    qrTitle:"QR로 받아가세요",
    qrLead:"휴대폰 카메라로 QR을 스캔하면 사진을 받을 수 있어요.",
    qrExpire:"⏰ QR(사진 링크)은 2시간 뒤 사라져요.\n미리 저장해 주세요!",
    qrNoStore:"QR을 만들려면 Supabase 설정이 필요해요.\n지금은 아래 버튼으로 저장만 가능합니다.",
  },
  en:{
    sub:"Robot & AI Science Museum 4-Cut",
    startTitle:"Take photos\nwith the RAIM robots",
    startLead:"First design your frame, then take 6 shots.\nAI suggests the best shots and detects faces to decorate the frame.",
    s1:"① Make frame", s2:"② 6 shots", s3:"③ Pick 4", s4:"④ Get QR",
    start:"Start",
    allow:"Please allow camera access",
    capNote:"Look at the screen and pose!",
    aiwatch:"AI is detecting your face",
    analyzing:"AI is picking the best shots",
    selTitle:"Pick your favorite 4",
    selLead:"Yellow tags are AI picks. Your choices fill the frame on the right.",
    rec:"AI pick", picked:"selected", next:"Finish", preview:"My frame",
    wizTitle:"Make your frame",
    qColor:"Pick a frame color", qRobot:"Pick a robot friend",
    qInit:"Your message",
    qVersion:"Pick a robot version", verNormal:"Normal", verSummer:"Summer",
    initPh:"e.g. RAIM", initHint:"Any name or phrase (KO/EN). Up to 30 chars(optional)",
    make:"Frame ready! Start shooting ▶",
    composing:"Placing photos in your frame",
    resultTitle:"Done!", retake:"Start over",
    qrTitle:"Scan the QR to keep it",
    qrLead:"Point your phone camera at the QR to get your photo.",
    qrExpire:"⏰ The QR link expires in 2 hours.\nPlease save it now!",
    qrNoStore:"QR needs Supabase configured.\nFor now you can save the image below.",
  }
};
let LANG = "ko";
const t = k => (I18N[LANG][k] ?? k);

/* ============================================================ STATE ============================================================ */
const app = document.getElementById("app");
const state = {
  shots: [], suggested: [], picked: [],
  theme: THEMES[2], robot: ROBOTS[0], version: "normal",
  caption: "", layout: "grid",
  faceLandmarker: null, faceReady: false, _tried:false,
  stream: null, _bgCanvas:null, _robotImgs:[], _logoImg:null, _museumImg:null,
  _assetsP:null, _finalCanvas:null,
};

/* ============================================================ SVG ART ============================================================ */
function raimiSVG(){
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="20" width="56" height="50" rx="16" fill="#2BB7B3"/>
    <rect x="30" y="30" width="40" height="22" rx="11" fill="#0c1426"/>
    <circle cx="42" cy="41" r="6" fill="#FFC23C"/><circle cx="58" cy="41" r="6" fill="#FFC23C"/>
    <circle cx="42" cy="41" r="2.4" fill="#0c1426"/><circle cx="58" cy="41" r="2.4" fill="#0c1426"/>
    <rect x="44" y="58" width="12" height="4" rx="2" fill="#fff"/>
    <rect x="48" y="10" width="4" height="10" rx="2" fill="#16233A"/><circle cx="50" cy="9" r="4" fill="#FF6B5C"/>
    <rect x="14" y="44" width="8" height="16" rx="4" fill="#16233A"/><rect x="78" y="44" width="8" height="16" rx="4" fill="#16233A"/>
    <rect x="34" y="72" width="12" height="14" rx="4" fill="#16233A"/><rect x="54" y="72" width="12" height="14" rx="4" fill="#16233A"/>
  </svg>`;
}
function robotSVG(color){
  const dark="#16233A";
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="22" width="52" height="46" rx="15" fill="${color}"/>
    <rect x="32" y="31" width="36" height="20" rx="10" fill="${dark}"/>
    <circle cx="43" cy="41" r="5.2" fill="#fff"/><circle cx="57" cy="41" r="5.2" fill="#fff"/>
    <circle cx="43" cy="41" r="2.2" fill="${dark}"/><circle cx="57" cy="41" r="2.2" fill="${dark}"/>
    <rect x="44" y="57" width="12" height="3.4" rx="1.7" fill="#fff"/>
    <rect x="48" y="12" width="4" height="10" rx="2" fill="${dark}"/><circle cx="50" cy="11" r="3.6" fill="${color}"/>
    <rect x="16" y="46" width="8" height="14" rx="4" fill="${dark}"/><rect x="76" y="46" width="8" height="14" rx="4" fill="${dark}"/>
    <rect x="34" y="70" width="11" height="13" rx="4" fill="${dark}"/><rect x="55" y="70" width="11" height="13" rx="4" fill="${dark}"/>
  </svg>`;
}

/* ============================================================ ROUTER ============================================================ */
function header(){
  return `<div class="topbar">
    <div class="brand">
      <img class="museumlogo" src="${MUSEUM_LOGO}" alt="Seoul RAIM" />
      <div><b>RAIM 네컷</b><small>${t("sub").toUpperCase()}</small></div>
    </div>
    <div class="langtoggle">
      <button data-lang="ko" class="${LANG==='ko'?'sel':''}">한국어</button>
      <button data-lang="en" class="${LANG==='en'?'sel':''}">EN</button>
    </div>
  </div>`;
}
function mountLang(){
  app.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{ LANG=b.dataset.lang; render(currentScreen); });
}
let currentScreen="start";
function render(name){
  currentScreen=name;
  ({start:Start, wizard:Wizard, capture:Capture, analyze:Analyze, select:Select, result:Result})[name]();
  mountLang();
}

/* ---------------- START ---------------- */
function Start(){
  const rnd = ROBOTS[Math.floor(Math.random()*ROBOTS.length)];   // 매번 랜덤 로봇 프로필
  app.innerHTML = `<section class="screen on">
    ${header()}
    <div class="hero">
      <div class="heroart"><div class="ring"></div><div class="face" id="heroface">${raimiSVG()}</div></div>
      <h1 style="font-size:34px;text-align:center;white-space:pre-line">${t("startTitle")}</h1>
      <p class="lead" style="text-align:center;white-space:pre-line">${t("startLead")}</p>
      <div class="steps">
        <span class="pill"><b>${t("s1")}</b></span><span class="pill"><b>${t("s2")}</b></span>
        <span class="pill"><b>${t("s3")}</b></span><span class="pill"><b>${t("s4")}</b></span>
      </div>
    </div>
    <button class="btn primary" id="go">${t("start")} ▶</button>
  </section>`;
  document.getElementById("go").onclick=()=>render("wizard");
  // 랜덤 로봇 프로필 이미지로 교체 (실패 시 기본 SVG 유지)
  const face=document.getElementById("heroface");
  const img=new Image(); img.className="faceimg"; img.alt=rnd.ko;
  img.onload=()=>{ face.innerHTML=""; face.appendChild(img); };
  img.src=robotProfile(rnd.id);
}

/* ---------------- WIZARD (frame first) ---------------- */
function Wizard(){
  app.innerHTML=`<section class="screen on">
    ${header()}
    <h1 style="font-size:26px;margin-bottom:6px">${t("wizTitle")}</h1>
    <div class="wizscroll">
      <div class="qblock">
        <p class="qtitle"><span class="n">1</span>${t("qColor")}</p>
        <div class="colors" id="colors"></div>
      </div>
      <div class="qblock">
        <p class="qtitle"><span class="n">2</span>${t("qVersion")}</p>
        <div class="versions" id="versions"></div>
      </div>
      <div class="qblock">
        <p class="qtitle"><span class="n">3</span>${t("qRobot")}</p>
        <div class="robots" id="robots"></div>
      </div>
      <div class="qblock">
        <p class="qtitle"><span class="n">4</span>${t("qInit")}</p>
        <div class="initwrap">
          <input id="initInput" type="text" maxlength="30" placeholder="${t("initPh")}" value="${state.caption.replace(/"/g,'&quot;')}">
          <p class="hint">${t("initHint")}</p>
        </div>
      </div>
    </div>
    <button class="btn pop" id="make">✨ ${t("make")}</button>
  </section>`;

  const colors=document.getElementById("colors");
  THEMES.forEach(th=>{
    const s=document.createElement("div"); s.className="swatch"+(state.theme.id===th.id?" sel":"");
    s.style.background=th.hex; s.onclick=()=>{ state.theme=th; Wizard(); };
    colors.appendChild(s);
  });
  const versions=document.getElementById("versions");
  [["normal",t("verNormal"),"🤖"],["summer",t("verSummer"),"🏖️"]].forEach(([id,label,emo])=>{
    const d=document.createElement("div"); d.className="vercard"+(state.version===id?" sel":"");
    d.innerHTML=`<span class="emo">${emo}</span><span class="nm">${label}</span>`;
    d.onclick=()=>{ state.version=id; Wizard(); };
    versions.appendChild(d);
  });
  const robots=document.getElementById("robots");
  ROBOTS.forEach(r=>{
    const d=document.createElement("div"); d.className="robot"+(state.robot.id===r.id?" sel":"");
    const ill = `<img src="${robotProfile(r.id)}" alt="" onerror="this.style.display='none'">`;
    d.innerHTML=`<div class="ill">${ill}</div><div class="nm">${r.ko}<small>${r.en}</small></div>`;
    d.onclick=()=>{ state.robot=r; Wizard(); };
    robots.appendChild(d);
  });
  const init=document.getElementById("initInput");
  init.oninput=e=>{ state.caption=e.target.value.slice(0,30); e.target.value=state.caption; };
  document.getElementById("make").onclick=()=>{
    state._assetsP = prepareAssets();     // background + robot sticker, prepped during capture
    render("capture"); startCapture();
  };
}

/* ---------------- CAPTURE ---------------- */
function Capture(){
  app.innerHTML = `<section class="screen on">
    ${header()}
    <div class="stage">
      <video id="video" playsinline autoplay muted></video>
      <div class="shotchips" id="chips"></div>
      <div class="aibadge"><span class="dot"></span><span>${t("aiwatch")}</span></div>
      <div class="countdown" id="cd"></div>
      <div class="flash" id="flash"></div>
    </div>
    <p class="capnote" id="capnote">${t("allow")}</p>
  </section>`;
  const chips=document.getElementById("chips");
  for(let i=0;i<CONFIG.TOTAL_SHOTS;i++){ const s=document.createElement("span"); s.textContent=i+1; chips.appendChild(s); }
}
async function ensureFaceModel(){
  if(state.faceLandmarker || (state._tried && !state.faceReady)) return;
  state._tried=true;
  try{
    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12");
    const fileset = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm");
    state.faceLandmarker = await vision.FaceLandmarker.createFromOptions(fileset,{
      baseOptions:{ modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
      runningMode:"IMAGE", numFaces:2, outputFaceBlendshapes:true,
    });
    state.faceReady=true;
  }catch(e){ console.warn("FaceLandmarker unavailable — degrading gracefully.", e); state.faceReady=false; }
}
async function startCapture(){
  state.shots=[]; state.suggested=[]; state.picked=[];
  const video=document.getElementById("video");
  const note=document.getElementById("capnote");
  ensureFaceModel();
  try{
    state.stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"user", width:{ideal:1080}, height:{ideal:1440} }, audio:false });
    video.srcObject=state.stream; await video.play(); note.textContent=t("capNote");
  }catch(e){
    note.textContent = LANG==='ko' ? "카메라를 사용할 수 없어요. HTTPS 환경과 카메라 권한을 확인하세요." : "Camera unavailable. Check HTTPS and camera permission.";
    return;
  }
  await sleep(700);
  for(let i=0;i<CONFIG.TOTAL_SHOTS;i++){ await countdownAndShoot(video,i); }
  stopStream(); render("analyze"); runAnalysis();
}
function countdownAndShoot(video,idx){
  return new Promise(resolve=>{
    const cd=document.getElementById("cd"); let n=CONFIG.COUNTDOWN_SEC;
    const tick=()=>{
      cd.innerHTML=`<div class="cdnum">${n}</div>`;
      if(n<=0){
        cd.innerHTML="";
        document.getElementById("flash").classList.add("go");
        setTimeout(()=>document.getElementById("flash").classList.remove("go"),460);
        snap(video,idx); markChip(idx); resolve(); return;
      }
      n--; setTimeout(tick,1000);
    };
    tick();
  });
}
function markChip(i){ const s=document.getElementById("chips").children[i]; if(s) s.classList.add("done"); }
function snap(video,idx){
  const w=720,h=960; const c=document.createElement("canvas"); c.width=w; c.height=h; const ctx=c.getContext("2d");
  ctx.translate(w,0); ctx.scale(-1,1);
  const vw=video.videoWidth||w, vh=video.videoHeight||h;
  const r=Math.max(w/vw,h/vh), dw=vw*r, dh=vh*r;
  ctx.drawImage(video,(w-dw)/2,(h-dh)/2,dw,dh);
  state.shots[idx]={ dataURL:c.toDataURL("image/jpeg",0.9), canvas:c, score:0 };
}

/* ---------------- ANALYZE ---------------- */
function Analyze(){
  app.innerHTML=`<section class="screen on">${header()}
    <div class="analyzing"><div class="scanner"><div class="scanline"></div>${raimiSVG()}</div>
    <h1 style="font-size:24px" class="loaderdots">${t("analyzing")}</h1></div></section>`;
}
async function runAnalysis(){
  await ensureFaceModel();
  for(const shot of state.shots){
    if(!shot) continue;
    const sharp = sharpness(shot.canvas);
    let facePresent=0, eyesOpen=0.5, smile=0.3;
    if(state.faceReady && state.faceLandmarker){
      try{
        const res = state.faceLandmarker.detect(shot.canvas);
        if(res.faceLandmarks && res.faceLandmarks.length){
          facePresent=1;
          const bs=res.faceBlendshapes && res.faceBlendshapes[0];
          if(bs){ const get=n=>{ const c=bs.categories.find(x=>x.categoryName===n); return c?c.score:0; };
            eyesOpen = 1 - Math.max(get("eyeBlinkLeft"),get("eyeBlinkRight"));
            smile    = Math.max(get("mouthSmileLeft"),get("mouthSmileRight")); }
        }
      }catch(e){}
    }
    shot.score = 0.40*sharp + 0.25*facePresent + 0.20*eyesOpen + 0.15*Math.min(1,smile*1.6);
  }
  const order=state.shots.map((s,i)=>({i,score:s?s.score:-1})).sort((a,b)=>b.score-a.score);
  state.suggested = order.slice(0,CONFIG.PICK_COUNT).map(o=>o.i).sort((a,b)=>a-b);
  state.picked=[];  // AI 추천은 '표시'만, 자동 선택 안 함
  await sleep(900); render("select");
}
function sharpness(canvas){
  const s=160; const c=document.createElement("canvas"); c.width=s; c.height=s;
  const ctx=c.getContext("2d"); ctx.drawImage(canvas,0,0,s,s);
  const d=ctx.getImageData(0,0,s,s).data; const g=new Float32Array(s*s);
  for(let i=0;i<s*s;i++){ g[i]=0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2]; }
  let mean=0,n=0; const vals=[];
  for(let y=1;y<s-1;y++)for(let x=1;x<s-1;x++){ const i=y*s+x; const lap=g[i-1]+g[i+1]+g[i-s]+g[i+s]-4*g[i]; vals.push(lap); mean+=lap; n++; }
  mean/=n; let v=0; for(const x of vals) v+=(x-mean)*(x-mean); v/=n;
  return Math.min(1, v/600);
}

/* ---------------- SELECT (with live frame preview) ---------------- */
function Select(){
  app.innerHTML=`<section class="screen on">
    ${header()}
    <h1 style="font-size:24px">${t("selTitle")}</h1>
    <p class="lead" style="margin-top:6px">${t("selLead")}</p>
    <div class="selrow">
      <div class="selgrid"><div class="grid8" id="grid"></div></div>
      <div class="selpreview">
        <span class="plabel">${t("preview").toUpperCase()}</span>
        <canvas id="previewCanvas" width="320" height="480"></canvas>
      </div>
    </div>
    <div class="selbar">
      <span class="count" id="count"></span>
      <button class="btn primary grow" id="next" style="font-size:20px;padding:16px">${t("next")} ▶</button>
    </div>
  </section>`;
  const grid=document.getElementById("grid");
  state.shots.forEach((shot,i)=>{
    if(!shot) return;
    const d=document.createElement("div");
    d.className="thumb"+(state.picked.includes(i)?" sel":"");
    d.innerHTML=`<img src="${shot.dataURL}">
      ${state.suggested.includes(i)?`<span class="rec">★ ${t("rec")}</span>`:""}
      <span class="check">${state.picked.includes(i)?(state.picked.indexOf(i)+1):""}</span>`;
    d.onclick=()=>toggle(i);
    grid.appendChild(d);
  });
  updateCount();
  document.getElementById("next").onclick=()=>{ if(state.picked.length===CONFIG.PICK_COUNT) render_compose(); };
  refreshPreview();
}
function toggle(i){
  const at=state.picked.indexOf(i);
  if(at>=0) state.picked.splice(at,1);
  else { if(state.picked.length>=CONFIG.PICK_COUNT) return; state.picked.push(i); }
  Select();
}
function updateCount(){
  document.getElementById("count").textContent = `${state.picked.length} / ${CONFIG.PICK_COUNT} ${t("picked")}`;
  document.getElementById("next").disabled = state.picked.length!==CONFIG.PICK_COUNT;
}
async function refreshPreview(){
  const pc=document.getElementById("previewCanvas"); if(!pc) return;
  if(state._assetsP){ try{ await state._assetsP; }catch(e){} }
  const picks=[0,1,2,3].map(k=> state.picked[k]!=null ? state.shots[state.picked[k]] : null);
  const full=await composeFrame(picks);
  const ctx=pc.getContext("2d"); ctx.clearRect(0,0,pc.width,pc.height);
  ctx.drawImage(full,0,0,pc.width,pc.height);
}

/* ---------------- COMPOSE ---------------- */
const OUT_W=1080, OUT_H=1620;
async function prepareAssets(){
  await ensureFonts();   // 캔버스 텍스트용 웹폰트 로드
  // 선택된 버전의 1~4번 포즈를 컷마다 하나씩 쓰기 위해 모두 로드
  state._robotImgs = await Promise.all([1,2,3,4].map(i=>urlToImage(robotImgPath(state.robot.id, state.version, i))));
  state._logoImg   = await urlToImage(frameLogoPath(state.theme));
  const wl = await urlToImage(MUSEUM_LOGO_WHITE);   // 로고를 프레임 색(진한 톤)으로
  state._museumImg = wl ? tintImage(wl, deepThemeColor(state.theme.hex)) : await urlToImage(MUSEUM_LOGO);
  state._bgCanvas  = await buildBackgroundCanvas();
}
function robotImgForSlot(k){
  const imgs = state._robotImgs || [];
  return imgs[k] || imgs.find(Boolean) || null;
}
async function buildBackgroundCanvas(){
  const c=document.createElement("canvas"); c.width=OUT_W; c.height=OUT_H; const ctx=c.getContext("2d");
  if(CONFIG.AI_BACKGROUND_ENDPOINT){
    try{
      const res=await fetch(CONFIG.AI_BACKGROUND_ENDPOINT,{ method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ color:state.theme.hex, robot:state.robot.id, layout:state.layout }) });
      if(res.ok){ const j=await res.json(); const src=j.imageDataUrl||j.imageUrl;
        if(src){ const img=await urlToImage(src); if(img){ ctx.drawImage(img,0,0,OUT_W,OUT_H); return c; } } }
    }catch(e){ console.warn("AI background failed, procedural fallback.",e); }
  }
  proceduralBackground(ctx); return c;
}
function proceduralBackground(ctx){
  const base=state.theme.hex;
  const g=ctx.createLinearGradient(0,0,OUT_W,OUT_H);
  g.addColorStop(0, lighten(base,0.82)); g.addColorStop(1, lighten(base,0.55));
  ctx.fillStyle=g; ctx.fillRect(0,0,OUT_W,OUT_H);
  scatterDecor(ctx, base);   // 하트·꽃·반짝이 떠다니기
}
function scatterDecor(ctx, base){
  const kinds=["heart","flower","sparkle","dot","heart","flower"];
  for(let i=0;i<78;i++){
    const x=Math.random()*OUT_W, y=Math.random()*OUT_H, s=14+Math.random()*32;
    ctx.save();
    ctx.translate(x,y); ctx.rotate((Math.random()-0.5)*0.9);
    ctx.globalAlpha=0.10+Math.random()*0.16;
    ctx.fillStyle=Math.random()<0.45 ? "#ffffff" : base;
    const k=kinds[(Math.random()*kinds.length)|0];
    if(k==="heart") drawHeart(ctx,s);
    else if(k==="flower") drawFlower(ctx,s);
    else if(k==="sparkle") drawSparkle(ctx,s);
    else { ctx.beginPath(); ctx.arc(0,0,s*0.16,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
}
function drawHeart(ctx,s){
  const w=s, h=s;
  ctx.beginPath();
  ctx.moveTo(0,-h*0.15);
  ctx.bezierCurveTo(-w*0.5,-h*0.55,-w*0.5,h*0.12,0,h*0.45);
  ctx.bezierCurveTo(w*0.5,h*0.12,w*0.5,-h*0.55,0,-h*0.15);
  ctx.closePath(); ctx.fill();
}
function drawFlower(ctx,s){
  const pr=s*0.26, d=s*0.30;
  for(let i=0;i<5;i++){ const a=i*2*Math.PI/5; ctx.beginPath(); ctx.arc(Math.cos(a)*d, Math.sin(a)*d, pr, 0, Math.PI*2); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0,0,pr*0.75,0,Math.PI*2); ctx.fill();
}
function drawSparkle(ctx,s){
  const o=s*0.5, i=s*0.13;
  ctx.beginPath();
  ctx.moveTo(0,-o); ctx.lineTo(i,-i); ctx.lineTo(o,0); ctx.lineTo(i,i);
  ctx.lineTo(0,o); ctx.lineTo(-i,i); ctx.lineTo(-o,0); ctx.lineTo(-i,-i);
  ctx.closePath(); ctx.fill();
}
async function composeFrame(picks){
  const c=document.createElement("canvas"); c.width=OUT_W; c.height=OUT_H; const ctx=c.getContext("2d");
  if(state._bgCanvas) ctx.drawImage(state._bgCanvas,0,0); else proceduralBackground(ctx);

  const pad=60;
  const ink    = "#16233A";
  const subInk = "rgba(22,35,58,.60)";

  /* ---- 상단: 좌측 과학관 로고 · 우측 기념 날짜 · 가운데 RAIM ---- */
  const accent = deepThemeColor(state.theme.hex);   // 로고·날짜는 프레임 색의 진한 톤
  const mLogo = state._museumImg;
  if(mLogo){ const iw=mLogo.naturalWidth||mLogo.width, ih=mLogo.naturalHeight||mLogo.height, mH=70, mW=iw/ih*mH; ctx.drawImage(mLogo, pad, pad, mW, mH); }
  ctx.textAlign="right"; ctx.textBaseline="top"; ctx.fillStyle=accent;
  ctx.font="300 30px Pretendard, sans-serif"; ctx.fillText(kstDateStr(), OUT_W-pad, pad+14);

  const logo = state._logoImg;
  let headerBottom;
  if(logo){
    const lH=190, lW=logo.naturalWidth/logo.naturalHeight*lH, ly=pad+86;
    ctx.drawImage(logo, (OUT_W-lW)/2, ly, lW, lH);
    headerBottom = ly + lH;
  } else {
    ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillStyle=ink;
    ctx.font="800 80px Pretendard, sans-serif"; ctx.fillText("RAIM", OUT_W/2, pad+180);
    headerBottom = pad+210;
  }

  /* ---- 사진 영역 (2×2 그리드 고정) ---- */
  const footerH = state.caption ? 156 : 84;
  const top = headerBottom + 26, bottom = OUT_H - footerH - 6;
  const areaW=OUT_W-pad*2, areaH=bottom-top;
  const gap=24, sw=(areaW-gap)/2, sh=(areaH-gap)/2;
  const slots=[[pad,top,sw,sh],[pad+sw+gap,top,sw,sh],[pad,top+sh+gap,sw,sh],[pad+sw+gap,top+sh+gap,sw,sh]];
  for(let k=0;k<4;k++){ const [x,y,w,h]=slots[k];
    drawSlotPhoto(ctx, picks[k], x,y,w,h);
    if(picks[k]) drawRobotInSlot(ctx, robotImgForSlot(k), x,y,w,h);
  }

  /* ---- 하단: 손글씨 문구 + 과학관 명칭 ---- */
  if(state.caption){
    ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillStyle=ink;
    let fs=78; ctx.font=`${fs}px Ttobak, cursive`;
    const maxW=OUT_W-pad*2;
    while(ctx.measureText(state.caption).width>maxW && fs>30){ fs-=2; ctx.font=`${fs}px Ttobak, cursive`; }
    ctx.fillText(state.caption, OUT_W/2, OUT_H - 96);
  }
  ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillStyle=subInk;
  ctx.font="400 26px Pretendard, sans-serif";
  ctx.fillText(MUSEUM_TEXT, OUT_W/2, OUT_H - 40);
  return c;
}
/* 로봇 포즈를 각 사진의 오른쪽 하단에 배치 (기본 배치) */
function drawRobotInSlot(ctx, img, x,y,w,h){
  if(!img || !img.naturalWidth) return;
  const boxW = w*0.50, boxH = h*0.46, margin = Math.min(w,h)*0.02;
  const r = Math.min(boxW/img.naturalWidth, boxH/img.naturalHeight);
  const dw = img.naturalWidth*r, dh = img.naturalHeight*r;
  const px = x + w - dw - margin, py = y + h - dh - margin;
  ctx.save();
  ctx.shadowColor="rgba(0,0,0,.28)"; ctx.shadowBlur=18; ctx.shadowOffsetY=6;
  ctx.drawImage(img, px, py, dw, dh);
  ctx.restore();
}
function drawSlotPhoto(ctx, shot, x,y,w,h){
  roundRect(ctx,x,y,w,h,18); ctx.save(); ctx.clip();
  if(shot && shot.canvas){
    const iw=shot.canvas.width, ih=shot.canvas.height, r=Math.max(w/iw,h/ih), dw=iw*r, dh=ih*r;
    ctx.drawImage(shot.canvas, x+(w-dw)/2, y+(h-dh)/2, dw, dh);
  } else {
    ctx.fillStyle="rgba(22,35,58,.08)"; ctx.fillRect(x,y,w,h);
    ctx.fillStyle="rgba(22,35,58,.28)"; ctx.font="800 56px Pretendard, sans-serif"; ctx.textAlign="center";
    ctx.fillText("?", x+w/2, y+h/2+18);
  }
  ctx.restore();
  roundRect(ctx,x,y,w,h,18); ctx.lineWidth=6; ctx.strokeStyle="#fff"; ctx.stroke();
}
/* ---------------- RESULT ---------------- */
async function render_compose(){
  app.innerHTML=`<section class="screen on">${header()}
    <div class="analyzing"><div class="scanner"><div class="scanline"></div>${robotSVG(state.robot.color)}</div>
    <h1 style="font-size:24px" class="loaderdots">${t("composing")}</h1></div></section>`;
  if(state._assetsP) { try{ await state._assetsP; }catch(e){} }
  state._finalCanvas = await composeFrame(state.picked.map(i=>state.shots[i]));
  render("result");
}
function Result(){
  app.innerHTML=`<section class="screen on">
    ${header()}
    <h1 style="font-size:28px">🎉 ${t("resultTitle")}</h1>
    <div class="resultrow">
      <div class="resultphoto"><canvas id="resultCanvas"></canvas></div>
      <div class="qrcard" id="qrcard">
        <div id="qrbox"><div class="loaderdots"></div></div>
        <div class="qtxt"><b id="qrtitle">${t("qrTitle")}</b><p id="qrlead">${t("qrLead")}</p><p class="qrexpire" id="qrexpire">${t("qrExpire")}</p></div>
      </div>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn primary grow" id="retake">↻ ${t("retake")}</button>
    </div>
  </section>`;
  const rc=document.getElementById("resultCanvas"), fc=state._finalCanvas;
  rc.width=fc.width; rc.height=fc.height; rc.getContext("2d").drawImage(fc,0,0);
  document.getElementById("retake").onclick=()=>{ resetState(); render("start"); };
  buildQR(fc);
}
async function buildQR(canvas){
  const box=document.getElementById("qrbox"), card=document.getElementById("qrcard");
  const expire=document.getElementById("qrexpire");
  if(!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY){
    card.classList.add("err"); box.innerHTML="⚠️"; if(expire) expire.style.display="none";
    document.getElementById("qrtitle").textContent = LANG==='ko'?"QR 미설정":"QR not configured";
    const lead=document.getElementById("qrlead"); lead.style.whiteSpace="pre-line"; lead.textContent=t("qrNoStore"); return;
  }
  try{
    const url = await uploadToSupabase(canvas);
    const finalUrl = CONFIG.VIEWER_BASE ? `${CONFIG.VIEWER_BASE}?img=${encodeURIComponent(url)}` : url;
    box.innerHTML=""; await ensureQRLib();
    new window.QRCode(box,{ text:finalUrl, width:184, height:184, colorDark:"#16233A", colorLight:"#ffffff", correctLevel:window.QRCode.CorrectLevel.M });
  }catch(e){ console.error(e); card.classList.add("err"); box.innerHTML="⚠️"; if(expire) expire.style.display="none";
    document.getElementById("qrlead").textContent = LANG==='ko' ? "업로드에 실패했어요. 네트워크/버킷 설정을 확인하세요." : "Upload failed. Check network/bucket settings."; }
}
async function uploadToSupabase(canvas){
  const blob=await new Promise(r=>canvas.toBlob(r,"image/jpeg",0.9));
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
  const sb=createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  const path=`${new Date().toISOString().slice(0,10)}/${Date.now()}.jpg`;
  const { error } = await sb.storage.from(CONFIG.SUPABASE_BUCKET).upload(path, blob, { contentType:"image/jpeg", upsert:false });
  if(error) throw error;
  // 2시간(LINK_EXPIRE_SEC) 뒤 만료되는 서명 URL — 시간이 지나면 링크가 열리지 않음
  const { data, error: signErr } = await sb.storage.from(CONFIG.SUPABASE_BUCKET).createSignedUrl(path, CONFIG.LINK_EXPIRE_SEC);
  if(signErr) throw signErr;
  return data.signedUrl;
}
let _qrLoaded=false;
function ensureQRLib(){
  if(_qrLoaded && window.QRCode) return Promise.resolve();
  return new Promise((res,rej)=>{ const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload=()=>{ _qrLoaded=true; res(); }; s.onerror=rej; document.head.appendChild(s); });
}

/* ============================================================ helpers ============================================================ */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function stopStream(){ if(state.stream){ state.stream.getTracks().forEach(t=>t.stop()); state.stream=null; } }
function resetState(){ stopStream(); state.shots=[]; state.suggested=[]; state.picked=[]; state.caption=""; state._bgCanvas=null; state._robotImgs=[]; state._logoImg=null; state._museumImg=null; state._assetsP=null; }
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function urlToImage(src){ return new Promise(res=>{ const img=new Image(); img.crossOrigin="anonymous"; img.onload=()=>res(img); img.onerror=()=>res(null); img.src=src; }); }
function lighten(hex,amt){ const n=parseInt(hex.slice(1),16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.round(r+(255-r)*amt); g=Math.round(g+(255-g)*amt); b=Math.round(b+(255-b)*amt); return `rgb(${r},${g},${b})`; }

render("start");
