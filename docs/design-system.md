## 🎨 Design System – Tailwind CSS v4

### 1. **Colors**

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',       // blue-500
      primaryDark: '#1E40AF',   // blue-900
      secondary: '#F59E0B',     // amber-500
      background: '#F9FAFB',    // gray-50
      surface: '#FFFFFF',       // white
      muted: '#6B7280',         // gray-500
      danger: '#EF4444',        // red-500
      success: '#10B981',       // green-500
    },
  },
}
```

---

### 2. **Typography**

| Element     | Tailwind Classes                   |
| ----------- | ---------------------------------- |
| Headings    | `text-2xl md:text-3xl font-bold`   |
| Subheadings | `text-xl font-semibold text-muted` |
| Body Text   | `text-base text-gray-800`          |
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
  class="px-4 py-2 rounded-lg bg-white border border-primary text-primary hover:bg-primary/10"
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
<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
<nav class="flex items-center justify-between px-4 py-3 bg-white shadow">
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
