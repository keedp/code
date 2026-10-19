/* 答题系统 —— 核心逻辑
 * 无依赖、无需联网，数据全部保存在本机浏览器 localStorage。
 */
(function () {
  'use strict';

  /* ================= 常量 ================= */
  var STORE_NAME = 'quiz_system_name_v1';
  var STORE_HISTORY = 'quiz_system_history_v1';
  var HISTORY_MAX = 60;

  /* ================= 工具 ================= */
  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return h > 0 ? h + ':' + pad2(m) + ':' + pad2(s) : pad2(m) + ':' + pad2(s);
  }

  function fmtDateTime(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) +
      ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function letterAt(i) { return String.fromCharCode(65 + i); }

  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 忽略配额错误 */ }
  }

  function scrollTopSmooth() {
    try {
      if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) { /* 某些环境不支持，忽略 */ }
  }

  /* ================= 题库解析 ================= */
  function normType(t) {
    var s = String(t == null ? '' : t).trim().toLowerCase();
    if (!s) return '';
    if (/^(single|radio|单选|单选题|单项选择)$/.test(s)) return 'single';
    if (/^(multiple|multi|checkbox|多选|多选题|多项选择)$/.test(s)) return 'multiple';
    if (/^(judge|boolean|tf|判断|判断题|是非|是非题)$/.test(s)) return 'judge';
    return '';
  }

  function toBool(v) {
    if (typeof v === 'boolean') return v;
    var s = String(v == null ? '' : v).trim().toLowerCase();
    if (!s) return null;
    if (['true', 't', '1', '对', '正确', '√', '是', 'y', 'yes', 'v'].indexOf(s) >= 0) return true;
    if (['false', 'f', '0', '错', '错误', '×', 'x', '否', 'n', 'no'].indexOf(s) >= 0) return false;
    return null;
  }

  function lettersOf(v) {
    if (Array.isArray(v)) {
      return v.map(function (x) { return String(x == null ? '' : x).trim().toUpperCase(); })
        .filter(function (x) { return x; });
    }
    var s = String(v == null ? '' : v).toUpperCase();
    return (s.match(/[A-Z]/g) || []);
  }

  /* 选项自带 "A. xxx" 前缀且顺序正确时，去掉前缀 */
  function stripLabels(opts) {
    var re = /^\s*([A-Za-z])\s*[\.、．\)）:：]\s*/;
    var ms = opts.map(function (o) { return o.match(re); });
    if (ms.length < 2 || ms.some(function (m) { return !m; })) return opts;
    var ok = ms.every(function (m, i) { return m[1].toUpperCase().charCodeAt(0) === 65 + i; });
    if (!ok) return opts;
    return opts.map(function (o) { return o.replace(re, '').trim(); });
  }

  function buildQuestion(raw, group, idx) {
    var q = {
      no: idx + 1,
      group: group || '未分组',
      stem: '',
      type: 'single',
      options: [],
      answer: [],
      analysis: '',
      issues: [],
      warns: []
    };
    if (!raw || typeof raw !== 'object') {
      q.issues.push('题目不是对象');
      q.stem = '（无法解析的题目）';
      return q;
    }

    q.stem = String(raw.stem != null ? raw.stem : (raw.title != null ? raw.title : (raw.question != null ? raw.question : ''))).trim();
    if (!q.stem) q.issues.push('题干为空');

    var ana = raw.analysis != null ? raw.analysis : (raw.explain != null ? raw.explain : raw.explanation);
    q.analysis = String(ana == null ? '' : ana).trim();

    var rawOpts = Array.isArray(raw.options) ? raw.options
      : (Array.isArray(raw.choices) ? raw.choices : []);
    var explicitType = normType(raw.type);
    var noOpts = rawOpts.length === 0;
    var isJudge = explicitType === 'judge' ||
      (noOpts && explicitType !== 'single' && explicitType !== 'multiple');

    if (isJudge) {
      q.type = 'judge';
      var b = toBool(raw.answer);
      if (b === null) q.issues.push('判断题答案无法识别（应写 true/false 或 对/错）');
      else q.answer = [b ? 'T' : 'F'];
      q.options = [{ key: 'T', text: '正确' }, { key: 'F', text: '错误' }];
      return q;
    }

    var opts = stripLabels(rawOpts.map(function (o) { return String(o == null ? '' : o).trim(); })
      .filter(function (t) { return t !== ''; }));
    if (opts.length < 2) q.issues.push('选项少于 2 个');
    q.options = opts.map(function (text, i) { return { key: letterAt(i), text: text }; });

    var letters = lettersOf(raw.answer);
    var inRange = letters.filter(function (L) {
      var c = L.charCodeAt(0) - 65;
      return c >= 0 && c < q.options.length;
    });
    var uniq = [];
    inRange.forEach(function (L) { if (uniq.indexOf(L) < 0) uniq.push(L); });
    uniq.sort();

    if (!uniq.length) q.issues.push('答案无法识别或超出选项范围');
    q.answer = uniq;

    q.type = explicitType || (uniq.length > 1 ? 'multiple' : 'single');
    if (q.type === 'single' && uniq.length > 1) q.issues.push('标为单选，但答案有多个字母');
    if (q.type === 'multiple' && uniq.length === 1) q.issues.push('标为多选，但答案只有 1 个字母');
    if (q.type === 'multiple' && uniq.length === q.options.length) {
      q.warns.push('多选答案覆盖了全部选项，请确认不是漏选');
    }

    return q;
  }

  function parseBank(raw) {
    var out = { questions: [], groups: [], problems: [] };
    if (!Array.isArray(raw)) {
      out.problems.push({ level: 'bad', msg: '题库文件里没有找到 window.QUIZ_BANK 数组' });
      return out;
    }

    raw.forEach(function (entry, gi) {
      if (entry && Array.isArray(entry.questions)) {
        var gname = String(entry.group != null ? entry.group : ('题组 ' + (gi + 1))).trim() || ('题组 ' + (gi + 1));
        entry.questions.forEach(function (q) {
          out.questions.push(buildQuestion(q, gname, out.questions.length));
        });
      } else if (entry && typeof entry === 'object') {
        out.questions.push(buildQuestion(entry, '未分组', out.questions.length));
      }
    });

    var seen = {};
    out.questions.forEach(function (q) {
      if (seen[q.group] == null) seen[q.group] = 0;
      seen[q.group] += 1;
    });
    out.groups = Object.keys(seen).map(function (g) { return { name: g, count: seen[g] }; });

    return out;
  }

  /* ================= 全局状态 ================= */
  var state = {
    bank: { questions: [], groups: [], problems: [] },
    session: null,
    timerId: null
  };

  /* ================= 首页 ================= */
  function renderHome() {
    var total = state.bank.questions.length;
    var gcount = state.bank.groups.length;
    var summary = $('home-summary');

    if (total === 0) {
      summary.textContent = '题库里还没有题目。把题目写进 questions.js 后刷新本页即可。';
    } else {
      summary.textContent = '题库共 ' + total + ' 题，分 ' + gcount + ' 个题组。';
    }

    var sel = $('select-scope');
    sel.innerHTML = '';
    var allOpt = el('option', null, '全部题目（' + total + ' 题）');
    allOpt.value = '__ALL__';
    sel.appendChild(allOpt);

    state.bank.groups.forEach(function (g) {
      var o = el('option', null, g.name + '（' + g.count + ' 题）');
      o.value = g.name;
      sel.appendChild(o);
    });

    var countInput = $('input-count');
    countInput.value = String(Math.min(10, Math.max(1, total)));
    countInput.max = String(Math.max(1, total));
    countInput.disabled = total === 0;
    $('btn-start').disabled = total === 0;

    var lastName = '';
    try { lastName = localStorage.getItem(STORE_NAME) || ''; } catch (e) { /* 忽略 */ }
    if (lastName) $('input-name').value = lastName;

    updateCountMax();
  }

  function updateCountMax() {
    var pool = poolFor($('select-scope').value);
    var input = $('input-count');
    var max = Math.max(1, pool.length);
    input.max = String(max);
    var v = parseInt(input.value, 10);
    if (!v || v < 1) input.value = String(Math.min(10, max));
    else if (v > max) input.value = String(max);
  }

  function poolFor(scope) {
    if (!scope || scope === '__ALL__') return state.bank.questions;
    return state.bank.questions.filter(function (q) { return q.group === scope; });
  }

  /* ================= 组卷 ================= */
  function startSession(items, cfg) {
    var session = {
      name: cfg.name || '匿名考生',
      mode: cfg.mode || 'practice',
      scopeLabel: cfg.scopeLabel || '全部题目',
      items: items,
      responses: items.map(function () {
        return { selected: new Set(), checked: false, correct: null };
      }),
      index: 0,
      startedAt: Date.now(),
      endedAt: null
    };
    state.session = session;

    $('quiz-mode-tag').textContent = session.mode === 'practice' ? '练习' : '考试';
    $('progress-total').textContent = String(session.items.length);
    $('quiz-elapsed').textContent = '00:00';

    showScreen('quiz');
    renderQuestion();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    var t0 = state.session.startedAt;
    state.timerId = setInterval(function () {
      if (!state.session || state.session.endedAt) return;
      $('quiz-elapsed').textContent = fmtClock((Date.now() - t0) / 1000);
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function onStart() {
    var total = state.bank.questions.length;
    if (total === 0) return;

    var name = $('input-name').value.trim();
    try { localStorage.setItem(STORE_NAME, name); } catch (e) { /* 忽略 */ }

    var scope = $('select-scope').value;
    var pool = poolFor(scope);
    var want = parseInt($('input-count').value, 10) || pool.length;
    want = Math.max(1, Math.min(want, pool.length));

    var picked;
    if ($('chk-shuffle-questions').checked) picked = shuffle(pool).slice(0, want);
    else picked = pool.slice(0, want);

    var shuffleOpts = $('chk-shuffle-options').checked;
    var items = picked.map(function (q) {
      var opts = q.options;
      if (q.type !== 'judge' && shuffleOpts) opts = shuffle(opts);
      return { q: q, opts: opts };
    });

    var scopeLabel = scope === '__ALL__' ? '全部题目' : scope;
    startSession(items, {
      name: name,
      mode: $('select-mode').value,
      scopeLabel: scopeLabel
    });
  }

  /* ================= 答题页渲染 ================= */
  function curItem() { return state.session.items[state.session.index]; }
  function curResp() { return state.session.responses[state.session.index]; }

  function typeLabel(q) {
    if (q.type === 'judge') return '判断题';
    if (q.type === 'multiple') return '多选题';
    return '单选题';
  }

  function renderQuestion() {
    var s = state.session;
    var item = curItem();
    var resp = curResp();
    var q = item.q;

    $('progress-index').textContent = String(s.index + 1);
    $('progress-total').textContent = String(s.items.length);
    $('progress-fill').style.width = ((s.index + 1) / s.items.length * 100) + '%';
    $('quiz-group').textContent = q.group && q.group !== '未分组' ? q.group : '';

    $('q-type').textContent = typeLabel(q);
    $('q-score').textContent = q.issues.length ? '格式有疑问，见题库校验' : '';    $('q-stem').textContent = q.stem;

    var box = $('q-options');
    box.innerHTML = '';

    item.opts.forEach(function (opt, i) {
      var btn = el('button', 'opt');
      btn.type = 'button';

      var keyBadge = el('span', 'opt-key', q.type === 'judge' ? (opt.key === 'T' ? '✓' : '✗') : letterAt(i));
      btn.appendChild(keyBadge);
      btn.appendChild(el('span', 'opt-text', opt.text));

      var isSel = resp.selected.has(opt.key);
      var isAns = q.answer.indexOf(opt.key) >= 0;

      if (isSel) btn.classList.add('selected');

      if (resp.checked) {
        btn.disabled = true;
        if (isAns) {
          btn.classList.remove('selected');
          btn.classList.add(isSel ? 'correct' : 'missed');
        } else if (isSel) {
          btn.classList.remove('selected');
          btn.classList.add('wrong');
        }
      }

      btn.addEventListener('click', function () { onPick(opt.key); });
      box.appendChild(btn);
    });

    renderActions(item, resp);
    renderFeedback(item, resp);
    renderPicker();
    renderNav();
  }

  function renderActions(item, resp) {
    var box = $('q-actions');
    box.innerHTML = '';
    var practice = state.session.mode === 'practice';

    if (!practice || resp.checked) return;

    if (item.q.type === 'multiple') {
      var btn = el('button', 'btn btn-primary btn-sm', '确认答案');
      btn.type = 'button';
      btn.disabled = resp.selected.size === 0;
      btn.addEventListener('click', checkCurrent);
      box.appendChild(btn);
      box.appendChild(el('span', 'tip', '多选题，选好后点确认（可多选）'));
    } else if (item.q.type === 'single') {
      box.appendChild(el('span', 'tip', '点击选项即提交本题'));
    } else {
      box.appendChild(el('span', 'tip', '点击「正确」或「错误」即提交本题'));
    }
  }

  function renderFeedback(item, resp) {
    var box = $('q-feedback');
    box.innerHTML = '';
    if (!resp.checked) return;

    var ok = resp.correct === true;
    var wrap = el('div', 'fb ' + (ok ? 'fb-ok' : 'fb-bad'));
    wrap.appendChild(el('div', 'fb-title', ok ? '回答正确' : '回答错误'));

    var line = el('div', null, '正确答案：' + answerText(item, item.q.answer));
    wrap.appendChild(line);

    if (!ok && resp.selected.size) {
      wrap.appendChild(el('div', null, '你的答案：' + answerText(item, Array.from(resp.selected))));
    }

    if (item.q.analysis) {
      var ana = el('div', 'fb-analysis');
      var b = el('b', null, '解析：');
      ana.appendChild(b);
      ana.appendChild(document.createTextNode(item.q.analysis));
      wrap.appendChild(ana);
    }

    box.appendChild(wrap);
  }

  function renderNav() {
    var s = state.session;
    var practice = s.mode === 'practice';
    var resp = curResp();
    var isLast = s.index === s.items.length - 1;

    $('btn-prev').disabled = s.index === 0;

    var next = $('btn-next');
    if (practice && !resp.checked && resp.selected.size > 0) {
      next.textContent = '请先确认答案';
      next.disabled = false;
      next.classList.remove('btn-primary');
      next.classList.add('btn-ghost');
    } else {
      next.classList.add('btn-primary');
      next.classList.remove('btn-ghost');
      next.textContent = isLast ? '查看成绩' : '下一题';
      next.disabled = false;
    }
  }

  function renderPicker() {
    var s = state.session;
    var box = $('card-picker');
    box.innerHTML = '';

    s.items.forEach(function (item, i) {
      var resp = s.responses[i];
      var chip = el('button', 'chip', String(i + 1));
      chip.type = 'button';
      if (i === s.index) chip.classList.add('current');
      if (resp.checked) {
        chip.classList.add(resp.correct ? 'right' : 'wrong');
      } else if (resp.selected.size > 0) {
        chip.classList.add('answered');
      }
      chip.addEventListener('click', function () { goto(i); });
      box.appendChild(chip);
    });
  }

  function answerText(item, keys) {
    var q = item.q;
    if (q.type === 'judge') {
      return keys.map(function (k) { return k === 'T' ? '正确' : '错误'; }).join('、');
    }
    var out = [];
    item.opts.forEach(function (o, i) {
      if (keys.indexOf(o.key) >= 0) out.push(letterAt(i));
    });
    return out.length ? out.join('、') : '（未作答）';
  }

  /* ================= 作答 ================= */
  function onPick(key) {
    var item = curItem();
    var resp = curResp();
    var practice = state.session.mode === 'practice';

    if (practice && resp.checked) return;

    if (item.q.type === 'multiple') {
      if (resp.selected.has(key)) resp.selected.delete(key);
      else resp.selected.add(key);
      renderQuestion();
      return;
    }

    resp.selected = new Set([key]);
    if (practice) checkCurrent();
    else renderQuestion();
  }

  function checkCurrent() {
    var item = curItem();
    var resp = curResp();
    if (resp.checked) return;
    if (resp.selected.size === 0) { toast('请先选择答案'); return; }

    resp.correct = isCorrect(item, resp.selected);
    resp.checked = true;
    renderQuestion();
  }

  function isCorrect(item, selected) {
    var ans = item.q.answer;
    if (selected.size !== ans.length) return false;
    for (var i = 0; i < ans.length; i++) {
      if (!selected.has(ans[i])) return false;
    }
    return true;
  }

  function goto(i) {
    var s = state.session;
    if (i < 0 || i >= s.items.length) return;
    s.index = i;
    renderQuestion();
    scrollTopSmooth();
  }

  function onNext() {
    var s = state.session;
    var resp = curResp();
    if (s.mode === 'practice' && !resp.checked && resp.selected.size > 0) {
      toast('先点「确认答案」提交本题，再进入下一题');
      return;
    }
    if (s.index >= s.items.length - 1) {
      askFinish();
      return;
    }
    goto(s.index + 1);
  }

  function onPrev() { goto(state.session.index - 1); }

  /* ================= 交卷 ================= */
  function askFinish() {
    var s = state.session;
    if (!s) return;

    var unanswered = 0;
    s.responses.forEach(function (r) {
      if (!r.checked && r.selected.size === 0) unanswered += 1;
    });

    if (unanswered > 0) {
      openConfirm(
        '还有 ' + unanswered + ' 题没作答',
        '未作答的题会按错误计算。确定现在交卷吗？',
        finishSession
      );
    } else {
      finishSession();
    }
  }

  function finishSession() {
    var s = state.session;
    if (!s || s.endedAt) return;
    stopTimer();
    s.endedAt = Date.now();

    var correct = 0, wrong = 0, blank = 0;
    s.items.forEach(function (item, i) {
      var r = s.responses[i];
      if (!r.checked) {
        r.correct = r.selected.size > 0 ? isCorrect(item, r.selected) : false;
        r.checked = true;
        if (r.selected.size === 0) blank += 1;
      }
      if (r.correct) correct += 1; else wrong += 1;
    });

    var total = s.items.length;
    var score = total ? Math.round(correct / total * 100) : 0;
    var duration = Math.round((s.endedAt - s.startedAt) / 1000);

    var record = {
      id: 'r' + s.endedAt + '_' + Math.random().toString(36).slice(2, 7),
      at: s.endedAt,
      name: s.name,
      mode: s.mode,
      scope: s.scopeLabel,
      total: total,
      correct: correct,
      wrong: wrong - blank,
      blank: blank,
      score: score,
      duration: duration
    };
    saveHistory(record);

    renderResult(record);
    showScreen('result');
    scrollTopSmooth();
  }

  function renderResult(rec) {
    $('result-score').textContent = String(rec.score);
    $('result-title').textContent = scoreTitle(rec.score);
    $('result-sub').textContent = rec.name + ' · ' + rec.scope + ' · ' +
      (rec.mode === 'practice' ? '练习模式' : '考试模式') + ' · 用时 ' + fmtClock(rec.duration);

    var ring = $('score-ring');
    var deg = Math.round(rec.score * 3.6);
    var color = rec.score >= 80 ? '#12905a' : (rec.score >= 60 ? '#2f6bff' : '#d64545');
    ring.style.background = 'conic-gradient(' + color + ' ' + deg + 'deg, #e7ecf5 ' + deg + 'deg)';
    $('result-score').style.color = color;

    var stats = $('result-stats');
    stats.innerHTML = '';
    [
      { n: rec.total, l: '总题数', cls: '' },
      { n: rec.correct, l: '答对', cls: 'ok' },
      { n: rec.wrong, l: '答错', cls: 'bad' },
      { n: rec.blank, l: '未作答', cls: '' }
    ].forEach(function (it) {
      var d = el('div', 'stat ' + it.cls);
      d.appendChild(el('div', 'stat-num', String(it.n)));
      d.appendChild(el('div', 'stat-label', it.l));
      stats.appendChild(d);
    });

    renderResultDetail();

    var wrongCount = rec.wrong + rec.blank;
    $('btn-retry-wrong').disabled = wrongCount === 0;
    $('btn-retry-wrong').textContent = wrongCount ? ('只练错题（' + wrongCount + '）') : '没有错题';
  }

  function renderResultDetail() {
    var s = state.session;
    var box = $('result-detail');
    box.innerHTML = '';

    s.items.forEach(function (item, i) {
      var r = s.responses[i];
      var d = el('div', 'detail-item');

      var head = el('div', 'detail-head');
      var badge;
      if (!r.selected.size) badge = el('span', 'badge skip', '未答');
      else if (r.correct) badge = el('span', 'badge ok', '答对');
      else badge = el('span', 'badge bad', '答错');
      head.appendChild(badge);
      head.appendChild(el('span', 'detail-stem', (i + 1) + '. ' + item.q.stem));
      d.appendChild(head);

      var ans = el('div', 'detail-answer');
      var k1 = el('span', 'k', '正确答案：');
      var v1 = el('span', 'v-ok', answerText(item, item.q.answer));
      ans.appendChild(k1); ans.appendChild(v1);
      ans.appendChild(document.createTextNode('　'));

      if (r.selected.size) {
        var k2 = el('span', 'k', '你的答案：');
        var v2 = el('span', r.correct ? 'v-ok' : 'v-bad', answerText(item, Array.from(r.selected)));
        ans.appendChild(k2); ans.appendChild(v2);
      }
      d.appendChild(ans);

      if (item.q.analysis) {
        d.appendChild(el('div', 'detail-analysis', '解析：' + item.q.analysis));
      }

      box.appendChild(d);
    });
  }

  function scoreTitle(score) {
    if (score >= 90) return '优秀，稳了';
    if (score >= 80) return '良好，再加把劲';
    if (score >= 60) return '及格，还差一点';
    return '需要重点复习';
  }

  /* ================= 历史记录 ================= */
  function saveHistory(rec) {
    var list = loadJSON(STORE_HISTORY, []);
    if (!Array.isArray(list)) list = [];
    list.unshift(rec);
    if (list.length > HISTORY_MAX) list = list.slice(0, HISTORY_MAX);
    saveJSON(STORE_HISTORY, list);
  }

  function renderHistory() {
    var list = loadJSON(STORE_HISTORY, []);
    var box = $('history-list');
    box.innerHTML = '';

    if (!Array.isArray(list) || !list.length) {
      box.appendChild(el('p', 'hint', '还没有答题记录。'));
      return;
    }

    list.forEach(function (rec) {
      var row = el('div', 'history-row');
      var main = el('div', 'history-main');
      main.appendChild(el('div', 'history-name', rec.name || '匿名考生'));
      main.appendChild(el('div', 'history-meta',
        fmtDateTime(rec.at) + ' · ' + rec.scope + ' · ' +
        (rec.mode === 'practice' ? '练习' : '考试') + ' · ' +
        '对 ' + rec.correct + '/' + rec.total + ' · 用时 ' + fmtClock(rec.duration)));
      row.appendChild(main);
      row.appendChild(el('div', 'history-score', rec.score + ' 分'));
      box.appendChild(row);
    });
  }

  function exportHistory() {
    var list = loadJSON(STORE_HISTORY, []);
    if (!Array.isArray(list) || !list.length) { toast('还没有可导出的记录'); return; }

    var rows = [['时间', '姓名', '模式', '范围', '总题数', '答对', '答错', '未作答', '得分', '用时(秒)']];
    list.forEach(function (r) {
      rows.push([
        fmtDateTime(r.at),
        r.name || '',
        r.mode === 'practice' ? '练习' : '考试',
        r.scope || '',
        r.total, r.correct, r.wrong, r.blank, r.score, r.duration
      ]);
    });

    var csv = rows.map(function (row) {
      return row.map(function (cell) {
        var s = String(cell == null ? '' : cell);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',');
    }).join('\r\n');

    var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '答题记录_' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function clearHistory() {
    openConfirm('清空全部答题记录？', '清空后无法恢复，题库不受影响。', function () {
      saveJSON(STORE_HISTORY, []);
      renderHistory();
      toast('记录已清空');
    });
  }

  /* ================= 题库校验 ================= */
  function renderBankStats() {
    var qs = state.bank.questions;
    var counts = { single: 0, multiple: 0, judge: 0 };
    qs.forEach(function (q) { counts[q.type] = (counts[q.type] || 0) + 1; });

    var box = $('bank-stats');
    box.innerHTML = '';
    [
      { n: qs.length, l: '题目总数' },
      { n: state.bank.groups.length, l: '题组数' },
      { n: counts.single, l: '单选题' },
      { n: counts.multiple, l: '多选题' },
      { n: counts.judge, l: '判断题' }
    ].forEach(function (it) {
      var d = el('div', 'stat');
      d.appendChild(el('div', 'stat-num', String(it.n)));
      d.appendChild(el('div', 'stat-label', it.l));
      box.appendChild(d);
    });
  }

  function runValidation() {
    var out = $('validate-output');
    out.innerHTML = '';

    var problems = state.bank.problems.slice();
    var warns = [];
    state.bank.questions.forEach(function (q) {
      q.issues.forEach(function (msg) {
        problems.push({ level: 'bad', msg: '第 ' + q.no + ' 题（' + q.group + '）：' + msg });
      });
      (q.warns || []).forEach(function (msg) {
        warns.push({ level: 'warn', msg: '第 ' + q.no + ' 题（' + q.group + '）：' + msg });
      });
    });

    var head = el('p');
    if (!problems.length) {
      head.appendChild(el('span', 'v-ok', '校验通过'));
      head.appendChild(document.createTextNode('：共 ' + state.bank.questions.length + ' 题，未发现格式问题。'));
    } else {
      head.appendChild(el('span', 'v-bad', '发现 ' + problems.length + ' 处问题'));
      head.appendChild(document.createTextNode('：'));
    }
    out.appendChild(head);

    if (problems.length) {
      var ul = el('ul');
      problems.forEach(function (p) {
        var li = el('li');
        li.appendChild(el('span', 'v-bad', '✗ '));
        li.appendChild(document.createTextNode(p.msg));
        ul.appendChild(li);
      });
      out.appendChild(ul);
    }

    if (warns.length) {
      var wh = el('p', 'validate-warn-head');
      wh.appendChild(el('span', 'v-warn', warns.length + ' 条提示'));
      wh.appendChild(document.createTextNode('（不影响答题，建议人工确认）：'));
      out.appendChild(wh);

      var wul = el('ul');
      warns.forEach(function (p) {
        var li = el('li');
        li.appendChild(el('span', 'v-warn', '! '));
        li.appendChild(document.createTextNode(p.msg));
        wul.appendChild(li);
      });
      out.appendChild(wul);
    }
  }

  /* ================= 屏幕切换 ================= */
  function showScreen(name) {
    ['home', 'quiz', 'result', 'settings'].forEach(function (n) {
      var s = $('screen-' + n);
      if (s) s.classList.toggle('active', n === name);
    });
    document.body.dataset.screen = name;
  }

  /* ================= 弹窗 / 提示 ================= */
  var confirmCb = null;

  function openConfirm(title, text, cb) {
    $('modal-confirm-title').textContent = title;
    $('modal-confirm-text').textContent = text;
    confirmCb = cb || null;
    $('modal-confirm').hidden = false;
  }

  function closeConfirm() {
    $('modal-confirm').hidden = true;
    confirmCb = null;
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    if (!t) {
      t = el('div', 'toast');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2000);
  }

  /* ================= 事件绑定 ================= */
  function bind() {
    $('btn-start').addEventListener('click', onStart);
    $('select-scope').addEventListener('change', updateCountMax);
    $('input-count').addEventListener('change', updateCountMax);

    $('btn-next').addEventListener('click', onNext);
    $('btn-prev').addEventListener('click', onPrev);
    $('btn-finish').addEventListener('click', askFinish);

    $('btn-quit').addEventListener('click', function () {
      openConfirm('退出本次答题？', '当前作答不会保存，也不会计入记录。', function () {
        stopTimer();
        state.session = null;
        showScreen('home');
      });
    });

    $('btn-back-home').addEventListener('click', function () {
      state.session = null;
      showScreen('home');
    });

    $('btn-restart').addEventListener('click', function () {
      var s = state.session;
      if (!s) { showScreen('home'); return; }
      var items = s.items.map(function (it) {
        return { q: it.q, opts: it.opts };
      });
      startSession(items, { name: s.name, mode: s.mode, scopeLabel: s.scopeLabel });
    });

    $('btn-retry-wrong').addEventListener('click', function () {
      var s = state.session;
      if (!s) return;
      var items = [];
      s.items.forEach(function (it, i) {
        var r = s.responses[i];
        if (!r.correct) items.push({ q: it.q, opts: it.opts });
      });
      if (!items.length) { toast('没有错题'); return; }
      startSession(items, { name: s.name, mode: 'practice', scopeLabel: '错题重练' });
    });

    $('btn-open-settings').addEventListener('click', function () {
      renderBankStats();
      renderHistory();
      $('validate-output').innerHTML = '';
      showScreen('settings');
    });
    $('btn-close-settings').addEventListener('click', function () { showScreen('home'); });
    $('btn-validate').addEventListener('click', runValidation);
    $('btn-export').addEventListener('click', exportHistory);
    $('btn-clear-history').addEventListener('click', clearHistory);

    $('btn-confirm-ok').addEventListener('click', function () {
      var cb = confirmCb;
      closeConfirm();
      if (cb) cb();
    });
    $('modal-confirm').addEventListener('click', function (e) {
      if (e.target === $('modal-confirm') || e.target.hasAttribute('data-modal-cancel')) closeConfirm();
    });

    document.addEventListener('keydown', function (e) {
      if (!$('modal-confirm').hidden) {
        if (e.key === 'Escape') closeConfirm();
        return;
      }
      if (document.body.dataset.screen !== 'quiz' || !state.session) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        var r = curResp();
        if (state.session.mode === 'practice' && !r.checked && r.selected.size > 0) checkCurrent();
        else onNext();
        return;
      }

      var k = e.key.toUpperCase();
      var idx = -1;
      if (/^[A-Z]$/.test(k)) idx = k.charCodeAt(0) - 65;
      else if (/^[1-9]$/.test(k)) idx = parseInt(k, 10) - 1;
      if (idx < 0) return;

      var item = curItem();
      if (idx >= item.opts.length) return;
      e.preventDefault();
      onPick(item.opts[idx].key);
    });
  }

  /* ================= 初始化 ================= */
  function init() {
    var raw = window.QUIZ_BANK;
    state.bank = parseBank(raw);
    renderHome();
    bind();
    showScreen('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
