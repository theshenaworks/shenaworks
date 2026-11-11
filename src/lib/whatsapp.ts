export type WhatsAppMessageContext =
  | { type: 'default' }
  | { type: 'service'; serviceTitle: string }
  | { type: 'project'; projectTitle: string }
  | { type: 'equipment'; categoryName?: string }
  | { type: 'machine'; machineName: string; make: string; model: string }
  | { type: 'location'; town: string }
  | { type: 'contact' }

export function buildWhatsAppMessage(ctx: WhatsAppMessageContext = { type: 'default' }): string {
  switch (ctx.type) {
    case 'service':
      return `Hello Shena Works, I'm interested in ${ctx.serviceTitle} in [my location]. Can we talk?`
    case 'project':
      return `Hello Shena Works, I saw the ${ctx.projectTitle} project on your website and I'd like something similar.`
    case 'equipment':
      return `Hello Shena Works, I'd like to hire ${ctx.categoryName ? ctx.categoryName.toLowerCase() : 'equipment'}. Is it available?`
    case 'machine':
      return `Hello Shena Works, I'd like to hire the ${ctx.machineName} (${ctx.make} ${ctx.model}). Dates: [ ]. Site location: [ ].`
    case 'location':
      return `Hello Shena Works, I'm in ${ctx.town} and would like to talk about a project.`
    case 'contact':
      return `Hello Shena Works, I'd like to request a quote.`
    case 'default':
    default:
      return 'Hello Shena Works, I found you on your website and would like to talk about a project.'
  }
}

export function buildWhatsAppUrl(
  ctx: WhatsAppMessageContext = { type: 'default' },
  whatsappNumber = '254718971896',
): string {
  const digits = whatsappNumber.replace(/[^0-9]/g, '')
  const message = buildWhatsAppMessage(ctx)
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
