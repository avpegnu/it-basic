#!/usr/bin/env python3
"""Render shared handbook knowledge into this repository's static HTML format.
Usage: python3 tools/sync-handbook.py [path/to/av-lore/src/content/handbook]
Interactive React worksheets remain exclusive to AV Lore; all explanatory text is retained.
"""
import html
import json
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT.parent/'av-lore/src/content/handbook'
DEST=ROOT/'SystemDesign/Handbook'
DEST.mkdir(parents=True,exist_ok=True)
esc=lambda s:html.escape(str(s),quote=True)
lessons=[json.loads(p.read_text()) for p in sorted(SOURCE.glob('*.json'))]
if not lessons:raise SystemExit('No handbook lessons found')
style='''body{margin:0;background:#f9f8f4;color:#242c35;font:16px/1.9 system-ui,sans-serif}main,header,footer{max-width:1050px;margin:auto;padding:24px}main{overflow-wrap:anywhere}.cards>*{min-width:0}h1{font-size:clamp(30px,5vw,48px);line-height:1.3}h2{margin-top:64px;border-top:1px solid #cbd0d5;padding-top:24px;scroll-margin-top:24px}a{color:#24547a}nav{display:flex;gap:20px;flex-wrap:wrap}pre{white-space:pre;overflow:auto;background:#e9edf0;padding:20px;border-radius:10px;font-size:13px}aside,details{background:#eef1ed;border:1px solid #cbd0d5;padding:20px;border-radius:10px;margin:24px 0}summary{cursor:pointer;font-weight:600}.table{overflow:auto}table{width:100%;border-collapse:collapse;min-width:540px}th,td{text-align:left;vertical-align:top;border:1px solid #cbd0d5;padding:14px}th{background:#edf0f1}.diagram{overflow:auto;background:#edf0f1}.diagram svg{min-width:760px;width:100%}.diagram rect{fill:#fff;stroke:#50718b;stroke-width:2}.diagram text{font:13px system-ui;fill:#242c35}dt{font-weight:700;margin-top:20px}dd{margin-left:0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}.cards a{padding:24px;border:1px solid #cbd0d5;border-radius:12px;text-decoration:none} @media(prefers-color-scheme:dark){body{background:#111820;color:#d9e2eb}a{color:#8ec1ee}pre,aside,details,.diagram{background:#1d2a35}th{background:#233442}.diagram rect{fill:#263b4b;stroke:#9ab9d2}.diagram text{fill:#d9e2eb}}'''
(DEST/'handbook.css').write_text(style+'\n')
def page(title,body,lang,other):
 return f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} · IT Basic</title><link rel="stylesheet" href="handbook.css"></head><body><header><nav><a href="../index.html">IT Basic / System Design</a><a href="index.html">Handbook</a><a href="{esc(other)}">{"English" if lang=="vi" else "Tiếng Việt"}</a></nav></header><main>{body}</main><footer>IT Basic · Learn. Understand. Build.</footer></body></html>'
for lang in ['vi','en']:
 text=lambda pair:esc(pair[lang])
 for l in lessons:
  out=f'<h1>{text(l["title"])}</h1><p>{text(l["summary"])}</p>'
  def render_flow(flow):
   return f'<aside><h3>{text(flow["title"])}</h3><ol>'+''.join(f'<li><strong>{text(step["title"])}</strong><p>{text(step["detail"])}</p></li>' for step in flow['steps'])+f'</ol><p>{text(flow["caption"])}</p></aside>'
  if l.get('overview'):out+=render_flow(l['overview'])
  out+='<aside><ul>'+''.join(f'<li>{text(t)}</li>' for t in l['takeaways'])+'</ul></aside>'
  known={item['id']:item for item in lessons}
  out+='<nav>'+''.join(f'<a href="{esc(id)}{"" if lang=="vi" else ".en"}.html">{text(known[id]["title"])}</a>' for id in l.get('prerequisites',[]) if id in known)+'</nav>'
  out+='<nav>'+''.join(f'<a href="../../NotesInterview/index.html#topic/{esc(id)}">Notes &amp; Interview / {esc(id)}</a>' for id in l.get('relatedTopics',[]))+'</nav>'
  out+='<nav>'+''.join(f'<a href="#{esc(s["id"])}">{text(s["title"])}</a>' for s in l['sections'])+'</nav>'
  for s in l['sections']:
   out+=f'<section><h2 id="{esc(s["id"])}">{text(s["title"])}</h2>'
   if s.get('flow'):out+=render_flow(s['flow'])
   if s.get('cards'):
    out+='<div class="cards">'+''.join(f'<aside><h3>{text(card["title"])}</h3><ul>'+''.join(f'<li>{text(item)}</li>' for item in card['items'])+'</ul></aside>' for card in s['cards'])+'</div>'
   out+=''.join(f'<p>{text(p)}</p>' for p in s.get('paragraphs',[]))
   if s.get('bullets'):out+='<ul>'+''.join(f'<li>{text(b)}</li>' for b in s['bullets'])+'</ul>'
   if t:=s.get('table'):
    out+='<div class="table" tabindex="0"><table><thead><tr>'+''.join(f'<th scope="col">{text(h)}</th>' for h in t['headers'])+'</tr></thead><tbody>'
    for row in t['rows']:out+='<tr>'+''.join(f'<th scope="row">{text(c)}</th>' if i==0 else f'<td>{text(c)}</td>' for i,c in enumerate(row))+'</tr>'
    out+='</tbody></table></div>'
    if t.get('caption'):out+=f'<p>{text(t["caption"])}</p>'
   for api in s.get('api',[]):
    out+=f'<h3>{esc(api["method"])} <code>{esc(api["path"])}</code></h3><p>{text(api["description"])}</p>'
    if api.get('request'):out+=f'<pre><code>{esc(api["request"])}</code></pre>'
    out+=f'<pre><code>{esc(api["response"])}</code></pre>'
    out+='<ul>'+''.join(f'<li>{text(n)}</li>' for n in api.get('notes',[]))+'</ul>'
   if c:=s.get('code'):out+=f'<pre><code>{esc(c["content"])}</code></pre><p>{text(c["caption"])}</p>'
   if planner:=s.get('planner'):
    out+='<aside><h3>'+('Luyện theo từng giai đoạn' if lang=='vi' else 'Practice each phase')+'</h3>'
    for phase in planner['phases']:
     out+=f'<h4>{text(phase["title"])} · {phase["minutes"]} min</h4><p>{text(phase["description"])}</p><ul>'+''.join(f'<li>{text(item)}</li>' for item in phase['checklist'])+'</ul>'
    out+='</aside>'
   if graph:=s.get('diagram'):
    out+=f'<h3>{text(graph["title"])}</h3><div class="diagram" tabindex="0"><svg role="img" aria-label="{text(graph["title"])}" viewBox="0 0 {graph["width"]} {graph["height"]}">'
    # Static component map; the complete ordered request paths below carry flow semantics.
    for n in graph['nodes']:out+=f'<g><rect x="{n["x"]-88}" y="{n["y"]-32}" width="176" height="64" rx="12"/><text x="{n["x"]}" y="{n["y"]+5}" text-anchor="middle">{text(n["label"])}</text></g>'
    out+='</svg></div><p>'+('Sơ đồ các component; các luồng request được giải thích đầy đủ theo thứ tự bên dưới.' if lang=='vi' else 'Component map; the complete ordered request paths are explained below.')+'</p>'
    for trace in graph['traces']:out+=f'<h3>{text(trace["label"])}</h3><ol>'+''.join(f'<li>{text(step["description"])}</li>' for step in trace['steps'])+'</ol>'
    out+='<dl>'+''.join(f'<dt>{text(n["label"])}</dt><dd>{text(n["detail"])}</dd>' for n in graph['nodes'])+'</dl>'
   for stage in s.get('stages',[]):
    out+=f'<h3>{text(stage["title"])}</h3><p>{text(stage["description"])}</p>'
    for key,vi,en in [('problem','Áp lực cần giải quyết','Problem pressure'),('decision','Quyết định kiến trúc','Architectural decision'),('tradeoff','Chi phí và đánh đổi','Costs and trade-offs'),('nextPressure','Khi nào cần bước tiếp?','When is the next step needed?')]:
     if stage.get(key):out+=f'<p><strong>{vi if lang=="vi" else en}: </strong>{text(stage[key])}</p>'
    out+=f'<aside>{text(stage["exitCriteria"])}</aside>'
    if stage.get('diagram'):
     for trace in stage['diagram']['traces']:
      out+=f'<h4>{text(trace["label"])}</h4><ol>'+''.join(f'<li>{text(step["description"])}</li>' for step in trace['steps'])+'</ol>'
     out+='<dl>'+''.join(f'<dt>{text(n["label"])}</dt><dd>{text(n["detail"])}</dd>' for n in stage['diagram']['nodes'])+'</dl>'
   if c:=s.get('callout'):out+=f'<aside><strong>{text(c["title"])}</strong><p>{text(c["body"])}</p></aside>'
   for q in s.get('questions',[]):
    out+=f'<details><summary>{text(q["question"])}</summary>'+''.join(f'<p>{text(a)}</p>' for a in q['answer'])
    if q.get('followup'):out+=f'<p>{text(q["followup"])}</p>'
    out+='</details>'
   out+='</section>'
  suffix='' if lang=='vi' else '.en';other='' if lang=='en' else '.en'
  (DEST/f'{l["id"]}{suffix}.html').write_text(page(l['title'][lang],out,lang,f'{l["id"]}{other}.html'))
 title='System Design & AI Handbook'
 out='<h1>'+title+'</h1><div class="cards">'+''.join(f'<a href="{esc(l["id"])}{"" if lang=="vi" else ".en"}.html"><h2>{text(l["title"])}</h2><p>{text(l["summary"])}</p></a>' for l in lessons)+'</div>'
 (DEST/('index.html' if lang=='vi' else 'index.en.html')).write_text(page(title,out,lang,'index.en.html' if lang=='vi' else 'index.html'))
print(f'Rendered {len(lessons)} shared lessons in Vietnamese and English; React tools remain in AV Lore.')
