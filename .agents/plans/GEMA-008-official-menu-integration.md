# GEMA-008 — Official Food & Beverage Menu Integration

Integrate official GEMA Food and Beverage menus transcribed from approved PDFs.

## Objectives
- Replace placeholder/demo menu fixtures with authentic PDF menu data.
- Introduce client-side `FOOD | BEVERAGE` top-level switch with dynamic category navigation.
- Extend domain models (`MenuCategory`, `MenuItem`) cleanly without redundant `menuType` on items.
- Preserve source spellings, section notes, steak multi-pricing, burger add-ons, and tax/service footnote.
- Retain curated `signature: true` flags on flagship items for homepage `SignatureDishes` section continuity.

## Domain Model
- `MenuCategory`:
  - `id`: string
  - `name`: LocalizedText
  - `order`: number
  - `menuType`: 'food' | 'beverage'
  - `sectionNote?`: LocalizedText
- `MenuItem`:
  - `id`: string
  - `slug`: string
  - `name`: string
  - `categoryId`: string
  - `description?`: LocalizedText
  - `priceLabel`: string
  - `portion?`: string
  - `priceVariants?`: { portion?: string; label?: string; priceLabel: string }[]
  - `subhead?`: LocalizedText
  - `subheadNote?`: LocalizedText
  - `additionalNotes?`: string[]
  - `isIntroBlock?`: boolean
  - `signature?`: boolean (curated website presentation flag)
  - `featured?`: boolean
  - `contentStatus`: 'verified'

## Verification
- Run `npm run typecheck` and `npm run build`.
- Check all 11 food and 9 beverage categories, item names, prices, notes, and switcher behavior.
