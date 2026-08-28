// ============ Data Storage ============
class ProblemStore {
    constructor() {
        this.problems = this.loadFromStorage('problems') || [];
        this.notes = this.loadFromStorage('wrongAnswerNotes') || [];
        this.apiKey = this.loadFromStorage('apiKey') || null;
        this.quizMode = false;
        this.quizProblems = [];
        this.currentQuizIndex = 0;
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    }

    addProblem(problem) {
        problem.id = Date.now() + Math.random();
        problem.createdAt = new Date().toISOString();
        problem.answered = false;
        problem.userAnswer = null;
        this.problems.unshift(problem);
        this.saveToStorage('problems', this.problems);
        return problem;
    }

    updateProblem(id, updates) {
        const problem = this.problems.find(p => p.id === id);
        if (problem) {
            Object.assign(problem, updates);
            this.saveToStorage('problems', this.problems);
        }
        return problem;
    }

    addNote(note) {
        note.id = Date.now() + Math.random();
        note.createdAt = new Date().toISOString();
        this.notes.unshift(note);
        this.saveToStorage('wrongAnswerNotes', this.notes);
    }

    clearNotes() {
        this.notes = [];
        this.saveToStorage('wrongAnswerNotes', this.notes);
    }

    removeNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveToStorage('wrongAnswerNotes', this.notes);
    }

    setApiKey(key) {
        this.apiKey = key;
        this.saveToStorage('apiKey', key);
    }

    startQuizMode(problems) {
        this.quizMode = true;
        this.quizProblems = problems.filter(p => p.options);
        this.currentQuizIndex = 0;
        return this.quizProblems.length > 0;
    }

    endQuizMode() {
        this.quizMode = false;
        this.quizProblems = [];
        this.currentQuizIndex = 0;
    }

    getCurrentQuizProblem() {
        if (this.currentQuizIndex >= this.quizProblems.length) {
            return null;
        }
        return this.quizProblems[this.currentQuizIndex];
    }

    nextQuizProblem() {
        this.currentQuizIndex++;
        return this.getCurrentQuizProblem();
    }

    getQuizProgress() {
        return {
            current: this.currentQuizIndex + 1,
            total: this.quizProblems.length
        };
    }
}

// ============ Problem Generator ============
class ProblemGenerator {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        // API 키가 없거나 demo-mode면 데모 모드 사용
        this.useDemo = !apiKey || apiKey === 'demo-mode';
    }

    async generateProblems(text, types, difficulty, quantity) {
        if (this.useDemo) {
            return this.generateDemoProblems(text, types, difficulty, quantity);
        }

        try {
            const prompt = this.buildPrompt(text, types, difficulty, quantity);
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: '당신은 대학 교과서 내용을 기반으로 창의적이고 교육적인 문제를 만드는 전문가입니다. JSON 형식으로 정확하게 응답해주세요.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No JSON found in response');
                }
                const problems = JSON.parse(jsonMatch[0]);
                return problems.problems || [problems];
            } catch (e) {
                console.error('Failed to parse response:', e);
                return this.generateDemoProblems(text, types, difficulty, quantity);
            }
        } catch (error) {
            console.error('API Error:', error);
            return this.generateDemoProblems(text, types, difficulty, quantity);
        }
    }

    buildPrompt(text, types, difficulty, quantity) {
        const typeStr = types.join(', ');
        const difficultyMap = {
            '하': '기초 개념 이해',
            '중': '응용 및 문제 해결',
            '상': '심화 및 기출문제 변형'
        };

        return `다음 교과서 내용을 기반으로 ${quantity}개의 문제를 만들어주세요:

교과서 내용:
${text}

요구사항:
- 문제 유형: ${typeStr}
- 난이도: ${difficultyMap[difficulty]}
- 총 ${quantity}개 문제
- 각 문제마다 2개의 힌트와 상세한 풀이를 포함

다음 JSON 형식으로 응답해주세요:
{
  "problems": [
    {
      "id": 1,
      "title": "문제 제목",
      "type": "객관식|단답형|서술형|계산형",
      "difficulty": "하|중|상",
      "content": "문제 내용",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "correctAnswer": "정답",
      "hints": ["힌트1", "힌트2"],
      "explanation": "상세한 풀이 및 설명",
      "concepts": ["개념1", "개념2"]
    }
  ]
}`;
    }

    generateDemoProblems(text, types, difficulty, quantity) {
        const demoProblems = [
            {
                id: 1,
                title: "열역학 제1법칙 이해",
                type: "객관식",
                difficulty: "하",
                content: "열역학 제1법칙은 다음 중 어느 것을 설명하는가?",
                options: [
                    "에너지는 생성되거나 소멸될 수 없다",
                    "모든 물질은 열을 방출한다",
                    "물질은 항상 열을 흡수한다",
                    "에너지는 온도와 비례한다"
                ],
                correctAnswer: "에너지는 생성되거나 소멸될 수 없다",
                hints: [
                    "💡 힌트1: 에너지 보존의 법칙을 생각해보세요",
                    "💡 힌트2: 계의 내부에너지 변화 = 가해진 열 + 한 일"
                ],
                explanation: "열역학 제1법칙은 에너지 보존의 법칙으로, 우주의 총 에너지는 일정하다는 것을 의미합니다.",
                concepts: ["에너지 보존", "열역학 제1법칙"]
            },
            {
                id: 2,
                title: "에너지 계산 문제",
                type: "객관식",
                difficulty: "중",
                content: "어떤 물질이 에너지를 받을 때 가장 많이 증가하는 것은?",
                options: [
                    "부피",
                    "온도",
                    "질량",
                    "밀도"
                ],
                correctAnswer: "온도",
                hints: [
                    "💡 힌트1: Q = mc(T₂ - T₁) 공식을 생각하세요",
                    "💡 힌트2: 에너지가 증가하면 어떤 물리량이 변할까요?"
                ],
                explanation: "에너지를 흡수하면 온도가 증가합니다. 열량과 온도 변화의 관계식은 Q = mc ΔT입니다.",
                concepts: ["열량", "온도 변화", "비열"]
            },
            {
                id: 3,
                title: "엔트로피 개념",
                type: "객관식",
                difficulty: "중",
                content: "다음 중 엔트로피에 대한 설명으로 가장 올바른 것은?",
                options: [
                    "엔트로피는 에너지의 양이다",
                    "엔트로피는 무질서도를 나타내는 상태함수다",
                    "엔트로피는 항상 감소한다",
                    "엔트로피는 시간에 따라 선형적으로 증가한다"
                ],
                correctAnswer: "엔트로피는 무질서도를 나타내는 상태함수다",
                hints: [
                    "💡 힌트1: 엔트로피 S의 정의를 떠올려보세요",
                    "💡 힌트2: 고립된 계에서는 엔트로피가 증가하는 경향"
                ],
                explanation: "엔트로피는 계의 무질서도를 나타내는 열역학적 성질입니다.",
                concepts: ["엔트로피", "상태함수", "무질서도"]
            },
            {
                id: 4,
                title: "기체의 성질",
                type: "객관식",
                difficulty: "하",
                content: "이상기체의 특징이 아닌 것은?",
                options: [
                    "분자 간 상호작용이 없다",
                    "분자의 크기가 무시할 수 있다",
                    "완전히 비탄성 충돌을 한다",
                    "평균 운동에너지는 온도에 비례한다"
                ],
                correctAnswer: "완전히 비탄성 충돌을 한다",
                hints: [
                    "💡 힌트1: 이상기체는 완전탄성충돌을 합니다",
                    "💡 힌트2: 에너지가 손실되지 않는 충돌"
                ],
                explanation: "이상기체는 분자 간 충돌이 완전탄성충돌이므로 에너지가 보존됩니다.",
                concepts: ["이상기체", "탄성충돌", "분자운동론"]
            },
            {
                id: 5,
                title: "압력과 온도의 관계",
                type: "객관식",
                difficulty: "상",
                content: "일정한 부피에서 기체의 압력이 2배가 되었다면 절대온도는?",
                options: [
                    "1/2배",
                    "2배",
                    "4배",
                    "변화가 없다"
                ],
                correctAnswer: "2배",
                hints: [
                    "💡 힌트1: P/T = k (일정한 부피에서)",
                    "💡 힌트2: 게이루삭 법칙을 적용하세요"
                ],
                explanation: "일정한 부피에서 P₁/T₁ = P₂/T₂이므로, P₂ = 2P₁이면 T₂ = 2T₁입니다.",
                concepts: ["기체법칙", "압력", "절대온도"]
            }
        ];

        let filtered = demoProblems.filter(p => {
            const typeMatch = types.length === 0 || types.includes(p.type);
            const diffMatch = p.difficulty === difficulty;
            return typeMatch && diffMatch;
        });

        if (filtered.length === 0) {
            filtered = demoProblems;
        }

        return filtered.slice(0, quantity).map((p, idx) => ({
            ...p,
            id: Date.now() + idx
        }));
    }
}

// ============ UI Manager ============
class UIManager {
    constructor() {
        this.store = new ProblemStore();
        this.generator = new ProblemGenerator(this.store.apiKey);
        this.currentProblem = null;
        this.setupEventListeners();
        this.showApiKeyModal();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        document.getElementById('generateBtn').addEventListener('click', () => this.generateProblems());
        document.getElementById('clearNotesBtn').addEventListener('click', () => this.clearAllNotes());

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });        document.getElementById('demoBtn').addEventListener('click', () => {
            this.generator.useDemo = true;
            this.store.setApiKey('demo-mode');
            document.getElementById('demoModal').classList.add('hidden');
            console.log('✅ 데모 모드 활성화됨');
        });

        document.getElementById('apiBtn').addEventListener('click', () => {
            const apiKey = document.getElementById('apiKey').value.trim();
            if (apiKey) {
                this.store.setApiKey(apiKey);
                this.generator.apiKey = apiKey;
                this.generator.useDemo = false;
                console.log('✅ API 키 저장됨');
            } else {
                alert('API 키를 입력해주세요.');
                return;
            }
            document.getElementById('demoModal').classList.add('hidden');
        });
    }    showApiKeyModal() {
        // 자동으로 데모 모드 활성화
        setTimeout(() => {
            const demoModal = document.getElementById('demoModal');
            if (demoModal && !this.store.apiKey) {
                demoModal.classList.remove('hidden');
            }
        }, 500);
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        if (tabName === 'problems') {
            this.renderProblems();
        } else if (tabName === 'notes') {
            this.renderNotes();
        }
    }

    async generateProblems() {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            alert('교과서 텍스트나 키워드를 입력해주세요.');
            return;
        }

        const types = Array.from(document.querySelectorAll('input[name="type"]:checked'))
            .map(checkbox => checkbox.value);
        if (types.length === 0) {
            alert('문제 유형을 최소 하나 선택해주세요.');
            return;
        }

        const difficulty = document.getElementById('difficulty').value;
        const quantity = parseInt(document.getElementById('quantity').value);

        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('generateBtn').disabled = true;

        try {
            const problems = await this.generator.generateProblems(text, types, difficulty, quantity);
            
            if (Array.isArray(problems)) {
                problems.forEach(problem => this.store.addProblem(problem));
            } else {
                this.store.addProblem(problems);
            }

            alert(`✨ ${Array.isArray(problems) ? problems.length : 1}개의 문제가 생성되었습니다!`);
            document.getElementById('textInput').value = '';
            this.switchTab('problems');
        } catch (error) {
            alert('문제 생성 중 오류가 발생했습니다: ' + error.message);
        } finally {
            document.getElementById('loadingSpinner').classList.add('hidden');
            document.getElementById('generateBtn').disabled = false;
        }
    }

    renderProblems() {
        const list = document.getElementById('problemsList');
        if (this.store.problems.length === 0) {
            list.innerHTML = '<p class="empty-message">아직 생성된 문제가 없습니다.</p>';
            return;
        }

        const quizProblems = this.store.problems.filter(p => p.options);

        let html = '';
        if (quizProblems.length > 0) {
            html += `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="uiManager.startQuizMode()">
                        🎮 즉시 풀이 모드 시작 (${quizProblems.length}개 문제)
                    </button>
                </div>
            `;
        }

        html += this.store.problems.map(problem => `
            <div class="problem-card ${problem.answered ? 'answered' : ''} ${problem.isWrong ? 'wrong' : ''}">
                <div class="problem-header">
                    <div class="problem-title">${problem.title}</div>
                    <div class="problem-meta">
                        <span class="badge badge-type">${problem.type}</span>
                        <span class="badge difficulty-${problem.difficulty}">난이도: ${problem.difficulty}</span>
                    </div>
                </div>
                <div class="problem-description">${problem.content}</div>
                ${problem.options ? `
                    <div class="options">
                        ${problem.options.map((opt, idx) => `
                            <div class="option" data-problem-id="${problem.id}" data-option="${opt.replace(/"/g, '&quot;')}" onclick="uiManager.handleOptionClick(this, ${problem.id}, '${opt.replace(/'/g, "\\'")}')">
                                ${String.fromCharCode(65 + idx)}. ${opt}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="problem-actions">
                    <button class="btn btn-sm btn-primary" onclick="uiManager.showProblemDetail(${problem.id})">풀이 보기</button>
                    <button class="btn btn-sm btn-secondary" onclick="uiManager.deleteProblem(${problem.id})">삭제</button>
                </div>
            </div>
        `).join('');

        list.innerHTML = html;
    }

    vibrate(pattern = 100) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    handleOptionClick(element, problemId, selectedOption) {
        const problem = this.store.problems.find(p => p.id === problemId);
        if (!problem) return;

        if (element.classList.contains('disabled')) return;
        element.classList.add('disabled');

        const isCorrect = selectedOption === problem.correctAnswer;

        if (isCorrect) {
            element.style.backgroundColor = '#dcfce7';
            element.style.borderColor = '#10b981';
            element.style.color = '#10b981';
            element.style.fontWeight = '600';
            this.store.updateProblem(problemId, { answered: true });
        } else {
            element.style.backgroundColor = '#fee2e2';
            element.style.borderColor = '#ef4444';
            element.style.color = '#ef4444';
            element.style.fontWeight = '600';
            this.vibrate([100, 50, 100]);

            this.store.addNote({
                problemId: problem.id,
                title: problem.title,
                content: problem.content,
                correctAnswer: problem.correctAnswer,
                explanation: problem.explanation,
                userAnswer: selectedOption,
                concepts: problem.concepts,
                attempts: (problem.attempts || 0) + 1
            });
            this.store.updateProblem(problemId, { isWrong: true });

            const options = document.querySelectorAll(`[data-problem-id="${problemId}"]`);
            options.forEach(opt => {
                if (opt.getAttribute('data-option') === problem.correctAnswer.replace(/"/g, '&quot;')) {
                    opt.style.backgroundColor = '#dcfce7';
                    opt.style.borderColor = '#10b981';
                    opt.style.color = '#10b981';
                    opt.style.fontWeight = '600';
                }
            });
        }
    }

    startQuizMode() {
        const quizProblems = this.store.problems.filter(p => p.options);
        
        if (quizProblems.length === 0) {
            alert('객관식 문제가 없습니다.');
            return;
        }

        if (!this.store.startQuizMode(quizProblems)) {
            alert('퀴즈를 시작할 수 없습니다.');
            return;
        }

        this.showQuizModal();
    }

    showQuizModal() {
        const modal = document.getElementById('problemModal');
        const body = document.getElementById('modalBody');
        const problem = this.store.getCurrentQuizProblem();

        if (!problem) {
            this.showQuizComplete();
            return;
        }

        const progress = this.store.getQuizProgress();

        body.innerHTML = `
            <div class="quiz-mode">
                <div class="quiz-header">
                    <h2>🎮 즉시 풀이 모드</h2>
                    <div class="quiz-progress">문제 ${progress.current} / ${progress.total}</div>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(progress.current / progress.total) * 100}%"></div>
                </div>

                <div class="problem-detail">
                    <h3>${problem.title}</h3>
                    <div style="margin: 20px 0;">
                        <span class="badge badge-type">${problem.type}</span>
                        <span class="badge difficulty-${problem.difficulty}">난이도: ${problem.difficulty}</span>
                    </div>

                    <div class="problem-content">
                        <h4>📝 문제</h4>
                        <p>${problem.content}</p>
                    </div>

                    <div class="options" style="margin: 20px 0;">
                        ${problem.options.map((opt, idx) => `
                            <div class="option" data-problem-id="${problem.id}" data-option="${opt.replace(/"/g, '&quot;')}" onclick="uiManager.handleQuizOptionClick(this, ${problem.id}, '${opt.replace(/'/g, "\\'")}')">
                                ${String.fromCharCode(65 + idx)}. ${opt}
                            </div>
                        `).join('')}
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.9rem;">
                        💡 보기를 클릭하면 자동으로 다음 문제로 넘어갑니다
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    handleQuizOptionClick(element, problemId, selectedOption) {
        const problem = this.store.problems.find(p => p.id === problemId);
        if (!problem) return;

        if (element.classList.contains('disabled')) return;
        element.classList.add('disabled');

        const isCorrect = selectedOption === problem.correctAnswer;

        if (isCorrect) {
            element.style.backgroundColor = '#dcfce7';
            element.style.borderColor = '#10b981';
            element.style.color = '#10b981';
            element.style.fontWeight = '600';
            this.store.updateProblem(problemId, { answered: true });

            setTimeout(() => {
                this.nextQuizProblem();
            }, 800);
        } else {
            element.style.backgroundColor = '#fee2e2';
            element.style.borderColor = '#ef4444';
            element.style.color = '#ef4444';
            element.style.fontWeight = '600';
            this.vibrate([100, 50, 100]);

            this.store.addNote({
                problemId: problem.id,
                title: problem.title,
                content: problem.content,
                correctAnswer: problem.correctAnswer,
                explanation: problem.explanation,
                userAnswer: selectedOption,
                concepts: problem.concepts,
                attempts: (problem.attempts || 0) + 1
            });
            this.store.updateProblem(problemId, { isWrong: true });

            const options = document.querySelectorAll(`[data-problem-id="${problemId}"]`);
            options.forEach(opt => {
                if (opt.getAttribute('data-option') === problem.correctAnswer.replace(/"/g, '&quot;')) {
                    opt.style.backgroundColor = '#dcfce7';
                    opt.style.borderColor = '#10b981';
                    opt.style.color = '#10b981';
                    opt.style.fontWeight = '600';
                }
            });

            setTimeout(() => {
                this.nextQuizProblem();
            }, 1500);
        }
    }

    nextQuizProblem() {
        const nextProblem = this.store.nextQuizProblem();
        if (!nextProblem) {
            this.showQuizComplete();
        } else {
            this.showQuizModal();
        }
    }

    showQuizComplete() {
        const modal = document.getElementById('problemModal');
        const body = document.getElementById('modalBody');

        const correctCount = this.store.quizProblems.filter(p => p.answered).length;
        const wrongCount = this.store.quizProblems.length - correctCount;

        body.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">🎉 완료!</h2>
                <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 30px;">모든 문제를 풀었습니다!</p>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                    <p style="font-size: 1rem; color: #15803d; margin: 10px 0;">
                        ✅ 정답: <strong>${correctCount}</strong>개
                    </p>
                    <p style="font-size: 1rem; color: #dc2626; margin: 10px 0;">
                        ❌ 오답: <strong>${wrongCount}</strong>개
                    </p>
                </div>

                <button class="btn btn-primary" onclick="uiManager.goToWrongAnswerNotes()" style="margin-right: 10px;">
                    📝 오답 노트 확인하기
                </button>
                <button class="btn btn-secondary" onclick="document.getElementById('problemModal').classList.add('hidden')">
                    닫기
                </button>
            </div>
        `;

        this.store.endQuizMode();
    }

    goToWrongAnswerNotes() {
        document.getElementById('problemModal').classList.add('hidden');
        this.switchTab('notes');
    }

    showProblemDetail(id) {
        const problem = this.store.problems.find(p => p.id === id);
        if (!problem) return;

        this.currentProblem = problem;
        const modal = document.getElementById('problemModal');
        const body = document.getElementById('modalBody');

        body.innerHTML = `
            <div class="problem-detail">
                <h2>${problem.title}</h2>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <span class="badge badge-type">${problem.type}</span>
                    <span class="badge difficulty-${problem.difficulty}">난이도: ${problem.difficulty}</span>
                </div>

                <div class="problem-content">
                    <h4>📝 문제</h4>
                    <p>${problem.content}</p>
                </div>

                ${problem.options ? `
                    <div class="options">
                        ${problem.options.map((opt, idx) => `
                            <div class="option">${String.fromCharCode(65 + idx)}. ${opt}</div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="response-buttons">
                    <button class="btn btn-sm btn-reveal" onclick="uiManager.showHint(1)">💡 힌트 1 보기</button>
                    <button class="btn btn-sm btn-reveal" onclick="uiManager.showHint(2)">💡 힌트 2 보기</button>
                    <button class="btn btn-sm btn-success" onclick="uiManager.showSolution()">✅ 정답 및 풀이</button>
                </div>

                <div id="hintsContainer"></div>
                <div id="solutionContainer"></div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    showHint(hintNum) {
        const container = document.getElementById('hintsContainer');
        const hints = this.currentProblem.hints || [];
        
        if (hints[hintNum - 1]) {
            const hint = hints[hintNum - 1];
            const hintDiv = document.createElement('div');
            hintDiv.className = 'hint-section';
            hintDiv.innerHTML = `
                <h4>💡 힌트 ${hintNum}</h4>
                <p>${hint}</p>
            `;
            container.appendChild(hintDiv);

            event.target.disabled = true;
            event.target.textContent = '✓ 표시됨';
        }
    }

    showSolution() {
        const container = document.getElementById('solutionContainer');
        const problem = this.currentProblem;

        container.innerHTML = `
            <div class="solution-section">
                <h4>✅ 정답</h4>
                <p><strong>${problem.correctAnswer}</strong></p>
            </div>

            <div class="solution-section">
                <h4>📖 상세 풀이</h4>
                <p>${problem.explanation.replace(/\n/g, '<br>')}</p>
            </div>

            <div class="concept-section">
                <h4>🎓 관련 개념</h4>
                <p>${(problem.concepts || []).join(', ')}</p>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-sm btn-danger" onclick="uiManager.addToWrongNotes()">
                    ❌ 오답 노트에 추가
                </button>
                <button class="btn btn-sm btn-success" onclick="uiManager.markAsCorrect()">
                    ✓ 맞췄습니다
                </button>
            </div>
        `;
    }

    addToWrongNotes() {
        const problem = this.currentProblem;
        this.store.addNote({
            problemId: problem.id,
            title: problem.title,
            content: problem.content,
            correctAnswer: problem.correctAnswer,
            explanation: problem.explanation,
            userAnswer: problem.userAnswer,
            concepts: problem.concepts,
            attempts: (problem.attempts || 0) + 1
        });

        this.store.updateProblem(problem.id, { isWrong: true });
        alert('✓ 오답 노트에 추가되었습니다.');
    }

    markAsCorrect() {
        this.store.updateProblem(this.currentProblem.id, { answered: true });
        alert('✓ 정답으로 표시되었습니다!');
        this.renderProblems();
    }

    renderNotes() {
        const list = document.getElementById('notesList');
        if (this.store.notes.length === 0) {
            list.innerHTML = '<p class="empty-message">오답 노트가 비어있습니다.</p>';
            return;
        }

        list.innerHTML = this.store.notes.map(note => `
            <div class="note-card">
                <div class="problem-header">
                    <div class="problem-title">${note.title}</div>
                    <div class="problem-meta">
                        <span class="badge badge-type">틀린 횟수: ${note.attempts || 1}</span>
                    </div>
                </div>
                <div class="problem-description">${note.content}</div>
                <div class="problem-content">
                    <h4>정답</h4>
                    <p>${note.correctAnswer}</p>
                </div>
                <div class="problem-content">
                    <h4>풀이</h4>
                    <p>${note.explanation.substring(0, 200)}...</p>
                </div>
                <div class="problem-actions">
                    <button class="btn btn-sm btn-primary" onclick="uiManager.showNoteDetail(${note.id})">
                        상세보기
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="uiManager.deleteNote(${note.id})">
                        제거
                    </button>
                </div>
            </div>
        `).join('');
    }

    showNoteDetail(id) {
        const note = this.store.notes.find(n => n.id === id);
        if (!note) return;

        const modal = document.getElementById('problemModal');
        const body = document.getElementById('modalBody');

        body.innerHTML = `
            <div class="problem-detail">
                <h2>${note.title}</h2>
                <span class="badge badge-type">틀린 횟수: ${note.attempts || 1}회</span>

                <div class="problem-content" style="margin-top: 20px;">
                    <h4>📝 문제</h4>
                    <p>${note.content}</p>
                </div>

                <div class="problem-content">
                    <h4>❌ 당신의 답</h4>
                    <p>${note.userAnswer || '기록 없음'}</p>
                </div>

                <div class="solution-section">
                    <h4>✅ 정답</h4>
                    <p><strong>${note.correctAnswer}</strong></p>
                </div>

                <div class="solution-section">
                    <h4>📖 풀이</h4>
                    <p>${note.explanation.replace(/\n/g, '<br>')}</p>
                </div>

                <div class="concept-section">
                    <h4>🎓 관련 개념</h4>
                    <p>${(note.concepts || []).join(', ')}</p>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    deleteNote(id) {
        if (confirm('이 오답 노트를 삭제하시겠습니까?')) {
            this.store.removeNote(id);
            this.renderNotes();
        }
    }

    clearAllNotes() {
        if (confirm('모든 오답 노트를 삭제하시겠습니까?')) {
            this.store.clearNotes();
            this.renderNotes();
        }
    }

    deleteProblem(id) {
        if (confirm('이 문제를 삭제하시겠습니까?')) {
            this.store.problems = this.store.problems.filter(p => p.id !== id);
            this.store.saveToStorage('problems', this.store.problems);
            this.renderProblems();
        }
    }
}

// ============ Initialize App ============
let uiManager;

document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
});
