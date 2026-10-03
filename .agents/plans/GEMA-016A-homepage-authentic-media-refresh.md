# GEMA-016A — Homepage Media Refresh & Menu Teaser Semantic Correction Plan

Status: APPROVED BY USER (Execution Contract)
Date: 2026-09-18
Scope: Homepage authentic media replacement (excluding Journal and Events) with semantic alignment for Menu Teaser and rigorous Signature Dishes verification.

---

## 1. Locked Approvals & Directives

### A. Menu Teaser Section (`CuisineCategories.tsx`)
1. **Kategori 01: ANTIPASTI**
   - Source: `QAR04007.jpg`
   - Target: `/media/teaser/home-menu-teaser-antipasti.jpg`
   - Label: EN: `ANTIPASTI`, ID: `ANTIPASTI`
   - Reason: Fried appetizer presentation with dipping sauce, consistent with GEMA antipasti family.

2. **Kategori 02: PASTA**
   - Source: `FNR02831.jpg`
   - Target: `/media/teaser/home-menu-teaser-pasta.jpg`
   - Label: EN: `PASTA`, ID: `PASTA` (Do NOT use "FRESH PASTA" / "Pasta Segar" to align with authoritative category taxonomy).
   - Reason: Chef plating pasta directly from sauté pan into plate.

3. **Kategori 03: WOODFIRE & GRILL**
   - Source: `QAR03957.jpg`
   - Target: `/media/teaser/home-menu-teaser-grill.jpg`
   - Label: EN: `WOODFIRE & GRILL`, ID: `WOODFIRE & GRILL`
   - Reason: Sliced grilled steak on the pass. Crop/object-position prioritizes the steak over side dishes.

4. **Kategori 04: DOLCI**
   - Source: `3E7402F0-326A-4BE8-A27E-88E1A479CF12.jpg`
   - Target: `/media/teaser/home-menu-teaser-dolci.jpg`
   - Label: EN: `DOLCI`, ID: `DOLCI`
   - Reason: Hand-dusting cocoa GEMA script stencil on Tiramisu; strong branded ending for the food journey.

### B. Beverage / Cocktail Asset
- `QAR04031.jpg` preserved in working asset pool for future bar/beverage usage. NOT used in Menu Teaser.

### C. Experience / Atmosphere Section (`SpacePreview.tsx`)
- **Indoor Dining**: `1445A16B-ADA5-491F-A94D-C33487E13B53.jpg` $\rightarrow$ `/media/experience/home-experience-indoor.jpg`
- **Patio / Greenery**: `029899D5-C7C8-407C-BCD1-C791C21E13E6.jpg` $\rightarrow$ `/media/experience/home-experience-patio.jpg`

### D. Signature Dishes Evaluation (`SignatureDishes.tsx`)
Current cards:
1. `Ravioli Fritti`: No authentic photo of fried ravioli found. $\rightarrow$ **LEAVE UNCHANGED / NO SAFE MATCH**
2. `Quattro Formaggi`: No authentic pizza photos exist in Drive. $\rightarrow$ **LEAVE UNCHANGED / NO SAFE MATCH**
3. `Ragu di Manzo`: No authentic pizza photos exist in Drive. $\rightarrow$ **LEAVE UNCHANGED / NO SAFE MATCH**
4. `Australian Wagyu Picanha`: `QAR03957.jpg` (sliced grilled wagyu steak) $\rightarrow$ **SAME DISH FAMILY**; web derivative `/media/signature/home-signature-wagyu-picanha.jpg` cropped on the grilled steak.

### E. Untouched Invariants
- **Hero**: Retain single source `home-hero-open-kitchen.jpg` across desktop & mobile.
- **Chef Preview**: Retain `chef-home-loop.mp4` and verified poster.
- **Events Section**: STRICTLY UNTOUCHED.
- **Journal Section**: STRICTLY UNTOUCHED.
- **Signature Dish Copy**: Unchanged.
