#!/usr/bin/env python3
"""Render shared handbook knowledge into this repository's static HTML format.
Usage: python3 tools/sync-handbook.py [path/to/av-lore/src/content/handbook]
Interactive React worksheets remain exclusive to AV Lore; all explanatory text is retained.
"""
import html
import json
import re
import sys
import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT.parent/'av-lore/src/content/handbook'
DEST=ROOT/'SystemDesign/Handbook'
DEST.mkdir(parents=True,exist_ok=True)
esc=lambda s:html.escape(str(s),quote=True)
lessons=[json.loads(p.read_text()) for p in sorted(SOURCE.glob('*.json'))]
if not lessons:raise SystemExit('No handbook lessons found')
glossary_folder=SOURCE.parent/'glossary'
glossary=[e for p in sorted(glossary_folder.glob('*.json')) for e in json.loads(p.read_text())]
if any(s.get('experiment')=='glossary' for l in lessons for s in l['sections']) and not glossary:raise SystemExit('Glossary source entries missing')
glossary.sort(key=lambda e:e['term'].casefold())
quiz_folder=SOURCE.parent/'quiz'
quiz=[q for p in sorted(quiz_folder.glob('*.json')) for q in json.loads(p.read_text())]
if any(s.get('experiment')=='knowledge-quiz' for l in lessons for s in l['sections']) and not quiz:raise SystemExit('Quiz source questions missing')
learning={};english={}
if any(section.get('experiment') in ['visual-recall','question-bank'] for lesson in lessons for section in lesson['sections']):
 learning_source=SOURCE.parent.parent/'lib/learning.ts'
 learning=json.loads(subprocess.run(['node','--input-type=module','-e','import(process.argv[1]).then(m=>console.log(JSON.stringify(m.learning)))',learning_source.resolve().as_uri()],check=True,capture_output=True,text=True).stdout)
 for name in ['en.json','en-overrides.json']:
  english.update(json.loads((SOURCE.parent.parent/'i18n'/name).read_text()))

def learning_english(value):
 key=' '.join(value.split());translated=english.get(key)
 if translated is None and any(ord(c)>127 for c in key):raise ValueError('Missing saved learning-map translation: '+key)
 result=translated if translated is not None else value
 if re.search(r'[ăâđêôơưĂÂĐÊÔƠƯ\u1EA0-\u1EF9]',result):raise ValueError('Untranslated learning-map value: '+key)
 return result
# Validate every new shared-map translation before writing any generated pages.
for topic_id,m in learning.items():
 topic=json.loads((SOURCE.parent/'topics'/f'{topic_id}.json').read_text())
 for value in [topic['title'],m['analogy'],*m['path'],*m['takeaways']]:learning_english(value)
style='''body{margin:0;background:#f9f8f4;color:#242c35;font:16px/1.9 system-ui,sans-serif}main,header,footer{max-width:1050px;margin:auto;padding:24px}main{overflow-wrap:anywhere}.cards>*{min-width:0}h1{font-size:clamp(30px,5vw,48px);line-height:1.3}h2{margin-top:64px;border-top:1px solid #cbd0d5;padding-top:24px;scroll-margin-top:24px}a{color:#24547a}nav{display:flex;gap:20px;flex-wrap:wrap}pre{white-space:pre;overflow:auto;background:#e9edf0;padding:20px;border-radius:10px;font-size:13px}aside,details{background:#eef1ed;border:1px solid #cbd0d5;padding:20px;border-radius:10px;margin:24px 0}summary{cursor:pointer;font-weight:600}.table{overflow:auto}table{width:100%;border-collapse:collapse;min-width:540px}th,td{text-align:left;vertical-align:top;border:1px solid #cbd0d5;padding:14px}th{background:#edf0f1}.diagram{overflow:auto;background:#edf0f1}.diagram svg{min-width:760px;width:100%}.diagram rect{fill:#fff;stroke:#50718b;stroke-width:2}.diagram text{font:13px system-ui;fill:#242c35}dt{font-weight:700;margin-top:20px}dd{margin-left:0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}.cards a{padding:24px;border:1px solid #cbd0d5;border-radius:12px;text-decoration:none} @media(prefers-color-scheme:dark){body{background:#111820;color:#d9e2eb}a{color:#8ec1ee}pre,aside,details,.diagram{background:#1d2a35}th{background:#233442}.diagram rect{fill:#263b4b;stroke:#9ab9d2}.diagram text{fill:#d9e2eb}}'''
(DEST/'handbook.css').write_text(style+'\n')
def page(title,body,lang,other):
 return f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} · IT Basic</title><link rel="stylesheet" href="handbook.css"></head><body><header><nav><a href="../index.html">IT Basic / System Design</a><a href="index.html">Handbook</a><a href="{esc(other)}">{"English" if lang=="vi" else "Tiếng Việt"}</a></nav></header><main>{body}</main><footer>IT Basic · Learn. Understand. Build.</footer></body></html>'
# Question Bank is a view of existing authoritative answers, not a second answer collection.
bank=[]
if any(s.get('experiment')=='question-bank' for l in lessons for s in l['sections']):
 topic_folder=SOURCE.parent/'topics'
 def bank_pair(value):return {'vi':value,'en':learning_english(value)}
 for p in sorted(topic_folder.glob('*.json')):
  topic=json.loads(p.read_text())
  for q in topic['questions']:
   bank.append({'question':bank_pair(q['question']),'answer':[bank_pair(q[k]) for k in ['answer','explanation'] if q[k].strip()], 'followup':bank_pair(q['followUp']) if q['followUp'] else None,'origins':[{'title':bank_pair(topic['title']),'topic':topic['id'],'question':q['id']}]})
 for item in lessons:
  for sec in item['sections']:
   for q in sec.get('questions',[]):
    bank.append({'question':q['question'],'answer':q['answer'],'followup':q.get('followup'),'origins':[{'title':item['title'],'lesson':item['id'],'section':sec['id']}]})
 unique={}
 for q in bank:
  fingerprint=json.dumps([q['question'],q['answer'],q['followup']],sort_keys=True,ensure_ascii=False)
  if fingerprint in unique:unique[fingerprint]['origins'].extend(q['origins'])
  else:unique[fingerprint]=q
 bank=list(unique.values())

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
    out+=f'<p class="diagram-caption">{text(graph["caption"])}</p>'
    for trace in graph['traces']:out+=f'<h3>{text(trace["label"])}</h3><ol>'+''.join(f'<li>{text(step["description"])}</li>' for step in trace['steps'])+'</ol>'
    out+='<dl>'+''.join(f'<dt>{text(n["label"])}</dt><dd>{text(n["detail"])}</dd>' for n in graph['nodes'])+'</dl>'
   for stage in s.get('stages',[]):
    out+=f'<h3>{text(stage["title"])}</h3><p>{text(stage["description"])}</p>'
    for key,vi,en in [('problem','Áp lực cần giải quyết','Problem pressure'),('decision','Quyết định kiến trúc','Architectural decision'),('tradeoff','Chi phí và đánh đổi','Costs and trade-offs'),('nextPressure','Khi nào cần bước tiếp?','When is the next step needed?')]:
     if stage.get(key):out+=f'<p><strong>{vi if lang=="vi" else en}: </strong>{text(stage[key])}</p>'
    out+=f'<aside>{text(stage["exitCriteria"])}</aside>'
    if stage.get('diagram'):
     out+=f'<p class="stage-diagram-caption">{text(stage["diagram"]["caption"])}</p>'
     for trace in stage['diagram']['traces']:
      out+=f'<h4>{text(trace["label"])}</h4><ol>'+''.join(f'<li>{text(step["description"])}</li>' for step in trace['steps'])+'</ol>'
     out+='<dl>'+''.join(f'<dt>{text(n["label"])}</dt><dd>{text(n["detail"])}</dd>' for n in stage['diagram']['nodes'])+'</dl>'
   if mock:=s.get('mock'):
    out+='<h3>'+('Coaching theo pha' if lang=='vi' else 'Phase coaching')+'</h3>'
    for phase in mock['coach']:
     out+=f'<section><h4>{text(phase["title"])}</h4><p>{text(phase["goal"])}</p><ul>'+''.join(f'<li>{text(c)}</li>' for c in phase['checklist'])+'</ul></section>'
    for prompt in mock['prompts']:
     out+=f'<article class="mock-prompt"><h3 id="mock-prompt-{esc(prompt["id"])}">{text(prompt["title"])}</h3><p>{text(prompt["prompt"])}</p><h4>Curveballs</h4><ul>'+''.join(f'<li>{text(c)}</li>' for c in prompt['curveballs'])+'</ul>'
     if prompt.get('lessonId') in known:
      id=prompt['lessonId'];out+=f'<a href="{esc(id)}{"" if lang=="vi" else ".en"}.html">{text(known[id]["title"])}</a>'
     if id:=prompt.get('topicId'):out+=f'<a href="../../NotesInterview/index.html#topic/{esc(id)}">Notes &amp; Interview / {esc(id)}</a>'
     out+='</article>'
   for scenario in s.get('workshop',[]):
    out+=f'<article class="reasoning-scenario"><h3 id="workshop-{esc(scenario["id"])}">{text(scenario["title"])}</h3><p>{text(scenario["prompt"])}</p><aside>{text(scenario["proposal"])}</aside>'
    for claim in scenario['claims']:
     out+=f'<section class="reasoning-claim"><h4>{text(claim["title"])}</h4><p>{text(claim["statement"])}</p><p>{text(claim["why"])}</p><p>{text(claim["check"])}</p></section>'
    out+='</article>'
   if s.get('experiment')=='visual-recall':
    def topic_text(value):
     if lang=='vi':return esc(value)
     return esc(learning_english(value))
    for topic_id,m in learning.items():
     topic=json.loads((SOURCE.parent/'topics'/f'{topic_id}.json').read_text())
     out+=f'<article><h3 id="map-topic-{esc(topic_id)}">Notes &amp; Interview / {topic_text(topic["title"])}</h3><ol>'+''.join(f'<li>{topic_text(step)}</li>' for step in m['path'])+'</ol><aside>'+topic_text(m['analogy'])+'</aside><ul>'+''.join(f'<li>{topic_text(t)}</li>' for t in m['takeaways'])+f'</ul><a href="../../NotesInterview/index.html#topic/{esc(topic_id)}">Notes &amp; Interview →</a></article>'
    for item in lessons:
     if item['id']!=l['id'] and item.get('overview'):
      out+=f'<article><h3 id="map-handbook-{esc(item["id"])}">{text(item["title"])}</h3>'+render_flow(item['overview'])+'<ul>'+''.join(f'<li>{text(t)}</li>' for t in item['takeaways'])+f'</ul><a href="{esc(item["id"])}{"" if lang=="vi" else ".en"}.html">'+('Mở bài học →' if lang=='vi' else 'Open lesson →')+'</a></article>'
   if s.get('experiment')=='knowledge-quiz':
    out+='<p>'+('Câu hỏi và giải thích đầy đủ; công cụ làm bài/timer thuộc bản AV Lore.' if lang=='vi' else 'Complete questions and explanations; session and timer tools are available in AV Lore.')+'</p><div class="quiz-corpus-transcript">'
    for q in quiz:
     out+=f'<article><h3 id="quiz-{esc(q["id"])}">{text(q["question"])}</h3><ol>'
     for option in q['options']:
      out+=f'<li><strong>{text(option["text"])}</strong><p>{text(option["rationale"])}</p>'
      if option['id']==q['correctId']:out+='<aside>'+('Đáp án theo tình huống' if lang=='vi' else 'Answer under the stated assumptions')+'</aside>'
      out+='</li>'
     out+='</ol>'+''.join(f'<p>{text(item)}</p>' for item in q['explanation'])
     if q.get('lessonId') in known:
      href=esc(q['lessonId'])+('' if lang=='vi' else '.en')+'.html'
     else:href='../../NotesInterview/index.html#topic/'+esc(q['topicId'])
     out+=f'<a href="{href}">'+('Mở bài học →' if lang=='vi' else 'Open lesson →')+'</a></article>'
    out+='</div>'
   if s.get('experiment')=='question-bank':
    out+='<p>'+('Toàn bộ câu hỏi và lời giải; công cụ lọc/luyện thẻ thuộc bản AV Lore.' if lang=='vi' else 'Complete questions and answers; filtering and flashcard tools are available in AV Lore.')+'</p><div class="question-bank-transcript">'
    for i,q in enumerate(bank):
     out+=f'<article><h3 id="bank-question-{i+1}">{text(q["question"])}</h3>'+''.join(f'<p>{text(a)}</p>' for a in q['answer'])
     if q.get('followup'):out+=f'<aside>{text(q["followup"])}</aside>'
     for origin in q['origins']:
      if origin.get('lesson'):href=esc(origin['lesson'])+('' if lang=='vi' else '.en')+'.html#'+esc(origin['section'])
      else:href='../../NotesInterview/index.html#topic/'+esc(origin['topic'])
      out+=f'<a href="{href}">{text(origin["title"])} →</a>'
     out+='</article>'
    out+='</div>'
   if s.get('experiment')=='glossary':
    out+='<nav aria-label="Glossary categories">'+''.join(f'<a href="#category-{esc(c)}">{text(label)}</a>' for c,label in {e['category']['id']:e['category']['label'] for e in glossary}.items())+'</nav>'
    for category in dict.fromkeys(e['category']['id'] for e in glossary):
     rows=[e for e in glossary if e['category']['id']==category]
     out+=f'<h3 id="category-{esc(category)}">{text(rows[0]["category"]["label"])}</h3>'
     for e in rows:
      out+=f'<article><h4 id="term-{esc(e["id"])}">{esc(e["term"])}</h4>'
      if e.get('aliases'):out+='<p>Alias: '+esc(' · '.join(e['aliases']))+'</p>'
      out+=f'<p>{text(e["definition"])}</p><aside><strong>{"Ví dụ cụ thể" if lang=="vi" else "Concrete example"}</strong><p>{text(e["example"])}</p></aside><aside><strong>{"Đừng nhầm" if lang=="vi" else "Common pitfall"}</strong><p>{text(e["pitfall"])}</p></aside><nav>'
      out+=''.join(f'<a href="{esc(id)}{"" if lang=="vi" else ".en"}.html">{text(known[id]["title"])}</a>' for id in e.get('relatedLessons',[]) if id in known)
      out+=''.join(f'<a href="../../NotesInterview/index.html#topic/{esc(id)}">Notes &amp; Interview / {esc(id)}</a>' for id in e.get('relatedTopics',[]))+'</nav></article>'
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
