const STATUS_FLOW = [
    "Reported",
    "Received",
    "Under Review",
    "Possible Match",
    "Verification",
    "Ready to Claim",
    "Claimed",
    "Closed"
];


function typeLabel(report) {
    return report.type === "lost" ? "Lost" : "Found";
}

function typeBadge(report) {
    return `<span class="badge ${report.type}">${typeLabel(report)}</span>`;
}

function escapeHTML(str) {
    var amp = String.fromCharCode(38); // &
    var lt = String.fromCharCode(60);  // <
    var gt = String.fromCharCode(62);  // >
    return String(str)
        .split(amp).join(amp + "amp;")
        .split(lt).join(amp + "lt;")
        .split(gt).join(amp + "gt;")
        .split('"').join(amp + "quot;")
        .split("'").join(amp + "#39;");
}

 
let reports = loadReports();
let trackingCounter = loadTrackingCounter();

function loadReports() {
    try {
        const data = localStorage.getItem("clarofind_reports");
        if (data) return JSON.parse(data);
    } catch(e) {}
    return seedData();
}

function saveReports() {
    localStorage.setItem("clarofind_reports", JSON.stringify(reports));
}

function loadTrackingCounter() {
    try {
        const val = parseInt(localStorage.getItem("clarofind_counter"), 10);
        if (!isNaN(val) && val > 0) return val;
    } catch(e) {}
    return reports.length;
}

function saveTrackingCounter() {
    localStorage.setItem("clarofind_counter", String(trackingCounter));
}

function seedData() {
    const year = new Date().getFullYear();
    return [
        {
            tracking: `CF-${year}-000001`,
            type: "lost",
            name: "Black Wallet",
            category: "Bags",
            itemName: "Black Wallet",
            color: "Black",
            brand: "Herschel",
            location: "Library",
            date: "2026-07-18",
            description: "Black leather wallet with ID card and some cash inside.",
            reporterName: "Juan Dela Cruz",
            grade: "Grade 12 - ICT",
            sid: "2024-0001",
            secret: "wallet2026",
            status: "Under Review",
            turnedOver: "",
            photo: ""
        },
        {
            tracking: `CF-${year}-000002`,
            type: "found",
            name: "iPhone 13",
            category: "Electronics",
            itemName: "iPhone 13",
            color: "Blue",
            brand: "Apple",
            location: "Computer Lab",
            date: "2026-07-20",
            description: "Blue iPhone 13 with a clear case. Found on a desk in the computer lab.",
            reporterName: "Maria Santos",
            grade: "Grade 12 - ICT",
            sid: "2024-0002",
            secret: "",
            status: "Ready to Claim",
            turnedOver: "Ms. Dela Cruz",
            photo: ""
        },
        {
            tracking: `CF-${year}-000003`,
            type: "lost",
            name: "PE Uniform",
            category: "Clothing",
            itemName: "PE Uniform",
            color: "White",
            brand: "",
            location: "Cafeteria",
            date: "2026-07-19",
            description: "White and green PE uniform with name tag 'A. Reyes'.",
            reporterName: "Ana Reyes",
            grade: "Grade 12 - ICT 1B",
            sid: "2024-0003",
            secret: "peuniform",
            status: "Claimed",
            turnedOver: "",
            photo: ""
        },
        {
            tracking: `CF-${year}-000004`,
            type: "found",
            name: "Scientific Calculator",
            category: "School Supplies",
            itemName: "Scientific Calculator",
            color: "Black",
            brand: "Casio",
            location: "Library",
            date: "2026-07-21",
            description: "Casio fx-991EX calculator found near the library study area.",
            reporterName: "Pedro Garcia",
            grade: "Grade 11 - ICT 2A",
            sid: "2024-0004",
            secret: "",
            status: "Verification",
            turnedOver: "Guard on Duty",
            photo: ""
        }
    ];
}

 
function goPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("page-" + page).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (page === "home") renderHome();
    if (page === "browse") renderBrowse();
    if (page === "claim") renderClaimList();
    if (page === "admin") renderAdmin();
}

document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => goPage(btn.dataset.page));
});

 
function generateTracking() {
    const year = new Date().getFullYear();
    trackingCounter += 1;
    saveTrackingCounter();
    const num = String(trackingCounter).padStart(6, "0");
    return `CF-${year}-${num}`;
}

 
document.getElementById("lost-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const tracking = generateTracking();
    const report = {
        tracking: tracking,
        type: "lost",
        name: document.getElementById("lost-name").value,
        grade: document.getElementById("lost-grade").value,
        sid: document.getElementById("lost-sid").value,
        email: document.getElementById("lost-email").value,
        contact: document.getElementById("lost-contact").value,
        category: document.getElementById("lost-category").value,
        itemName: document.getElementById("lost-item-name").value,
        color: document.getElementById("lost-color").value,
        brand: document.getElementById("lost-brand").value,
        date: document.getElementById("lost-date").value,
        location: document.getElementById("lost-location").value,
        description: document.getElementById("lost-desc").value,
        secret: document.getElementById("lost-secret").value,
        status: "Reported",
        turnedOver: "",
        photo: ""
    };
    const photoFile = document.getElementById("lost-photo").files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = e2 => {
            report.photo = e2.target.result;
            reports.unshift(report);
            saveReports();
            showSuccess(report);
        };
        reader.readAsDataURL(photoFile);
    } else {
        reports.unshift(report);
        saveReports();
        showSuccess(report);
    }
    this.reset();
});

 
document.getElementById("found-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const tracking = generateTracking();
    const report = {
        tracking: tracking,
        type: "found",
        name: document.getElementById("found-name").value,
        grade: document.getElementById("found-grade").value,
        sid: document.getElementById("found-sid").value,
        category: document.getElementById("found-category").value,
        itemName: document.getElementById("found-item-name").value,
        date: document.getElementById("found-date").value,
        location: document.getElementById("found-location").value,
        description: document.getElementById("found-desc").value,
        turnedOver: document.getElementById("found-turnover").value,
        secret: "",
        status: "Received",
        color: "",
        brand: "",
        photo: ""
    };
    const photoFile = document.getElementById("found-photo").files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = e2 => {
            report.photo = e2.target.result;
            reports.unshift(report);
            saveReports();
            showSuccess(report);
        };
        reader.readAsDataURL(photoFile);
    } else {
        reports.unshift(report);
        saveReports();
        showSuccess(report);
    }
    this.reset();
});

 
function showSuccess(report) {
document.getElementById("success-details").innerHTML = `
        <p><strong>Tracking Number:</strong> <span class="badge Received">${escapeHTML(report.tracking)}</span></p>
        <p><strong>Item:</strong> ${escapeHTML(report.itemName)}</p>
        <p><strong>Type:</strong> ${report.type === "lost" ? "Lost" : "Found"}</p>
        <p><strong>Status:</strong> ${escapeHTML(report.status)}</p>
        <p style="margin-top:10px;color:#888;">Save this tracking number to check your report status.</p>
    `;
    document.getElementById("success-modal").classList.remove("hidden");
}

function closeSuccessModal() {
    document.getElementById("success-modal").classList.add("hidden");
    goPage("home");
}

 
function renderHome() {
    const lost = reports.filter(r => r.type === "lost").length;
    const found = reports.filter(r => r.type === "found").length;
    const claimed = reports.filter(r => r.status === "Claimed" || r.status === "Closed").length;
    const pending = reports.filter(r => r.status !== "Claimed" && r.status !== "Closed").length;
    document.getElementById("stat-lost").textContent = lost;
    document.getElementById("stat-found").textContent = found;
    document.getElementById("stat-claimed").textContent = claimed;
    document.getElementById("stat-pending").textContent = pending;

    const latestEl = document.getElementById("latest-reports");
    const latest = reports.slice(0, 5);
    if (latest.length === 0) {
        latestEl.innerHTML = "<p>No reports yet.</p>";
        return;
    }
latestEl.innerHTML = latest.map(r => `
<div class="report-item">
            <div>
                <span class="rep-name">${escapeHTML(r.itemName)}</span>
                ${typeBadge(r)}
            </div>
            <span class="badge ${r.status.replace(/\s/g,'')}">${escapeHTML(r.status)}</span>
        </div>
    `).join("");
}

function searchFromHome() {
    const q = document.getElementById("home-search").value.toLowerCase();
    goPage("browse");
    document.getElementById("browse-search").value = q;
    renderBrowse();
}

 
function renderBrowse() {
    const q = document.getElementById("browse-search").value.toLowerCase();
    const cat = document.getElementById("browse-category").value;
    const status = document.getElementById("browse-status").value;
    const type = document.getElementById("browse-type").value;

    let filtered = reports.filter(r => {
        const matchQ = !q || (r.itemName + " " + r.category + " " + r.location + " " + r.description).toLowerCase().includes(q);
        const matchCat = cat === "all" || r.category === cat;
        const matchStatus = status === "all" || r.status === status;
        const matchType = type === "all" || r.type === type;
        return matchQ && matchCat && matchStatus && matchType;
    });

    const categories = ["Electronics", "School Supplies", "IDs", "Bags", "Clothing", "Others"];
    const container = document.getElementById("category-groups");
    container.innerHTML = "";

    categories.forEach(c => {
        const items = filtered.filter(r => r.category === c);
        if (items.length === 0) return;
        const icons = { "Electronics": "📱", "School Supplies": "📚", "IDs": "🪪", "Bags": "🎒", "Clothing": "👕", "Others": "📦" };
        const group = document.createElement("div");
        group.className = "category-group";
        group.innerHTML = `<h3>${icons[c]} ${c} (${items.length})</h3>`;
        const grid = document.createElement("div");
        grid.className = "items-grid";
        items.forEach(r => {
            const card = document.createElement("div");
            card.className = "item-card";
card.innerHTML = `
                <div class="item-icon">${icons[c]}</div>
                <h4>${escapeHTML(r.itemName)}</h4>
                ${typeBadge(r)}
                <span class="badge ${r.status.replace(/\s/g,'')}">${escapeHTML(r.status)}</span>
                <div class="item-meta">📍 ${escapeHTML(r.location)} | ${escapeHTML(r.date)}</div>
                <div class="item-meta">${typeLabel(r)}${r.brand ? " | " + escapeHTML(r.brand) : ""}${r.color ? " | " + escapeHTML(r.color) : ""}</div>
                <div class="item-desc">${escapeHTML(r.description)}</div>
                <small style="color:#888;">Ref: ${escapeHTML(r.tracking)}</small>
            `;
            grid.appendChild(card);
        });
        group.appendChild(grid);
        container.appendChild(group);
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="panel"><p>No items match your filters.</p></div>`;
    }
}

 
function trackReport() {
    const input = document.getElementById("track-input").value.trim().toUpperCase();
    const resultEl = document.getElementById("track-result");
    if (!input) {
        resultEl.innerHTML = "<p class='error'>Please enter a tracking number.</p>";
        return;
    }
    const report = reports.find(r => r.tracking.toUpperCase() === input);
    if (!report) {
        resultEl.innerHTML = `<p class="error">No report found with tracking number <strong>${input}</strong>.</p>`;
        return;
    }
    const currentIdx = STATUS_FLOW.indexOf(report.status);
    const flowList = STATUS_FLOW.map((s, i) => {
        let cls = "";
        if (i < currentIdx) cls = "done";
        if (i === currentIdx) cls = "current";
        const mark = i < currentIdx ? "✔" : (i === currentIdx ? "⏳" : "•");
        return `<li class="${cls}"><span class="mark">${mark}</span> ${s}</li>`;
    }).join("");

resultEl.innerHTML = `
        <div class="track-result-card">
            <h3>📈 ${escapeHTML(report.itemName)}</h3>
<p><strong>Tracking:</strong> ${escapeHTML(report.tracking)}</p>
            <p><strong>Type:</strong> ${typeBadge(report)}</p>
            <p><strong>Category:</strong> ${escapeHTML(report.category)}</p>
            <p><strong>Location:</strong> ${escapeHTML(report.location)}</p>
            <p><strong>Date:</strong> ${escapeHTML(report.date)}</p>
            <p><strong>Current Status:</strong> <span class="badge ${report.status.replace(/\s/g,'')}">${escapeHTML(report.status)}</span></p>
            <ul class="status-flow">${flowList}</ul>
        </div>
    `;
}

 
function renderClaimList() {
    const listEl = document.getElementById("claim-list");
    const claimable = reports.filter(r => r.status === "Ready to Claim");
    if (claimable.length === 0) {
        listEl.innerHTML = "<div class='panel'><p>No items are currently ready to claim.</p></div>";
        return;
    }
listEl.innerHTML = claimable.map(r => `
        <div class="claim-card">
            <h4>${escapeHTML(r.itemName)}</h4>
            <p>📍 ${escapeHTML(r.location)} | ${escapeHTML(r.category)}</p>
            <p>Ref: ${escapeHTML(r.tracking)}</p>
            <button class="btn btn-primary" onclick="openClaimModal('${r.tracking}')">Claim This Item</button>
        </div>
    `).join("");
}

let currentClaimTracking = null;

function openClaimModal(tracking) {
    const report = reports.find(r => r.tracking === tracking);
    if (!report) return;
    currentClaimTracking = tracking;
    document.getElementById("modal-item-name").textContent = report.itemName;
    document.getElementById("claim-secret").value = "";
    document.getElementById("claim-sid").value = "";
    document.getElementById("claim-error").classList.add("hidden");
    document.getElementById("claim-modal").classList.remove("hidden");
}

function closeClaimModal() {
    document.getElementById("claim-modal").classList.add("hidden");
}

function verifyClaim() {
    const report = reports.find(r => r.tracking === currentClaimTracking);
    if (!report) return;
    const secret = document.getElementById("claim-secret").value;
    const sid = document.getElementById("claim-sid").value;
    const errEl = document.getElementById("claim-error");

    if (!report.secret) {
        errEl.textContent = "This item has no secret code on file. Please visit the admin office to verify.";
        errEl.classList.remove("hidden");
        return;
    }
    if (secret !== report.secret || sid !== report.sid) {
        errEl.textContent = "Verification failed. Secret code or Student ID does not match the report.";
        errEl.classList.remove("hidden");
        return;
    }
    report.status = "Claimed";
    saveReports();
    closeClaimModal();
    alert(`✅ Item "${report.itemName}" successfully claimed! Please present your Student ID to the admin office.`);
    renderClaimList();
    renderHome();
}

  
document.getElementById("admin-login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;
    if (user === "admin" && pass === "admin123") {
        document.getElementById("admin-dashboard").classList.remove("hidden");
        renderAdmin();
        alert("Welcome, Admin!");
    } else {
        alert("Invalid credentials. Try admin / admin123");
    }
});

function renderAdmin() {
    const el = document.getElementById("admin-reports");
    if (reports.length === 0) {
        el.innerHTML = "<p>No reports.</p>";
        return;
    }
el.innerHTML = reports.map(r => `
        <div class="admin-item">
            <div class="admin-info">
                <strong>${escapeHTML(r.itemName)}</strong> (${escapeHTML(r.category)})<br>
                <small>${escapeHTML(r.tracking)} · ${r.type === "lost" ? "Lost" : "Found"} · ${escapeHTML(r.location)}</small><br>
                <small>Reporter: ${escapeHTML(r.name)} (${escapeHTML(r.grade)})</small>
            </div>
            <select onchange="updateStatus('${r.tracking}', this.value)">
                ${STATUS_FLOW.map(s => `<option value="${s}" ${s === r.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
        </div>
    `).join("");
}

function updateStatus(tracking, newStatus) { ;
    const report = reports.find(r => r.tracking === tracking);
    if (report) {
        report.status = newStatus;
        saveReports();
        alert(`Status updated to "${newStatus}" for ${report.itemName}.`);
        renderAdmin();
    }
}

// ===== FEEDBACK =====
function submitFeedback(event) {
    event.preventDefault();
    const panel = document.getElementById("feedback-panel");
    panel.classList.add("showing-thanks");
    document.getElementById("feedback-name").value = "";
    document.getElementById("feedback-email").value = "";
    document.getElementById("feedback-msg").value = "";
}

 
renderHome();
