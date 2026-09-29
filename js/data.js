/*
 * 포트폴리오 데이터 — 이 파일만 수정하면 사이트 전체가 바뀐다.
 * [대괄호] 표시는 전부 본인 정보로 교체할 자리.
 * 프로젝트 숫자(metrics.value)에 실제 숫자를 넣으면 카운트업 애니메이션이 자동 적용된다. 예: "+312%", "1.2M", "38"
 * 필요 없는 항목은 배열에서 지우면 화면에서도 사라진다.
 */
const PORTFOLIO = {
  profile: {
    name: "[이름]",
    nameEn: "[English Name]",
    role: "Growth Hacker",
    status: "Open to work", // 비우면 배지 숨김
    // 홈 인트로에서 타이핑으로 순환되는 문구
    roles: ["Growth Hacker", "Data × Experiment", "AI Automation"],
    // 헤드라인 — *별표* 사이 단어가 강조색으로 표시됨
    headline: "[데이터로 가설을 세우고, 실험으로 *성장*을 증명합니다]",
    summary: "[한 줄 소개 — 어떤 지표를, 어떤 방법으로, 얼마나 움직였는지]",
    photo: "", // 예: "assets/profile.jpg"
    contacts: [
      { label: "Email", value: "[email@example.com]", href: "mailto:[email@example.com]" },
      { label: "LinkedIn", value: "[linkedin.com/in/아이디]", href: "" },
      { label: "GitHub", value: "[github.com/아이디]", href: "" },
      { label: "Blog", value: "[블로그 주소]", href: "" },
    ],
  },

  // 01 기술 — level: 1~5 (없으면 막대 표시 안 함)
  skills: [
    {
      category: "Analytics",
      items: [
        { name: "[GA4]", level: 5, note: "[이벤트 설계·퍼널 분석]" },
        { name: "[Amplitude]", level: 4, note: "" },
        { name: "[SQL]", level: 4, note: "" },
      ],
    },
    {
      category: "Experiment",
      items: [
        { name: "[A/B Test]", level: 5, note: "[가설 설계·통계 검정]" },
        { name: "[CRO]", level: 4, note: "" },
      ],
    },
    {
      category: "Automation / Dev",
      items: [
        { name: "[Python]", level: 3, note: "" },
        { name: "[n8n / Make]", level: 4, note: "" },
        { name: "[JavaScript]", level: 3, note: "" },
      ],
    },
    {
      category: "Marketing",
      items: [
        { name: "[SEO]", level: 4, note: "" },
        { name: "[Performance Ads]", level: 4, note: "" },
        { name: "[CRM]", level: 3, note: "" },
      ],
    },
  ],

  // 02 연혁 — type: 경력 | 학력 | 교육 | 자격 | 수상
  history: [
    { period: "[2024.03 – 현재]", type: "경력", title: "[회사명]", sub: "[팀 / 직급]", desc: "[담당 업무 요약]" },
    { period: "[2023.01 – 2023.06]", type: "교육", title: "[교육기관 / 과정명]", sub: "", desc: "" },
    { period: "[2022.11]", type: "자격", title: "[자격증명]", sub: "[발급기관]", desc: "" },
    { period: "[2016.03 – 2022.02]", type: "학력", title: "[학교명]", sub: "[전공 / 학위]", desc: "" },
  ],

  // 03 개발 — 개발·자동화 역량
  dev: [
    { title: "[그로스 실험 파이프라인]", desc: "[가설 → 실험 → 분석 → 적용 루프를 어떻게 자동화했는지]" },
    { title: "[마케팅 자동화]", desc: "[도구, 규모, 절감 시간 등 숫자로]" },
    { title: "[데이터 대시보드]", desc: "[어떤 지표를 누구에게 어떻게 보이게 했는지]" },
  ],

  // 04 프로젝트
  projects: [
    {
      title: "[프로젝트명]",
      period: "[2024.01 – 2024.04]",
      team: "[팀 4명]",
      role: "[본인 역할 — 예: 그로스 리드, 기여도 70%]",
      stack: ["[GA4]", "[Amplitude]", "[n8n]"],
      summary: "[한 줄 요약 — 어떤 지표를 움직였나]",
      metrics: [
        { value: "[+000%]", label: "[전환율]" },
        { value: "[-00%]", label: "[이탈률]" },
      ],
      points: [
        "[문제] 무엇이 문제였나",
        "[가설] 무엇을 검증하려 했나",
        "[실행] 어떤 실험을 돌렸나",
        "[성과] 수치로",
      ],
      image: "", // 예: "assets/project1.png"
      links: [
        { label: "Case Study", href: "" },
        { label: "Live", href: "" },
      ],
    },
    {
      title: "[프로젝트명 2]",
      period: "[기간]",
      team: "[구성]",
      role: "[역할]",
      stack: ["[기술]"],
      summary: "[요약]",
      metrics: [{ value: "[00%]", label: "[지표]" }],
      points: ["[문제]", "[가설]", "[실행]", "[성과]"],
      image: "",
      links: [],
    },
  ],

  // 05 레퍼런스 — 글, 발표, 추천인 등
  references: [
    { type: "글", title: "[기술 블로그 글 제목]", href: "", desc: "[한 줄 설명]" },
    { type: "발표", title: "[발표 / 세미나]", href: "", desc: "" },
    { type: "추천", title: "[추천인 — 이름, 소속, 관계]", href: "", desc: "[연락 가능 여부 등]" },
  ],
};
