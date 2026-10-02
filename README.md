# RAY · Business Development Portfolio

메시징 · 통신 사업개발 포트폴리오

개인 포트폴리오. 정적 HTML/CSS/JS 멀티페이지, 다크 테마. 홈은 WebGL(three.js) 3D 인트로.

## 페이지
| 파일 | 내용 |
|---|---|
| index.html | 홈 — 3D 인트로 (뫼비우스 ∞ 띠 + 흐르는 파티클, 클릭 시 충격파) + 핵심 숫자 |
| models.html | 01 사업 모델 — 문제 → 모델 → 구조 → 수익 사례 6개 + 제휴 모델 3개, 구조도 · 데모 · 프로토타입 · 영상 팝업 |
| partners.html | 02 제휴·실적 — 통신사 · 글로벌 · 대학 · 공공 · 기업 공급 · 서비스 출시 |
| history.html | 03 경력 — 회사별 직급 · 추진 업무 (이력서와 동일하게) |
| skills.html | 04 역량 |
| contact.html | 05 연락 |
| 404.html | 없는 주소 안내 (GitHub Pages 전용 · 프로토타입 제외 화면 안내 포함) |
| dev.html · projects.html · references.html | 예전 주소 → 새 페이지 자동 이동 |

## 구조
```
*.html          페이지 뼈대
css/style.css   디자인
js/data.js      ← 내용은 여기만 수정
js/intl-demo.js 사업 모델 페이지 팝업: 국제 메시징 플랫폼 — A2P 양방향 · OTP·룩업 · 로밍 eSIM 탭, 목적지 선택 (아이콘: Lucide, ISC)
js/sms-demo.js  사업 모델 페이지 팝업: SMS 시스템 구조 시뮬레이션 (아이콘: Lucide, ISC)
js/arm-demo.js  사업 모델 페이지 팝업: A.R.M 이메일 → RCS → AI 상담 흐름 (업종별 페르소나 · 상담원 이관)
js/xlate-demo.js 사업 모델 페이지 팝업: AI 동시번역 메시징 중계 (구매대행 · 해외직구 CS · 유학 상담)
js/showcase.js  사업 모델 페이지 팝업: 프로토타입 미리보기 · 영상 (data.js models[].showcase 설정)
js/main.js      렌더링 (네비·페이지·이전/다음·인트로 텍스트 효과)
js/intro.bundle.js  3D 인트로 빌드 결과물 (커밋됨, 그대로 동작)
src/intro.js    3D 인트로 소스
assets/         사진·프로젝트 이미지 · og.jpg 링크 공유 미리보기(1200×630) · media/ 베트남 방송·광고 영상(압축본)
showcase/       PARTUP · 한양꽃집 프로토타입 공개본 (로그인·가입·결제·관리자 계정 화면 제외, noindex)
files/          원본 자료 (계약서·NDA 포함, .gitignore로 제외 — 커밋 금지)
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

## 공유 미리보기 (카톡 · 링크드인)
각 페이지 `<head>`의 `og:` 태그는 `https://loki1984s.github.io/liki/` 기준 절대 주소다. 저장소 이름이나 도메인이 바뀌면 함께 바꾼다.
