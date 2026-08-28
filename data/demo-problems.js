// 고등물리학 데모 문제셋 - GitHub Pages 배포용
// 주제: 역학, 열역학, 파동, 전자기학

const DEMO_PROBLEMS = [
  // ============ 직선운동 (5개) ============
  {
    id: "physics_001",
    question: "자동차가 정지 상태에서 출발하여 일정한 가속도로 5초 동안 주행했을 때, 속도가 20 m/s가 되었다. 자동차의 가속도는?",
    type: "calculation",
    difficulty: "easy",
    concepts: ["가속도", "등가속도운동"],
    options: [],
    correctAnswer: "4 m/s²",
    explanation: "등가속도운동의 기본 식: v = u + at\n초기속도 u = 0, 최종속도 v = 20 m/s, 시간 t = 5s\n20 = 0 + a × 5\na = 4 m/s²",
    hints: ["v = u + at 공식을 사용하세요", "주어진 값을 정리하면: u=0, v=20, t=5"],
    solutionSteps: ["주어진 값 정리: u=0, v=20 m/s, t=5s", "공식 v = u + at 적용", "20 = 0 + a×5", "a = 20÷5 = 4 m/s²"]
  },
  {
    id: "physics_002",
    question: "초기 속도 10 m/s로 움직이던 물체가 2 m/s²의 가속도로 8초 동안 가속할 때, 이동 거리는?",
    type: "calculation",
    difficulty: "easy",
    concepts: ["거리", "등가속도운동"],
    options: [],
    correctAnswer: "144 m",
    explanation: "등가속도운동의 거리 공식: s = ut + ½at²\nu = 10 m/s, a = 2 m/s², t = 8s\ns = 10(8) + ½(2)(8)²\ns = 80 + 64 = 144 m",
    hints: ["s = ut + ½at² 공식을 사용하세요", "각 항을 계산: ut = 80, ½at² = 64"],
    solutionSteps: ["공식 확인: s = ut + ½at²", "ut 계산: 10 × 8 = 80 m", "½at² 계산: ½ × 2 × 64 = 64 m", "총 거리: 80 + 64 = 144 m"]
  },
  {
    id: "physics_003",
    question: "수평면에서 같은 높이에서 던진 공 A와 공 B 중, 수평 방향 속도가 더 큰 공은 어디에 먼저 떨어질까?",
    type: "multiple_choice",
    difficulty: "easy",
    concepts: ["포물선운동", "수평운동", "수직운동"],
    options: ["공 A (수평 속도가 크므로)", "공 B (수평 속도가 작으므로)", "같은 시간에 떨어진다", "높이에 따라 달라진다"],
    correctAnswer: "같은 시간에 떨어진다",
    explanation: "포물선운동에서 수직 방향 운동과 수평 방향 운동은 독립적이다. \n수평 속도의 크기는 수직 낙하 시간에 영향을 주지 않는다.\n따라서 같은 높이에서 던진 두 공은 같은 시간에 땅에 닿는다. \n(단, 수평 거리는 다르다)",
    hints: ["포물선운동에서 수평과 수직은 독립적인가?", "중력 가속도는 수평 속도에 영향을 받는가?"],
    solutionSteps: ["포물선운동 분석: 수평운동과 수직운동은 독립적", "수직 방향: h = ½gt² (수평속도와 무관)", "따라서 떨어지는 시간은 같다"]
  },
  {
    id: "physics_004",
    question: "연직 위로 던진 물체의 최고점에서의 속도는 얼마인가?",
    type: "short_answer",
    difficulty: "easy",
    concepts: ["연직운동", "속도"],
    options: [],
    correctAnswer: "0",
    explanation: "연직 위로 던진 물체가 최고점에 도달할 때는 순간적으로 속도가 0이다. \n그 순간 이후 물체는 중력에 의해 다시 아래로 떨어진다.",
    hints: ["최고점에서 물체의 운동 상태는?", "가속도 방향은 어디인가?"],
    solutionSteps: ["최고점의 정의: 속도가 0인 지점", "이후 중력으로 인한 가속도만 작용"]
  },
  {
    id: "physics_005",
    question: "어떤 물체가 10 m/s의 속도로 움직이다가 5초 후에 정지했다. 이 동안의 평균 속도는?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["평균속도", "등감속도운동"],
    options: [],
    correctAnswer: "5 m/s",
    explanation: "평균 속도 = 총 변위 / 총 시간\n등가속도운동에서: 평균 속도 = (초기속도 + 최종속도) / 2\n평균 속도 = (10 + 0) / 2 = 5 m/s",
    hints: ["평균속도 = 총 변위 / 총 시간", "또는 = (v₁ + v₂) / 2"],
    solutionSteps: ["공식: v_avg = (v₁ + v₂) / 2", "v₁ = 10 m/s, v₂ = 0 m/s", "v_avg = (10 + 0) / 2 = 5 m/s"]
  },

  // ============ 뉴턴의 운동 법칙 (5개) ============
  {
    id: "physics_006",
    question: "질량 2 kg인 물체에 10 N의 힘이 작용할 때 물체의 가속도는?",
    type: "calculation",
    difficulty: "easy",
    concepts: ["뉴턴의 제2법칙", "힘", "가속도"],
    options: [],
    correctAnswer: "5 m/s²",
    explanation: "뉴턴의 제2법칙: F = ma\n10 = 2 × a\na = 10 / 2 = 5 m/s²",
    hints: ["F = ma를 사용하세요", "a = F / m"],
    solutionSteps: ["공식: F = ma", "정리: a = F / m", "계산: a = 10 / 2 = 5 m/s²"]
  },
  {
    id: "physics_007",
    question: "수평면에 놓인 5 kg의 물체를 12 N의 힘으로 끌 때, 마찰력이 2 N이면 물체의 가속도는?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["뉴턴의 제2법칙", "마찰력", "합력"],
    options: [],
    correctAnswer: "2 m/s²",
    explanation: "합력 = 적용 힘 - 마찰력 = 12 - 2 = 10 N\nF_net = ma에서:\n10 = 5 × a\na = 2 m/s²",
    hints: ["먼저 합력을 구하세요", "F_net = F - f_friction"],
    solutionSteps: ["합력 계산: F_net = 12 - 2 = 10 N", "뉴턴의 제2법칙: F_net = ma", "10 = 5 × a", "a = 2 m/s²"]
  },
  {
    id: "physics_008",
    question: "뉴턴의 제1법칙(관성의 법칙)을 설명하는 가장 적절한 예시는?",
    type: "multiple_choice",
    difficulty: "easy",
    concepts: ["뉴턴의 제1법칙", "관성"],
    options: ["버스가 급히 멈춰 승객이 앞으로 쏠린다", "자동차를 밀 때 밀수록 더 빨리 간다", "위로 던진 공이 다시 떨어진다", "달이 지구 주위를 계속 돈다"],
    correctAnswer: "버스가 급히 멈춰 승객이 앞으로 쏠린다",
    explanation: "관성의 법칙: 외력이 없으면 물체는 계속 같은 상태를 유지한다.\n버스가 급히 멈출 때 승객은 계속 앞으로 나아가려고 하는 관성 때문에 앞으로 쏠린다.",
    hints: ["관성이란 외력이 없을 때 원래 상태를 유지하려는 성질", "어느 예시가 이를 가장 잘 보여주는가?"],
    solutionSteps: ["관성의 정의 확인", "각 선택지 검토", "버스 예시: 버스 속도 변화 → 승객은 관성으로 계속 전진"]
  },
  {
    id: "physics_009",
    question: "질량 10 kg인 물체가 20 N의 일정한 힘을 받아 처음 정지 상태에서 10초 동안 가속한다. 최종 속도는?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["뉴턴의 제2법칙", "등가속도운동", "속도"],
    options: [],
    correctAnswer: "20 m/s",
    explanation: "F = ma에서 가속도 구하기: a = F/m = 20/10 = 2 m/s²\nv = u + at에서: v = 0 + 2(10) = 20 m/s",
    hints: ["먼저 가속도를 구하세요", "그 다음 속도 공식을 사용하세요"],
    solutionSteps: ["가속도: a = F/m = 20/10 = 2 m/s²", "속도 공식: v = u + at", "v = 0 + 2 × 10 = 20 m/s"]
  },
  {
    id: "physics_010",
    question: "작용-반작용의 법칙(뉴턴의 제3법칙)에 따르면, 책상 위에 놓인 책에 대해 성립하는 것은?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["뉴턴의 제3법칙", "작용반작용"],
    options: ["책의 무게가 책상을 누르는 힘 = 책상이 책을 지지하는 힘", "책의 무게가 책상을 누르는 힘 > 책상이 책을 지지하는 힘", "책의 무게가 책상을 누르는 힘 < 책상이 책을 지지하는 힘", "책의 무게와 책상의 지지력은 무관하다"],
    correctAnswer: "책의 무게가 책상을 누르는 힘 = 책상이 책을 지지하는 힘",
    explanation: "작용-반작용: 한 물체가 다른 물체에 가하는 힘과 그 반대 힘은 크기가 같고 방향이 반대이다.\n책이 책상을 누르는 힘 = 책상이 책을 지지하는 힘",
    hints: ["작용-반작용 법칙이란?", "두 힘의 크기 관계는?"],
    solutionSteps: ["작용: 책이 책상을 누르는 힘", "반작용: 책상이 책을 지지하는 힘", "이 두 힘은 크기가 같고 방향이 반대"]
  },

  // ============ 일과 에너지 (5개) ============
  {
    id: "physics_011",
    question: "10 N의 힘으로 물체를 5 m 이동시켰을 때 한 일은?",
    type: "calculation",
    difficulty: "easy",
    concepts: ["일", "에너지"],
    options: [],
    correctAnswer: "50 J",
    explanation: "일 = 힘 × 거리 × cosθ\n힘의 방향과 운동 방향이 같으므로 θ = 0°, cosθ = 1\nW = 10 × 5 × 1 = 50 J",
    hints: ["W = Fs cosθ", "같은 방향이면 cosθ = 1"],
    solutionSteps: ["공식: W = Fs cosθ", "각도: 0° (같은 방향)", "W = 10 × 5 × 1 = 50 J"]
  },
  {
    id: "physics_012",
    question: "질량 2 kg인 물체를 정지 상태에서 5 m/s의 속도로 가속시키는데 필요한 운동 에너지는?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["운동에너지", "에너지"],
    options: [],
    correctAnswer: "25 J",
    explanation: "운동에너지: KE = ½mv²\nm = 2 kg, v = 5 m/s\nKE = ½ × 2 × 5² = ½ × 2 × 25 = 25 J",
    hints: ["KE = ½mv²", "v² = 5² = 25"],
    solutionSteps: ["공식: KE = ½mv²", "계산: KE = ½ × 2 × 25", "KE = 25 J"]
  },
  {
    id: "physics_013",
    question: "높이 10 m에 있는 질량 5 kg의 물체의 중력 포텐셜 에너지는? (g = 10 m/s²)",
    type: "calculation",
    difficulty: "easy",
    concepts: ["중력포텐셜에너지", "위치에너지"],
    options: [],
    correctAnswer: "500 J",
    explanation: "중력 포텐셜 에너지: PE = mgh\nm = 5 kg, g = 10 m/s², h = 10 m\nPE = 5 × 10 × 10 = 500 J",
    hints: ["PE = mgh", "모든 값을 곱하면 된다"],
    solutionSteps: ["공식: PE = mgh", "대입: PE = 5 × 10 × 10", "PE = 500 J"]
  },
  {
    id: "physics_014",
    question: "완벽한 탄성 충돌에서 보존되는 것은?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["탄성충돌", "운동량", "에너지"],
    options: ["운동량만 보존된다", "운동 에너지만 보존된다", "운동량과 운동 에너지 모두 보존된다", "속도만 보존된다"],
    correctAnswer: "운동량과 운동 에너지 모두 보존된다",
    explanation: "탄성 충돌: 충돌 전후에 운동량과 운동 에너지가 모두 보존되는 충돌\n비탄성 충돌: 운동량만 보존되고 운동 에너지는 일부 손실",
    hints: ["탄성과 비탄성 충돌의 차이는?", "어떤 물리량이 보존되는가?"],
    solutionSteps: ["탄성 충돌의 정의 확인", "보존되는 물리량: 운동량과 운동에너지"]
  },
  {
    id: "physics_015",
    question: "에너지 보존 법칙에 따라, 마찰이 없을 때 높이 20 m에서 떨어진 물체가 땅에 닿을 때의 속도는? (g = 10 m/s²)",
    type: "calculation",
    difficulty: "hard",
    concepts: ["에너지보존", "운동에너지", "포텐셜에너지"],
    options: [],
    correctAnswer: "20 m/s",
    explanation: "에너지 보존: PE = KE\nmgh = ½mv²\ngh = ½v²\nv² = 2gh = 2 × 10 × 20 = 400\nv = 20 m/s",
    hints: ["포텐셜 에너지 = 운동 에너지", "v² = 2gh"],
    solutionSteps: ["에너지 보존: mgh = ½mv²", "m 약분: gh = ½v²", "정리: v² = 2gh = 2 × 10 × 20 = 400", "v = √400 = 20 m/s"]
  },

  // ============ 열역학 (4개) ============
  {
    id: "physics_016",
    question: "절대온도가 2배 증가하면 기체의 부피는 (압력 일정할 때) 몇 배가 되는가?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["이상기체법칙", "온도", "부피"],
    options: [],
    correctAnswer: "2배",
    explanation: "이상기체 법칙: PV = nRT\n압력 P가 일정하면: V/T = nR/P = 상수\nV₁/T₁ = V₂/T₂\nT₂ = 2T₁이면 V₂ = 2V₁",
    hints: ["V/T = 상수", "온도가 2배면 부피도 2배"],
    solutionSteps: ["이상기체법칙: PV = nRT", "P 일정: V ∝ T", "T가 2배 → V도 2배"]
  },
  {
    id: "physics_017",
    question: "열역학 제1법칙을 설명하는 가장 적절한 표현은?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["열역학제1법칙", "에너지보존"],
    options: ["에너지는 생성되거나 소멸될 수 없다", "높은 온도에서 낮은 온도로만 열이 이동한다", "엔트로피는 항상 증가한다", "절대영도에 도달할 수 없다"],
    correctAnswer: "에너지는 생성되거나 소멸될 수 없다",
    explanation: "열역학 제1법칙 = 에너지 보존 법칙\nΔU = Q - W (내부에너지 변화 = 흡수열 - 한 일)\n에너지는 형태만 바뀌고 총량은 보존된다.",
    hints: ["열역학 제1법칙과 에너지 보존의 관계는?", "ΔU = Q - W"],
    solutionSteps: ["열역학 제1법칙의 정의", "에너지 형태 변환", "총 에너지량은 보존"]
  },
  {
    id: "physics_018",
    question: "20°C의 물 100 g에 1000 J의 열을 가했을 때 최종 온도는? (물의 비열 = 4186 J/(kg·°C))",
    type: "calculation",
    difficulty: "hard",
    concepts: ["비열", "열량"],
    options: [],
    correctAnswer: "약 2.4°C 증가 → 약 22.4°C",
    explanation: "Q = mcΔT\n1000 = 0.1 × 4186 × ΔT\nΔT = 1000 / (0.1 × 4186) ≈ 2.39°C\n최종온도 = 20 + 2.39 ≈ 22.4°C",
    hints: ["Q = mcΔT", "질량을 kg 단위로 변환하세요"],
    solutionSteps: ["공식: Q = mcΔT", "정리: ΔT = Q/(mc)", "계산: ΔT = 1000 / (0.1 × 4186) ≈ 2.39°C", "최종온도 = 20 + 2.39 ≈ 22.4°C"]
  },
  {
    id: "physics_019",
    question: "열역학 제2법칙을 가장 잘 설명하는 것은?",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["열역학제2법칙", "엔트로피"],
    options: ["고립된 계의 엔트로피는 항상 증가한다", "열은 저온에서 고온으로 자발적으로 이동할 수 없다", "모든 자발적 과정에서 엔트로피는 증가한다", "위 모두 맞다"],
    correctAnswer: "위 모두 맞다",
    explanation: "열역학 제2법칙의 여러 표현:\n1) 엔트로피 표현: 고립된 계의 엔트로피는 증가한다\n2) 클라우지우스 표현: 열은 저온에서 고온으로 자발적으로 이동할 수 없다\n3) 켈빈-플랑크 표현: 열을 완전히 일로 변환하는 순환과정은 불가능하다\n모두 동등한 표현이다.",
    hints: ["열역학 제2법칙의 다양한 표현", "엔트로피와 자발성"],
    solutionSteps: ["제1 표현: 엔트로피 증가", "제2 표현: 열의 일방향 흐름", "제3 표현: 순환과정의 한계", "모두 동등"]
  },

  // ============ 파동 (4개) ============
  {
    id: "physics_020",
    question: "파동의 속도 = 파장 × ?",
    type: "short_answer",
    difficulty: "easy",
    concepts: ["파동", "파장", "진동수"],
    options: [],
    correctAnswer: "진동수 (또는 주파수)",
    explanation: "파동의 기본 관계식: v = fλ\nv: 파동의 속도\nf: 진동수(주파수)\nλ: 파장",
    hints: ["v = fλ", "f는 진동수"],
    solutionSteps: ["파동의 기본식: v = fλ", "v = 파장 × ?", "? = 진동수(f)"]
  },
  {
    id: "physics_021",
    question: "파장 0.5 m, 진동수 10 Hz인 파동의 속도는?",
    type: "calculation",
    difficulty: "easy",
    concepts: ["파동속도", "파장", "진동수"],
    options: [],
    correctAnswer: "5 m/s",
    explanation: "v = fλ\nf = 10 Hz, λ = 0.5 m\nv = 10 × 0.5 = 5 m/s",
    hints: ["v = fλ를 사용하세요"],
    solutionSteps: ["공식: v = fλ", "대입: v = 10 × 0.5", "v = 5 m/s"]
  },
  {
    id: "physics_022",
    question: "진동수가 두 배가 되고 파장이 반이 되면, 파동의 속도는?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["파동속도", "파장", "진동수"],
    options: ["½ 배가 된다", "2배가 된다", "4배가 된다", "변하지 않는다"],
    correctAnswer: "변하지 않는다",
    explanation: "v = fλ\n새로운 속도: v' = (2f) × (λ/2) = fλ = v\n진동수가 2배, 파장이 ½배이면 속도는 변하지 않는다.",
    hints: ["v = fλ의 관계를 유지하는가?", "f와 λ의 변화를 동시에 고려하세요"],
    solutionSteps: ["원래: v = fλ", "변화 후: v' = 2f × (λ/2)", "v' = fλ", "속도는 변하지 않음"]
  },
  {
    id: "physics_023",
    question: "소리가 공기에서 물로 지나갈 때 변하지 않는 것은?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["굴절", "파동", "매질"],
    options: ["속도", "파장", "진동수", "모두 변한다"],
    correctAnswer: "진동수",
    explanation: "파동이 다른 매질로 이동할 때:\n- 속도: 매질에 따라 변한다\n- 파장: 속도가 변하면 파장도 변한다 (v = fλ)\n- 진동수: 변하지 않는다 (파원의 진동수는 매질에 무관)\nf는 상수이므로 v = fλ에서 v가 변하면 λ도 변한다.",
    hints: ["매질이 바뀔 때 어떤 것이 보존되는가?", "f와 v와 λ의 관계"],
    solutionSteps: ["다른 매질 진입 시", "진동수는 보존: f = 상수", "속도는 매질 의존: v 변함", "파장도 변함: λ = v/f"]
  },

  // ============ 전기장 (4개) ============
  {
    id: "physics_024",
    question: "두 점전하 사이의 정전기력은 거리의 제곱에 역비례한다. 이것은?",
    type: "short_answer",
    difficulty: "easy",
    concepts: ["쿨롱의법칙", "정전력"],
    options: [],
    correctAnswer: "쿨롱의 법칙",
    explanation: "쿨롱의 법칙: F = kQ₁Q₂/r²\nF ∝ 1/r²\n두 점전하 사이의 힘은 거리의 제곱에 반비례한다.",
    hints: ["거리의 제곱에 역비례한다는 법칙의 이름은?"],
    solutionSteps: ["거리 제곱에 반비례", "이는 쿨롱의 법칙"]
  },
  {
    id: "physics_025",
    question: "전기장 E = 1000 N/C인 곳에 전하 q = 2 × 10⁻⁶ C가 있을 때, 전하가 받는 힘은?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["전기장", "전하", "힘"],
    options: [],
    correctAnswer: "2 × 10⁻³ N (또는 0.002 N)",
    explanation: "전기장의 정의: F = qE\nF = 2 × 10⁻⁶ × 1000\nF = 2 × 10⁻³ N = 0.002 N",
    hints: ["F = qE", "단위를 정확히 계산하세요"],
    solutionSteps: ["공식: F = qE", "대입: F = 2 × 10⁻⁶ × 1000", "F = 2 × 10⁻³ N"]
  },
  {
    id: "physics_026",
    question: "두 평행 판 사이의 전기장은 판의 면적이 커지면 어떻게 되는가? (판의 전하량 일정)",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["전기장", "평행판커패시터"],
    options: ["증가한다", "감소한다", "변하지 않는다", "판의 거리에만 의존한다"],
    correctAnswer: "변하지 않는다",
    explanation: "평행 판 커패시터의 전기장: E = σ/ε₀ = Q/(Aε₀)\n... 실제로는 E = V/d이고,\n판의 면적이 커지면 용량 C = ε₀A/d가 커지지만,\n전하량이 일정하면 V = Q/C가 작아지므로\nE = V/d는 결과적으로 일정하다.",
    hints: ["E = V/d", "면적과 용량의 관계", "전하량 일정 조건"],
    solutionSteps: ["평행판: E = V/d", "C = ε₀A/d", "Q 일정이면 V = Q/C", "면적 증가 → 용량 증가 → 전압 감소", "결과: E는 불변"]
  },
  {
    id: "physics_027",
    question: "양성자와 전자 사이의 정전력이 1 N이라면, 거리를 2배로 하면 정전력은?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["쿨롱의법칙", "정전력", "거리"],
    options: [],
    correctAnswer: "0.25 N",
    explanation: "쿨롱의 법칙: F ∝ 1/r²\nr → 2r이면\nF' = F/(2²) = F/4 = 1/4 N = 0.25 N",
    hints: ["F ∝ 1/r²", "r이 2배면 F는 1/4로 감소"],
    solutionSteps: ["쿨롱: F ∝ 1/r²", "원래: F = 1 N, r = r₀", "변화 후: r' = 2r₀", "F' = F × (r₀/2r₀)² = F/4", "F' = 0.25 N"]
  },

  // ============ 자기장 (4개) ============
  {
    id: "physics_028",
    question: "직선 전류가 만드는 자기장의 방향은 오른손 법칙으로 결정된다. 이를 '로렌츠 법칙'이라고 하나?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["자기장", "오른손법칙", "전류"],
    options: ["예, 맞다", "아니다, 비오-사바르 법칙이다", "아니다, 앙페르 법칙이다", "상황에 따라 다르다"],
    correctAnswer: "아니다, 앙페르 법칙이다",
    explanation: "오른손 법칙은 앙페르 법칙(Ampère's Law)의 표현방식이다.\n로렌츠 힘: 자기장 속의 전하나 전류가 받는 힘\nF = qv × B",
    hints: ["오른손 법칙과 앙페르 법칙의 관계", "로렌츠 힘의 정의"],
    solutionSteps: ["오른손 법칙: 자기장 방향 결정", "이는 앙페르 법칙의 표현", "로렌츠 힘은 다른 개념"]
  },
  {
    id: "physics_029",
    question: "자기장 B = 0.5 T에 수직으로 놓인 길이 L = 2 m인 전선에 I = 3 A의 전류가 흐를 때, 전선이 받는 힘은?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["자기력", "전류", "자기장"],
    options: [],
    correctAnswer: "3 N",
    explanation: "자기장 속 전류 도체의 힘: F = BIL (수직일 때)\nF = 0.5 × 3 × 2 = 3 N",
    hints: ["F = BIL", "수직이므로 sin(90°) = 1"],
    solutionSteps: ["공식: F = BIL sinθ", "수직: θ = 90°, sin(90°) = 1", "F = 0.5 × 3 × 2 = 3 N"]
  },
  {
    id: "physics_030",
    question: "자기장 속에서 움직이는 양의 전하가 받는 로렌츠 힘의 방향은?",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["로렌츠힘", "속도", "자기장"],
    options: ["속도 방향과 같다", "자기장 방향과 같다", "속도와 자기장에 모두 수직이다", "상황에 따라 다르다"],
    correctAnswer: "속도와 자기장에 모두 수직이다",
    explanation: "로렌츠 힘: F = q(v × B)\n외적의 성질에 의해 F는 v와 B 모두에 수직이다.\n오른손 법칙: 손가락이 v, 둘째손가락이 B를 가리킬 때,\n엄지손가락 방향이 F의 방향",
    hints: ["벡터의 외적 v × B의 방향은?", "오른손 법칙 적용"],
    solutionSteps: ["로렌츠 힘: F = q(v × B)", "외적의 성질: v ⊥ F, B ⊥ F", "오른손 법칙으로 방향 결정"]
  },
  {
    id: "physics_031",
    question: "원형 코일이 자기장을 통과할 때 발생하는 유도 기전력의 크기는?",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["전자기유도", "파라데이법칙", "자기선속"],
    options: ["E = -dΦ/dt", "E = nΦBv", "E = ΔΦ/Δt", "위 모두 맞다"],
    correctAnswer: "위 모두 맞다",
    explanation: "파라데이의 전자기 유도 법칙:\nE = -dΦ/dt (미분 형태)\nE = -ΔΦ/Δt (평균 형태)\nn이 코일 수일 때: E = -n dΦ/dt\n모두 동등한 표현이다.",
    hints: ["파라데이의 법칙의 다양한 형태", "미분과 평균 형태의 관계"],
    solutionSteps: ["파라데이 법칙: E = -dΦ/dt", "평균형: E = -ΔΦ/Δt", "다중 코일: E = -n dΦ/dt", "모두 등가"]
  },

  // ============ 원자 구조 (4개) ============
  {
    id: "physics_032",
    question: "보어 모형에서 에너지가 가장 낮은 전자 궤도(기저상태)의 에너지는?",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["보어모형", "에너지준위", "수소원자"],
    options: ["0", "양수", "음수", "무한대"],
    correctAnswer: "음수",
    explanation: "보어 모형: E_n = -13.6 eV / n²\nn = 1 (기저상태): E = -13.6 eV (음수)\n음수 에너지는 전자가 원자핵에 속박되어 있음을 의미한다.",
    hints: ["전자가 원자에 속박되어 있으면 에너지는?", "이온화에너지의 부호"],
    solutionSteps: ["보어 모형: E_n = -13.6/n² eV", "n=1: E = -13.6 eV", "음의 에너지는 속박 상태"]
  },
  {
    id: "physics_033",
    question: "광전 효과(광전자 방출)에서 중요한 것은?",
    type: "multiple_choice",
    difficulty: "medium",
    concepts: ["광전효과", "광자", "일함수"],
    options: ["빛의 세기만 중요하다", "빛의 진동수만 중요하다", "빛의 파장만 중요하다", "에너지만 중요하다"],
    correctAnswer: "빛의 진동수만 중요하다",
    explanation: "광전효과: hf ≥ W (일함수)\n아인슈타인의 광전 방정식: hf = W + KE\n임계 진동수: f₀ = W/h 이상이어야 전자가 방출된다.\n빛의 세기가 강해도 진동수가 낮으면 광전자가 방출되지 않는다.",
    hints: ["hf = W + KE", "임계 진동수의 개념"],
    solutionSteps: ["광전효과 조건: hf ≥ W", "W: 일함수 (물질 특성)", "f: 빛의 진동수", "f₀ = W/h 이상이어야 함"]
  },
  {
    id: "physics_034",
    question: "수소 원자에서 n=2에서 n=1로 전자가 떨어질 때, 방출되는 포톤의 에너지는?",
    type: "calculation",
    difficulty: "hard",
    concepts: ["보어모형", "에너지준위", "포톤"],
    options: [],
    correctAnswer: "10.2 eV",
    explanation: "E_n = -13.6 / n² eV\nE₁ = -13.6 eV\nE₂ = -13.6 / 4 = -3.4 eV\nΔE = E₂ - E₁ = -3.4 - (-13.6) = 10.2 eV\n방출 포톤 에너지: 10.2 eV",
    hints: ["E_n = -13.6/n² eV", "ΔE = E_final - E_initial"],
    solutionSteps: ["E₁ = -13.6 eV", "E₂ = -13.6/4 = -3.4 eV", "ΔE = -3.4 - (-13.6) = 10.2 eV"]
  },
  {
    id: "physics_035",
    question: "파동-입자 이중성을 설명하는 드브로이 파장의 공식은?",
    type: "short_answer",
    difficulty: "hard",
    concepts: ["드브로이파장", "파동성", "입자성"],
    options: [],
    correctAnswer: "λ = h/p (또는 λ = h/mv)",
    explanation: "드브로이 파장: λ = h/p\nh: 플랑크 상수 (6.626 × 10⁻³⁴ J·s)\np: 운동량 (= mv)\n모든 입자는 파동성을 가진다.",
    hints: ["입자의 파장을 나타내는 공식", "h: 플랑크 상수, p: 운동량"],
    solutionSteps: ["드브로이 파장: λ = h/p", "또는 λ = h/(mv)"]
  },
  {
    id: "physics_036",
    question: "방사성 핵붕괴의 반감기란?",
    type: "multiple_choice",
    difficulty: "easy",
    concepts: ["방사성붕괴", "반감기", "핵반응"],
    options: ["방사능이 절반으로 감소하는 시간", "핵이 완전히 붕괴하는 시간", "방사선 에너지가 절반이 되는 시간", "방사선이 검출되지 않는 시간"],
    correctAnswer: "방사능이 절반으로 감소하는 시간",
    explanation: "반감기 T₁/₂: 처음 원자핵 수의 절반이 붕괴하는데 걸리는 시간\nN(t) = N₀ × (1/2)^(t/T₁/₂)\nt = T₁/₂일 때, N = N₀/2",
    hints: ["반감기의 정의", "원자핵 수의 변화"],
    solutionSteps: ["반감기: 원자핵 수가 절반으로 감소하는 시간", "N = N₀ × (1/2)^(t/T)"]
  },

  // ============ 추가 심화 문제 (6개) ============
  {
    id: "physics_037",
    question: "충돌하는 두 물체의 반발 계수(e) = 0.8이라면 어떤 충돌인가?",
    type: "multiple_choice",
    difficulty: "hard",
    concepts: ["충돌", "반발계수", "탄성성"],
    options: ["완벽한 탄성충돌 (e=1)", "완벽한 비탄성충돌 (e=0)", "부분탄성충돌 (0<e<1)", "충돌이 일어나지 않음"],
    correctAnswer: "부분탄성충돌 (0<e<1)",
    explanation: "반발 계수: e = (분리속도) / (접근속도)\ne = 1: 완벽한 탄성충돌\ne = 0: 완벽한 비탄성충돌 (한덩어리로 붙음)\n0 < e < 1: 부분탄성충돌 (일부 에너지 손실)",
    hints: ["반발계수의 범위별 충돌 유형", "e의 값에 따른 분류"],
    solutionSteps: ["반발계수 e = 0.8", "0 < 0.8 < 1", "따라서 부분탄성충돌"]
  },
  {
    id: "physics_038",
    question: "수평면에 놓인 물체에 수평 방향 힘을 가했을 때 정지 마찰력의 최댓값 f_s = μ_s × N이다. 여기서 N은?",
    type: "short_answer",
    difficulty: "easy",
    concepts: ["마찰력", "수직항력", "정지마찰"],
    options: [],
    correctAnswer: "수직항력 (Normal Force)",
    explanation: "정지마찰력의 최댓값: f_s,max = μ_s × N\nN: 수직항력 (normal force)\n수평면에서는 N = mg (물체의 무게와 같음)\nμ_s: 정지마찰계수",
    hints: ["μ_s는 마찰계수", "N은 수직 방향의 힘"],
    solutionSteps: ["정지마찰: f_s,max = μ_s N", "N은 표면이 물체를 지지하는 수직 항력"]
  },
  {
    id: "physics_039",
    question: "원운동하는 물체의 구심가속도는 반지름 r과 속도 v의 관계에서 a_c = ?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["원운동", "구심가속도", "반지름"],
    options: [],
    correctAnswer: "v²/r",
    explanation: "원운동의 구심가속도: a_c = v²/r = ω²r\nv: 선속도\nω: 각속도\nr: 반지름",
    hints: ["원운동의 가속도 공식", "v와 r의 관계"],
    solutionSteps: ["구심가속도: a_c = v²/r", "또는 a_c = ω²r"]
  },
  {
    id: "physics_040",
    question: "반지름 0.5 m인 원형 궤도에서 4 m/s의 속도로 회전하는 물체의 구심가속도는?",
    type: "calculation",
    difficulty: "medium",
    concepts: ["원운동", "구심가속도"],
    options: [],
    correctAnswer: "32 m/s²",
    explanation: "a_c = v²/r\nv = 4 m/s, r = 0.5 m\na_c = 4² / 0.5 = 16 / 0.5 = 32 m/s²",
    hints: ["a_c = v²/r", "v² = 16"],
    solutionSteps: ["공식: a_c = v²/r", "v² = 4² = 16", "a_c = 16 / 0.5 = 32 m/s²"]
  }
];

// 내보내기 (사용 방식)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEMO_PROBLEMS;
}
