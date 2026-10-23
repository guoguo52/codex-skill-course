/* 生成可编辑 PPTX：node build-deck.cjs */
const fs = require("fs");
const path = require("path");
const PptxGenJS = require("C:/Users/Administrator/.agents/skills/PPT-and-网站开发系统/node_modules/pptxgenjs");

const ROOT = __dirname;
const dataSrc = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
const DATA = new Function("window", dataSrc + "\nreturn window;")({}).SITE_DATA;

const T = {
  ink: "1B1B18",
  soft: "44443F",
  muted: "73726B",
  rule: "E6E4DC",
  paper: "F6F5F2",
  accent: "0F766E",
  accentInk: "0B5D57",
  white: "FFFFFF",
  font: "Microsoft YaHei",
  mono: "Consolas"
};

const OUT = path.join(ROOT, "downloads", "Codex-Skill-Course.pptx");
fs.mkdirSync(path.dirname(OUT), { recursive: true });

function img(name) {
  const p = path.join(ROOT, name.replace(/\//g, path.sep));
  return fs.existsSync(p) ? p : null;
}

function header(s, eyebrow, title, y) {
  s.addText(eyebrow, {
    x: 0.55, y: y !== undefined ? y : 0.32, w: 8.9, h: 0.3,
    fontSize: 10.5, color: T.accent, fontFace: T.font, charSpacing: 1.5
  });
  s.addText(title, {
    x: 0.55, y: (y !== undefined ? y : 0.32) + 0.34, w: 8.9, h: 0.65,
    fontSize: 25, bold: true, color: T.ink, fontFace: T.font
  });
}

function footer(s, num) {
  s.addText("Codex + Skill 应用入门课", {
    x: 0.55, y: 5.22, w: 4, h: 0.3, fontSize: 8.5, color: T.muted, fontFace: T.font
  });
  s.addText(String(num), {
    x: 9.1, y: 5.22, w: 0.4, h: 0.3, fontSize: 9, color: T.muted, fontFace: T.mono, align: "right"
  });
}

function caseRow(s, item, y) {
  s.addText(item.title, {
    x: 0.55, y, w: 5.7, h: 0.32, fontSize: 13.5, bold: true, color: T.ink, fontFace: T.font
  });
  s.addText(item.desc, {
    x: 0.55, y: y + 0.34, w: 5.7, h: 0.52, fontSize: 10.5, color: T.muted, fontFace: T.font, valign: "top"
  });
  s.addText((item.tags || []).join(" · "), {
    x: 0.55, y: y + 0.84, w: 5.7, h: 0.28, fontSize: 9, color: T.accent, fontFace: T.font
  });
}

function domainSlide(s, domain, cases, num) {
  header(s, "案例巡礼 · 领域 " + domain.num, domain.name);
  s.addText(domain.blurb, {
    x: 0.55, y: 1.18, w: 5.7, h: 0.42, fontSize: 11.5, color: T.muted, fontFace: T.font
  });
  s.addShape("line", { x: 0.55, y: 1.58, w: 5.7, h: 0, line: { color: T.rule, width: 1 } });

  cases.forEach((item, i) => {
    const y = 1.78 + i * 1.04;
    caseRow(s, item, y);
  });

  const rightImgs = cases.slice(0, 2).map((c) => img(c.img)).filter(Boolean);
  if (rightImgs.length > 0) {
    s.addShape("roundRect", {
      x: 6.55, y: 1.0, w: 2.95, h: 4.05,
      fill: { color: T.paper }, line: { color: T.rule, width: 1 }, rectRadius: 0.06
    });
    rightImgs.forEach((p, i) => {
      const w = 2.65, h = rightImgs.length === 1 ? 3.75 : 1.82;
      const x = 6.7, y = rightImgs.length === 1 ? 1.15 : 1.15 + i * 1.96;
      s.addImage({ path: p, x, y, w, h, sizing: { type: "cover", w, h } });
    });
  }
  footer(s, num);
}

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.title = "Codex + Skill 应用入门课";
pptx.author = "Codex + Skill 课程站";

/* 1 封面 */
{
  const s = pptx.addSlide();
  s.background = { color: T.white };
  s.addShape("rect", { x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: T.accent }, line: { type: "none" } });
  s.addText("CODEX + SKILL · 入门科普课", {
    x: 0.7, y: 0.72, w: 6, h: 0.35, fontSize: 12, color: T.accent, fontFace: T.font, charSpacing: 1.5
  });
  s.addText("把通用 AI，变成你的专业工作流", {
    x: 0.7, y: 1.18, w: 6.6, h: 1.5, fontSize: 34, bold: true, color: T.ink, fontFace: T.font
  });
  s.addText("用一个小时看懂一套组合拳：Codex 负责执行力，Skill 提供行业方法。六个领域、十五个真实案例，全部来自本机成品目录。", {
    x: 0.7, y: 2.78, w: 6.1, h: 1.1, fontSize: 13, color: T.muted, fontFace: T.font
  });
  s.addText("1 小时  ·  6 大领域  ·  15 个案例  ·  零代码起步", {
    x: 0.7, y: 4.05, w: 6.2, h: 0.4, fontSize: 12, color: T.accentInk, fontFace: T.font
  });
  const coverImgs = ["assets/cases/yiwu.png", "assets/cases/campaign.jpg", "assets/cases/b36.jpg", "assets/cases/aimv.jpg"]
    .map((n) => img(n)).filter(Boolean).slice(0, 4);
  coverImgs.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 7.0 + col * 1.48, y = 0.42 + row * 2.52, w = 1.34, h = 2.3;
    s.addImage({ path: p, x, y, w, h, sizing: { type: "cover", w, h } });
  });
}

/* 2 课程速览 */
{
  const s = pptx.addSlide();
  header(s, "课程速览", "一小时的容量，六个模块");
  const facts = [["1", "小时", "课程总时长"], ["6", "大", "应用领域"], ["15", "个", "真实案例"], ["0", "行", "代码也能起步"]];
  facts.forEach(([v, u, l], i) => {
    const x = 0.55 + i * 2.28;
    s.addShape("roundRect", { x, y: 1.7, w: 2.05, h: 2.5, fill: { color: T.paper }, line: { color: T.rule, width: 1 }, rectRadius: 0.05 });
    s.addText(v + " " + u, { x, y: 2.0, w: 2.05, h: 0.9, fontSize: 34, bold: true, color: T.accent, fontFace: T.font, align: "center" });
    s.addText(l, { x, y: 3.05, w: 2.05, h: 0.45, fontSize: 12, color: T.muted, fontFace: T.font, align: "center" });
  });
  s.addText("从建立心智模型开始，用真实成品建立判断力，最后给出可复制的手上路线。", {
    x: 0.55, y: 4.5, w: 8.9, h: 0.4, fontSize: 11.5, color: T.muted, fontFace: T.font
  });
  footer(s, 2);
}

/* 3 为什么 */
{
  const s = pptx.addSlide();
  header(s, "核心逻辑", "为什么是 Codex + Skill");
  const why = [
    ["01", "Codex 是执行者", "能写代码、跑命令、调用工具，把想法真正落地成文件、页面和视频。"],
    ["02", "Skill 是方法论", "把行业怎么做写成可复用的指令与流程，让每次产出质量稳定。"],
    ["03", "一加一大于二", "通用智能体配上行业 skill，等于针对具体场景的自动化生产线。"],
    ["04", "门槛其实很低", "不需要会写代码，装好 skill 照案例跑一遍就能上手。"]
  ];
  why.forEach(([n, h, d], i) => {
    const y = 1.55 + i * 0.92;
    s.addText(n, { x: 0.55, y, w: 0.7, h: 0.35, fontSize: 13, bold: true, color: T.accent, fontFace: T.mono });
    s.addText(h, { x: 1.4, y, w: 2.6, h: 0.35, fontSize: 14, bold: true, color: T.ink, fontFace: T.font });
    s.addText(d, { x: 4.15, y, w: 5.3, h: 0.75, fontSize: 11.5, color: T.muted, fontFace: T.font, valign: "top" });
    if (i < why.length - 1) s.addShape("line", { x: 0.55, y: y + 0.82, w: 8.9, h: 0, line: { color: T.rule, width: 0.75 } });
  });
  footer(s, 3);
}

/* 4 课程大纲 */
{
  const s = pptx.addSlide();
  header(s, "课程大纲", "一小时，六个模块");
  const mods = [
    ["00–08 分", "开场：Codex 与 Skill 分别是什么", "先分清两个概念，建立同一套讨论坐标系。"],
    ["08–18 分", "核心逻辑：通用引擎加专业方法", "讲清两者怎么配合，以及组合之后为什么能干活。"],
    ["18–43 分", "案例巡礼：六个领域逐个看", "每个领域 3 到 4 分钟，看成品并指出背后用了哪类 skill。"],
    ["43–52 分", "上手路线：装 skill 跑通第一个案例", "从本机案例目录挑一个，照着启动说明运行一次。"],
    ["52–60 分", "答疑与延伸：继续逛本机案例", "回答提问，并给出本机其他案例目录的浏览顺序。"]
  ];
  mods.forEach(([t, h, d], i) => {
    const y = 1.5 + i * 0.74;
    s.addShape("roundRect", { x: 0.55, y, w: 1.35, h: 0.5, fill: { color: T.accent }, line: { type: "none" }, rectRadius: 0.04 });
    s.addText(t, { x: 0.55, y, w: 1.35, h: 0.5, fontSize: 10.5, bold: true, color: T.white, fontFace: T.font, align: "center", valign: "middle" });
    s.addText(h, { x: 2.15, y: y - 0.02, w: 7.3, h: 0.34, fontSize: 13, bold: true, color: T.ink, fontFace: T.font });
    s.addText(d, { x: 2.15, y: y + 0.3, w: 7.3, h: 0.32, fontSize: 10.5, color: T.muted, fontFace: T.font });
  });
  footer(s, 4);
}

/* 5-10 领域 */
let page = 5;
DATA.domains.forEach((domain) => {
  const cases = DATA.cases.filter((c) => c.domain === domain.id);
  const s = pptx.addSlide();
  domainSlide(s, domain, cases, page);
  page += 1;
});

/* 11 更多案例 */
{
  const s = pptx.addSlide();
  header(s, "本机还有更多", "这些目录，也都是现成的案例");
  DATA.more.forEach((g, gi) => {
    const col = gi % 2, row = Math.floor(gi / 2);
    const x = 0.55 + col * 4.5, y = 1.55 + row * 1.5;
    s.addShape("roundRect", { x, y, w: 4.3, h: 1.28, fill: { color: T.paper }, line: { color: T.rule, width: 1 }, rectRadius: 0.05 });
    s.addText(g.group + " · " + g.items.length + " 个目录", {
      x: x + 0.18, y: y + 0.1, w: 3.95, h: 0.32, fontSize: 12.5, bold: true, color: T.ink, fontFace: T.font
    });
    s.addText(g.items.map((it) => it.name).join("、"), {
      x: x + 0.18, y: y + 0.46, w: 3.95, h: 0.72, fontSize: 9.5, color: T.muted, fontFace: T.font, valign: "top"
    });
  });
  footer(s, 11);
}

/* 12 怎么上手 */
{
  const s = pptx.addSlide();
  header(s, "怎么上手", "四条路径，今天就能开始");
  const steps = [
    ["1", "装一个 Skill", "把行业 skill 放进本机 skills 目录，Codex 就能识别并调用。"],
    ["2", "挑一个案例", "从案例里选一个离你业务最近的领域。"],
    ["3", "跑一遍", "打开案例里的 index.html，或按 README 的启动命令运行一次。"],
    ["4", "改着玩", "把文案、配色、素材换成自己的，跑出第一版成品。"]
  ];
  steps.forEach(([n, h, d], i) => {
    const x = 0.55 + i * 2.28;
    s.addShape("roundRect", { x, y: 1.65, w: 2.05, h: 2.9, fill: { color: T.paper }, line: { color: T.rule, width: 1 }, rectRadius: 0.05 });
    s.addShape("ellipse", { x: x + 0.16, y: 1.85, w: 0.5, h: 0.5, fill: { color: T.accent }, line: { type: "none" } });
    s.addText(n, { x: x + 0.16, y: 1.85, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: T.white, fontFace: T.font, align: "center", valign: "middle" });
    s.addText(h, { x: x + 0.16, y: 2.55, w: 1.75, h: 0.4, fontSize: 14, bold: true, color: T.ink, fontFace: T.font });
    s.addText(d, { x: x + 0.16, y: 3.0, w: 1.75, h: 1.4, fontSize: 10, color: T.muted, fontFace: T.font, valign: "top" });
  });
  footer(s, 12);
}

/* 13 收尾 */
{
  const s = pptx.addSlide();
  s.background = { color: T.ink };
  s.addText("CODEX + SKILL · 入门科普课", {
    x: 0.7, y: 1.35, w: 8.6, h: 0.35, fontSize: 12, color: "9BB3B0", fontFace: T.font, charSpacing: 1.5
  });
  s.addText("准备好开始了吗", {
    x: 0.7, y: 1.75, w: 8.6, h: 0.9, fontSize: 32, bold: true, color: T.white, fontFace: T.font
  });
  s.addText("从课程大纲看起，再用案例目录练手。一个小时后，你会对 Codex + Skill 能做什么有清晰的判断。", {
    x: 0.7, y: 2.7, w: 8.2, h: 0.7, fontSize: 13, color: "C9C8C0", fontFace: T.font
  });
  s.addText("配套文件：本 PPTX 可编辑 · 整站讲义 PDF 可在网站下载区获取", {
    x: 0.7, y: 3.55, w: 8.6, h: 0.4, fontSize: 11, color: "7FD0C8", fontFace: T.font
  });
}

pptx.writeFile({ fileName: OUT }).then(() => {
  console.log("PPTX 已生成:", OUT);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
