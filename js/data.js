/*
 * 포트폴리오 데이터 — 이 파일만 수정하면 사이트 전체가 바뀐다.
 * [대괄호] 표시는 전부 본인 정보로 교체할 자리.
 * 필요 없는 항목은 배열에서 지우면 화면에서도 사라진다.
 */
const PORTFOLIO = {
  profile: {
    name: "[이름]",
    nameEn: "[English Name]",
    role: "[지원 직무 — 예: 백엔드 개발자]",
    summary: "[한 줄 소개 — 무엇을, 어떻게, 어떤 결과로 해왔는지 한 문장]",
    photo: "", // 예: "assets/profile.jpg" (비우면 표시 안 함)
    contacts: [
      { label: "Email", value: "[email@example.com]", href: "mailto:[email@example.com]" },
      { label: "Phone", value: "[010-0000-0000]", href: "" },
      { label: "GitHub", value: "[github.com/아이디]", href: "https://github.com/" },
      { label: "Blog", value: "[블로그 주소]", href: "" },
    ],
  },

  // 01 기술 — level: 1~5 (없으면 막대 표시 안 함)
  skills: [
    {
      category: "Language",
      items: [
        { name: "[JavaScript]", level: 4, note: "[사용 수준 한 줄]" },
        { name: "[Python]", level: 3, note: "" },
      ],
    },
    {
      category: "Framework / Library",
      items: [
        { name: "[React]", level: 4, note: "" },
        { name: "[Node.js]", level: 3, note: "" },
      ],
    },
    {
      category: "Infra / Tool",
      items: [
        { name: "[Git]", level: 4, note: "" },
        { name: "[AWS]", level: 2, note: "" },
      ],
    },
  ],

  // 02 연혁 — type: 경력 | 학력 | 교육 | 자격 | 수상
  history: [
    { period: "[2024.03 – 현재]", type: "경력", title: "[회사명]", sub: "[부서 / 직급]", desc: "[담당 업무 요약]" },
    { period: "[2023.01 – 2023.06]", type: "교육", title: "[교육기관 / 과정명]", sub: "", desc: "" },
    { period: "[2022.11]", type: "자격", title: "[자격증명]", sub: "[발급기관]", desc: "" },
    { period: "[2016.03 – 2022.02]", type: "학력", title: "[학교명]", sub: "[전공 / 학위]", desc: "" },
  ],

  // 03 개발 — 개발 활동·역량 (오픈소스, 자동화, 코드 스타일, 협업 방식 등)
  dev: [
    { title: "[개발 원칙 / 강점 1]", desc: "[구체적 근거 — 무엇을 했고 결과가 어땠는지]" },
    { title: "[개발 활동 2 — 예: 업무 자동화]", desc: "[도구, 규모, 절감 효과 등 숫자로]" },
    { title: "[개발 활동 3 — 예: 오픈소스 기여]", desc: "[저장소, 기여 내용]" },
  ],

  // 04 프로젝트
  projects: [
    {
      title: "[프로젝트명]",
      period: "[2024.01 – 2024.04]",
      team: "[개인 / 팀 4명]",
      role: "[본인 역할 — 예: 백엔드 전담, 기여도 70%]",
      stack: ["[React]", "[Node.js]", "[MySQL]"],
      summary: "[한 줄 요약 — 무엇을 만들었나]",
      points: [
        "[문제] 무엇이 문제였나",
        "[해결] 어떻게 해결했나",
        "[성과] 수치로 — 예: 응답속도 40% 개선",
      ],
      image: "", // 예: "assets/project1.png"
      links: [
        { label: "GitHub", href: "" },
        { label: "Demo", href: "" },
      ],
    },
    {
      title: "[프로젝트명 2]",
      period: "[기간]",
      team: "[구성]",
      role: "[역할]",
      stack: ["[기술]"],
      summary: "[요약]",
      points: ["[문제]", "[해결]", "[성과]"],
      image: "",
      links: [],
    },
  ],

  // 05 레퍼런스 — 참고 링크, 발표, 글, 추천인 등
  references: [
    { type: "글", title: "[기술 블로그 글 제목]", href: "", desc: "[한 줄 설명]" },
    { type: "발표", title: "[발표 / 세미나]", href: "", desc: "" },
    { type: "추천", title: "[추천인 — 이름, 소속, 관계]", href: "", desc: "[연락 가능 여부 등]" },
  ],
};
