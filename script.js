(function () {
  "use strict";

  var DATA = window.SITE_DATA || { domains: [], cases: [], more: [] };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function fileUrl(path) {
    return "file:///" + encodeURI(path.replace(/\\/g, "/"));
  }

  function shortPath(path) {
    var parts = path.split("\\").filter(Boolean);
    var tail = parts.slice(-2).join("\\");
    return parts.length > 2 ? "\u2026\\" + tail : tail;
  }

  function renderCaseCard(item) {
    var card = el("article", "case-card reveal");

    var thumb = el("a", "case-thumb");
    thumb.href = fileUrl(item.path);
    thumb.setAttribute("title", "打开目录：" + item.path);
    var img = document.createElement("img");
    img.src = item.img;
    img.alt = item.title;
    img.loading = "lazy";
    thumb.appendChild(img);
    card.appendChild(thumb);

    var body = el("div", "case-body");
    body.appendChild(el("h4", "case-title", item.title));
    body.appendChild(el("p", "case-desc", item.desc));

    var tags = el("div", "case-tags");
    (item.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    body.appendChild(tags);

    var pathEl = el("span", "case-path", shortPath(item.path));
    pathEl.setAttribute("title", item.path);
    body.appendChild(pathEl);

    var open = el("a", "case-open", "打开目录");
    open.href = fileUrl(item.path);
    open.setAttribute("aria-label", "打开目录：" + item.title);
    body.appendChild(open);

    card.appendChild(body);
    return card;
  }

  function renderCases() {
    var root = document.getElementById("cases-root");
    if (!root) return;
    DATA.domains.forEach(function (domain) {
      var section = el("section", "domain reveal");
      var head = el("div", "domain-head");
      head.appendChild(el("span", "domain-num", domain.num));
      var hd = el("div");
      hd.appendChild(el("h3", null, domain.name));
      hd.appendChild(el("p", null, domain.blurb));
      head.appendChild(hd);
      section.appendChild(head);

      var grid = el("div", "case-grid");
      DATA.cases.filter(function (c) { return c.domain === domain.id; }).forEach(function (c) {
        grid.appendChild(renderCaseCard(c));
      });
      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function renderMore() {
    var root = document.getElementById("more-root");
    if (!root) return;
    DATA.more.forEach(function (group) {
      var box = el("div", "more-group reveal");
      box.appendChild(el("h3", null, group.group));
      var list = el("div", "chip-list");
      group.items.forEach(function (it) {
        var chip = el("a", "chip", it.name);
        chip.href = fileUrl(it.path);
        chip.setAttribute("title", it.path);
        list.appendChild(chip);
      });
      box.appendChild(list);
      root.appendChild(box);
    });
  }

  function setupReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  function animateCount(elNode) {
    var target = parseInt(elNode.dataset.count, 10) || 0;
    if (reduceMotion) { elNode.textContent = target; return; }
    var duration = 900;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      elNode.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function setupCounts() {
    var nums = Array.prototype.slice.call(document.querySelectorAll(".fact-num[data-count]"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nums.forEach(function (n) { n.textContent = n.dataset.count; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var list = document.getElementById("nav-list");
    if (!toggle || !list) return;
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    list.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function prepareForPrint() {
    document.querySelectorAll(".fact-num[data-count]").forEach(function (n) {
      n.textContent = n.dataset.count;
    });
    document.querySelectorAll(".reveal").forEach(function (t) {
      t.classList.add("is-in");
    });
  }

  window.addEventListener("beforeprint", prepareForPrint);

  renderCases();
  renderMore();
  if (location.search.indexOf("print") !== -1) prepareForPrint();
  setupReveal();
  setupCounts();
  setupNav();
})();
