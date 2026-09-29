# Zero Infinity

`0 → ∞` · by liki · Growth Hacker

개인 포트폴리오. 정적 HTML/CSS/JS 멀티페이지, 다크 테마. 홈은 WebGL(three.js) 3D 인트로.

## 페이지
| 파일 | 내용 |
|---|---|
| index.html | 홈 — 3D 인트로 (뫼비우스 ∞ 띠 + 흐르는 파티클, 클릭 시 충격파) |
| skills.html | 01 기술 |
| history.html | 02 연혁 |
| dev.html | 03 개발 — 국제 메시징(A2P 양방향 · OTP·룩업 · 로밍 eSIM) · SMS 중계 재판매 구조도 팝업 포함 |
| projects.html | 04 프로젝트 |
| references.html | 05 레퍼런스 |

## 구조
```
*.html          페이지 뼈대
css/style.css   디자인
js/data.js      ← 내용은 여기만 수정
js/intl-demo.js 개발 페이지 팝업: 국제 메시징 플랫폼 — A2P 양방향 · OTP·룩업 · 로밍 eSIM 탭, 목적지 선택 (아이콘: Lucide, ISC)
js/sms-demo.js  개발 페이지 팝업: SMS 시스템 구조 시뮬레이션 (아이콘: Lucide, ISC)
js/main.js      렌더링 (네비·페이지·이전/다음·인트로 텍스트 효과)
js/intro.bundle.js  3D 인트로 빌드 결과물 (커밋됨, 그대로 동작)
src/intro.js    3D 인트로 소스
assets/         사진·프로젝트 이미지
```

## 수정
`js/data.js`의 `[대괄호]` 항목을 본인 정보로 교체. 항목 추가/삭제는 배열 요소 추가/삭제.

## 3D 인트로 수정
`src/intro.js` 수정 후:
```
npm install
npm run build
```
WebGL 미지원 환경에서는 3D 없이 텍스트만 표시된다.

## 미리보기
`index.html`을 브라우저로 열기.

## 배포 (GitHub Pages)
Settings → Pages → Branch 선택 → `/ (root)` → Save.
주소: `https://<아이디>.github.io/<저장소명>/`
