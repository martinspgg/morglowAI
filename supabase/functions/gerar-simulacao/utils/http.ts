import type { ErrorResponse, SuccessResponse } from '../types.ts'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400'
}

export const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json; charset=utf-8'
}

export function jsonResponse(
  body: SuccessResponse | ErrorResponse | Record<string, unknown>,
  status = 200
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  })
}

export function optionsResponse(): Response {
  return new Response('ok', {
    status: 200,
    headers: corsHeaders
  })
}

export function errorResponse(message: string, error: string, status = 200): Response {
  return jsonResponse(
    {
      success: false,
      ok: false,
      status: 'error',
      message,
      error
    },
    status
  )
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Erro desconhecido.'
}
