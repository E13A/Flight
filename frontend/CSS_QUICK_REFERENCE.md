# CSS Quick Reference Guide

A quick reference for using the custom CSS utilities in the FlightDelay DApp.

## 🎨 Animations (Tailwind Classes)

| Class | Effect | Duration | Use Case |
|-------|--------|----------|----------|
| `animate-fade-in` | Fade in with upward movement | 0.5s | Page sections, modals |
| `animate-slide-in-left` | Slide from left | 0.5s | Side panels, notifications |
| `animate-slide-in-right` | Slide from right | 0.5s | Side panels, notifications |
| `animate-scale-in` | Scale up from 90% | 0.3s | Buttons, cards, popups |
| `animate-shimmer` | Shimmer loading effect | 2s infinite | Loading skeletons |
| `animate-pulse-glow` | Pulsing glow shadow | 2s infinite | CTAs, important buttons |

## 🎭 Component Classes (Custom CSS)

| Class | Effect | Use Case |
|-------|--------|----------|
| `.glass` | Glassmorphism effect | Headers, overlays, cards |
| `.gradient-text` | Purple gradient text | Headings, highlights |
| `.card-hover` | Lift on hover | Interactive cards |
| `.shimmer` | Loading shimmer | Skeleton screens |
| `.pulse-glow` | Glowing animation | Call-to-action elements |

## 🌈 Text Gradients (Tailwind Utilities)

| Class | Colors | Example |
|-------|--------|---------|
| `.text-gradient-blue` | Blue → Cyan | Main headings |
| `.text-gradient-purple` | Purple → Pink | Premium features |
| `.text-gradient-green` | Green → Emerald | Success messages |

## ✨ Shadow Utilities (Tailwind)

| Class | Color | Intensity | Use Case |
|-------|-------|-----------|----------|
| `shadow-glow-blue` | Blue | Normal | Buttons, cards |
| `shadow-glow-purple` | Purple | Normal | Premium elements |
| `shadow-glow-green` | Green | Normal | Success states |
| `shadow-glow-blue-lg` | Blue | Large | Hero CTAs |
| `shadow-glow-purple-lg` | Purple | Large | Premium CTAs |
| `shadow-glow-green-lg` | Green | Large | Success CTAs |

## 🔄 Transitions (Custom CSS)

| Class | Easing | Duration | Use Case |
|-------|--------|----------|----------|
| `.transition-smooth` | Ease-out | 0.3s | General hover effects |
| `.transition-bounce` | Bounce | 0.5s | Playful interactions |

## 📐 Background Gradients (Tailwind)

```jsx
// Radial gradient
<div className="bg-gradient-radial from-blue-500 to-purple-600">

// Conic gradient  
<div className="bg-gradient-conic from-blue-500 via-purple-500 to-pink-500">
```

## 💡 Common Patterns

### Hero Section
```jsx
<h1 className="text-gradient-blue text-6xl font-bold animate-fade-in">
  Welcome
</h1>
```

### CTA Button
```jsx
<button className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-glow-blue-lg animate-pulse-glow hover:scale-105 transition-smooth">
  Get Started
</button>
```

### Glass Card
```jsx
<div className="glass rounded-2xl p-8 card-hover">
  Content
</div>
```

### Loading Skeleton
```jsx
<div className="h-4 bg-slate-200 rounded animate-shimmer" />
```

### Feature Card
```jsx
<div className="bg-white rounded-xl p-6 card-hover animate-scale-in border border-slate-200">
  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-bounce hover:scale-110">
    <Icon />
  </div>
  <h3 className="text-xl font-bold mt-4">Feature</h3>
</div>
```

## 🎯 Best Practices

✅ **DO:**
- Combine animations with transitions for smooth effects
- Use `animate-*` classes for entrance animations
- Use `transition-*` classes for hover/interaction states
- Test in both light and dark modes

❌ **DON'T:**
- Overuse animations (can cause motion sickness)
- Stack multiple heavy animations
- Forget to test on mobile devices
- Use animations on every element

## 🔧 Responsive Usage

```jsx
// Apply animation only on larger screens
<div className="md:animate-fade-in">

// Different animations for different breakpoints
<div className="animate-slide-in-left md:animate-fade-in">

// Conditional glow
<button className="shadow-glow-blue hover:shadow-glow-blue-lg">
```

## 🌙 Dark Mode

All utilities automatically adapt to dark mode:
- Custom scrollbar changes color
- Glass effect adjusts opacity and borders
- Shadows remain visible

## 📱 Mobile Considerations

- Reduce animation on mobile: `motion-reduce:animate-none`
- Use smaller glows: prefer `shadow-glow-*` over `shadow-glow-*-lg`
- Test touch interactions with hover states

---

**Quick Tip**: Combine utilities for powerful effects!
```jsx
<div className="glass card-hover animate-fade-in shadow-glow-blue">
  Premium animated glass card
</div>
```
