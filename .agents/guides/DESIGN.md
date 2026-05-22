---
version: alpha
name: Tokopedia Fresh Commerce
description: A bright, approachable marketplace system with crisp cards, compact controls, and a strong green brand accent.
colors:
  primary: "#00AA5B"
  primary-60: "#33BB7A"
  primary-70: "#1BAA62"
  secondary: "#FFFFFF"
  tertiary: "#F4F6F8"
  neutral: "#080808"
  neutral-60: "#6B7280"
  neutral-30: "#B3BBC9"
  neutral-10: "#E5E7EB"
  surface: "#FFFFFF"
  surface-2: "#F9FAFB"
  on-surface: "#101010"
  error: "#E5484D"
typography:
  headline-display:
    fontFamily: "Open Sauce One"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "Open Sauce One"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 33px
    letterSpacing: "0px"
  headline-md:
    fontFamily: "Open Sauce One"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "Open Sauce One"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: "0px"
  body-lg:
    fontFamily: "Open Sauce One"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: "0px"
  body-md:
    fontFamily: "Open Sauce One"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 21px
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Open Sauce One"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Open Sauce One"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: "0px"
  label-md:
    fontFamily: "Open Sauce One"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 16px
    letterSpacing: "0px"
  label-sm:
    fontFamily: "Open Sauce One"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: "0px"
  caption:
    fontFamily: "Open Sauce One"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: "0px"
  micro:
    fontFamily: "Open Sauce One"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 12px
    letterSpacing: "0px"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "16px"
  md: "32px"
  lg: "50px"
  xl: "110px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px 16px"
    height: "40px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.neutral}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0px 12px"
    height: "40px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "0px 12px"
    height: "36px"
  banner:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-60}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px 16px"
  tab-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "0px 16px"
---

## Overview
Tokopedia feels friendly, energetic, and highly commercial, with a layout optimized for quick browsing and fast conversion. The visual tone is bright and approachable rather than luxury-focused, using cheerful greens, clean white surfaces, and playful promotional graphics. It is dense enough to support many shopping paths, but the spacing keeps the interface readable and organized.

## Colors
- **Primary (#00AA5B):** The signature Tokopedia green used for core actions, active states, brand marks, and selected navigation. It signals trust, momentum, and purchase readiness.
- **Secondary (#FFFFFF):** The dominant background and button base color. It keeps the interface airy and gives promotional content room to stand out.
- **Tertiary (#F4F6F8):** A soft neutral layer for subtle separation when a section needs definition without adding visual weight.
- **Neutral (#080808):** The near-black text color used for headings, labels, and important UI chrome. It provides strong contrast on white surfaces.
- **Neutral-60 (#6B7280):** A muted gray for secondary metadata, inactive tabs, and supportive text where hierarchy should recede.
- **Neutral-30 (#B3BBC9):** A cool border and outline tone used for inputs, secondary buttons, and light dividers.
- **Neutral-10 (#E5E7EB):** The faintest structural border color for cards and boxed modules.
- **Surface (#FFFFFF):** The default card and page surface color, reinforcing the clean marketplace feel.
- **Surface-2 (#F9FAFB):** A barely tinted surface for low-emphasis containers and background blocks.
- **On-surface (#101010):** The default readable dark content tone for controls and body text on light backgrounds.
- **Error (#E5484D):** Reserved for validation feedback and destructive states; it should remain rare and highly noticeable.

## Typography
Open Sauce One is the primary type family, with Nunito Sans as a practical fallback for broad readability. The system leans on bold, rounded letterforms to feel friendly and recognizable, while still keeping interfaces compact and efficient. Headings use 700 or 600 weight for strong hierarchy; body text is typically 600 in the source styling, which gives the product a confident, slightly emphatic voice. Labels and buttons use extra-bold treatment for emphasis, and uppercase styling is not a dominant pattern in the screenshot; instead, clarity comes from weight and contrast.

## Layout
The layout is built around a centered, fixed-max-width content column with generous outer whitespace. Sections stack vertically with large promotional gaps, while cards and modules use smaller internal padding to keep scan patterns efficient. Rhythm should follow the defined spacing scale: 6px for fine adjustments, 16px for typical internal spacing, 32px for section separation, 50px for larger promotional breathing room, and 110px for hero-level vertical whitespace.

## Elevation & Depth
Depth is subtle and mostly functional. Cards are separated from the page with light borders and a soft shadow rather than heavy elevation, which keeps the marketplace feeling clean and trustworthy. Surfaces rely more on tonal layering, outline contrast, and clear section boundaries than dramatic shadows. Promotional banners may use stronger color blocks, but the overall system stays mostly flat.

## Shapes
The shape language is rounded but restrained. An 8px radius is the standard for buttons, cards, inputs, and modular containers, giving the interface a soft commercial friendliness without becoming pill-heavy. Larger banners can stretch to a 12px or 16px feel, while chips may use a full radius for compact category pills.

## Components
Buttons are compact and conversion-focused. Use `button-primary` for the main call to action: green fill, white text, 40px height, 16px horizontal padding, and bold label styling. `button-secondary` is a white button with a 1px neutral border and dark text, used for low-emphasis actions like sign in. `button-link` is minimal and text-only for utility navigation and secondary discovery.

Cards should use the `card` style: white background, 1px light border, 8px radius, and 16px padding. They should feel modular and content-first, with enough separation to hold product modules, category groups, and promotional panels.

Inputs should be lightweight and immediately legible. Use the `input` token for search and form fields: white background, 8px radius, subtle border, 40px height, and compact internal padding. Focus states should remain crisp and readable rather than decorative.

Chips and category pills should follow `chip`: white or neutral surface, rounded-full shape, compact height, and small horizontal padding. They should feel selectable and browse-friendly, not heavy like buttons.

Tabs should be understated by default and more assertive when active. `tab` uses muted text on transparent backgrounds, while `tab-active` should switch to green text and stronger label treatment to show selection. Keep tab spacing horizontal and compact for dense marketplace navigation.

Banners and hero promotions should be colorful, illustrative, and high-contrast. They can use saturated brand-adjacent palettes, but the surrounding system should still anchor them with white space and clean typography so the page does not feel chaotic.

## Do's and Don'ts
- Do keep primary actions green, bold, and compact.
- Do use white cards with light borders to separate modules.
- Do preserve generous horizontal breathing room around major page sections.
- Do favor strong text contrast for headings and search.
- Don't introduce heavy shadows or glassmorphism.
- Don't make buttons tall or overly rounded beyond the 8px system baseline.
- Don't use muted gray text for key CTAs or important labels.
- Don't overcrowd the layout with dense borders when spacing can establish hierarchy.