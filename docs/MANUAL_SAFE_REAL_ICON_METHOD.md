# Manual Safer Real Icon Method

For truly real icons, the safest method is to edit only the icon values in your existing category data, not replace the whole section.

Search your project for:

```text
Events & Parties
Food & Drinks
Sale Offers
```

You will likely find an array like:

```js
const categories = [
  { label: "Events & Parties", icon: "🎵" },
  { label: "Food & Drinks", icon: "🍴" },
]
```

A safe upgrade is:

1. Keep the same array.
2. Replace the emoji `icon` with an SVG component or imported icon.
3. Do not replace the whole category rail JSX.

If you use `lucide-react`, example:

```bash
npm install lucide-react
```

Then:

```jsx
import {
  Music,
  Utensils,
  BadgePercent,
  Megaphone,
  Sparkles,
  Shirt,
  Car,
  Bed,
  CalendarDays,
  MapPin,
} from "lucide-react";
```

Example array:

```jsx
const categories = [
  { label: "Events & Parties", href: "/browse?category=Events%20%26%20Parties", Icon: Music },
  { label: "Food & Drinks", href: "/browse?category=Food%20%26%20Drinks", Icon: Utensils },
  { label: "Sale Offers", href: "/browse?category=Sale%20Offers", Icon: BadgePercent },
  { label: "Campaigns", href: "/campaigns", Icon: Megaphone },
  { label: "Beauty", href: "/browse?category=Beauty", Icon: Sparkles },
  { label: "Fashion", href: "/browse?category=Fashion", Icon: Shirt },
  { label: "Transport", href: "/browse?category=Transport", Icon: Car },
  { label: "Stay", href: "/browse?category=Stay", Icon: Bed },
  { label: "Weekend", href: "/weekend", Icon: CalendarDays },
  { label: "Parish Pulse", href: "/map", Icon: MapPin },
];
```

Then where the old icon prints:

```jsx
<span>{category.icon}</span>
```

change to:

```jsx
<category.Icon size={22} strokeWidth={2.2} />
```

This changes only the icon, not the page layout.
