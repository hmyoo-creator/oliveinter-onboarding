/* 페이지를 그리는 코드예요. 문구 수정은 content 폴더에서 해주세요. */
(function () {
  var root = document.getElementById("app");
  var C = window.COMMON, T = window.TRACK;

  if (!C || !T) {
    var which = !C ? "content/common.js" : "content/" + (document.body.dataset.track || "") + ".js";
    root.innerHTML = '<div class="wrap"><div class="error"><strong>페이지를 불러오지 못했어요.</strong><br>' + which +
      ' 파일에 쉼표나 따옴표가 빠진 곳이 없는지 확인해주세요.</div></div>';
    return;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // [글자](주소) 링크, **굵게**, 줄바꿈(\n) 처리
  function fmt(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g, function (m, t, u) {
        return '<a href="' + u + '"' + (u.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"') + ">" + t + "</a>";
      })
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }
  function list(a) { return Array.isArray(a) ? a : []; }
  function head(title, desc) {
    return "<h2>" + fmt(title) + "</h2>" + (desc ? '<p class="desc">' + fmt(desc) + "</p>" : "");
  }

  var h = [];
  var tel = String(C.연락처 || "").replace(/[^0-9+]/g, "");

  // 상단
  h.push('<div class="wrap"><div class="top">',
    '<img class="logo" src="../assets/logo.png" alt="OLIVE INTERNATIONAL" width="451" height="150">',
    '<p class="track">' + esc(C.라벨) + "</p>",
    "<h1>" + fmt(C.제목) + "</h1>",
    '<p class="intro">' + fmt(C.인사말) + "</p>",
    C.문의_안내 ? '<p class="intro small-intro">' + fmt(C.문의_안내) + "</p>" : "",
    C.팀메일 ? '<p class="mail"><a class="act" href="mailto:' + esc(C.팀메일) + '">' + esc(C.팀메일) + "</a></p>" : "",
    "</div></div>");

  // 바로가기
  h.push('<nav class="jump wrap" aria-label="바로가기">',
    '<a href="#location">' + esc(C.오시는길_제목) + "</a>",
    '<a href="#basics">' + esc(C.기본정보_제목) + "</a>",
    '<a href="#benefits">' + esc(C.복지_제목) + "</a>",
    '<a href="#prep">준비물</a>',
    "</nav>");

  h.push('<main class="wrap">');

  // 오시는 길
  h.push('<section id="location">' + head(C.오시는길_제목, C.오시는길_설명),
    '<p class="addr">' + esc(C.주소) + "</p>",
    '<div class="actions">',
    C.네이버지도_링크 ? '<a class="act" href="' + esc(C.네이버지도_링크) + '" target="_blank" rel="noopener">네이버 지도</a>' : "",
    C.카카오맵_링크 ? '<a class="act" href="' + esc(C.카카오맵_링크) + '" target="_blank" rel="noopener">카카오맵</a>' : "",
    '<button class="act" type="button" data-copy="' + esc(C.주소) + '">주소 복사</button>',
    "</div>");
  h.push('<ol class="seq">');
  list(C.오시는길_안내).forEach(function (x) { h.push("<li><span>" + fmt(x) + "</span></li>"); });
  h.push("</ol>");
  h.push('<div class="pics">',
    '<figure><img src="../assets/map.jpg" alt="강남역 8번 출구에서 그레이츠 강남까지 가는 길" width="1137" height="811"><figcaption class="cap">' + esc(C.지도_설명) + "</figcaption></figure>",
    '<figure><img src="../assets/elevator.jpg" alt="' + esc(C.엘리베이터_사진설명) + '" width="800" height="1065"><figcaption class="cap">' + esc(C.엘리베이터_사진설명) + "</figcaption></figure>",
    "</div>");
  h.push('<div class="callout"><div><div class="lbl">' + esc(C.연락처_이름) + '</div><div class="num">' + esc(C.연락처) + "</div></div>",
    '<div class="actions"><a class="act" href="tel:' + tel + '">전화하기</a>',
    '<button class="act" type="button" data-copy="' + esc(C.연락처) + '">번호 복사</button></div></div>');
  h.push("</section>");

  // 기본 정보
  var over = T.기본정보_변경 || {};
  h.push('<section id="basics">' + head(C.기본정보_제목, C.기본정보_설명) + '<dl class="kv">');
  list(C.기본정보).forEach(function (r) {
    var text = Object.prototype.hasOwnProperty.call(over, r[0]) ? over[r[0]] : r[1];
    if (text) h.push("<div><dt>" + esc(r[0]) + "</dt><dd>" + fmt(text) + "</dd></div>");
  });
  h.push("</dl></section>");

  // 복지
  var group = T.구분 || "정규직";
  var perks = list(C.복지).filter(function (b) { return !b.대상 || b.대상 === "전체" || b.대상 === group; });
  h.push('<section id="benefits">' + head(C.복지_제목, C.복지_설명) + '<ul class="perks">');
  perks.forEach(function (b) { h.push("<li><h3>" + fmt(b.이름) + "</h3><p>" + fmt(b.설명) + "</p></li>"); });
  h.push("</ul></section>");

  // 준비물
  h.push('<section id="prep">' + head(C.준비물_제목, C.준비물_설명) + '<ul class="checks">');
  list(C.준비물).forEach(function (x) { h.push("<li>" + fmt(x) + "</li>"); });
  h.push("</ul></section>");

  // 온보딩 미리보기
  if (C.온보딩_링크) {
    h.push('<section id="onboarding"><div class="promo">' + head(C.온보딩_제목, C.온보딩_설명),
      '<a class="act promo-btn" href="' + esc(C.온보딩_링크) + '" target="_blank" rel="noopener">' + esc(C.온보딩_버튼) + " →</a>",
      "</div></section>");
  }

  // 하단
  h.push('<footer class="closing"><p class="bye">' + fmt(C.마무리) + "</p><p>" + fmt(C.서명) + "</p></footer></main>");
  h.push('<div class="toast" id="toast" role="status" aria-live="polite"></div>');

  root.innerHTML = h.join("");

  // 복사 버튼
  var toast = document.getElementById("toast"), timer;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("show"); }, 1800); }
  root.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      try { navigator.clipboard.writeText(v).then(function () { say("복사했어요"); }, function () { say(v); }); }
      catch (e) { say(v); }
    });
  });
})();
