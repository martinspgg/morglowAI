# MORGLOW AI

Plataforma SaaS B2B de Beauty Tech para salões de beleza e barbearias. Antes de qualquer corte, coloração ou barba, o cliente visualiza o resultado simulado por IA sobre sua própria foto — eliminando o principal motivo de hesitação do setor: o medo de se arrepender.

O app é operado pelo profissional (cabeleireiro/barbeiro) em tablet ou smartphone, com o cliente presente. Documentação de origem em `documentação/` (Guia de Prototipação v4.0, Especificação Funcional, Briefing Técnico e Adendo de Cobrança).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite (JavaScript), CSS puro por módulo de página |
| Backend / Auth / Banco | Supabase (PostgreSQL, Auth, Edge Functions) |
| Geração de imagem por IA | Supabase Edge Function `gerar-simulacao` com provider FLUX/HTTP compatível e fallback mock |
| Busca de estilos na web | Google Custom Search → Pexels → Openverse (conforme chave no `.env`) |

## Identidade visual

Paleta oficial (variáveis em `frontend/src/index.css`): dourado `#D4AF37` (CTA, destaques), prata `#C0C0C0` (secundários, bordas), preto `#0D0D0D` (fundo de todas as telas), grafite `#1E1E1E` (cards), branco `#F2F2F2` (texto). Fonte Exo 2 com fallback Roboto. Dark mode é parte da identidade — nunca fundo claro.

Responsividade em 4 faixas: `<=360px` (celulares pequenos), base mobile, `>=768px` (tablet, dispositivo principal) e `>=1100px` (desktop).

## Fluxo do atendimento

1. **Login** (`/`) — Supabase Auth
2. **Home** (`/home`) — novo atendimento, 4 clientes recentes, histórico, marketplace
3. **Cliente** (`/atendimento`, `/cadastrarCli`) — busca ou cadastro rápido com consentimento LGPD
4. **Análise** (`/analise`) — boas-vindas, cria o registro em `A3_ATENDIMENTOS`
5. **Captura Facial** (`/captura`) — câmera ou upload; foto vai para o fluxo (sessionStorage)
6. **Serviço** (`/service`) — corte, coloração, barba ou corte+barba
7. **Estilo** (`/estilo/:servico`) — catálogo local + busca de referência na web
8. **Processamento IA** (`/simulacao`) — Tela 04: animação + chamada de geração
9. **Resultado** (`/resultado`) — Tela 05: antes/depois, variações, aprovação (incrementa `A3_NATEND`)

Estado do fluxo compartilhado via `frontend/src/lib/atendimentoFlow.js` (sessionStorage). Geração via `frontend/src/lib/geracao.js` (`USAR_MOCK = true` — o mock aplica filtros na própria foto; quando a flag for alterada para produção, a chamada real vai para a Edge Function `supabase/functions/gerar-simulacao`).

## Edge Function `gerar-simulacao`

A função em `supabase/functions/gerar-simulacao` implementa o backend de geração real/fallback da simulação sem alterar o frontend. Ela aceita `POST` com JSON, responde `OPTIONS` para CORS e normaliza campos flexíveis enviados pelo app ou por integrações futuras.

Campos aceitos para imagem: `foto`, `image`, `imageUrl`, `image_url`, `fotoUrl`, `originalImage`, `original_image`, `base64`.

Campos aceitos para serviço: `servico`, `service`, `serviceType`, `tipoServico`. O serviço é normalizado internamente para `haircut`, `color`, `beard`, `haircut_beard` ou `unknown`.

Campos aceitos para estilo/cor/atendimento: `estilo`, `style`, `selectedStyle`, `selected_style`, `cor`, `color`, `selectedColor`, `selected_color`, `variacaoCor`, `variacaoEscolhida`, `atendimentoId`, `appointmentId`, `appointment_id`, `A3_ID`.

Resposta de sucesso inclui aliases amplos para compatibilidade:

```json
{
  "success": true,
  "ok": true,
  "status": "success",
  "resultadoUrl": "https://...",
  "resultUrl": "https://...",
  "imageUrl": "https://...",
  "url": "https://...",
  "variacoes": [
    {
      "id": "var_1",
      "url": "https://...",
      "imageUrl": "https://...",
      "label": "Variação 1",
      "nome": "Variação 1",
      "imagem": "https://..."
    }
  ],
  "metadata": {
    "provider": "flux",
    "model": "flux-compatible-http",
    "durationMs": 1200,
    "mode": "single_simulation"
  }
}
```

O item de variação mantém `nome` e `imagem` para continuar compatível com a tela atual de resultado.

### Providers

- `mockProvider`: retorna a própria imagem enviada e cria até 3 variações mock. É usado quando `AI_PROVIDER` não é `flux`, quando `FLUX_API_KEY` está ausente ou quando o provider real falha.
- `fluxProvider`: faz `POST` via `fetch` para `FLUX_API_URL`, usando `FLUX_API_KEY`, com payload isolado para ajuste conforme o provedor FLUX escolhido. A função tenta mapear retornos comuns como `image_url`, `url`, `output`, `images[0].url`, `data`, `artifacts` e base64.

O prompt final preserva rosto, pele, expressão, idade aparente, roupa, fundo, iluminação, ângulo e identidade do cliente, alterando apenas cabelo, cor ou barba conforme o serviço selecionado.

### Variáveis de ambiente

```bash
AI_PROVIDER=mock
FLUX_API_KEY=
FLUX_API_URL=
FLUX_TIMEOUT_MS=60000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`AI_PROVIDER` também aceita o alias legado `IA_PROVIDER`. Para testar sem custo, mantenha `AI_PROVIDER=mock` ou não configure `FLUX_API_KEY`.

### Deploy

```bash
supabase functions deploy gerar-simulacao
supabase secrets set AI_PROVIDER=flux FLUX_API_KEY=... FLUX_API_URL=...
```

Teste mock com URL:

```bash
curl -i -X POST "$SUPABASE_URL/functions/v1/gerar-simulacao" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "foto": "https://exemplo.com/foto-cliente.jpg",
    "servico": "corte",
    "estilo": {
      "nome": "Degradê Moderno",
      "descricao": "Fade progressivo nas laterais, topo com movimento e textura.",
      "variacoes": ["Natural", "Texturizado"]
    },
    "variacaoEscolhida": "Natural",
    "atendimentoId": "123"
  }'
```

## Rodando o projeto

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env` (não versionado):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_PEXELS_KEY=...          # busca de estilos (opcional)
VITE_GOOGLE_CSE_KEY=...      # Google Imagens (opcional, prioridade sobre Pexels)
VITE_GOOGLE_CSE_CX=...
```

Tabelas no Supabase: `L1_LOJA` (conta do salão), `A3_CLIENTE` (clientes, `A3_NATEND` = nº de atendimentos), `A3_ATENDIMENTOS` (registros de atendimento), `M1_MARKETPLACE` (produtos).

## Pendências

- [ ] **Configurar provider real de IA**: escolher o endpoint FLUX/HTTP definitivo, configurar `AI_PROVIDER=flux`, `FLUX_API_KEY` e `FLUX_API_URL`, validar custo/latência (~20-30s ponta a ponta) e então trocar `USAR_MOCK` para `false` em `frontend/src/lib/geracao.js`
- [ ] **Validação real da foto** na captura (exatamente 1 rosto, nitidez, iluminação) — hoje só há dicas visuais; a doc exige bloqueio antes de enviar à IA
- [ ] **Recência real no histórico**: criar coluna de data do último atendimento (ex.: `A3_ULTATEND`) e ordenar Recentes/Histórico por ela (hoje ordena por `id`)
- [ ] **Tela 06 — Guia Técnico do profissional** (passo a passo de execução, ferramentas, protocolo de coloração) vinculado ao estilo aprovado
- [ ] **Compartilhamento do resultado** (WhatsApp/e-mail) + avaliação da experiência ao fim do atendimento
- [ ] **Status do atendimento**: atualizar `A3_STATUS` em `A3_ATENDIMENTOS` na aprovação/abandono; salvar a imagem aprovada no histórico (Supabase Storage)
- [ ] **Multi-tenant de verdade**: RLS por salão (hoje as policies são abertas para qualquer usuário autenticado) e vínculo cliente ↔ salão
- [ ] **Criação de conta** no Login (link "Crie uma" ainda sem ação)
- [ ] **Config — cobrança da simulação**: persistir o toggle Cortesia/Serviço Pago e o valor no banco (Adendo de Cobrança)
- [ ] Corrigir lint pré-existente (`set-state-in-effect` nos fetches em useEffect)

## Ideias futuras (da documentação)

- **Painel biométrico completo** (Tela 05): formato do rosto, tom de pele (Fitzpatrick I–VI para personalizar coloração), tipo de cabelo, simetria — via modelo de visão computacional
- **Geração sob demanda por variação**: cada aba/variação tocada dispara nova geração (controle de custo), em vez de gerar tudo de uma vez
- **Catálogo de estilos por salão**: estilos e preços personalizáveis pela conta (hoje o catálogo é fixo no código)
- **Dashboard do gestor**: métricas de atendimentos, taxa de conversão pós-simulação
- **Marketplace integrado a fornecedores** (hoje é catálogo estático do banco)
- **Modo admin oculto** e múltiplos profissionais por salão
- **Fine-tuning do modelo de IA** com resultados reais aprovados
- **Fase barba na IA**: a doc admite barba como fase 1.5 se a complexidade técnica for alta

## Deploy / Git

- Branch de trabalho: `testesClaude` → merge em `main`
- Edge Function: `supabase functions deploy gerar-simulacao` (secrets via `supabase secrets set`)
