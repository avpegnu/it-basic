/**
 * IT Basic — Shared progress library
 * Single source of truth cho localStorage tiến độ học tập.
 * Dùng bởi master /index.html.
 *
 * Schema localStorage:
 *   itbasic_progress = { "<pillarId>": { "chuong1.html": true, ... }, ... }
 *   itbasic_quiz     = { "<pillarId>": { "chuong1.html": { score, total, date }, ... }, ... }
 */
(function () {
  const PROGRESS_KEY = 'itbasic_progress';
  const QUIZ_KEY = 'itbasic_quiz';

  // Pillar registry — phải sync với chapters trong copy.js mỗi pillar
  const PILLARS = [
    { id: 'CLI',                 name: 'CLI / Terminal',           total: 10, path: 'CLI/index.html',                         accent: '#4ade80' },
    { id: 'DSA',                 name: 'DSA',                       total: 12, path: 'DSA/index.html',                         accent: '#67e8f9' },
    { id: 'OS',                  name: 'OS',                        total: 10, path: 'OS/index.html',                          accent: '#a05a2c' },
    { id: 'Networking',          name: 'Networking',                total: 10, path: 'Networking/index.html',                  accent: '#6366f1' },
    { id: 'Database',            name: 'Database',                  total: 12, path: 'Database/index.html',                    accent: '#0d6e6e' },
    { id: 'OOP',                 name: 'OOP & Design Patterns',     total: 8,  path: 'OOP/index.html',                         accent: '#8b3a3a' },
    { id: 'SystemDesign',        name: 'System Design',             total: 8,  path: 'SystemDesign/index.html',                accent: '#2c4a6b' },
    { id: 'DevOps',              name: 'DevOps',                    total: 14, path: 'DevOps/index.html',                      accent: '#22d3ee' },
    { id: 'ProgrammingLanguage', name: 'Dart · Flutter · JS · Python', total: 45, path: 'Programming Language/index.html',     accent: '#0468d7' },
  ];

  function loadStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  }
  function saveStore(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
  }

  function getPillarProgress(pillarId, total) {
    const store = loadStore(PROGRESS_KEY);
    const pillar = store[pillarId] || {};
    const done = Object.values(pillar).filter(Boolean).length;
    const t = total || PILLARS.find(p => p.id === pillarId)?.total || 0;
    return { done, total: t, percent: t ? Math.round(done / t * 100) : 0 };
  }

  function getOverallProgress() {
    let totalDone = 0, totalAll = 0;
    for (const p of PILLARS) {
      const { done, total } = getPillarProgress(p.id, p.total);
      totalDone += done; totalAll += total;
    }
    return { done: totalDone, total: totalAll, percent: totalAll ? Math.round(totalDone / totalAll * 100) : 0 };
  }

  function resetAll() {
    if (!confirm('Reset toàn bộ tiến độ học tập + lịch sử quiz của TẤT CẢ trụ cột?')) return;
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(QUIZ_KEY);
    location.reload();
  }

  window.ITBasicShared = {
    PILLARS,
    getPillarProgress,
    getOverallProgress,
    resetAll,
  };
})();
