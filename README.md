# Procurement Analytics Dashboard

> A full-stack, enterprise-grade procurement analytics dashboard built for C-suite executives. Real-time data, interactive charts, secure login, and a fully responsive design across desktop, tablet and mobile.

---

## 📸 Preview

| Desktop | Mobile |
|---|---|
| Full single-screen layout with 6 live charts | Stacked responsive layout with compact header |

---

## ✨ Features

### 📊 Dashboard
- **4 KPI Cards** — Total Suppliers, Top Supplier, Total Revenue, Completed Orders with growth indicators
- **Exploded Pie Chart** — Top 5 supplier spend with custom dark tooltips
- **Vertical Bar Chart** — Supplier spend distribution with value labels
- **Horizontal Bar Chart** — All 10 items ranked by order value
- **Ranked Supplier List** — Top 5 by order count with medal badges
- **Animated Progress Bars** — Supplier and item spend with smooth transitions
- **Auto Refresh** — All charts and KPIs update every 30 seconds from live MySQL data

### 🔐 Security
- Login page with username and password authentication
- Remember me functionality using localStorage
- Session-based protection using sessionStorage
- Back button blocked after logout
- Redirect to login if session expires

### 🎨 UI & UX
- Clean light-mode enterprise design
- Steel-blue header with notification bell and user profile dropdown
- Notification dropdown with 5 notifications, mark as read, mark all as read
- User profile dropdown with role, view profile, settings and logout
- Department indicator button in header
- Fully responsive — desktop, tablet and mobile
- Custom dark tooltips on all charts
- No scroll on desktop — everything fits one screen

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core MVC (.NET 8) |
| Database | MySQL 8.0 |
| ORM | Dapper |
| Charts | Chart.js v4 + chartjs-plugin-datalabels |
| Frontend | Razor Pages + Vanilla JavaScript + CSS3 |
| Font | DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
Aegle/
├── Controllers/
│   ├── HomeController.cs           # Serves main dashboard
│   ├── AccountController.cs        # Serves login page
│   └── ProcurementController.cs    # 6 JSON API endpoints
├── Services/
│   └── ProcurementService.cs       # All MySQL queries via Dapper
├── Models/
│   └── Models.cs                   # DTOs for all API responses
├── Views/
│   ├── Home/
│   │   └── Index.cshtml            # Main dashboard page
│   └── Account/
│       └── Login.cshtml            # Login page
├── wwwroot/
│   └── js/
│       └── dashboard.js            # Chart logic and auto-refresh
├── aegle_procurement.sql           # Full schema + seed data
├── Program.cs                      # App startup and DI registration
├── appsettings.json                # Connection string (update with your password)
└── Aegle.csproj                    # NuGet packages
```

---

## 🗄️ Database Schema

```sql
suppliers  (5 rows)   — supplier names
items      (10 rows)  — procurement item names
orders     (36 rows)  — orders across HR, Finance and Admin departments
```

---

## 🔌 API Endpoints

All endpoints live under `/api/procurement/`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/kpis` | Total suppliers, top supplier, revenue, completed orders |
| GET | `/top5-supplier-spend` | Top 5 suppliers by total spend with percentages |
| GET | `/top5-supplier-order-count` | Top 5 suppliers by number of orders |
| GET | `/items-by-order-value` | All 10 items ranked by total value |
| GET | `/supplier-by-order-value` | All suppliers ranked by total value |
| GET | `/top5-items-by-order-value` | Top 5 items by total order value |

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL 8.0](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) *(optional)*

### Installation

**1 — Clone the repository**
```bash
git clone https://github.com/chrisambatti/Procurement-Dashboard.git
cd Procurement-Dashboard
```

**2 — Install NuGet packages**
```bash
dotnet add package Dapper
dotnet add package MySqlConnector
```

**3 — Set up the database**

Open MySQL Workbench and run the SQL file, or use the terminal:
```bash
mysql -u root -p < aegle_procurement.sql
```

**4 — Update the connection string**

Open `appsettings.json` and update with your MySQL credentials:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=aegle_procurement;User=root;Password=YOUR_PASSWORD;AllowPublicKeyRetrieval=true;SslMode=None;"
  }
}
```

**5 — Add HomeController**

Create `Controllers/HomeController.cs`:
```csharp
using Microsoft.AspNetCore.Mvc;
namespace Aegle.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}
```

**6 — Run the app**
```bash
dotnet run
```

**7 — Open in your browser**
```
http://localhost:5000
```

---

## 🔑 Login Credentials

| Field | Value |
|---|---|
| Username | `user` |
| Password | `password` |

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| Desktop  | Full single-screen, no scroll, 3-column charts |
| Tablet  | 2-column charts, scrollable |
| Mobile  | Single column, stacked charts, compact header |

---

## 🗺️ Roadmap

### Version 1.0 ✅
- Full dashboard with 6 interactive charts
- Secure login with session management
- Notification bell and user profile dropdowns
- Auto-refresh every 30 seconds
- Mobile and tablet responsive layout
- GitHub repository

### Version 2.0 🔮
- [ ] Order Status Dashboard
- [ ] Dashboard Dropdown
- [ ] Supplier Performance Dashboard
- [ ] Date range filter
- [ ] Export to PDF and Excel
- [ ] Multiple user accounts with role-based access
- [ ] Live notifications from database

---
### ✅ Must Have (Phase 1)
- Overview (done)
- Order Status
- Supplier Performance
---
### 📍 (Phase 2) 
- [ ] Spend Analytics
- [ ] Pipeline
---
## 👨‍💻 Author

**Christopher Ambatti** —
**Software Developer** — Dubai, UAE 🇦🇪

---

## 📄 License

This project is private and not licensed for public use.
