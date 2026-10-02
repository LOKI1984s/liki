/*
 * 포트폴리오 데이터: 이 파일만 수정하면 사이트 전체가 바뀐다.
 * [대괄호] 표시는 본인 정보로 교체할 자리.
 * metrics.value에 숫자를 넣으면 카운트업 애니메이션이 자동 적용된다.
 * 필요 없는 항목은 배열에서 지우면 화면에서도 사라진다.
 * 문구 규칙: 화면에 보이는 글에는 줄표(—), 화살표(→), 더하기(+) 같은 기호를 쓰지 않고,
 *           문장은 "~합니다" 또는 명사형으로 끝낸다.
 */
const PORTFOLIO = {
  profile: {
    brand: "RAY",                             // 이름 (상단 로고 · 홈 대제목 · 탭 제목)
    tagline: "Business Development Portfolio", // 이름 옆 설명 (상단 로고 · 홈 · 탭 제목)
    mark: "R",                                // 상단 로고 원형 이니셜
    name: "RAY",                              // 저작권 표기
    role: "Business Development",
    // 홈 인트로에서 타이핑으로 순환되는 문구
    roles: ["Business Development", "신사업 모델링", "Messaging & Telecom"],
    // 헤드라인: *별표* 사이 단어가 강조색으로 표시됨
    headline: "시장의 빈틈에서 *사업 모델*을 설계합니다",
    summary: "메시징·통신 분야에서 신사업의 초기 모델과 서비스 구조를 설계하고, 통신사·글로벌 파트너 제휴를 추진해 왔습니다. 제휴 모델에 관심 있는 파트너의 연락을 환영합니다.",
    // 홈 핵심 숫자
    stats: [
      { value: "15", label: "년 이상 통신 · 메시징 경력" },
      { value: "6", label: "추진 사업 모델" },
      { value: "3", label: "제휴 모델" },
      { value: "226", label: "글로벌 게이트웨이" },
    ],
    // 방문자 카운터 (hits.sh, 가입 불필요). 배포 주소에서만 실제 카운트, 로컬 미리보기는 별도 키로 집계
    counter: { key: "loki1984s.github.io/liki", label: "VISITORS" },
    photo: "", // 예: "assets/profile.jpg"
    resume: "", // 예: "assets/resume.pdf" (넣으면 연락 페이지에 다운로드 버튼 표시)
    contacts: [
      { label: "Email", value: "tomasrain84@gmail.com", href: "mailto:tomasrain84@gmail.com" },
      { label: "Telegram", value: "@mbiostrip", href: "https://t.me/mbiostrip" },
      { label: "해외 연락처 · 베트남", value: "+84-38-221-4051", href: "tel:+84382214051" },
      { label: "해외 연락처 · 필리핀", value: "+63-915-042-7205", href: "tel:+639150427205" },
    ],
  },

  // 01 사업 모델: 초기 모델링·서비스 기획 사례
  // points: [문제] [모델] [구조] [수익] 순서
  // short: 역량 페이지 링크 등에 쓰는 짧은 이름
  // demo: 카드 안 인터랙티브 팝업 키 (a2p · arm · sms · partup · hanyang · vietnam)
  models: [
    {
      title: "글로벌 A2P 양방향 국제문자",
      short: "글로벌 A2P",
      period: "2025 ~ 현재",
      field: "Messaging · Global",
      role: "사업 모델링 · 서비스 구조 기획 · 글로벌 파트너 제휴 추진",
      summary: "국제발신 문자를 한국 대표번호로 받고 답장까지 되는 양방향 구조로 바꾼 A2P 플랫폼 모델입니다.",
      metrics: [
        { value: "226", label: "글로벌 게이트웨이" },
        { value: "3", label: "서비스 라인 (A2P · OTP · eSIM)" },
      ],
      points: [
        "[문제] 국제문자는 단방향이라 답장을 받을 수 없고, 실패 건에도 비용이 그대로 발생합니다",
        "[모델] Tier1 글로벌 GSM 허브 연동 위에 양방향 A2P, OTP · 번호 룩업, 로밍 eSIM을 한 플랫폼으로 구성",
        "[구조] 고객사에서 게이트웨이, 국가별 통신사를 거쳐 단말까지 전달하고, 실패 건은 24시간 단위로 집계해 자동 환급",
        "[수익] 건당 발송 마진과 룩업 과금, 실패 건 환급 구조로 고객 비용 손실 최소화",
      ],
      chips: ["A2P", "SMPP · HTTP API", "OTP · Lookup", "eSIM", "글로벌 제휴"],
      demo: "a2p",
      demoLabel: "서비스 구조 보기",
    },
    {
      title: "A.R.M 이메일 RCS AI 자동응답 마케팅",
      short: "A.R.M",
      period: "2026",
      field: "Messaging · AI",
      role: "사업 모델링 · 서비스 구조 · BM 기획",
      summary: "이메일 클릭을 웹페이지 대신 RCS 문자창으로 바로 연결하고, AI 상담이 예약 확정까지 이어가는 전문직 마케팅 모델입니다.",
      metrics: [
        { value: "4", label: "단계 파이프라인" },
        { value: "24/7", label: "AI 응대" },
      ],
      points: [
        "[문제] 고관여 업종(의료 · 법률 · VIP)은 랜딩페이지와 전화 상담 단계에서 리드 대부분이 이탈",
        "[모델] 이메일 발송, RCS 딥링크, AI 페르소나 상담, 예약 확정의 4단계로 구성하고 신뢰도가 낮으면 상담원에게 이관",
        "[구조] 앱 설치 없이 기본 문자창으로 전환, 통신사 인증마크로 신뢰 확보, 수신동의 DB 전용 발송",
        "[수익] 초기 셋업비, 월 구독(SaaS), 트래픽 마진의 3단 수익 구조",
      ],
      chips: ["RCS", "AI 상담", "SaaS BM", "의료광고법 · 개인정보보호법"],
      demo: "arm",
      demoLabel: "서비스 흐름 보기",
    },
    {
      title: "SMS 중계 재판매 모델",
      short: "SMS 재판매",
      period: "2017 ~ 2023",
      field: "Messaging · B2B",
      role: "재판매 사업 구조 · 가격 전략 기획",
      summary: "통신사 직계약 중계망 위에 재판매 플랫폼을 얹어, 소규모 기업도 기업연동 문자를 저렴하게 쓰도록 만든 모델입니다.",
      metrics: [
        { value: "30원", label: "LMS 건당 · 2017년 (업계 35원)" },
        { value: "50원", label: "GMS 그림문자 · 2017년" },
      ],
      points: [
        "[문제] 중소 사업자에게 기업연동 문자 도입 비용과 장문 · 그림문자 단가가 부담",
        "[모델] 고객사, 재판매 플랫폼, 중계사, 통신사로 이어지는 구조에 설치비 · 가입비 무료 기업연동 제공",
        "[구조] 발송 검증, 초당 전송량 제어, 중계사 장애 우회, 결과(DLR) 실시간 리포트",
        "[수익] 성공 건만 과금하고 실패 건은 실시간 환불해 신뢰 확보, 대량 발송 단가 차익",
      ],
      chips: ["SMS · LMS · GMS", "기업연동", "가격 전략", "080 수신거부"],
      demo: "sms",
      demoLabel: "유통 구조 보기",
    },
    {
      title: "PARTUP B2B 구매 플랫폼",
      short: "PARTUP",
      period: "2026",
      field: "Commerce · B2B",
      role: "서비스 콘셉트 · 기능 구조 기획",
      summary: "견적 요청부터 대량구매, OEM · ODM 제작까지 기업 구매 흐름을 한 플랫폼에 담은 B2B 커머스 모델입니다.",
      metrics: [
        { value: "97", label: "화면 설계 범위" },
      ],
      points: [
        "[문제] 기업 구매는 견적 · 비교 · 계약 · 세금계산서가 흩어져 있어 반복 구매가 번거롭습니다",
        "[모델] 견적 요청과 비교, 주문, 대량구매 상담, OEM · ODM 제작 의뢰를 하나의 구매 흐름으로 구성",
        "[구조] 사업자 회원가입 · 서류 심사, 기업 멤버 관리, 명세서 · 세금계산서 조회, 공급사 입점",
        "[수익] 거래 수수료, 대량구매 · OEM 중개, 공급사 입점",
      ],
      chips: ["B2B 커머스", "견적 · 대량구매", "OEM · ODM", "IA 설계"],
      demo: "partup",
      demoLabel: "프로토타입 보기",
      showcase: {
        kind: "proto",
        base: "showcase/partup/",
        sub: "구매자용 사이트 기획 프로토타입",
        note: "탭을 누르면 주요 화면으로 이동합니다. 화면 안의 링크로 다른 페이지도 둘러볼 수 있습니다.",
        foot: "기획 프로토타입 · 로그인 · 회원가입 · 결제 화면은 공개본에서 제외",
        pages: [
          { label: "메인", path: "main.html" },
          { label: "견적 요청", path: "quote-request.html" },
          { label: "견적 비교", path: "quote-compare.html" },
          { label: "대량구매 상담", path: "bulk-consult.html" },
          { label: "OEM · ODM", path: "oem-odm.html" },
          { label: "마이페이지", path: "mypage.html" },
          { label: "전체 화면 목록", path: "sitemap.html" },
        ],
      },
    },
    {
      title: "한양꽃집 플라워 커머스와 리셀러",
      short: "한양꽃집",
      period: "2026",
      field: "Commerce · B2C",
      role: "서비스 콘셉트 · 운영 구조 기획",
      summary: "전통 색채 브랜딩의 플라워 쇼핑몰에 리셀러(파트너) 유통망과 정기구독을 결합한 커머스 모델입니다.",
      metrics: [
        { value: "37", label: "관리자 운영 메뉴" },
      ],
      points: [
        "[문제] 꽃 커머스는 1회성 구매가 많고 지역 배송 조건이 복잡합니다",
        "[모델] 정기구독, 기업 회원, 해외결제(PayPal)로 구매층을 넓히고 리셀러가 자기 도메인으로 판매",
        "[구조] 전국퀵 · 서울퀵 · 택배 배송 유형 분리, 리셀러 트리 · 정산 · 도메인 관리, 유입 · 매출 통계",
        "[수익] 직판 매출, 정기구독, 리셀러 네트워크 판매",
      ],
      chips: ["플라워 커머스", "리셀러 · 정산", "정기구독", "관리자 기획"],
      demo: "hanyang",
      demoLabel: "프로토타입 보기",
      showcase: {
        kind: "proto",
        base: "showcase/hanyang/",
        sub: "쇼핑몰 · 관리자 · 파트너센터 기획 프로토타입",
        note: "쇼핑몰과 관리자, 리셀러용 파트너센터까지 한 흐름으로 설계했습니다. 메인 배너 사진 출처: Wikimedia Commons (CC BY-SA 4.0, Basile Morin, Teemeah 외).",
        foot: "기획 프로토타입 · 로그인 · 회원가입 · 결제 · 관리자 계정 화면은 공개본에서 제외",
        pages: [
          { label: "쇼핑몰 메인", path: "index.html" },
          { label: "상품 상세", path: "product.html" },
          { label: "정기구독", path: "subscription.html" },
          { label: "관리자 대시보드", path: "admin/index.html" },
          { label: "매출 통계", path: "admin/22_매출.html" },
          { label: "리셀러 트리", path: "admin/35_리셀러트리.html" },
          { label: "파트너센터", path: "admin/partner/dashboard.html" },
        ],
      },
    },
    {
      title: "화장품 베트남 진출",
      short: "베트남 진출",
      period: "2018 ~ 2020",
      field: "Global · Trade",
      role: "베트남 인허가 · 현지 판매 채널 연결",
      summary: "국내 미백 화장품이 베트남에 진출할 수 있도록 현지 인허가를 진행하고 현지 홈쇼핑 채널과 연결한 프로젝트입니다.",
      points: [
        "[문제] 해외 판매를 하려면 현지 인허가와 판매 채널이 먼저 필요",
        "[모델] 자유판매증명과 베트남 위생허가를 확보한 뒤 현지 TV 홈쇼핑 채널에 연결",
        "[구조] 국내 제조사와 현지 유통사 사이에서 인허가 서류 준비와 판매 채널 협의 담당",
        "[결과] 베트남 VTV 홈쇼핑 방송 판매 진행",
      ],
      chips: ["해외 인허가", "현지 채널 연결", "베트남"],
      demo: "vietnam",
      demoLabel: "현지 방송 · 광고 보기",
      showcase: {
        kind: "video",
        sub: "베트남 현지 홈쇼핑 방송과 현지화 광고",
        foot: "서류는 개인정보를 모자이크한 공개본입니다",
        videos: [
          { label: "홈쇼핑 방송 하이라이트", src: "assets/media/vn-homeshopping-highlight.mp4", poster: "assets/media/vn-homeshopping-highlight.jpg", caption: "베트남 TV 홈쇼핑 방송 (원본 28분 중 94초 하이라이트)" },
          { label: "현지화 광고 (베트남어)", src: "assets/media/vn-ad.mp4", poster: "assets/media/vn-ad.jpg", caption: "베트남어 자막 제품 광고 (1분 54초)" },
        ],
        checklistTitle: "담당 영역 · 서류 이름을 누르면 공개본을 볼 수 있습니다",
        // doc: 아래 docs 배열의 순번 (누르면 서류 보기). 개인정보는 모자이크 처리한 이미지
        checklist: [
          { label: "자유판매증명서", doc: 0 },
          { label: "베트남 위생허가", doc: 1 },
          "현지 홈쇼핑 채널 연결",
        ],
        docs: [
          { button: "자유판매증명서 보기", title: "자유판매증명서 (Certificate of Free Sales)", sub: "대한화장품협회 발급 · 2019.06", pages: ["assets/docs/vn-free-sale-certificate.jpg"] },
          { button: "베트남 위생허가 보기", title: "베트남 화장품 공포 (위생허가)", sub: "베트남 보건부 의약품관리국 접수 · 2019.08", pages: ["assets/docs/vn-cosmetic-notice-1.jpg", "assets/docs/vn-cosmetic-notice-3.jpg", "assets/docs/vn-cosmetic-notice-7.jpg"] },
        ],
        docNote: "서명 · 개인 이름 · 연락처 · 주소 · 등록번호는 모자이크 처리했습니다.",
      },
    },
  ],

  // 01 사업 모델 하단: 제휴 모델 (문자 인프라를 여러 산업에 붙이는 모델)
  // points: [문제] [모델] [구조] [제휴] 순서, [제휴]는 파트너가 맡을 역할
  // targets: 카드의 "적용 대상" 아래에 한 줄씩 표시
  partnershipsIntro: {
    title: "함께 만들 수 있는 사업",
    lead: "문자 인프라 하나로 여러 산업에 붙일 수 있는 모델입니다. 각 모델의 제휴 파트너를 찾고 있습니다.",
  },
  partnerships: [
    {
      title: "크로스보더 커머스 메시징",
      field: "Cross-border Commerce",
      summary: "해외 커머스가 한국 고객과 한국 번호로 소통하도록 알림 · CS · 인증 · 규제 대응을 한 패키지로 붙이는 모델입니다.",
      targets: ["해외직구 플랫폼", "구매대행사", "한국 진출 해외몰"],
      points: [
        "[문제] 해외 발신 문자는 스팸으로 오인되고 답장이 안 되어 알림 · CS · 인증 채널이 따로 운영됩니다",
        "[모델] 한국 대표번호로 주문 · 배송 · 통관 알림, 고객 답장 CS, OTP 인증, 080 수신거부를 한 번에 제공",
        "[구조] 커머스 API에서 글로벌 게이트웨이를 거쳐 국내 통신사로 발송, 답장(MO)은 CS로 연결하고 인증은 룩업 후 발송",
        "[제휴] 커머스사는 주문 이벤트 연동, 진출 컨설팅 · PG · 물류사와 번들 구성, 우리는 번호 · 회선 · 운영",
      ],
      chips: ["A2P 양방향", "OTP · 룩업", "CS 연동", "정보통신망법"],
      demo: "a2p",
      demoLabel: "양방향 · 인증 구조 보기",
    },
    {
      title: "국가 간 양방향 · AI 동시번역 중계",
      field: "Country Pair · AI Relay",
      summary: "두 나라 사람이 각자 현지 번호와 모국어로 문자를 주고받고, 중간에서 AI가 번역하는 중계 모델입니다.",
      targets: ["한중 · 한베 판매자", "물류 · 무역사", "현지 통신사"],
      points: [
        "[문제] 국제문자는 비싸고 답장이 안 되며, 언어가 달라 국가별 상담 인력이 필요합니다",
        "[모델] 국가 쌍별로 양쪽 모두 현지 번호로 송수신하고, 중계 서버가 AI로 번역해 모국어로 전달",
        "[구조] 수신, 언어 감지, 용어집 적용 번역, 발송 순서로 처리하고 번호 매핑으로 스레드 유지 · 원문 보관",
        "[제휴] 현지 통신사 · 게이트웨이와 회선 공동 운영, 번역 AI 엔진사, 크로스보더 판매자 네트워크",
      ],
      chips: ["현지 번호", "AI 번역", "스레드 유지", "상담원 검수"],
      demo: "xlate",
      demoLabel: "동시번역 데모",
      demoScene: 0,
    },
    {
      title: "글로벌 서비스 24시간 AI 상담",
      field: "Global Services",
      summary: "시차 때문에 끊기는 해외 상담을 AI가 문자로 24시간 1차 응대 · 번역하고 담당자에게 넘기는 모델입니다.",
      targets: ["유학원", "이민 법무", "해외 채용 에이전시"],
      points: [
        "[문제] 문의가 업무 시간 밖에 몰리고, 답이 늦으면 고객이 이탈합니다",
        "[모델] 문자 채널에서 AI가 24시간 1차 응대 · 번역하고 서류 · 일정 안내 후 담당자에게 이관",
        "[구조] 문의 수신, 의도 분류, AI 응답(번역) 순서로 처리하고 확신이 낮으면 담당자 이관, 일정 자동 리마인드",
        "[제휴] 에이전시는 상담 콘텐츠 · 담당자, 우리는 메시징 채널 · AI 응대 · 번역",
      ],
      chips: ["24시간 응대", "AI 번역", "담당자 이관"],
      demo: "xlate",
      demoLabel: "상담 번역 보기",
      demoScene: 2,
    },
  ],

  // 02 제휴·실적: 이름과 관계까지만 (계약 조건·금액은 넣지 않음). 상단 숫자는 이름(· 구분) 개수로 자동 계산
  partners: [
    {
      category: "통신사 · 글로벌",
      items: [
        { year: "2025", name: "글로벌 Tier1 GSM 허브", desc: "GSM 후불제 볼륨계약 · A2P 국제문자 연동 · Sender ID 등록" },
        { year: "2024", name: "베트남 다낭 AI R&D 센터", desc: "설립 · 운영, 현지 학생 대상 AI 교육 프로그램" },
        { year: "2013~2014", name: "온세텔레콤", desc: "모바일웹 UMS 공동사업 · 동영상 큐레이션 솔루션 제휴" },
        { year: "2013~2014", name: "이니스텔", desc: "국제전화 투넘버 앱 공동개발 · MVNO MOU" },
        { year: "2012~2013", name: "KT XROSHOT", desc: "통합메시징 업무 제휴 MOU" },
        { year: "2012~2013", name: "LG텔레콤", desc: "통합메시지 서비스 업무 제휴 MOU" },
      ],
    },
    {
      category: "대학 · 공공",
      items: [
        { year: "2022", name: "(사)국민재난안전총연합회", desc: "사이버안전보안관 캠페인" },
        { year: "2013~2014", name: "아주대학교 · 인천대학교", desc: "통합메시지 서비스 공급" },
        { year: "2012~2013", name: "경희대학교 · 한국교원대학교", desc: "통합메시지 · 메시징 서비스 공급" },
      ],
    },
    {
      category: "기업 공급",
      items: [
        { year: "2014~2015", name: "석세스TV", desc: "동영상 강의 앱 공급" },
        { year: "2013~2014", name: "크린토피아", desc: "통합메시징 서비스 공급" },
        { year: "2012~2013", name: "훼미리마트", desc: "통합메시지 서비스 공급" },
        { year: "2013~2014", name: "자유나침반여행사", desc: "홈페이지 · 앱 공급" },
        { year: "2016", name: "제일캠핑카 · 와이즈콜린 · 핵직구닷컴", desc: "웹사이트 · 앱 공급" },
      ],
    },
    {
      category: "서비스 출시",
      items: [
        { year: "2017", name: "로켓문자", desc: "SMS · LMS · GMS 기업 문자 서비스" },
        { year: "2016", name: "8282SMS", desc: "웹문자 서비스" },
        { year: "2014~2015", name: "MYCALL 투넘버 050", desc: "투넘버 앱" },
        { year: "2014~2015", name: "하이콜", desc: "국제전화 앱" },
      ],
    },
    {
      category: "인증",
      metric: false, // 상단 숫자 줄에서 제외
      items: [
        { year: "2013~2014", name: "벤처기업 인증", desc: "㈜에이스시스템" },
        { year: "2013~2014", name: "기업부설연구소 설립", desc: "㈜에이스시스템" },
      ],
    },
  ],

  // 03 경력: 회사명 · 직급 · 기간 · 담당업무 (tasks는 한 줄씩 표시)
  history: [
    {
      period: "2024.01 ~ 현재", type: "경력", title: "제로네트워크", sub: "사업총괄이사",
      tasks: [
        "미국 글로벌 통신 허브 사업자와 GSM 후불제 볼륨계약 체결",
        "Global eSIM · A2P · MNO 국제 통신망 서비스 연동 및 시스템 기획",
        "베트남 다낭 AI R&D 센터 설립 · 운영, 현지 학생 대상 AI 교육 프로그램 기획",
        "AI 프롬프트 엔지니어링 및 바이브 코딩 기반 마케팅 자동화 프로그램 기획 · 개발",
        "LLM 응답 최적화 프롬프트 설계, 데이터 수집 · 분석 자동화 툴 제작, AI 연동 서비스 화면설계서(SB) 작성",
      ],
    },
    {
      period: "2018 ~ 2020", type: "프로젝트", title: "스노우퀸 (액트화이트)", sub: "해외사업 자문",
      tasks: [
        "베트남 진출을 위한 자유판매증명 · 현지 위생허가 인허가 진행",
        "현지 유통사 및 VTV 홈쇼핑 판매 채널 연결",
      ],
    },
    {
      period: "2017.03 ~ 2023.12", type: "경력", title: "㈜더로켓", sub: "사업본부장",
      tasks: [
        "B2B 대량 문자 메시징 발송 시스템 설계, API 연동 및 서비스 기획 총괄",
        "로켓문자 재판매 모델 · 가격 전략 기획",
        "웹 · 앱 에이전시 사업 수주 기획",
      ],
    },
    {
      period: "2012.01 ~ 2016.03", type: "경력", title: "㈜에이스시스템", sub: "기획팀 부장",
      tasks: [
        "통신 3사 기업용 대량 메시징(SMS · LMS · MMS) 중계 및 재판매 플랫폼 기획 · 운영",
        "통신사 제휴(KT · LG텔레콤 · 온세텔레콤) 추진, 대학 · 기업 공급",
      ],
    },
    {
      period: "2007.03 ~ 2009.05", type: "경력", title: "㈜아이엔케이", sub: "기획팀 과장 · 팀장",
      tasks: [
        "통신 3사 가입 유치 법인 대행사(TM · 온라인) 영업 프로세스 및 서비스 기획",
      ],
    },
  ],

  // 04 역량: level은 쓰지 않음 (근거 중심). cases: 근거 사례(models 인덱스), partners: 제휴·실적 링크
  skills: [
    {
      category: "Business Modeling",
      items: [
        { name: "신사업 초기 모델링", note: "문제 정의, 서비스 구조, 수익 구조 설계", cases: [0, 1, 3, 4] },
        { name: "BM · 가격 전략", note: "셋업비 · 구독 · 건당 마진, 경쟁 단가 대비 포지셔닝", cases: [1, 2] },
        { name: "사업계획서 · 투자제안서", note: "IR 덱, 기술사업계획서, 재무 로드맵", cases: [0, 1] },
      ],
    },
    {
      category: "Partnership",
      items: [
        { name: "통신사 · 글로벌 제휴", note: "국내 통신사 MOU, 글로벌 GSM 허브 볼륨계약 · 연동 추진", cases: [0], partners: true },
        { name: "B2B 영업", note: "대학 · 공공 · 기업 공급", partners: true },
        { name: "해외 진출", note: "현지 인허가, 판매 채널 연결, 다낭 AI R&D 센터 설립", cases: [5], partners: true },
      ],
    },
    {
      category: "Service Planning",
      items: [
        { name: "서비스 콘셉트 · 기능 구조", note: "커머스 · B2B · 관리자 운영 구조", cases: [3, 4] },
        { name: "화면설계서(SB) · 요구사항 정의", note: "개발팀 · 개발사에 넘길 범위와 흐름 정리", cases: [3, 4] },
      ],
    },
    {
      category: "AI Planning",
      items: [
        { name: "LLM 서비스 기획", note: "AI 상담 페르소나, 상담원 이관 기준, AI 번역 중계", cases: [1] },
        { name: "프롬프트 설계", note: "LLM 응답 최적화, 데이터 수집 · 분석 자동화" },
        { name: "AI 교육 프로그램", note: "베트남 다낭 현지 학생 대상 AI 교육 기획", partners: true },
      ],
    },
    {
      category: "Domain",
      items: [
        { name: "메시징 · 통신", note: "SMS · LMS · MMS · RCS · A2P · eSIM · 050 · VoIP 콜백", cases: [0, 1, 2] },
        { name: "과금 · 정산 흐름", note: "중계 · 재판매 · 실패 건 환급 · 리셀러 정산", cases: [0, 2, 4] },
        { name: "컴플라이언스", note: "정보통신망법 · 개인정보보호법 · 의료광고법", cases: [1, 2] },
      ],
    },
  ],
};
