---
description: 사용자의 Design Mode 편집과 의견을 실제 소스에 반영
---

# AI 에이전트 작업 지침 (한국어 참조)

[실행용 영문 원본](design-mode.md). 원본 명령과 도구 ID를 유지합니다.

| 도구 | 역할 |
| --- | --- |
| get_session_summary | 확장 연결 확인 |
| get_changes | 토큰/스타일/텍스트/DOM/의견 및 항목 ID 조회 |
| get_screenshot | 선택자, elementId 또는 의견 영역 캡처 |
| export_changes | CSS/Tailwind/SCSS/JSX 내보내기 |
| apply_changes | 브라우저 CSS 미리보기 |
| set_change_status | 항목 진행 중/해결 표시 |
| mark_comment_resolved | 의견 해결 표시 |
| wait_for_handoff | Local 전용 다음 전송 대기 |

연결 확인 후 일회성 처리 또는 실시간 피드백을 선택합니다. 일회성은 get_changes로 미해결 작업을 확인합니다. Local 실시간 모드는 정확한 pageUrl로 wait_for_handoff를 호출해 명시적 전송을 기다립니다. sessionId와 after 커서를 반환값에 맞게 유지합니다.

각 항목의 ID를 in_progress로 표시하고 selector를 실제 저장소의 path:line과 대응시킵니다. 영역 의견은 스크린샷으로 문맥을 확인합니다. CSS 토큰 변경은 scopeSelector에 해당하는 소스 정의를 수정하며 인라인 리터럴로 바꾸지 않습니다. var(--x)는 토큰 참조로 유지합니다. 기존 코드 스타일과 반응형 구조를 따릅니다. 실제 수정 및 검수 후 해당 ID만 resolved 처리하거나 의견 해결 도구를 사용합니다.

실시간 루프는 최대 20초씩 대기합니다. waiting이면 재대기, feedback이면 해당 스냅샷의 ID만 처리, stopped/busy이면 종료합니다. Cloud/Self-hosted 및 도구 미지원 환경은 일회성으로 처리합니다. 최종적으로 수정한 파일과 해결한 의견을 요약합니다.

처리 모드: step(개별 확인), batch(관련 작업 묶음 확인), yolo(자율 일괄 처리). 사용자 선택을 따릅니다.
