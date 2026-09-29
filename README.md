# Portfolio

개인 포트폴리오. 정적 HTML/CSS/JS 멀티페이지, 다크 테마, 빌드 없음.

## 페이지
| 파일 | 내용 |
|---|---|
| index.html | 홈 — 프로필·연락처·목차 |
| skills.html | 01 기술 |
| history.html | 02 연혁 |
| dev.html | 03 개발 |
| projects.html | 04 프로젝트 |
| references.html | 05 레퍼런스 |

## 구조
```
*.html          페이지 뼈대
css/style.css   디자인
js/data.js      ← 내용은 여기만 수정
js/main.js      렌더링 (네비·페이지·이전/다음)
assets/         사진·프로젝트 이미지
```

## 수정
`js/data.js`의 `[대괄호]` 항목을 본인 정보로 교체. 항목 추가/삭제는 배열 요소 추가/삭제.

## 미리보기
`index.html`을 브라우저로 열기.

## 배포 (GitHub Pages)
Settings → Pages → Branch 선택 → `/ (root)` → Save.
주소: `https://<아이디>.github.io/<저장소명>/`
