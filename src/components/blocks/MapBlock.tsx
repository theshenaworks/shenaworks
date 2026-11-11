import React from 'react'
import { ConsentEmbed } from '@/components/ui/ConsentEmbed'

export interface MapBlockProps {
  town: string
  address: string
  embedUrl?: string
  directionsUrl?: string
}

export function MapBlock({ town, address, embedUrl, directionsUrl }: MapBlockProps) {
  return (
    <ConsentEmbed
      title={`Map of Shena Works ${town} office`}
      embedUrl={embedUrl}
      fallbackAddress={`${town}: ${address}`}
      directionsUrl={directionsUrl}
    />
  )
}
