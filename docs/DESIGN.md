---
version: alpha
name: Tokopedia Green Commerce
description: A bright, trust-oriented marketplace system with a clean white base and vivid green accent.
colors:
    primary: '#00AA5B'
    primary-foreground: '#FFFFFF'
    primary-soft: '#E7F9EF'
    secondary: '#101010'
    tertiary: '#B3BBC9'
    neutral: '#FFFFFF'
    neutral-100: '#F7F8FA'
    surface: '#FFFFFF'
    surface-muted: '#F7F8FA'
    on-surface: '#080808'
    on-surface-muted: '#6B7280'
    border: '#E5E7EB'
    border-strong: '#B3BBC9'
    success: '#00AA5B'
    warning: '#F59E0B'
    error: '#E11D48'
typography:
    headline-display:
        fontFamily: 'Open Sauce One'
        fontSize: 32px
        fontWeight: 700
        lineHeight: 38px
        letterSpacing: 0px
    headline-lg:
        fontFamily: 'Open Sauce One'
        fontSize: 28px
        fontWeight: 700
        lineHeight: 33px
        letterSpacing: 0px
    headline-md:
        fontFamily: 'Open Sauce One'
        fontSize: 20px
        fontWeight: 600
        lineHeight: 24px
        letterSpacing: 0px
    headline-sm:
        fontFamily: 'Open Sauce One'
        fontSize: 18px
        fontWeight: 600
        lineHeight: 22px
        letterSpacing: 0px
    body-lg:
        fontFamily: 'Open Sauce One'
        fontSize: 16px
        fontWeight: 600
        lineHeight: 24px
        letterSpacing: 0px
    body-md:
        fontFamily: 'Open Sauce One'
        fontSize: 14px
        fontWeight: 600
        lineHeight: 21px
        letterSpacing: 0px
    body-sm:
        fontFamily: 'Open Sauce One'
        fontSize: 12px
        fontWeight: 400
        lineHeight: 18px
        letterSpacing: 0px
    label-lg:
        fontFamily: 'Open Sauce One'
        fontSize: 14px
        fontWeight: 700
        lineHeight: 21px
        letterSpacing: 0px
    label-md:
        fontFamily: 'Open Sauce One'
        fontSize: 12px
        fontWeight: 800
        lineHeight: 18px
        letterSpacing: 0px
    label-sm:
        fontFamily: 'Open Sauce One'
        fontSize: 12px
        fontWeight: 400
        lineHeight: 18px
        letterSpacing: 0px
    caption:
        fontFamily: 'Open Sauce One'
        fontSize: 11px
        fontWeight: 600
        lineHeight: 16px
        letterSpacing: 0px
    input:
        fontFamily: 'Open Sauce One'
        fontSize: 14px
        fontWeight: 400
        lineHeight: 21px
        letterSpacing: 0px
    navigation:
        fontFamily: 'Open Sauce One'
        fontSize: 12px
        fontWeight: 600
        lineHeight: 18px
        letterSpacing: 0px
rounded:
    none: 0px
    sm: 4px
    md: 8px
    lg: 12px
    xl: 16px
    full: 9999px
spacing:
    xs: 6px
    sm: 16px
    md: 32px
    lg: 50px
    xl: 110px
components:
    button-primary:
        backgroundColor: '{colors.primary}'
        textColor: '{colors.primary-foreground}'
        typography: '{typography.label-md}'
        rounded: '{rounded.md}'
        padding: '0px 16px'
        height: '40px'
    button-primary-hover:
        backgroundColor: '#00914D'
        textColor: '{colors.primary-foreground}'
        typography: '{typography.label-md}'
        rounded: '{rounded.md}'
        padding: '0px 16px'
        height: '40px'
    button-secondary:
        backgroundColor: '{colors.neutral}'
        textColor: '{colors.secondary}'
        typography: '{typography.label-md}'
        rounded: '{rounded.md}'
        padding: '0px 16px'
        height: '40px'
    button-tertiary:
        backgroundColor: 'transparent'
        textColor: '{colors.on-surface}'
        typography: '{typography.body-sm}'
        rounded: '{rounded.none}'
        padding: '0px'
        height: 'auto'
    card:
        backgroundColor: '{colors.surface}'
        textColor: '{colors.on-surface}'
        rounded: '{rounded.md}'
        padding: '16px'
    input:
        backgroundColor: '{colors.surface}'
        textColor: '{colors.on-surface}'
        typography: '{typography.input}'
        rounded: '{rounded.md}'
        padding: '0px 12px'
        height: '40px'
    chip:
        backgroundColor: '{colors.neutral}'
        textColor: '{colors.on-surface}'
        typography: '{typography.body-sm}'
        rounded: '{rounded.full}'
        padding: '0px 12px'
        height: '36px'
    tab-active:
        backgroundColor: '{colors.neutral}'
        textColor: '{colors.primary}'
        typography: '{typography.label-md}'
        rounded: '{rounded.none}'
        height: '40px'
    banner:
        backgroundColor: '{colors.surface}'
        textColor: '{colors.on-surface}'
        rounded: '{rounded.lg}'
        padding: '16px'
    nav-link:
        backgroundColor: 'transparent'
        textColor: '{colors.on-surface-muted}'
        typography: '{typography.navigation}'
        rounded: '{rounded.none}'
        padding: '0px'
---

# Tokopedia Green Commerce

## Overview

Tokopedia’s interface feels upbeat, efficient, and highly commercial, with a strong sense of trust and everyday usefulness. The visual tone is friendly rather than luxurious: bright green branding, white space, and bold promo graphics make the experience feel energetic and approachable. It is dense with content, but the spacing is disciplined enough to keep the page readable and conversion-focused.

## Colors

- **Primary (#00AA5B):** The signature Tokopedia green used for logo marks, primary calls to action, active states, and success-like emphasis. It communicates freshness, confidence, and marketplace trust.
- **Secondary (#101010):** A near-black used for strong text, key headings, and high-contrast interface elements. It keeps the UI grounded and readable on white surfaces.
- **Tertiary (#B3BBC9):** A muted cool gray used for borders, secondary controls, and subtle UI chrome. It supports structure without competing with the accent color.
- **Surface (#FFFFFF):** The default canvas for most containers, cards, and page regions. White space is a major part of the brand’s clarity.
- **Surface-muted (#F7F8FA):** A very light neutral used for soft separation, inactive zones, and background layering.
- **On-surface (#080808):** The main body text color, slightly softer than pure black while still offering excellent contrast.
- **On-surface-muted (#6B7280):** Used for supporting text, navigation labels, and less prominent metadata.
- **Border (#E5E7EB):** The standard divider and field outline color, keeping cards and inputs crisp but unobtrusive.
- **Border-strong (#B3BBC9):** A stronger border tone used when controls need clearer definition, such as search and form elements.
- **Primary-foreground (#FFFFFF):** The text/icon color on green buttons and active brand surfaces.
- **Primary-soft (#E7F9EF):** A pale green tint for gentle highlight areas and success-adjacent backgrounds.
- **Success (#00AA5B):** Matches the primary green, reinforcing the brand’s association with positive actions and completion.
- **Warning (#F59E0B):** A warm alert color for attention states when needed, though it is not dominant in the screenshot.
- **Error (#E11D48):** Reserved for destructive or validation messaging.

## Typography

The system uses Open Sauce One across the interface, which gives it a modern, rounded, highly legible retail voice. Headings are bold and compact, with no noticeable letter-spacing, and they lean into quick scanning rather than editorial elegance. Body text is slightly heavier than a typical UI body style, which fits the dense commerce context and improves readability at small sizes.

- **Headlines:** `headline-display`, `headline-lg`, `headline-md`, and `headline-sm` are used for hero banners, section titles, and major content blocks. They rely on 600–700 weight to keep marketing and navigation hierarchy clear.
- **Body:** `body-lg`, `body-md`, and `body-sm` cover supporting copy, field text, and smaller metadata. The 14px body style is the primary reading size in the interface.
- **Labels and controls:** `label-md`, `label-lg`, `navigation`, and `input` are tuned for buttons, tabs, and form fields. These styles are intentionally compact and assertive, matching the transactional nature of the product.
- **Caption:** `caption` is reserved for tiny supporting text, helper copy, and low-emphasis UI details.
- **Uppercase and tracking:** The observed UI does not rely on uppercase labels or pronounced tracking; clarity comes from weight, contrast, and spacing instead.

## Layout

The page is organized around a centered, fixed-max-width content area with generous outer margins, while the top navigation and utility rows stretch wider across the viewport. Major modules are grouped into large horizontal blocks: a hero banner, a two-column content panel, then promotional strips and category tabs. The spacing rhythm is moderate and consistent, using a small set of repeated gaps rather than many bespoke values.

Section padding and card interiors feel compact but not cramped: 16px inside cards, with larger 32px, 50px, and 110px rhythm values used to separate bigger page regions. The result is a marketplace layout that can carry a lot of content without losing structure.

## Elevation & Depth

Depth is subtle and restrained. Most UI relies on flat white surfaces, thin borders, and strong color contrast rather than heavy shadows or layering. When elevation is present, it is light and functional, like the soft shadow under cards and promo surfaces that helps them float from the page without feeling glossy.

## Shapes

The overall shape language is soft and practical, with an 8px default radius on buttons, cards, and inputs. Larger promotional panels can expand to 12px or 16px rounding, giving banners a friendly, modern feel. Circles and pill shapes appear selectively for chips, badges, and icon treatments, but the system is not overly rounded.

## Components

- **Primary buttons (`button-primary`):** Bright green fill, white text, `label-md` typography, 40px height, and 16px horizontal padding. These are the main conversion actions and should remain visually dominant. Hover states may deepen the green slightly via `button-primary-hover`.
- **Secondary buttons (`button-secondary`):** White background, subtle border, and dark text for secondary actions like login or supporting flows. Keep the same 40px height and 8px radius for consistency.
- **Tertiary buttons (`button-tertiary`):** Minimal or text-only actions, used for lightweight navigation and small utility links. They should not compete with primary actions.
- **Cards (`card`):** White surfaces with 1px borders, 8px radius, and 16px padding. Cards should feel organized and efficient rather than elevated or decorative.
- **Inputs (`input`):** White fields with light borders, 8px radius, and a 40px control height. Use compact padding and clear placeholder text so the form area stays clean in dense layouts.
- **Chips (`chip`):** Rounded pills with neutral backgrounds and compact height. These work well for category shortcuts and filters because they read as quick, selectable affordances.
- **Tabs (`tab-active`):** Simple, restrained tabs with active-state emphasis in green and minimal framing. The active label should feel crisp, not button-like.
- **Banners (`banner`):** Large promotional surfaces with stronger color and imagery. They can use more generous rounding than standard cards, but should still align to the grid.
- **Navigation links (`nav-link`):** Small, quiet text links in muted gray. Keep them lightweight so the main product actions and search remain the focal points.

## Do's and Don'ts

- Do keep the interface bright, open, and highly legible with white surfaces and clear spacing.
- Do use the Tokopedia green sparingly but consistently for primary actions, active states, and success cues.
- Do keep buttons compact and assertive with 40px height and strong label weight.
- Do use subtle borders to structure dense content instead of heavy shadows or decorative effects.
- Don't introduce dark backgrounds or luxury-style gradients into standard UI surfaces.
- Don't over-round controls; 8px should remain the default feel for most components.
- Don't use thin, delicate typography that lowers readability in a commerce-heavy interface.
- Don't let promotional visuals overwhelm the hierarchy; text, search, and conversion actions must stay easy to find.
