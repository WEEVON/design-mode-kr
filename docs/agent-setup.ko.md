# Local MCP 에이전트 설정

[영문 원본](agent-setup.md)

자동 설정은 Claude Code와 Cursor의 프로젝트 단위 설정을 지원합니다. 다른 클라이언트는 MCP 화면의 설정 복사와 워크플로 다운로드를 이용합니다. 별도 npm 배포 패키지가 필요하지 않습니다.

```sh
npm ci
npm --workspace @design-mode/mcp-local run build
node packages/mcp-local/dist/bin/cli.js setup --project /absolute/path/to/your/app --agent claude-code
```

Windows에서는 빌드 스크립트의 POSIX 환경 변수 문법에 맞는 실행 환경이 필요할 수 있습니다. 브라우저와 Local 브리지의 loopback 연결을 확인하세요.

--agent cursor는 Cursor, --agent all은 양쪽 설정입니다. 기본은 dry-run이며 파일을 수정하지 않습니다. 확인 후 --apply를 추가하고 승인합니다. --yes는 명시적 비대화형 승인입니다.

| 클라이언트 | 설정 | 워크플로 |
| --- | --- | --- |
| Claude Code | .mcp.json | .claude/commands/design-mode.md |
| Cursor | .cursor/mcp.json | .cursor/commands/design-mode.md |

설정은 design-mode 항목만 병합하며 다른 항목을 보존합니다. 수정 파일은 백업합니다. 기존 항목 충돌 시 --force와 적용 승인이 필요합니다. 기존 환경 변수와 추가 옵션을 보존하고 Local과 호환되지 않는 HTTP 필드는 제거합니다. JSONC 주석, 후행 쉼표와 BOM을 허용하며 변경 파일은 경고 후 JSON으로 정규화합니다. 잘못된 입력과 심볼릭 링크 대상은 덮어쓰지 않습니다. 동일 설정은 다시 쓰지 않습니다. 관계없는 설정값은 미리보기에 출력하지 않습니다. 비밀정보가 있는 백업을 커밋하지 마세요.

Node와 빌드된 CLI의 절대 경로를 사용하므로 이동하거나 Node를 교체하면 재설정합니다. 에이전트를 재시작하고 확장 MCP 화면에서 Local, 포트 9960(기본)을 선택합니다.

```sh
node packages/mcp-local/dist/bin/cli.js doctor
```

doctor는 CLI와 localhost 브리지/확장 연결을 확인하며 설정을 수정하거나 에이전트를 시작하지 않습니다. 에이전트 시작 전에 owner가 없는 것은 정상입니다. 사용자 지정 포트는 doctor --port <port>로 확인합니다.

## 실시간 피드백

에이전트에서 /design-mode를 실행하고 실시간 모드를 선택합니다. Local 전용 wait_for_handoff는 최대 20초씩 대기합니다. 화면에는 피드백 대기 중, 적용 중, 중지됨이 표시됩니다. 각 전송은 독립 스냅샷이며 이후 수정은 기존 전송에 포함되지 않습니다.

중지는 편집을 삭제하지 않고 루프를 종료하지만 실행 중인 에이전트 명령까지 중단하지는 않습니다. 필요하면 에이전트에서 직접 중지하세요. 페이지 이동, 연결 해제, 명시적 Clear도 세션을 종료합니다. 여러 클라이언트가 동일 세션을 동시에 소유할 수 없습니다. Cloud와 Self-hosted는 일회성 전송만 지원합니다.
