import { TOR_TEMPLATES } from '@/lib/server/tor-templates'

/**
 * GET /api/tor/template/[name]
 * Get TOR template data by name.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  if (!(name in TOR_TEMPLATES)) {
    const available = Object.keys(TOR_TEMPLATES).join(', ')
    return Response.json(
      {
        detail: `Template '${name}' not found. Available: ${available}`,
        error: 'Not found',
      },
      { status: 404 }
    )
  }

  const template = TOR_TEMPLATES[name]
  return Response.json({
    category: template.category,
    fields: template.fields,
    title: template.title,
  })
}
