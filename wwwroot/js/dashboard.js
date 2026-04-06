// wwwroot/js/dashboard.js
'use strict';

const PALETTE = ['#5B8FE8', '#7C6FD4', '#2CB5A0', '#F0A030', '#E85B6F'];
let pieChart = null, barChart = null, hbarChart = null;

// UTILITY FUNCTIONS

function fmtM(v) {
    if (v >= 1e6) return `AED ${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `AED ${(v / 1e3).toFixed(0)}K`;
    return `AED ${v.toFixed(0)}`;
}

function fmtFull(v) {
    return `AED ${Number(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '—';
}

function wrapLabel(s, n) {
    const ws = s.split(/\s+/);
    const ls = [];
    let c = '';
    for (const w of ws) {
        if ((c + ' ' + w).trim().length > n) {
            if (c) ls.push(c.trim());
            c = w;
        } else {
            c = (c + ' ' + w).trim();
        }
    }
    if (c) ls.push(c.trim());
    return ls;
}

function truncate(s, n) {
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// CHART INITIALIZATION

function initPieChart(data) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    const canvasCtx = ctx.getContext('2d');
    if (pieChart) pieChart.destroy();

    pieChart = new Chart(canvasCtx, {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                data: data.map(d => d.total),
                backgroundColor: PALETTE,
                borderWidth: 3,
                borderColor: '#FFFFFF',
                offset: 16,
                hoverOffset: 24
            }]
        },
        options: {
            cutout: 0,
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 1200, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                datalabels: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => fmtFull(context.parsed)
                    }
                }
            }
        }
    });
}
function initBarChart(data) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    const canvasCtx = ctx.getContext('2d');
    if (barChart) barChart.destroy();

    barChart = new Chart(canvasCtx, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: data.map(d => wrapLabel(d.name, 12)),
            datasets: [{
                data: data.map(d => d.total),
                backgroundColor: PALETTE,
                borderRadius: 7,
                borderSkipped: false,
                barPercentage: 0.55,
                categoryPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#1E2A45',
                    font: { family: 'DM Sans', size: 11, weight: '600' },
                    formatter: v => fmtM(v)
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => fmtFull(context.parsed.y)
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'DM Sans', size: 10 },
                        color: '#7B8FAD',
                        maxRotation: 0
                    }
                },
                y: {
                    grid: { color: 'rgba(74,127,212,0.08)', lineWidth: 1 },
                    border: { dash: [4, 4] },
                    ticks: {
                        font: { family: 'DM Sans', size: 10 },
                        color: '#2D3A54',
                        callback: v => fmtM(v)
                    }
                }
            },
            layout: { padding: { top: 24 } }
        }
    });
}

function initHbarChart(data) {
    const ctx = document.getElementById('hbarChart');
    if (!ctx) return;

    const canvasCtx = ctx.getContext('2d');
    if (hbarChart) hbarChart.destroy();

    const colors = data.map((_, i) => PALETTE[i % PALETTE.length]);

    hbarChart = new Chart(canvasCtx, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: data.map(d => truncate(d.name, 22)),
            datasets: [{
                data: data.map(d => d.total),
                backgroundColor: colors,
                borderRadius: 5,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.85
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    color: '#1E2A45',
                    font: { family: 'DM Sans', size: 10, weight: '600' },
                    formatter: v => fmtM(v),
                    clip: false
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => fmtFull(context.parsed.x)
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(74,127,212,0.08)', lineWidth: 1 },
                    border: { dash: [4, 4] },
                    ticks: {
                        font: { family: 'DM Sans', size: 10 },
                        color: '#7B8FAD',
                        callback: v => fmtM(v)
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'DM Sans', size: 10 },
                        color: '#2D3A54',
                        crossAlign: 'far'
                    }
                }
            },
            layout: { padding: { right: 44 } }
        }
    });
}

// UPDATE UI COMPONENTS

function updateKPIs(kpis) {
    console.log('📊 Updating KPI cards:', kpis);
    
    setText('kpi-totalSuppliers', kpis.totalSuppliers);
    setText('kpi-topSupplier', kpis.topSupplier.name || 'N/A');
    setText('kpi-totalRevenue', fmtM(kpis.totalRevenue));
    setText('kpi-totalOrders', kpis.totalCompletedOrders);
    
    updateGrowth('kpi-supplierGrowth', kpis.supplierGrowth, true);
    updateGrowth('kpi-topSupplierGrowth', kpis.topSupplierGrowth, true);
    updateGrowth('kpi-revenueGrowth', kpis.revenueGrowth, true);
    updateGrowth('kpi-ordersGrowth', kpis.ordersGrowth, false);
}

function updateGrowth(id, value, isUp) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const abs = Math.abs(value).toFixed(1);
    const arrow = isUp
        ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
        : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
    
    el.innerHTML = `${arrow} +${abs}%`;
    el.className = `kpi-growth ${isUp ? 'up' : 'down'}`;
}

function updatePieChart(data) {
    console.log('📈 Updating pie chart:', data);
    
    const legendEl = document.getElementById('pieLegend');
    if (!legendEl) return;
    
    const total = data.reduce((s, d) => s + d.total, 0);
    
    legendEl.innerHTML = data.map((d, i) => `
        <div class="legend-row">
            <div class="legend-dot" style="background:${PALETTE[i]}"></div>
            <span class="legend-name" title="${d.name}">${d.name}</span>
            <span class="legend-pct">${d.percentage?.toFixed(1) || '0'}%</span>
        </div>
    `).join('') + `
        <hr class="legend-divider"/>
        <div class="legend-total">
            <span class="legend-total-label">Total Spend</span>
            <span class="legend-total-val">${fmtM(total)}</span>
        </div>
    `;
    
    if (!pieChart) {
        initPieChart(data);
    } else {
        pieChart.data.labels = data.map(d => d.name);
        pieChart.data.datasets[0].data = data.map(d => d.total);
        pieChart.update();
    }
}

function updateBarChart(data) {
    console.log('📊 Updating bar chart:', data);
    
    if (!barChart) {
        initBarChart(data);
    } else {
        barChart.data.labels = data.map(d => wrapLabel(d.name, 12));
        barChart.data.datasets[0].data = data.map(d => d.total);
        barChart.update();
    }
}

function updateRankList(data) {
    console.log('🏆 Updating rank list:', data);
    
    const rankList = document.getElementById('rankList');
    if (!rankList) return;
    
    const badges = ['gold', 'silver', 'bronze', 'plain', 'plain'];
    const icons = ['🏆', '🥈', '🥉', '4', '5'];
    
    rankList.innerHTML = data.slice(0, 5).map((d, i) => {
        const ini = d.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
        return `
            <div class="rank-row" style="animation-delay:${i * 100}ms">
                <div class="rank-badge ${badges[i]}">
                    ${i < 3 ? `<span style="font-size:14px">${icons[i]}</span>` : `<span>${i + 1}</span>`}
                </div>
                <div class="rank-avatar">${ini}</div>
                <div class="rank-info">
                    <div class="rank-name" title="${d.name}">${d.name}</div>
                    <div class="rank-orders">${d.count} orders</div>
                </div>
                <div class="rank-pill p${i + 1}">${d.count}</div>
            </div>
        `;
    }).join('');
}

function updateHorizontalBar(data) {
    console.log('📊 Updating horizontal bar:', data);
    
    const badgeEl = document.getElementById('hbar-badge');
    if (badgeEl) badgeEl.textContent = `${data.length} Items`;
    
    if (!hbarChart) {
        initHbarChart(data.slice(0, 10));
    } else {
        const colors = data.slice(0, 10).map((_, i) => PALETTE[i % PALETTE.length]);
        hbarChart.data.labels = data.slice(0, 10).map(d => truncate(d.name, 22));
        hbarChart.data.datasets[0].data = data.slice(0, 10).map(d => d.total);
        hbarChart.data.datasets[0].backgroundColor = colors;
        hbarChart.update();
    }
}

function updateSupplierProgress(data) {
    console.log('📈 Updating supplier progress:', data);
    
    const el = document.getElementById('supplierProgress');
    if (!el) return;
    
    const max = data.length ? Math.max(...data.map(d => d.total)) : 1;
    
    el.innerHTML = data.slice(0, 5).map((d, i) => `
        <div>
            <div class="prog-row-header">
                <div class="prog-dot" style="background:${PALETTE[i]}"></div>
                <span class="prog-name" title="${d.name}">${d.name}</span>
                <span class="prog-amount">${fmtM(d.total)}</span>
            </div>
            <div class="prog-track">
                <div class="prog-fill" id="sp-fill-${i}" style="background:${PALETTE[i]}; width: 0%"></div>
            </div>
        </div>
    `).join('');
    
    setTimeout(() => {
        data.slice(0, 5).forEach((d, i) => {
            const f = document.getElementById(`sp-fill-${i}`);
            if (f) f.style.width = (d.total / max * 100) + '%';
        });
    }, 100);
}

function updateItemProgress(data) {
    console.log('📈 Updating item progress:', data);
    
    const el = document.getElementById('itemProgress');
    if (!el) return;
    
    const max = data.length ? Math.max(...data.map(d => d.total)) : 1;
    
    el.innerHTML = data.slice(0, 5).map((d, i) => `
        <div>
            <div class="prog-row-header">
                <div class="prog-rank-circle" style="background:${PALETTE[i]}">${i + 1}</div>
                <span class="prog-name" title="${d.name}">${d.name}</span>
                <span class="prog-amount">${fmtM(d.total)}</span>
            </div>
            <div class="prog-track">
                <div class="prog-fill" id="ip-fill-${i}" style="background:${PALETTE[i]}; width: 0%"></div>
            </div>
        </div>
    `).join('');
    
    setTimeout(() => {
        data.slice(0, 5).forEach((d, i) => {
            const f = document.getElementById(`ip-fill-${i}`);
            if (f) f.style.width = (d.total / max * 100) + '%';
        });
    }, 100);
}

// MAIN REFRESH FUNCTION

async function refreshDashboard(department = '') {
    try {
        const baseUrl = '/api/procurement';
        const query = department ? `?department=${encodeURIComponent(department)}` : '';

        console.log('🔄 Refreshing dashboard...', { baseUrl, query });

        // 1. KPI Data
        console.log('📍 Fetching KPI data...');
        const kpiResponse = await fetch(`${baseUrl}/kpis${query}`);
        if (!kpiResponse.ok) throw new Error(`KPI fetch failed: ${kpiResponse.status}`);
        const kpiData = await kpiResponse.json();
        console.log('✅ KPI Data:', kpiData);
        updateKPIs(kpiData);

        // 2. Top 5 Supplier Spend
        console.log('📍 Fetching Top 5 Supplier Spend...');
        const supplierSpendResponse = await fetch(`${baseUrl}/top5-supplier-spend${query}`);
        if (!supplierSpendResponse.ok) throw new Error(`Supplier spend fetch failed: ${supplierSpendResponse.status}`);
        const supplierSpendData = await supplierSpendResponse.json();
        console.log('✅ Supplier Spend Data:', supplierSpendData);
        updatePieChart(supplierSpendData);
        updateBarChart(supplierSpendData);

        // 3. Top 5 Supplier Order Count
        console.log('📍 Fetching Top 5 Supplier Order Count...');
        const orderCountResponse = await fetch(`${baseUrl}/top5-supplier-order-count${query}`);
        if (!orderCountResponse.ok) throw new Error(`Order count fetch failed: ${orderCountResponse.status}`);
        const orderCountData = await orderCountResponse.json();
        console.log('✅ Order Count Data:', orderCountData);
        updateRankList(orderCountData);

        // 4. Items by Order Value
        console.log('📍 Fetching Items by Order Value...');
        const itemsResponse = await fetch(`${baseUrl}/items-by-order-value${query}`);
        if (!itemsResponse.ok) throw new Error(`Items fetch failed: ${itemsResponse.status}`);
        const itemsData = await itemsResponse.json();
        console.log('✅ Items Data:', itemsData);
        updateHorizontalBar(itemsData);

        // 5. Supplier by Order Value
        console.log('📍 Fetching Supplier by Order Value...');
        const supplierValueResponse = await fetch(`${baseUrl}/supplier-by-order-value${query}`);
        if (!supplierValueResponse.ok) throw new Error(`Supplier value fetch failed: ${supplierValueResponse.status}`);
        const supplierValueData = await supplierValueResponse.json();
        console.log('✅ Supplier Value Data:', supplierValueData);
        updateSupplierProgress(supplierValueData);

        // 6. Top 5 Items by Order Value
        console.log('📍 Fetching Top 5 Items...');
        const top5ItemsResponse = await fetch(`${baseUrl}/top5-items-by-order-value${query}`);
        if (!top5ItemsResponse.ok) throw new Error(`Top 5 items fetch failed: ${top5ItemsResponse.status}`);
        const top5ItemsData = await top5ItemsResponse.json();
        console.log('✅ Top 5 Items Data:', top5ItemsData);
        updateItemProgress(top5ItemsData);

        console.log('✅✅✅ Dashboard refresh complete!');

    } catch (error) {
        console.error('❌ Error refreshing dashboard:', error.message);
        console.error('Stack:', error.stack);
    }
}

// MODAL & VIEW ALL FUNCTIONALITY

const modalConfig = {
    pie: {
        title: 'All Suppliers by Spend',
        columns: ['Supplier Name', 'Total Spend', 'Percentage'],
        endpoint: '/api/procurement/top5-supplier-spend'
    },
    bar: {
        title: 'All Suppliers by Spend Distribution',
        columns: ['Supplier Name', 'Total Spend', 'Percentage'],
        endpoint: '/api/procurement/top5-supplier-spend'
    },
    rank: {
        title: 'All Suppliers by Order Count',
        columns: ['Rank', 'Supplier Name', 'Order Count'],
        endpoint: '/api/procurement/top5-supplier-order-count'
    },
    items: {
        title: 'All Items by Order Value',
        columns: ['Item Code', 'Item Name', 'TOrder', 'Total Value'],
        endpoint: '/api/procurement/items-by-order-value'
    },
    order: {
        title: 'All Suppliers by Order Value',
        columns: ['Rank', 'Supplier Name', 'Total Value'],
        endpoint: '/api/procurement/supplier-by-order-value'
    }
};

async function openViewAll(type) {
    const config = modalConfig[type];
    if (!config) {
        console.warn(`⚠️ Unknown view type: ${type}`);
        return;
    }

    try {
        console.log(`🔍 Opening modal for: ${type}`);
        const modal = document.getElementById('viewAllModal');
        const title = document.getElementById('modalTitle');
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');

        // Set title
        title.textContent = config.title;

        // Build header
        tableHeader.innerHTML = config.columns.map(col => 
            `<th>${col}</th>`
        ).join('');

        // Fetch data
        const response = await fetch(config.endpoint);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();

        // Build body based on type
        tableBody.innerHTML = buildTableRows(type, data, config);

        // Show modal
        modal.classList.add('open');

    } catch (error) {
        console.error(`❌ Error opening modal:`, error);
        alert('Error loading data. Please try again.');
    }
}

function buildTableRows(type, data, config) {
    switch (type) {
        case 'pie':
        case 'bar':
            return data.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${fmtFull(item.total)}</td>
                    <td>${(item.percentage || 0).toFixed(2)}%</td>
                </tr>
            `).join('');

        case 'rank':
            return data.map((item, idx) => `
                <tr>
                    <td>${item.rank || idx + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                </tr>
            `).join('');

        case 'items':
            return data.map(item => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name || 'N/A'}</td>
            <td>${item.order}</td>
            <td>${fmtFull(item.total)}</td>
        </tr>
    `).join('');

        case 'order':
            return data.map((item, idx) => `
                <tr>
                    <td>${item.rank || idx + 1}</td>
                    <td>${item.name}</td>
                    <td>${fmtFull(item.total)}</td>
                </tr>
            `).join('');

        default:
            return '<tr><td colspan="' + config.columns.length + '">No data</td></tr>';
    }
}

function closeModal() {
    const modal = document.getElementById('viewAllModal');
    modal.classList.remove('open');
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('viewAllModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Add click handlers to View All buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const type = this.dataset.type;
            openViewAll(type);
        });
    });
});

// Optional: Department filter (if you add it later)
const deptDropdown = document.getElementById('deptDropdown');
if (deptDropdown) {
    deptDropdown.addEventListener('change', function () {
        refreshDashboard(this.value);
    });
}

// Register ChartDataLabels plugin
if (window.ChartDataLabels) {
    Chart.register(ChartDataLabels);
    console.log('✅ ChartDataLabels plugin registered');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Dashboard initialized');
    refreshDashboard();
    setInterval(() => refreshDashboard(), 30000);
});

console.log('✅ Dashboard.js loaded');