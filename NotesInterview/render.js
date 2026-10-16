/* Shared, dependency-free renderer for the app and its static reading edition. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NIRender = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paragraphs = values => values.map(v => `<p>${esc(v)}</p>`).join('');
  function diagram(d, key) {
    if (!d) return '';
    const marker = `arrow-${key.replace(/[^a-z0-9-]/gi, '-')}`;
    let svg = '';
    if (d.type === 'boxes') {
      svg = `<svg viewBox="0 0 640 400" role="img" aria-labelledby="title-${marker}"><title id="title-${marker}">${esc(d.title)}</title>`;
      d.labels.forEach((label,i)=>{const x=20+i*40,y=20+i*45;svg+=`<rect x="${x}" y="${y}" width="${600-i*80}" height="${360-i*90}" rx="8" fill="${['#f8eadc','#d9c7a5','#e3f1eb','#fffefa'][i]}" stroke="#91a68f"/><text x="${x+13}" y="${y+26}" fill="#234e44">${esc(label)}</text>`;});
      svg+='</svg>';
    } else if (d.type === 'graph') {
      const h = Math.max(...d.nodes.map(n=>n[1])) + 65;
      svg = `<svg viewBox="0 0 640 ${h}" role="img" aria-labelledby="title-${marker} desc-${marker}"><title id="title-${marker}">${esc(d.title)}</title><desc id="desc-${marker}">${esc(d.edges.map(([a,b])=>`${d.nodes[a][2]} nối tới ${d.nodes[b][2]}`).join('. '))}</desc><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#166d66"/></marker></defs>`;
      d.edges.forEach(([a,b])=>{const [x1,y1]=d.nodes[a],[x2,y2]=d.nodes[b],angle=Math.atan2(y2-y1,x2-x1),cos=Math.cos(angle),sin=Math.sin(angle),r=Math.min(64/Math.max(Math.abs(cos),.001),24/Math.max(Math.abs(sin),.001));svg+=`<line x1="${x1+r*cos}" y1="${y1+r*sin}" x2="${x2-(r+5)*cos}" y2="${y2-(r+5)*sin}" stroke="#719787" stroke-width="2" marker-end="url(#${marker})"/>`;});
      d.nodes.forEach(([x,y,label],i)=>{svg+=`<rect x="${x-64}" y="${y-24}" width="128" height="48" rx="12" fill="${i%2?'#f8eadc':'#e3f1eb'}" stroke="#a8c4b6"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#234e44">${esc(label)}</text>`;});
      svg+='</svg>';
    } else if (d.type === 'sequence') {
      const w = Math.max(680, d.actors.length * 190), h = 105 + d.steps.length * 61;
      const xs = d.actors.map((_, i) => 100 + i * (w - 200) / (d.actors.length - 1));
      svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title-${marker} desc-${marker}"><title id="title-${marker}">${esc(d.title)}</title><desc id="desc-${marker}">${esc(d.steps.map(s => `${d.actors[s[0]]} tới ${d.actors[s[1]]}: ${s[2]}`).join('. '))}</desc><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#166d66"/></marker></defs>`;
      d.actors.forEach((a, i) => { svg += `<rect x="${xs[i]-83}" y="12" width="166" height="42" rx="12" fill="#e3f1eb" stroke="#9cbdb0"/><text x="${xs[i]}" y="38" text-anchor="middle" fill="#184c46">${esc(a)}</text><line x1="${xs[i]}" y1="58" x2="${xs[i]}" y2="${h-15}" stroke="#b6c4bd" stroke-dasharray="5 6"/>`; });
      d.steps.forEach(([a,b,label], i) => {
        const y = 103 + i * 61;
        svg += `<text x="${(xs[a]+xs[b])/2}" y="${y-11}" text-anchor="middle" fill="#294b43">${i+1}. ${esc(label)}</text><line x1="${xs[a]}" y1="${y}" x2="${xs[b]}" y2="${y}" stroke="#166d66" stroke-width="2" marker-end="url(#${marker})"/>`;
      });
      svg += '</svg>';
    } else {
      // Alternating rows keep long diagrams readable without tiny text.
      const h = d.nodes.length * 78 + 6;
      svg = `<svg viewBox="0 0 640 ${h}" role="img" aria-labelledby="title-${marker}"><title id="title-${marker}">${esc(d.title)}</title><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#166d66"/></marker></defs>`;
      d.nodes.forEach((label,i) => {
        const y = i * 78 + 8;
        if (i) svg += `<line x1="320" y1="${y-24}" x2="320" y2="${y-3}" stroke="#166d66" stroke-width="2" marker-end="url(#${marker})"/>`;
        svg += `<rect x="75" y="${y}" width="490" height="48" rx="12" fill="${i%2?'#f8eadc':'#e3f1eb'}" stroke="${i%2?'#d9b697':'#a8c4b6'}"/><text x="320" y="${y+30}" text-anchor="middle" fill="#234e44">${i+1}. ${esc(label)}</text>`;
      }); svg += '</svg>';
    }
    return `<figure class="diagram"><figcaption>${esc(d.title)}</figcaption><div class="diagram-scroll" tabindex="0" role="region" aria-label="Sơ đồ ${esc(d.title)}">${svg}</div><p class="diagram-hint">Vuốt ngang để xem hết sơ đồ →</p><p class="caption">${esc(d.caption)}</p></figure>`;
  }
  function table(t) {
    if (!t) return '';
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="Bảng minh họa"><table><thead><tr>${t.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function noteBody(n, key) {
    return paragraphs(n.body) + diagram(n.diagram,key) + table(n.table) +
      (n.example?`<div class="code-wrap"><span class="code-label">Ví dụ · đọc kỹ chú thích và ngữ cảnh</span><pre><code>${esc(n.example)}</code></pre></div>`:'') +
      (n.pitfall?`<aside class="callout caution"><strong>Dễ hiểu nhầm</strong><p>${esc(n.pitfall)}</p></aside>`:'') +
      (n.exercise?`<aside class="callout exercise"><strong>Thử tự giải thích / thực hành</strong><p>${esc(n.exercise)}</p></aside>`:'') +
      (n.download?`<p><a href="${esc(n.download.url)}" download>${esc(n.download.title)} ↓</a></p>`:'');
  }
  function sources(t) {
    return `<div class="source-links"><strong>Đọc và đối chiếu</strong>${t.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}</div>`;
  }
  return { esc, paragraphs, diagram, table, noteBody, sources };
});
