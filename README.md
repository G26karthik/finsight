# FinSight — Premium Finance Dashboard UX

A clean, interactive, professional-grade finance dashboard for tracking financial activity, understanding spending patterns, and managing transactions. Built with React 19 + Vite.

---

## 🚀 Live Demo

🔗 **[View Live on Vercel](https://finsight-iota-one.vercel.app/)**

---

## ✨ Features

### Core Features
- **Dashboard Overview** — Summary cards (Balance, Income, Expenses) with month-over-month change indicators
- **Balance Trend Chart** — 6-month area chart with gradient fill showing cumulative balance
- **Spending Breakdown** — Interactive donut chart with category-wise expense distribution
- **Transaction Management** — Full CRUD (Add, Edit, Delete) with real-time UI updates
- **Advanced Filtering** — Filter by type, category, date range + full-text search
- **Sorting** — Sort by date or amount (ascending/descending)
- **Role-Based UI** — Toggle between Admin (full access) and Viewer (read-only) modes
- **Insights & Analytics** — Highest spending category, monthly comparison, savings rate, spending trends

### Optional Enhancements (All Implemented)
- ✅ **Dark/Light Mode** — System preference detection + manual toggle with smooth transitions
- ✅ **Data Persistence** — All transactions saved to localStorage (survives page refresh)
- ✅ **Export** — Download filtered transactions as CSV or JSON
- ✅ **Animations** — Page transitions, staggered card reveals, chart entrance animations (Framer Motion)
- ✅ **Advanced Filtering** — Combined filters (type + category + date range + search)
- ✅ **Empty States** — Graceful handling with illustrated empty states and actionable CTAs
- ✅ **Toast Notifications** — Success/error feedback on all CRUD operations

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 + Vite | Modern tooling, fast HMR, component-based architecture |
| **Routing** | React Router v7 | Multi-page navigation with URL-based routing |
| **State Management** | React Context + useReducer | Clean, scalable state architecture without external deps |
| **Charts** | Recharts | Declarative, responsive, React-native charting |
| **Icons** | Lucide React | Consistent, lightweight SVG icon library |
| **Animations** | Framer Motion | Smooth page transitions and micro-interactions |
| **Date Utilities** | date-fns | Lightweight, tree-shakable date formatting |
| **Styling** | Vanilla CSS + Custom Properties | Full control, theme tokens, no framework overhead |

---

## 🏗 Architecture & Approach

### State Management
The app uses **React Context + useReducer** for centralized state management:

- **TransactionContext** — Manages transactions array, filters, and sort configuration. All mutations (ADD/EDIT/DELETE) automatically sync to localStorage. Filtered & sorted transactions are computed on every state change and provided to consumers.
- **ThemeContext** — Manages dark/light theme with system preference detection on first load.
- **RoleContext** — Manages admin/viewer role toggle with UI behavior changes.

### Design System
Built with a **Premium CSS Custom Properties** design system (`index.css`):

- High-end monochrome baseline colors (slate/zinc mapping) giving a premium "Stripe/Vercel-like" feel
- Semantic color tokens (`--accent-green`, `--text-primary`, etc.) tailored for data visualization
- Consistent spacing scale (4px base), border radius system, and shadow scale
- Theme switching via `[data-theme]` attribute on `<html>` element
- No utility classes — components use scoped CSS for maintainability

### Component Architecture
- **Pages** compose domain-specific components (SummaryCards, Charts, TransactionList)
- **Common** components (Modal, Toast, EmptyState) are reusable across pages
- **Layout** components (Sidebar, Header) are shared across all routes
- Each component has co-located `.css` files for scoped styling

### Role-Based UI
- **Admin**: Full CRUD operations — Add, Edit, Delete buttons visible
- **Viewer**: Read-only — CRUD buttons hidden, "Viewer Mode" badge shown
- Role state persisted to localStorage for demo continuity

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/G26karthik/finsight.git
cd finsight

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 📐 Design Decisions

1. **Professional Dark & Light Theme** — Removed overly colorful and rainbow-styled aesthetics in favor of a sleek, premium, neutral palette typical of high-end SaaS applications, ensuring it looks handcrafted and rigorous rather than AI-generated.
2. **INR Currency** — Used Indian Rupee formatting with proper locale (`en-IN`) appropriate for the Zorvyn FinTech context.
3. **Context over Redux** — The app's state complexity doesn't warrant Redux. Context + useReducer provides the same predictable state updates with zero boilerplate fatigue.
4. **Mock data generator** — Instead of hardcoded data or an empty UI, transactions are generated across 6 months with realistic amounts and distributions to populate charts beautifully on first load.

---

## 👤 Author

**G Karthik Koundinya**

---

## 📄 License

Built as part of the Zorvyn FinTech Frontend Developer Intern assessment.

