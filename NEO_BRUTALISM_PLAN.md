# Implementation Plan - Neo-Brutalism Overhaul

This plan outlines the steps to transform the current social media application into a production-ready "Neo-Brutalism" masterpiece.

## 1. Design System (Neo-Brutalism)
- **Palette**: 
  - Background: `#FFFFFF`
  - High Contrast: `#000000`
  - Accent 1 (Primary): `#A3E635` (Neon Green)
  - Accent 2 (Secondary): `#FF3366` (Neon Pink)
  - Accent 3: `#3B82F6` (Electric Blue)
- **Typography**:
  - Headings: Bold, Heavy (e.g., 'Bebas Neue' or 'Public Sans')
  - Body: Medium/Bold (e.g., 'Inter')
- **UI Elements**:
  - Borders: `4px solid #000000`
  - Shadows: `6px 6px 0px #000000` (Hard offset, no blur)
  - Layout: Grid-based, asymmetrical, boxy.

## 2. Frontend Overhaul (client/src)
### Phase 1: Global Styles & Configuration
- Update `index.css` with CSS variables for the Neo-Brutalism theme.
- Create a `ThemeContext` if necessary.

### Phase 2: Core Components Rebuild
- **Navbar**: High-contrast, sticky, bold links.
- **PostCard**: The centerpiece. Thick borders, Hard shadows, Bold interactions.
- **Buttons**: Neo-brutalism "push" effect (shadow disappears on active).

### Phase 3: Page Rebuilds
- **AuthPages (Login/Register)**: Bold typography, centered boxes.
- **HomePage (Feed)**: Modern grid of post cards.
- **ProfilePage**: Bold header, grid of user posts.

## 3. Backend Verification (server)
- Ensure all routes are working for the new frontend requirements.
- Verify `Post` and `User` models support the visual data.

## 4. Documentation & Setup
- `SETUP.md`: Step-by-step instructions.
- `DEPLOYMENT.md`: Vercel + MongoDB Atlas guide.
