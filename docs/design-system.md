## 🎨 Design System – Tailwind CSS v4

### 1. **Colors**

```css
/* styles.css (with Tailwind v4) */
@theme {
  --color-primary: #3b82f6;
  --color-primaryDark: #1e40af;
  --color-secondary: #f59e0b;
  --color-background: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #1f2937; /* gray-800 */
  --color-text-strong: #1f2937; /* gray-800 */
  --color-muted: #6b7280; /* gray-500 */
  --color-divider: #e5e7eb; /* divider */
  --color-danger: #ef4444;
  --color-success: #10b981;
}

@layer base {
  @variant dark {
    --color-primary: #60a5fa; /* blue-400 */
    --color-primaryDark: #1e3a8a; /* blue-900 */
    --color-secondary: #fbbf24; /* amber-400 */
    --color-background: #111827; /* gray-900 */
    --color-surface: #1f2937; /* gray-800 */
    --color-text: #f3f4f6; /* gray-100 */
    --color-text-strong: #e5e7eb; /* divider */
    --color-muted: #d1d5db; /* gray-300 */
    --color-divider: #374151; /* gray-700 */
    --color-danger: #f87171; /* red-400 */
    --color-success: #34d399; /* green-400 */
  }
}
```

---

### 2. **Typography**

| Element     | Tailwind Classes                   |
| ----------- | ---------------------------------- |
| Headings    | `text-2xl md:text-3xl font-bold`   |
| Subheadings | `text-xl font-semibold text-muted` |
| Body Text   | `text-base text-text`              |
| Small Text  | `text-sm text-muted`               |
| Links       | `text-primary hover:underline`     |

---

### 3. **Buttons**

```html
<!-- Primary -->
<button
  class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition"
>
  Book Now
</button>

<!-- Secondary -->
<button
  class="px-4 py-2 rounded-lg bg-surface border border-primary text-primary hover:bg-primary/10"
>
  Learn More
</button>

<!-- Danger -->
<button class="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-700">
  Delete
</button>
```

---

### 4. **Cards / Containers**

```html
<div class="bg-surface rounded-2xl shadow-md p-4 md:p-6">
  <!-- Event Info / Form Content -->
</div>
```

---

### 5. **Forms**

```html
<label class="block text-sm font-medium text-text mb-1">Email</label>
<input
  type="email"
  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
/>
```

**Form UI Enhancements:**

- Focus states: `focus:ring-2 focus:ring-primary`
- Validation states:

  - Error: `border-danger text-danger`
  - Success: `border-success text-success`

---

### 6. **Navigation (User & Admin)**

```html
<nav class="flex items-center justify-between px-4 py-3 bg-surface shadow">
  <h1 class="text-xl font-bold text-primary">Evently</h1>
  <ul class="flex gap-4 text-sm text-muted">
    <li><a href="#" class="hover:text-primary">Home</a></li>
    <li><a href="#" class="hover:text-primary">My Bookings</a></li>
  </ul>
</nav>
```

---

### 7. **Utilities to Use Often**

```txt
rounded-2xl
shadow-md
transition duration-300 ease-in-out
hover:bg-opacity-80
grid grid-cols-1 md:grid-cols-3 gap-6
text-center text-muted
```
