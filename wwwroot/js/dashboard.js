
'use strict';

const PALETTE = ['#5B8FE8', '#7C6FD4', '#2CB5A0', '#F0A030', '#E85B6F'];

function fmtM(v) { return v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${v.toLocaleString()}`; }
function fmtFull(v) { return `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 0 })}`; }
function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function wrapLabel(s, n) { const ws = s.split(/\s+/), ls = []; let c = ''; for (const w of ws) { if ((c + ' ' + w).trim().length > n) { if (c) ls.push(c.trim()); c = w; } else c = (c + ' ' + w).trim(); } if (c) ls.push(c.trim()); return ls; }
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val ?? '—'; }

function makeTooltip(rawData) {
    return {
        enabled: false, external: function (context) {
            let el = document.getElementById('aegle-tooltip');
            if (!el) { el = document.createElement('div'); el.id = 'aegle-tooltip'; el.style.cssText = `position:fixed;background:#1E2A45;color:#fff;border-radius:10px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:13px;pointer-events:none;z-index:9999;box-shadow:0 6px 24px rgba(30,42,69,0.3);transition:opacity 0.2s ease;min-width:170px;`; document.body.appendChild(el); }
            const tip = context.tooltip;
            if (tip.opacity === 0) { el.style.opacity = '0'; return; }
            if (tip.dataPoints && tip.dataPoints.length) {
                const dp = tip.dataPoints[0], idx = dp.dataIndex;
                const label = rawData ? (rawData[idx]?.name || dp.label) : dp.label;
                const color = PALETTE[idx % PALETTE.length];
                el.innerHTML = `<div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;"><div style="width:9px;height:9px;border-radius:50%;background:${color};flex-shrink:0;"></div><span style="font-weight:600;color:#E2E8F4;font-size:12px;line-height:1.3;">${label}</span></div><div style="color:#F0A030;font-weight:700;font-size:15px;">${fmtFull(dp.raw)}</div><div style="color:#7B8FAD;font-size:11px;margin-top:3px;">FY 2025-26</div>`;
            }
            const rect = context.chart.canvas.getBoundingClientRect();
            const x = rect.left + tip.caretX, y = rect.top + tip.caretY;
            const elW = el.offsetWidth || 180, elH = el.offsetHeight || 70, pad = 14;
            let left = x + pad, top = y - elH / 2;
            if (left + elW > window.innerWidth - 10) left = x - elW - pad;
            if (top < 10) top = 10;
            if (top + elH > window.innerHeight - 10) top = window.innerHeight - elH - 10;
            el.style.left = left + 'px'; el.style.top = top + 'px'; el.style.opacity = '1';
        }
    };
}

let pieChart = null, barChart = null, hbarChart = null, currentDept = '';
const SLOW_ANIM = { duration: 1200, easing: 'easeInOutQuart' };
const NO_ANIM = { duration: 0 };

function initPieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'doughnut', plugins: [ChartDataLabels],
        data: { labels: data.map(d => d.name), datasets: [{ data: data.map(d => d.total), backgroundColor: PALETTE, borderWidth: 3, borderColor: '#FFFFFF', offset: 16, hoverOffset: 24 }] },
        options: {
            cutout: 0, responsive: true, maintainAspectRatio: true, animation: SLOW_ANIM,
            plugins: { legend: { display: false }, datalabels: { display: false }, tooltip: makeTooltip(data) }
        }
    });
}

function initBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar', plugins: [ChartDataLabels],
        data: { labels: data.map(d => wrapLabel(d.name, 12)), datasets: [{ data: data.map(d => d.total), backgroundColor: PALETTE, borderRadius: 7, borderSkipped: false, barPercentage: .55, categoryPercentage: .7 }] },
        options: {
            responsive: true, maintainAspectRatio: false, animation: SLOW_ANIM,
            plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#1E2A45', font: { family: 'DM Sans', size: 11, weight: '600' }, formatter: v => fmtM(v) }, tooltip: makeTooltip(data) },
            scales: { x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#7B8FAD', maxRotation: 0 } }, y: { grid: { color: 'rgba(74,127,212,0.08)', lineWidth: 1 }, border: { dash: [4, 4] }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#2D3A54', callback: v => fmtM(v) } } },
            layout: { padding: { top: 24 } }
        }
    });
}

function initHbarChart(data) {
    const ctx = document.getElementById('hbarChart').getContext('2d');
    const colors = data.map((_, i) => PALETTE[i % PALETTE.length]);
    hbarChart = new Chart(ctx, {
        type: 'bar', plugins: [ChartDataLabels],
        data: { labels: data.map(d => truncate(d.name, 22)), datasets: [{ data: data.map(d => d.total), backgroundColor: colors, borderRadius: 5, borderSkipped: false, barPercentage: .7, categoryPercentage: .85 }] },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: SLOW_ANIM,
            plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'right', color: '#1E2A45', font: { family: 'DM Sans', size: 10, weight: '600' }, formatter: v => fmtM(v), clip: false }, tooltip: makeTooltip(data) },
            scales: { x: { grid: { color: 'rgba(74,127,212,0.08)', lineWidth: 1 }, border: { dash: [4, 4] }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#7B8FAD', callback: v => fmtM(v) } }, y: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 10 }, color: '#2D3A54', crossAlign: 'far' } } },
            layout: { padding: { right: 44 } }
        }
    });
}

function updateKPIs(kpis) {
    setText('kpi-totalSuppliers', kpis.totalSuppliers);
    setText('kpi-topSupplier', kpis.topSupplier.name);
    setText('kpi-totalRevenue', fmtM(kpis.totalRevenue));
    setText('kpi-totalOrders', kpis.totalCompletedOrders);
    setGrowth('kpi-supplierGrowth', kpis.supplierGrowth, true);
    setGrowth('kpi-topSupplierGrowth', kpis.topSupplierGrowth, true);
    setGrowth('kpi-revenueGrowth', kpis.revenueGrowth, true);
    setGrowth('kpi-ordersGrowth', kpis.ordersGrowth, false);
}

function setGrowth(id, pct, isUp) {
    const el = document.getElementById(id); if (!el) return;
    const abs = Math.abs(pct).toFixed(1);
    const arrow = isUp ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>` : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;
    el.innerHTML = `${arrow} +${abs}% vs last quarter`;
    el.className = `kpi-growth ${isUp ? 'up' : 'down'}`;
}

function updatePieChart(data) {
    const legendEl = document.getElementById('pieLegend');
    const total = data.reduce((s, d) => s + d.total, 0);
    legendEl.innerHTML = data.map((d, i) => `<div class="legend-row"><div class="legend-dot" style="background:${PALETTE[i]}"></div><span class="legend-name" title="${d.name}">${d.name}</span><span class="legend-pct">${d.percentage}%</span></div>`).join('') + `<hr class="legend-divider"/><div class="legend-total"><span class="legend-total-label">Total Spend</span><span class="legend-total-val">${fmtM(total)}</span></div>`;
    if (!pieChart) { initPieChart(data); return; }
    pieChart.data.labels = data.map(d => d.name);
    pieChart.data.datasets[0].data = data.map(d => d.total);
    pieChart.options.animation = NO_ANIM;
    pieChart.update();
}

function updateBarChart(data) {
    if (!barChart) { initBarChart(data); return; }
    barChart.data.labels = data.map(d => wrapLabel(d.name, 12));
    barChart.data.datasets[0].data = data.map(d => d.total);
    barChart.options.animation = NO_ANIM;
    barChart.update();
}

const BADGE_C = ['gold', 'silver', 'bronze', 'plain', 'plain'];
const ICONS = ['🏆', '🥈', '🥉', '4', '5'];
const PILL_C = ['p1', 'p2', 'p3', 'p4', 'p5'];

function updateRankList(data) {
    document.getElementById('rankList').innerHTML = data.map((d, i) => {
        const ini = d.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
        return `<div class="rank-row" style="animation-delay:${i * 100}ms"><div class="rank-badge ${BADGE_C[i]}">${i < 3 ? `<span style="font-size:14px">${ICONS[i]}</span>` : `<span style="font-size:12px;font-weight:700;color:#4A6FA5">${ICONS[i]}</span>`}</div><div class="rank-avatar">${ini}</div><div class="rank-info"><div class="rank-name" title="${d.name}">${d.name}</div><div class="rank-orders">${d.count} orders</div></div><div class="rank-pill ${PILL_C[i]}">${ordinal(i + 1)}</div></div>`;
    }).join('');
}

function updateHorizontalBar(data) {
    document.getElementById('hbar-badge').textContent = `${data.length} Items`;
    if (!hbarChart) { initHbarChart(data); return; }
    const colors = data.map((_, i) => PALETTE[i % PALETTE.length]);
    hbarChart.data.labels = data.map(d => truncate(d.name, 22));
    hbarChart.data.datasets[0].data = data.map(d => d.total);
    hbarChart.data.datasets[0].backgroundColor = colors;
    hbarChart.options.animation = NO_ANIM;
    hbarChart.update();
}
function updateSupplierProgress(data) {
    const el = document.getElementById('supplierProgress');
    const max = data.length ? Math.max(...data.map(d => d.total)) : 1;
    el.innerHTML = data.slice(0, 5).map((d, i) => `<div><div class="prog-row-header"><div class="prog-dot" style="background:${PALETTE[i]}"></div><span class="prog-name" title="${d.name}">${d.name}</span><span class="prog-amount">${fmtM(d.total)}</span></div><div class="prog-track"><div class="prog-fill" id="sp-fill-${i}" style="background:${PALETTE[i]}"></div></div></div>`).join('');
    setTimeout(() => { data.slice(0, 5).forEach((d, i) => { const f = document.getElementById(`sp-fill-${i}`); if (f) f.style.width = (d.total / max * 100) + '%'; }); }, 80);
}

function updateItemProgress(data) {
    const el = document.getElementById('itemProgress');
    const max = data.length ? Math.max(...data.map(d => d.total)) : 1;
    el.innerHTML = data.map((d, i) => `<div><div class="prog-row-header"><div class="prog-rank-circle" style="background:${PALETTE[i]}">${i + 1}</div><span class="prog-name" title="${d.name}">${d.name}</span><span class="prog-amount">${fmtM(d.total)}</span></div><div class="prog-track"><div class="prog-fill" id="ip-fill-${i}" style="background:${PALETTE[i]}"></div></div></div>`).join('');
    setTimeout(() => { data.forEach((d, i) => { const f = document.getElementById(`ip-fill-${i}`); if (f) f.style.width = (d.total / max * 100) + '%'; }); }, 80);
}

async function refreshDashboard(department = '') {
    currentDept = department;
    const qs = department ? `?department=${encodeURIComponent(department)}` : '';
    try {
        const [kpis, pieData, barData, rankData, hBarData, suppOV, itemOV] = await Promise.all([
            fetch(`/api/procurement/kpis${qs}`).then(r => r.json()),
            fetch(`/api/procurement/top5-supplier-spend${qs}`).then(r => r.json()),
            fetch(`/api/procurement/top5-supplier-spend${qs}`).then(r => r.json()),
            fetch(`/api/procurement/top5-supplier-order-count${qs}`).then(r => r.json()),
            fetch(`/api/procurement/items-by-order-value${qs}`).then(r => r.json()),
            fetch(`/api/procurement/supplier-by-order-value${qs}`).then(r => r.json()),
            fetch(`/api/procurement/top5-items-by-order-value${qs}`).then(r => r.json()),
        ]);
        updateKPIs(kpis); updatePieChart(pieData); updateBarChart(barData);
        updateRankList(rankData); updateHorizontalBar(hBarData);
        updateSupplierProgress(suppOV); updateItemProgress(itemOV);
    } catch (err) { console.error('[Aegle] Refresh failed:', err); }
}

Chart.register(ChartDataLabels);

document.getElementById('deptDropdown').addEventListener('change', function () { refreshDashboard(this.value); });

document.addEventListener('mouseleave', e => {
    if (e.target.tagName === 'CANVAS') { const t = document.getElementById('aegle-tooltip'); if (t) t.style.opacity = '0'; }
}, true);

// Wait for DOM to be fully ready then load
document.addEventListener('DOMContentLoaded', function () {
    refreshDashboard();
    setInterval(() => refreshDashboard(currentDept), 30_000);
});