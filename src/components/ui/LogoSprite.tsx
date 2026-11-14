import React from 'react'
import {
  BRAND_COLORS,
  SHENA_LOGO_GOLD_PATH,
  SHENA_LOGO_NAVY_PATH,
  SHENA_LOGO_VIEWBOX,
} from '@/lib/brand'

/**
 * LogoSprite (AGENTS.md Section 0 Rule 4)
 * Inlines the logo <symbol id="shena-logo"> sprite once in the (site) layout.
 * Gold (#cb984e) & navy (#022460) hexagonal S emblem + SHENA WORKS wordmark,
 * with --logo-ink switching to white over dark photo headers.
 */
export function LogoSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <symbol id="shena-logo" viewBox={SHENA_LOGO_VIEWBOX}>
        <path
          d={SHENA_LOGO_GOLD_PATH}
          fill={`var(--logo-gold, ${BRAND_COLORS.logoGold})`}
          fillRule="evenodd"
        />
        <path
          d={SHENA_LOGO_NAVY_PATH}
          fill={`var(--logo-ink, ${BRAND_COLORS.logoNavy})`}
          fillRule="evenodd"
        />
      </symbol>
    </svg>
  )
}
