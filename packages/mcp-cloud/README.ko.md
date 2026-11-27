# Cloud MCP 서버 운영

[영문 원본](README.md) — 운영 요약.

Vercel에 배포하는 다중 테넌트 MCP 중계 서버로 Redis(Upstash) 연동을 사용합니다. AI 에이전트는 HTTPS Streamable HTTP /mcp로 연결하고, 확장 프로그램은 SSE /extension/stream 및 POST /extension/inbox를 사용합니다. 요청은 inbound:{tenantId}, 응답은 resp:{tenantId}:{requestId}에 저장됩니다. 응답 TTL은 60초이며 테넌트는 인증된 토큰에서 도출합니다.

## 로컬 실행

Vercel Marketplace Redis 연동이 REDIS_URL을 주입합니다. 로컬은 .env.example을 .env.local로 복사해 설정합니다.

```bash
npm install
vercel dev
```

로컬 3000 포트의 /api/auth/register로 익명 토큰을 발급하고, 확장 SSE 및 MCP 요청에 Authorization: Bearer 헤더를 사용합니다. 토큰은 기록하거나 공유하지 않습니다. 원본에 있는 smoke test 예제를 참고하세요.

## 제한 및 보안

기본 일일 호출량은 테넌트별 25회(DM_DAILY_QUOTA)이며 실제 호스팅 설정은 다를 수 있습니다. 유휴 연결 차단이나 폴링 지연 대신 호출량을 제한합니다. 원본 설계의 스트림 정리 기준은 약 100개/60초입니다. 로그에는 tenantId, type, byteCount, latency만 기록하도록 합니다. 운영 환경은 TLS를 사용합니다. /auth/revoke로 토큰을 폐기합니다. 현재 패널은 열려 있어야 하며 익명 기기 토큰 및 마지막 연결 우선 방식을 사용합니다.

```sh
npm test --workspace @design-mode/mcp-cloud
npm run typecheck --workspace @design-mode/mcp-cloud
```

테스트는 실제 운영 중계 서버에 접속하지 않습니다. 자체 서버에 배포하려면 Vercel/Redis 환경과 운영 비용을 별도로 검토하세요.
