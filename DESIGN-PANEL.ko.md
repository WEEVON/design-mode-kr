# 디자인 패널 사용법

[영문 전체 속성 참조](DESIGN-PANEL.md) — 실무용 한국어 요약. 내부 CSS 속성명은 번역하지 않습니다.

| 영역 | 사용 방법 | 주요 CSS |
| --- | --- | --- |
| 위치 | 좌표, 기준 위치, 쌓임 순서, 회전·반전 | position, top, left, z-index, transform |
| 레이아웃 | 크기, 최소·최대 크기, 정렬, 간격, 박스 모델 | width, height, display, gap, margin, padding |
| 모양 | 투명도, 둥근 모서리, 필터, 가시성 | opacity, border-radius, filter, visibility |
| 타이포그래피 | 글꼴, 굵기, 줄간격, 자간, 정렬, 텍스트 | font-family, font-size, font-weight, line-height, letter-spacing |
| 채우기 | 단색, 이미지, 그라데이션, SVG 채우기 | background, fill |
| 테두리 | 색상, 두께, 스타일, 방향별 설정 | border, outline, stroke |
| 효과 | 그림자, 블러, 모션 | box-shadow, text-shadow, backdrop-filter, transition, animation |
| 레이아웃 가이드 | 가이드를 이용해 정렬과 간격을 검토 | 화면 검수 기능 |
| 미디어 | 이미지·동영상·오디오·SVG에 맞는 속성 | 요소 종류에 따라 달라짐 |

## 레이아웃 편집

부모 요소를 선택하고 레이아웃 모드에서 Flex 또는 Grid를 적용합니다. 자식 정렬, 행·열 간격, 패딩을 조절합니다. 자식 요소의 너비, 높이, 최소·최대 제한도 확인합니다. 고급 설정에는 flex item, grid container/item, overflow, aspect-ratio, box-sizing 등이 포함됩니다.

위브온 실무에서는 절대 좌표보다 Flex/Grid와 기존 공통 레이아웃을 우선하며, 화면 변경을 그대로 인라인 스타일로 복제하지 않습니다.

## 글꼴과 텍스트

기존 텍스트를 선택하고 글꼴, 크기, 굵기, 줄 높이, 자간, 정렬을 조절합니다. 고급 설정에서 줄바꿈, 방향, 장식, 목록 및 렌더링을 제어합니다. 텍스트 및 링크 수정 내용도 확인합니다.

## 배경과 테두리

채우기 패널은 색상, 이미지, 선형·원형·원뿔 그라데이션을 지원합니다. 여러 채우기와 고급 마스크 설정은 요소 유형에 따라 달라집니다. 테두리는 위치 모드, 색상, 두께, 스타일, 방향별 설정과 점선 관련 설정을 제공합니다. SVG stroke와 CSS border는 구분합니다.

## 모션 및 효과

그림자·블러를 설정하고 모션 상호작용, transition, animation, transform 및 스크롤 기반 애니메이션을 검토합니다. 애니메이션 중지 기능을 사용해 특정 화면 상태를 확인할 수 있습니다.

## 검수 기준

색상 토큰 배지와 대비 검사기를 확인합니다. 단위와 반응형 설정을 검토하고 다른 뷰포트에서 다시 확인합니다. 특정 요소에 표시되는 패널은 요소 유형, position, layout mode, stroke mode에 따라 달라집니다. 미리보기 적용 후 변경사항 탭에서 실제 반영 대상을 확인합니다.
