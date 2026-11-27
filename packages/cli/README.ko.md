# 에이전트 CLI 사용법

[영문 전체 참조](README.md). 패키지 @designmode-app/cli, 실행 파일 designmode-app. 원본 소스 3.2.2는 원문 기준 아직 npm에 배포되지 않았습니다. 한국어판도 별도 배포 전입니다.

```sh
npm ci
npm run build --workspace @designmode-app/cli
node packages/cli/dist/cli.cjs --help
node packages/cli/dist/cli.cjs --mode local tools
npm pack --workspace @designmode-app/cli
```

생성된 tarball을 npm install /path/to/designmode-app-cli-3.2.2.tgz로 설치할 수 있습니다. Node 18 이상 필요. 원본 npm 배포판은 npx @designmode-app/cli@latest --help 또는 npm install -g @designmode-app/cli로 실행합니다. 운영용은 검증한 버전을 고정합니다.

## 모드

우선순위: --mode → DM_MODE → 설정 mode → Cloud.

| 모드 | 설정 |
| --- | --- |
| Cloud | https://mcp.designmode.app/api/mcp, DM_CLOUD_TOKEN 또는 cloud.token. 주소 변경 불가 |
| Local | DM_PORT(기본 9960). MCP 클라이언트가 design-mode-mcp를 시작해야 함. CLI 자체는 브리지를 시작하지 않음 |
| Self-hosted | DM_ENDPOINT(전체 /api/mcp URL) 또는 selfHosted.endpoint, DM_SELF_HOSTED_TOKEN 또는 selfHosted.token |

Self-hosted 원격 주소는 HTTPS 필수이며 HTTP는 localhost, 127.0.0.1, [::1]만 허용합니다. URL 인증 정보, 쿼리, 프래그먼트 및 리디렉션은 거부합니다. Cloud와 Self-hosted 인증 정보는 공유하지 않습니다.

토큰을 명령 인수나 채팅에 입력하지 않습니다. 환경 변수나 보호된 설정 파일을 사용합니다. 설정 파일은 DM_CONFIG로 직접 지정하고 현재 사용자 소유의 일반 파일(심볼릭 링크 불가), 권한 0600, 최대 64KiB JSON이어야 합니다. 저장소 밖에 보관합니다. 환경 변수가 설정 파일보다 우선합니다.

## 명령어

```sh
designmode-app version
designmode-app tools
designmode-app schema apply_changes
designmode-app status
designmode-app call get_session_summary
printf '%s' '{"format":"css"}' | designmode-app call export_changes --stdin
designmode-app --mode local status
```

tools/schema는 도구와 스키마를 조회합니다. status는 원격 모드에서 중계 연결만 확인하며 브라우저는 get_session_summary로 확인합니다. Local status는 브리지와 확장 연결을 보고합니다. call은 도구를 한 번 호출하며 --stdin은 최대 1MB JSON 객체, 생략하면 {}입니다. 원격 조회도 인증이 필요합니다.

## 제한과 안전

도구는 페이지를 변경할 수 있으므로 스키마를 먼저 확인합니다. 자동 재시도는 하지 않습니다. 원격 기본 제한은 30초(DM_TIMEOUT_MS 100~120000), Local은 30초입니다. 연결 해제가 변경 롤백을 의미하지 않습니다. 재시도 전에 상태를 확인하세요. 도움말 이외의 출력은 JSON이며 인증 정보를 마스킹하더라도 페이지 데이터가 포함될 수 있습니다.

| 종료 코드 | 설명 |
| --- | --- |
| 0 | 성공 |
| 1 | MCP/도구/인증/전송 실패 또는 타임아웃 |
| 2 | 입력/설정/명령 오류 |
| 3 | Local 브리지 접근 불가 |
| 4 | 확장 프로그램 오프라인 |

## 테스트

```sh
npm test --workspace @designmode-app/cli
npm run typecheck --workspace @designmode-app/cli
npm run build --workspace @design-mode/mcp-local
npm run typecheck --workspace @design-mode/mcp-local
npm test --workspace @design-mode/mcp-local
```

테스트 픽스처 검증과 운영 중계·실제 브라우저 검증은 별개입니다. 배포 절차는 [원문](PUBLISHING.md)을 참고합니다. 위브온 포크에는 원본 npm 배포 권한이 자동 승계되지 않습니다.
