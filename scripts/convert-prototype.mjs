// Converts the prototype's DC template (HTML + {{ }} + sc-if/sc-for) into JSX components.
// usage: node convert.mjs <prototype.html> <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'htmlparser2';

const [, , src, outDir] = process.argv;
const html = fs.readFileSync(src, 'utf8');
const start = html.indexOf('<div style="min-height:100vh');
const end = html.lastIndexOf('</x-dc>');
const tpl = html.slice(start, end);
const doc = parseDocument(tpl, { lowerCaseAttributeNames: false, lowerCaseTags: false, recognizeSelfClosing: true });

// sc-if value -> extracted component
const EXTRACT = {
  isHome: 'HomePage', isCands: 'MatchesPage', isAlerts: 'AlertsPage', isJournal: 'JournalPage',
  isBuilder: 'BuilderPage', isSettings: 'SettingsPage',
  glossOpen: 'GlossaryModal', 'rec.open': 'RecordModal', 'em.open': 'RuleEditModal', 'lib.open': 'ConditionLibraryModal',
  consentOpen: 'ConsentModal', hasToast: 'Toast',
};
const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link']);
const HOVER = { 'background:oklch(0.5 0.02 260 / 0.07);': 'rm-hover', 'transform:scale(0.98);': 'rm-press' };

let loopN = 0;
const files = {};

function expr(e, scope) {
  e = e.trim();
  if (e === 'true' || e === 'false' || /^-?\d+(\.\d+)?$/.test(e)) return e;
  const root = e.split(/[.[]/)[0];
  return scope.includes(root) ? e : 'v.' + e;
}
const MUSTACHE = /\{\{\s*(.+?)\s*\}\}/g;
function onlyMustache(s) { const m = s.trim().match(/^\{\{\s*(.+?)\s*\}\}$/); return m ? m[1] : null; }
function interp(s, scope) {
  const only = onlyMustache(s);
  if (only) return expr(only, scope);
  if (!s.includes('{{')) return JSON.stringify(s);
  return '`' + s.replace(/`/g, '\\`').replace(MUSTACHE, (_, e) => '${' + expr(e, scope) + '}') + '`';
}
function camel(p) {
  p = p.trim();
  if (p.startsWith('-webkit-')) return 'Webkit' + camel(p.slice(8)).replace(/^./, c => c.toUpperCase());
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
function splitDecls(s) {
  const out = []; let cur = '', depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '{' && s[i + 1] === '{') depth++;
    if (c === '}' && s[i + 1] === '}') depth--;
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out.filter(d => d.trim());
}
function styleObj(s, scope) {
  const parts = splitDecls(s).map(d => {
    const i = d.indexOf(':');
    const prop = camel(d.slice(0, i)), val = d.slice(i + 1).trim();
    return `${prop}: ${interp(val, scope)}`;
  });
  return '{{ ' + parts.join(', ') + ' }}';
}
function attrs(el, scope) {
  const out = [], classes = [];
  for (const [k, raw] of Object.entries(el.attribs)) {
    if (k.startsWith('hint-')) continue;
    if (k === 'style') { out.push(`style=${styleObj(raw, scope)}`); continue; }
    if (k === 'style-hover' || k === 'style-active') {
      const c = HOVER[raw.trim()];
      if (!c) throw new Error('unknown ' + k + ': ' + raw);
      classes.push(c); continue;
    }
    if (k === 'spellCheck') { out.push(`spellCheck={${raw === 'true'}}`); continue; }
    if (k === 'rows') { out.push(`rows={${+raw}}`); continue; }
    const name = k === 'class' ? 'className' : k;
    if (raw.includes('{{')) out.push(`${name}={${interp(raw, scope)}}`);
    else out.push(`${name}=${JSON.stringify(raw)}`);
  }
  if (classes.length) out.push(`className="${classes.join(' ')}"`);
  return out.length ? ' ' + out.join(' ') : '';
}
function text(t, scope) {
  if (!t.trim()) return t.includes('\n') ? '' : '{" "}';
  // keep same-line edge spaces, drop newline indentation
  const lead = /^[ \t]+/.test(t) && !/^\s*\n/.test(t) ? '{" "}' : '';
  const trail = /[ \t]+$/.test(t) && !/\n\s*$/.test(t) ? '{" "}' : '';
  const body = t.trim();
  let out = '', last = 0;
  body.replace(MUSTACHE, (m, e, idx) => {
    out += lit(body.slice(last, idx)); out += `{${expr(e, scope)}}`; last = idx + m.length; return m;
  });
  out += lit(body.slice(last));
  return lead + out + trail;
}
function lit(s) {
  if (!s) return '';
  return /[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s;
}
function kids(nodes, scope, ind) {
  return nodes.map(n => node(n, scope, ind)).filter(Boolean).join('\n');
}
function node(n, scope, ind) {
  const pad = '  '.repeat(ind);
  if (n.type === 'text') { const t = text(n.data, scope); return t ? pad + t : ''; }
  if (n.type === 'comment') return '';
  if (n.type !== 'tag') return '';
  if (n.name === 'sc-if') {
    const cond = onlyMustache(n.attribs.value);
    if (EXTRACT[cond]) {
      emit(EXTRACT[cond], n.children);
      return `${pad}{!!${expr(cond, scope)} && <${EXTRACT[cond]} v={v} />}`;
    }
    return `${pad}{!!(${expr(cond, scope)}) && (\n${pad}  <>\n${kids(n.children, scope, ind + 2)}\n${pad}  </>\n${pad})}`;
  }
  if (n.name === 'sc-for') {
    const list = expr(onlyMustache(n.attribs.list), scope), as = n.attribs.as, k = 'i' + (loopN++);
    return `${pad}{(${list} as any[]).map((${as}: any, ${k}: number) => (\n${pad}  <Fragment key={${k}}>\n${kids(n.children, [...scope, as], ind + 2)}\n${pad}  </Fragment>\n${pad}))}`;
  }
  const a = attrs(n, scope);
  if (VOID.has(n.name)) return `${pad}<${n.name}${a} />`;
  const inner = kids(n.children, scope, ind + 1);
  if (!inner) return `${pad}<${n.name}${a}></${n.name}>`;
  return `${pad}<${n.name}${a}>\n${inner}\n${pad}</${n.name}>`;
}
function emit(name, children) {
  const body = kids(children, [], 3);
  files[name] = `import { Fragment } from "react";
import type { ViewModel } from "../lib/types";

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function ${name}({ v }: { v: ViewModel }) {
  return (
    <>
${body}
    </>
  );
}
`;
}

const root = doc.children.find(n => n.type === 'tag');
const shellBody = node(root, [], 2);
const imports = Object.values(EXTRACT).map(n => `import ${n} from "./${n}";`).join('\n');
files.Shell = `import { Fragment } from "react";
import type { ViewModel } from "../lib/types";
${imports}

// Generated from design/Rulemate B2C.dc.html — keep in sync with the prototype.
export default function Shell({ v }: { v: ViewModel }) {
  return (
${shellBody}
  );
}
`;
fs.mkdirSync(outDir, { recursive: true });
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(outDir, n + '.tsx'), c);
console.log('wrote', Object.keys(files).length, 'files');
