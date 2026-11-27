# Design Mode 한국어판

브라우저에서 웹페이지를 직접 편집하고 정확한 변경사항을 기록해 AI 코딩 에이전트에 전달하는 무료 오픈소스 확장 프로그램입니다. 화면 편집은 미리보기이며 실제 소스는 저장소 접근 권한이 있는 에이전트가 수정합니다.

위브온 한국어판은 [원본 Design Mode](https://github.com/SandeepBaskaran/design-mode)를 기반으로 하며 MIT 라이선스와 MCP 규격을 유지합니다. 현재 UI 한글화 작업 중입니다.

![Design Mode 사이드 패널](website/public/cover.png)

## 주요 기능

- 요소 검사, 레이아웃·글꼴·색상·여백·효과·모션 수정
- 스타일·텍스트·DOM·의견의 변경 기록
- Markdown 프롬프트 복사 또는 MCP를 통한 AI 전달
- Chrome, Firefox, Safari 지원 (별도 창, 화면 속 화면 및 화면 스포이드는 Chromium 전용)

사이트 배포나 로그인 우회 기능은 제공하지 않습니다. 로컬 서버, 테스트 사이트, 이미 로그인한 페이지 등 스크립트 실행이 허용된 페이지를 편집합니다.

## 한국어판 설치 (Chrome)

Node.js 18 이상이 필요합니다. 원본 릴리스 환경인 Node.js 20 및 npm 10을 권장합니다.

```bash
git clone -b localization/ko https://github.com/WEEVON/design-mode-kr.git
cd design-mode-kr
npm ci
npm run build:extension
```

Chrome에서 chrome://extensions → 개발자 모드 → 압축해제된 확장 프로그램 로드 → packages/extension/dist 폴더를 선택합니다. 수정 후 다시 빌드하고 확장을 새로고침합니다. 한국어판 빌드 및 브라우저 검증은 아직 완료되지 않았습니다.

원본 배포판은 [Chrome 웹스토어](https://chromewebstore.google.com/detail/design-mode/ighgobegfcmjagombgnfhgioflinojih), [Firefox 140+](https://addons.mozilla.org/firefox/addon/design-mode-add-on/), [Safari 임시 확장](https://github.com/SandeepBaskaran/design-mode/releases/latest)에서 받을 수 있습니다. 이 링크는 한국어판이 아닙니다. Safari에서는 designmode-for-safari.zip을 임시 확장으로 추가하며 종료 시 제거됩니다.

## 빠른 시작

1. 확장 프로그램을 툴바에 고정하고 개발 페이지에서 실행합니다.
2. 요소를 선택해 스타일을 수정합니다.
3. 변경사항 탭에서 수정 내용을 확인합니다.
4. 프롬프트 복사 또는 MCP 연결 후 AI에 전송합니다.
5. AI가 수정한 실제 코드의 diff와 PC·모바일 화면을 검수합니다.

## 한국어 매뉴얼

| 문서 | 설명 |
| --- | --- |
| [사용자 매뉴얼](FEATURES.ko.md) | 기능 및 작업 흐름 |
| [디자인 패널](DESIGN-PANEL.ko.md) | 크기, 여백, 정렬, 글꼴, 효과 |
| [레이어 탭](LAYERS.ko.md) | 요소 선택 및 구조 수정 |
| [변경사항 탭](CHANGES.ko.md) | 검토, 내보내기, AI 전달 |
| [Local MCP 연결](docs/agent-setup.ko.md) | Claude Code, Cursor 및 실시간 피드백 |
| [CLI 사용법](packages/cli/README.ko.md) | Cloud, Local, Self-hosted |
| [Cloud MCP 운영](packages/mcp-cloud/README.ko.md) | 중계 서버 |
| [AI 작업 지침](website/public/design-mode.ko.md) | MCP 도구 및 작업 절차 |
| [Firefox 빌드](SOURCE-BUILD-README.ko.md) | 소스 빌드 및 패키징 |
| [개인정보·권한](PRIVACY.ko.md) | 접근 권한 및 전송 데이터 |

한국어 참조 문서는 실무 중심으로 정리한 매뉴얼이며 세부 사양은 각 문서의 영문 원본을 참조합니다. [영문 README](README.en.md)를 보존합니다.

## 공식 추가 자료

[공식 홈페이지](https://designmode.app/) · [데모](https://designmode.app/demo) · [MCP 설정](https://designmode.app/mcp) · [연결 안내](https://designmode.app/blog/mcp-setup) · [브라우저 지원](https://designmode.app/blog/browser-support) · [단축키](https://designmode.app/blog/keyboard-shortcuts) · [문제 해결](https://designmode.app/blog/troubleshooting) · [변경 이력](https://designmode.app/changelog)

## 개인정보와 라이선스

릴리스 빌드는 제한된 사용 통계를 전송합니다. 페이지 내용, 선택자, 의견, 스크린샷은 통계에 포함하지 않습니다. MCP 전송은 별도이며 [개인정보 원문](PRIVACY.md)을 참고하세요. [보안](SECURITY.md) · [MIT 라이선스](LICENSE).

## 개발

```bash
npm ci
npm run dev:extension
npm run dev:website
npm run verify
```

[수동 테스트](docs/e2e-testcases.md) · [기여 규칙](CONTRIBUTING.md) · [행동 강령](CODE_OF_CONDUCT.md)
