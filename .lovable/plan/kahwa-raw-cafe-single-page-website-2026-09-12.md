# Kahwa Raw Cafe single-page website

## Overview

Build a polished, mobile-first one-page website that makes visiting Kahwa Raw Cafe the primary action. The visual direction will blend cozy hospitality, premium editorial styling, modern clarity, and subtle Middle Eastern-inspired detail without becoming ornamental or generic.

## Page structure

- Add a sticky, accessible header with text branding, Home, Menu, About, and Visit links, a prominent Get Directions action, and a keyboard-friendly mobile menu.
- Build an image-led opening section with the supplied headline direction, concise supporting copy, Get Directions and Explore the Menu actions, and a clearly labeled replaceable café-image placeholder.
- Add a concise café introduction grounded only in the supplied customer-feedback themes.
- Create a scannable menu preview with editable placeholder categories and item slots explicitly marked “Menu details to be confirmed.” No prices, ingredients, dietary labels, or invented dishes will appear.
- Feature the three supplied customer-mentioned favourites: pistachio milk cake, brown sugar latte, and focaccia sandwich. Label them accurately and pair them with replaceable image placeholders.
- Add an atmosphere section with editorial image areas for the interior, seating, drinks, desserts, and café details.
- Create a review-summary section using the supplied editable 4.7 rating and 514-review count, with paraphrased feedback themes rather than fabricated quotations.
- Build a prominent Visit section with the exact address and phone number, working directions and telephone links, dine-in and takeaway wording, and “Check current hours before visiting.”
- Add a compact footer with contact details, in-page navigation, directions, and a dynamically generated copyright year.

## Visual direction

- Use an earthy, high-contrast semantic palette with warm cream, coffee, charcoal, muted olive, and a restrained copper accent.
- Pair an elegant editorial display face with a highly readable sans-serif body face.
- Use generous spacing, crisp section rhythm, subtle geometric pattern details, restrained borders, minimal shadows, and compact corner radii.
- Treat placeholders as art-directed editorial image panels with descriptive labels so they cannot be mistaken for real Kahwa Raw Cafe photography.
- Include only subtle entrance and navigation motion, with reduced-motion support.

## Content and interactions

- Keep all business details and editable content in simple centralized data structures.
- Use smooth accessible in-page navigation with correct focus behavior and section offsets.
- Make Get Directions open a Google Maps destination for the supplied address.
- Make Call the Café use `tel:+15874013212`.
- Do not add ordering, reservations, social links, delivery services, prices, full opening hours, or unsupported business claims.

## Technical details

- Replace the placeholder home screen at `/` and add unique café-specific title, description, Open Graph, and Twitter metadata.
- Update the global design tokens and typography while preserving the existing Tailwind v4 setup.
- Use semantic HTML, one H1, logical headings, descriptive alt text, visible focus states, touch-sized controls, stable image aspect ratios, and no horizontal overflow.
- Keep the implementation frontend-only; no database or external service connection is needed.

## Validation

- Check all navigation, directions, and call actions.
- Confirm no prices or invented menu items appear.
- Verify desktop and narrow mobile layouts in the running preview, including the mobile menu, readable text, section navigation, and absence of overlap or horizontal scrolling.
- Confirm the latest build and browser console are clean.
