# Firefox 소스 빌드

[영문 전체 참조](SOURCE-BUILD-README.md). 원본 AMO 심사용 소스 아카이브 생성 명령은 npm run package:firefox-source이며 DM_FIREFOX_SOURCE_ZIP으로 출력 경로를 변경할 수 있습니다.

Node 20.x 및 npm 10.x 권장(Node 18 이상 지원).

```sh
npm ci
npm run package:extension:firefox
```

결과는 packages/extension/design-mode-addon.zip입니다. about:debugging → 이 Firefox → 임시 부가 기능 로드에서 packages/extension/dist/manifest.json을 선택할 수도 있습니다.

수동 패키징:

```sh
npm run build:extension
cd packages/extension/dist
zip -rq ../design-mode-addon.zip . -x '*.DS_Store' -x '*.map'
```

기본 소스 빌드에는 사용 통계 설정이 주입되지 않습니다. 원본 배포 ZIP은 릴리스 워크플로에서 DM_DISTRIBUTION, DM_POSTHOG_HOST, DM_POSTHOG_KEY를 주입하므로 바이트 단위로 동일하지 않을 수 있습니다. 원본 배포 환경의 키를 한국어판에 복사하지 않습니다.

심사용 아카이브는 루트 패키지 및 잠금 파일, 라이선스, 아이콘, extension/shared 빌드 소스와 잠금 파일 유지를 위한 워크스페이스 package.json을 포함합니다. 웹사이트·MCP 소스, 테스트, 캐시, dist, 비밀정보 등은 제외합니다.
