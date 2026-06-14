/* ============================================================ CONFIG ============================================================ */
const CONFIG = {
  SUPABASE_URL:        "",
  SUPABASE_ANON_KEY:   "",
  SUPABASE_BUCKET:     "fourcut",
  VIEWER_BASE:         "",
  AI_BACKGROUND_ENDPOINT: "",
  COUNTDOWN_SEC: 3,
  TOTAL_SHOTS:   6,
  PICK_COUNT:    4,
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
  { id:"tomato",  hex:"#FF6B5C", logo:"red"    }, { id:"sun",   hex:"#FFC23C", logo:"yellow" },
  { id:"mint",    hex:"#1AB2C8", logo:"green"  }, { id:"laven", hex:"#9B8CFF", logo:"purple" },
  { id:"coral",   hex:"#FF8FB1", logo:"pink"   }, { id:"night", hex:"#2D3B57", logo:"navy"   },
];
const MUSEUM_LOGO = "assets/seoulraim_logo.png";
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
    qInit:"나만의 문구", qLayout:"사진 배치를 골라요",
    qVersion:"로봇 버전을 골라요", verNormal:"일반", verSummer:"여름",
    layGrid:"2×2 그리드", layStrip:"세로 4컷",
    initPh:"예: 우리 가족 ♥ / RAIM", initHint:"이름·문구 자유롭게 (한글/영문). 30자 이내, 비워둬도 돼요.",
    make:"프레임 완성! 촬영하기 ▶",
    composing:"프레임에 사진을 담는 중",
    resultTitle:"완성!", retake:"처음부터",
    download:"이미지 저장", qrTitle:"QR로 받아가세요",
    qrLead:"휴대폰 카메라로 QR을 비추면 사진을 받을 수 있어요.",
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
    qInit:"Your message", qLayout:"Pick a photo layout",
    qVersion:"Pick a robot version", verNormal:"Normal", verSummer:"Summer",
    layGrid:"2×2 grid", layStrip:"Vertical strip",
    initPh:"e.g. Our family ♥ / RAIM", initHint:"Any name or phrase (KO/EN). Up to 30 chars, optional.",
    make:"Frame ready! Start shooting ▶",
    composing:"Placing photos in your frame",
    resultTitle:"Done!", retake:"Start over",
    download:"Save image", qrTitle:"Scan the QR to keep it",
    qrLead:"Point your phone camera at the QR to get your photo.",
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
/* layout example diagrams */
function layoutExampleSVG(kind, color){
  const f="#cfd9e8", line="#16233A";
  if(kind==="grid"){
    return `<svg viewBox="0 0 84 116" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="80" height="112" rx="10" fill="#fff" stroke="${color}" stroke-width="3"/>
      <rect x="14" y="12" width="56" height="6" rx="3" fill="${line}"/>
      <rect x="12" y="26" width="28" height="34" rx="4" fill="${f}"/><rect x="44" y="26" width="28" height="34" rx="4" fill="${f}"/>
      <rect x="12" y="64" width="28" height="34" rx="4" fill="${f}"/><rect x="44" y="64" width="28" height="34" rx="4" fill="${f}"/>
      <circle cx="64" cy="106" r="5" fill="${color}"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 84 116" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="80" height="112" rx="10" fill="#fff" stroke="${color}" stroke-width="3"/>
    <rect x="14" y="10" width="56" height="5" rx="2.5" fill="${line}"/>
    <rect x="14" y="20" width="56" height="18" rx="4" fill="${f}"/>
    <rect x="14" y="41" width="56" height="18" rx="4" fill="${f}"/>
    <rect x="14" y="62" width="56" height="18" rx="4" fill="${f}"/>
    <rect x="14" y="83" width="56" height="18" rx="4" fill="${f}"/>
    <circle cx="64" cy="108" r="4.5" fill="${color}"/>
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
  app.innerHTML = `<section class="screen on">
    ${header()}
    <div class="hero">
      <div class="heroart"><div class="ring"></div><div class="face">${raimiSVG()}</div></div>
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
      <div class="qblock">
        <p class="qtitle"><span class="n">5</span>${t("qLayout")}</p>
        <div class="layouts" id="layouts"></div>
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
  const layouts=document.getElementById("layouts");
  [["grid",t("layGrid")],["strip",t("layStrip")]].forEach(([id,label])=>{
    const d=document.createElement("div"); d.className="layoutcard"+(state.layout===id?" sel":"");
    d.innerHTML=`<div class="ex">${layoutExampleSVG(id, state.theme.hex)}</div><div class="nm">${label}</div>`;
    d.onclick=()=>{ state.layout=id; Wizard(); };
    layouts.appendChild(d);
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
  state.shots[idx]={ dataURL:c.toDataURL("image/jpeg",0.9), canvas:c, faceCenter:null, score:0, parts:{} };
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
          const lm=res.faceLandmarks[0]; let mnx=1,mxx=0,mny=1,mxy=0;
          for(const p of lm){ mnx=Math.min(mnx,p.x); mxx=Math.max(mxx,p.x); mny=Math.min(mny,p.y); mxy=Math.max(mxy,p.y); }
          shot.faceCenter={ x:(mnx+mxx)/2, y:(mny+mxy)/2 };
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
  // 선택된 버전의 1~4번 포즈를 컷마다 하나씩 쓰기 위해 모두 로드
  state._robotImgs = await Promise.all([1,2,3,4].map(i=>urlToImage(robotImgPath(state.robot.id, state.version, i))));
  state._logoImg   = await urlToImage(frameLogoPath(state.theme));
  state._museumImg = await urlToImage(MUSEUM_LOGO);
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
  g.addColorStop(0, lighten(base,0.78)); g.addColorStop(1, lighten(base,0.55));
  ctx.fillStyle=g; ctx.fillRect(0,0,OUT_W,OUT_H);
  ctx.fillStyle=hexToRgba(base,0.18);
  for(let i=0;i<120;i++){ const x=Math.random()*OUT_W, y=Math.random()*OUT_H, r=2+Math.random()*7; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
}
async function composeFrame(picks){
  const c=document.createElement("canvas"); c.width=OUT_W; c.height=OUT_H; const ctx=c.getContext("2d");
  if(state._bgCanvas) ctx.drawImage(state._bgCanvas,0,0); else proceduralBackground(ctx);

  const pad=60, footerH = state.caption ? 120 : 70;

  /* ---- 상단: 좌측 과학관 로고 + 색상별 frame-logo 배너 ---- */
  const mLogo = state._museumImg;
  const mH = 132, mW = mLogo ? mLogo.naturalWidth/mLogo.naturalHeight*mH : 0;
  const gapH = mLogo ? 22 : 0;
  const bannerX = pad + (mLogo? mW+gapH : 0);
  const bannerW = OUT_W - pad - bannerX;
  const logo = state._logoImg;
  const bannerH = logo ? Math.min(bannerW * logo.naturalHeight/logo.naturalWidth, 250) : 96;
  const headerH = Math.max(mH, bannerH);
  if(logo){
    const bh = bannerW * logo.naturalHeight/logo.naturalWidth;
    const by = pad + (headerH - Math.min(bh,250))/2, bH = Math.min(bh,250);
    roundRect(ctx, bannerX, by, bannerW, bH, 22); ctx.save(); ctx.clip();
    ctx.drawImage(logo, bannerX, by, bannerW, bH); ctx.restore();
  } else {
    ctx.textAlign="center"; ctx.fillStyle="#16233A"; ctx.font="64px Jua, sans-serif";
    ctx.fillText("RAIM 네컷", OUT_W/2, pad+64);
  }
  if(mLogo) ctx.drawImage(mLogo, pad, pad + (headerH-mH)/2, mW, mH);

  const top = pad + headerH + 18, bottom = OUT_H - footerH - 10;
  const areaW=OUT_W-pad*2, areaH=bottom-top;

  let slots;
  if(state.layout==="grid"){
    const gap=24, sw=(areaW-gap)/2, sh=(areaH-gap)/2;
    slots=[[pad,top,sw,sh],[pad+sw+gap,top,sw,sh],[pad,top+sh+gap,sw,sh],[pad+sw+gap,top+sh+gap,sw,sh]];
  } else {
    const gap=20, sh=(areaH-gap*3)/4, sw=areaW;
    slots=[0,1,2,3].map(k=>[pad,top+k*(sh+gap),sw,sh]);
  }
  for(let k=0;k<4;k++){ const [x,y,w,h]=slots[k];
    drawSlotPhoto(ctx, picks[k], x,y,w,h);
    if(picks[k]) drawRobotInSlot(ctx, robotImgForSlot(k), x,y,w,h);
  }

  /* ---- 하단: 나만의 문구 ---- */
  if(state.caption){
    ctx.textAlign="center"; ctx.textBaseline="alphabetic"; ctx.fillStyle="#16233A";
    let fs=58; ctx.font=`${fs}px Jua, sans-serif`;
    const maxW = OUT_W - pad*2;
    while(ctx.measureText(state.caption).width > maxW && fs>22){ fs-=2; ctx.font=`${fs}px Jua, sans-serif`; }
    ctx.fillText(state.caption, OUT_W/2, OUT_H - footerH + footerH*0.62);
  }
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
    ctx.fillStyle="rgba(22,35,58,.28)"; ctx.font="56px Jua, sans-serif"; ctx.textAlign="center";
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
    <div class="resultwrap">
      <canvas id="resultCanvas"></canvas>
      <div class="qrcard" id="qrcard">
        <div id="qrbox"><div class="loaderdots"></div></div>
        <div class="qtxt"><b id="qrtitle">${t("qrTitle")}</b><p id="qrlead">${t("qrLead")}</p></div>
      </div>
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn ghost grow" id="download">⬇︎ ${t("download")}</button>
      <button class="btn primary grow" id="retake">↻ ${t("retake")}</button>
    </div>
  </section>`;
  const rc=document.getElementById("resultCanvas"), fc=state._finalCanvas;
  rc.width=fc.width; rc.height=fc.height; rc.getContext("2d").drawImage(fc,0,0);
  document.getElementById("download").onclick=()=>{ const a=document.createElement("a");
    a.download=`raimi-4cut-${Date.now()}.jpg`; a.href=fc.toDataURL("image/jpeg",0.92); a.click(); };
  document.getElementById("retake").onclick=()=>{ resetState(); render("start"); };
  buildQR(fc);
}
async function buildQR(canvas){
  const box=document.getElementById("qrbox"), card=document.getElementById("qrcard");
  if(!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY){
    card.classList.add("err"); box.innerHTML="⚠️";
    document.getElementById("qrtitle").textContent = LANG==='ko'?"QR 미설정":"QR not configured";
    const lead=document.getElementById("qrlead"); lead.style.whiteSpace="pre-line"; lead.textContent=t("qrNoStore"); return;
  }
  try{
    const url = await uploadToSupabase(canvas);
    const finalUrl = CONFIG.VIEWER_BASE ? `${CONFIG.VIEWER_BASE}?img=${encodeURIComponent(url)}` : url;
    box.innerHTML=""; await ensureQRLib();
    new window.QRCode(box,{ text:finalUrl, width:120, height:120, colorDark:"#16233A", colorLight:"#ffffff", correctLevel:window.QRCode.CorrectLevel.M });
  }catch(e){ console.error(e); card.classList.add("err"); box.innerHTML="⚠️";
    document.getElementById("qrlead").textContent = LANG==='ko' ? "업로드에 실패했어요. 네트워크/버킷 설정을 확인하세요." : "Upload failed. Check network/bucket settings."; }
}
async function uploadToSupabase(canvas){
  const blob=await new Promise(r=>canvas.toBlob(r,"image/jpeg",0.9));
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
  const sb=createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  const path=`fourcut/${new Date().toISOString().slice(0,10)}/${Date.now()}.jpg`;
  const { error } = await sb.storage.from(CONFIG.SUPABASE_BUCKET).upload(path, blob, { contentType:"image/jpeg", upsert:false });
  if(error) throw error;
  const { data } = sb.storage.from(CONFIG.SUPABASE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
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
const dist=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
function stopStream(){ if(state.stream){ state.stream.getTracks().forEach(t=>t.stop()); state.stream=null; } }
function resetState(){ stopStream(); state.shots=[]; state.suggested=[]; state.picked=[]; state.caption=""; state._bgCanvas=null; state._robotImgs=[]; state._logoImg=null; state._museumImg=null; state._assetsP=null; }
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function svgToImage(svg,w,h){ return new Promise(res=>{ const blob=new Blob([svg],{type:"image/svg+xml"}); const url=URL.createObjectURL(blob);
  const img=new Image(); img.onload=()=>{ URL.revokeObjectURL(url); res(img); }; img.onerror=()=>res(null); img.src=url; }); }
function urlToImage(src){ return new Promise(res=>{ const img=new Image(); img.crossOrigin="anonymous"; img.onload=()=>res(img); img.onerror=()=>res(null); img.src=src; }); }
function hexToRgba(hex,a){ const n=parseInt(hex.slice(1),16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }
function lighten(hex,amt){ const n=parseInt(hex.slice(1),16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.round(r+(255-r)*amt); g=Math.round(g+(255-g)*amt); b=Math.round(b+(255-b)*amt); return `rgb(${r},${g},${b})`; }

render("start");
