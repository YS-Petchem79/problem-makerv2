/**
 * 오답노트 시스템 - 자동 오답 저장 및 분석 엔진
 * 문제 풀이 데이터를 기반으로 오답을 저장, 분석, 복습하는 시스템
 */

const WrongAnswerDB = {
    dbName: 'StudyStats',
    version: 2,
    storeName: 'wrongAnswers',
    db: null,

    /**
     * IndexedDB 초기화 (기존 StudyStats DB 확장)
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // wrongAnswers 스토어 생성
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'wrongAnswerId' });
                    store.createIndex('questionId', 'questionId', { unique: false });
                    store.createIndex('workbookId', 'workbookId', { unique: false });
                    store.createIndex('concepts', 'concepts', { unique: false, multiEntry: true });
                    store.createIndex('reviewStatus', 'reviewStatus', { unique: false });
                    store.createIndex('wrongReason', 'wrongReason', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('deleted', 'deleted', { unique: false });
                }
            };
        });
    },

    /**
     * 오답 저장
     * @param {Object} wrongAnswerData - 오답 데이터
     */
    async saveWrongAnswer(wrongAnswerData) {
        if (!this.db) await this.init();

        const wrongAnswer = {
            wrongAnswerId: `wrong_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questionId: wrongAnswerData.questionId || `q_${Date.now()}`,
            workbookId: wrongAnswerData.workbookId || 'default',
            question: wrongAnswerData.question || '',
            userAnswer: wrongAnswerData.userAnswer || '',
            correctAnswer: wrongAnswerData.correctAnswer || '',
            explanation: wrongAnswerData.explanation || '',
            concepts: wrongAnswerData.concepts || [],
            difficulty: wrongAnswerData.difficulty || 'medium',
            questionType: wrongAnswerData.questionType || 'multiple_choice',
            wrongReason: wrongAnswerData.wrongReason || '', // AI 분석 결과 또는 사용자 선택
            hintUsed: wrongAnswerData.hintUsed || false,
            reviewStatus: 'unresolved', // unresolved, resolved, partially_resolved
            wrongCount: 1,
            createdAt: new Date().toISOString(),
            lastReviewedAt: null,
            deleted: false
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(wrongAnswer);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(wrongAnswer.wrongAnswerId);
        });
    },

    /**
     * 모든 오답 조회
     */
    async getAllWrongAnswers() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                // deleted가 아닌 것만 반환
                const result = request.result.filter(item => !item.deleted);
                resolve(result);
            };
        });
    },

    /**
     * 오답 업데이트
     */
    async updateWrongAnswer(wrongAnswerId, updates) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const getRequest = store.get(wrongAnswerId);

            getRequest.onsuccess = () => {
                const wrongAnswer = getRequest.result;
                if (!wrongAnswer) {
                    reject(new Error('오답을 찾을 수 없습니다'));
                    return;
                }

                Object.assign(wrongAnswer, updates);
                const updateRequest = store.put(wrongAnswer);

                updateRequest.onerror = () => reject(updateRequest.error);
                updateRequest.onsuccess = () => resolve(wrongAnswer);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    },

    /**
     * 오답 복습 (정답인 경우)
     */
    async markAsResolved(wrongAnswerId) {
        return this.updateWrongAnswer(wrongAnswerId, {
            reviewStatus: 'resolved',
            lastReviewedAt: new Date().toISOString()
        });
    },

    /**
     * 오답 복습 (다시 틀린 경우)
     */
    async incrementWrongCount(wrongAnswerId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const getRequest = store.get(wrongAnswerId);

            getRequest.onsuccess = () => {
                const wrongAnswer = getRequest.result;
                if (!wrongAnswer) {
                    reject(new Error('오답을 찾을 수 없습니다'));
                    return;
                }

                wrongAnswer.wrongCount += 1;
                wrongAnswer.reviewStatus = 'unresolved';
                const updateRequest = store.put(wrongAnswer);

                updateRequest.onerror = () => reject(updateRequest.error);
                updateRequest.onsuccess = () => resolve(wrongAnswer);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    },

    /**
     * 오답 삭제 (Soft Delete)
     */
    async deleteWrongAnswer(wrongAnswerId) {
        return this.updateWrongAnswer(wrongAnswerId, { deleted: true });
    },

    /**
     * 조건별 오답 조회
     */
    async getWrongAnswersByFilter(filters = {}) {
        const allWrongAnswers = await this.getAllWrongAnswers();

        return allWrongAnswers.filter(wa => {
            if (filters.reviewStatus && wa.reviewStatus !== filters.reviewStatus) return false;
            if (filters.wrongReason && wa.wrongReason !== filters.wrongReason) return false;
            if (filters.questionType && wa.questionType !== filters.questionType) return false;
            if (filters.difficulty && wa.difficulty !== filters.difficulty) return false;
            if (filters.concepts && filters.concepts.length > 0) {
                const hasCommonConcept = filters.concepts.some(c => wa.concepts.includes(c));
                if (!hasCommonConcept) return false;
            }
            return true;
        });
    },

    /**
     * 특정 문제의 오답 확인
     */
    async getWrongAnswerByQuestionId(questionId) {
        const allWrongAnswers = await this.getAllWrongAnswers();
        return allWrongAnswers.find(wa => wa.questionId === questionId);
    }
};

/**
 * 오답 분석 엔진
 */
const WrongAnswerAnalyzer = {
    /**
     * 오답 원인 분류 (AI 기반)
     * @param {string} question - 문제
     * @param {string} userAnswer - 사용자 답
     * @param {string} correctAnswer - 정답
     * @param {string} explanation - 풀이
     */
    async analyzeWrongReason(question, userAnswer, correctAnswer, explanation) {
        // AI API 호출 불가 시 패턴 기반 분석
        return this.patternBasedAnalysis(question, userAnswer, correctAnswer, explanation);
    },

    /**
     * 패턴 기반 오답 원인 분석
     */
    patternBasedAnalysis(question, userAnswer, correctAnswer, explanation) {
        const reasons = [
            { keyword: ['단위', '변환', 'cm', 'm', 'km'], reason: '단위 실수' },
            { keyword: ['공식', '계산', '계산하면'], reason: '공식 암기 부족' },
            { keyword: ['개념', '정의', '의미'], reason: '개념 이해 부족' },
            { keyword: ['조건', '주어진', '가정'], reason: '조건 누락' },
            { keyword: ['해석', '이해', '의미 해석'], reason: '문제 해석 오류' }
        ];

        let suspectedReason = '단순 실수';
        let maxMatches = 0;

        for (const reasonItem of reasons) {
            const combinedText = `${question} ${explanation}`.toLowerCase();
            const matches = reasonItem.keyword.filter(keyword => 
                combinedText.includes(keyword.toLowerCase())
            ).length;

            if (matches > maxMatches) {
                maxMatches = matches;
                suspectedReason = reasonItem.reason;
            }
        }

        return suspectedReason;
    },

    /**
     * 오답 통계 계산
     */
    async calculateWrongAnswerStats(wrongAnswers) {
        if (wrongAnswers.length === 0) {
            return {
                totalWrong: 0,
                unresolved: 0,
                resolved: 0,
                mostCommonReason: 'N/A',
                mostCommonConcept: 'N/A',
                mostCommonType: 'N/A'
            };
        }

        // 가장 흔한 원인
        const reasonCounts = {};
        wrongAnswers.forEach(wa => {
            if (wa.wrongReason) {
                reasonCounts[wa.wrongReason] = (reasonCounts[wa.wrongReason] || 0) + 1;
            }
        });
        const mostCommonReason = Object.keys(reasonCounts).length > 0
            ? Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

        // 가장 흔한 개념
        const conceptCounts = {};
        wrongAnswers.forEach(wa => {
            wa.concepts.forEach(concept => {
                conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
            });
        });
        const mostCommonConcept = Object.keys(conceptCounts).length > 0
            ? Object.entries(conceptCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

        // 가장 흔한 유형
        const typeCounts = {};
        wrongAnswers.forEach(wa => {
            const type = wa.questionType || 'other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        const mostCommonType = Object.keys(typeCounts).length > 0
            ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

        return {
            totalWrong: wrongAnswers.length,
            unresolved: wrongAnswers.filter(wa => wa.reviewStatus === 'unresolved').length,
            resolved: wrongAnswers.filter(wa => wa.reviewStatus === 'resolved').length,
            mostCommonReason,
            mostCommonConcept,
            mostCommonType
        };
    },

    /**
     * 유사 문제 생성을 위한 프롬프트 생성
     */
    generateSimilarProblemPrompt(problem, concepts, difficulty) {
        return `
다음 문제와 동일한 개념과 난이도를 유지하면서 새로운 유사 문제를 생성해주세요.

원래 문제:
${problem.question}

개념: ${concepts.join(', ')}
난이도: ${difficulty}
문제 유형: ${problem.type}

새 문제에서 변경할 수 있는 요소:
- 숫자 값
- 조건
- 상황 설정
- 보기 순서
- 질문 방식

생성 규칙:
1. 개념은 동일해야 함
2. 난이도는 동일해야 함
3. 문제 유형은 동일해야 함
4. 완전히 새로운 문제여야 함 (문제 복사 금지)
5. 정답과 풀이도 새로운 조건에 맞게 생성

다음 JSON 형식으로 응답:
{
    "question": "새 문제",
    "options": ["선택지1", "선택지2", ...],
    "answer": "정답",
    "explanation": "상세한 풀이 과정",
    "hints": ["힌트1", "힌트2"],
    "concepts": ["개념1", "개념2"]
}

JSON만 반환하세요.
`;
    },

    /**
     * 집중 학습 문제 생성 프롬프트
     */
    generateConcentrationProblemPrompt(concept, difficulty, count = 5) {
        return `
다음 개념에 대한 집중 학습 문제를 ${count}개 생성해주세요.

개념: ${concept}
난이도: ${difficulty}

문제 구성:
- 계산형: 3개
- 개념형: 2개

다음 JSON 배열 형식으로 응답:
[
    {
        "question": "문제",
        "type": "calculation|multiple_choice",
        "options": ["선택지1", "선택지2", ...],
        "answer": "정답",
        "explanation": "풀이",
        "hints": ["힌트1", "힌트2"],
        "concepts": ["${concept}"]
    },
    ...
]

JSON만 반환하세요.
`;
    }
};

/**
 * 오답 관리자
 */
const WrongAnswerManager = {
    /**
     * 오답 추가 (문제 풀이 후 호출)
     */
    async addWrongAnswer(attemptData, problemData) {
        try {
            const wrongReason = await WrongAnswerAnalyzer.analyzeWrongReason(
                problemData.question,
                attemptData.userAnswer,
                attemptData.correctAnswer,
                problemData.explanation || problemData.solution
            );

            const wrongAnswerId = await WrongAnswerDB.saveWrongAnswer({
                questionId: attemptData.questionId,
                workbookId: attemptData.workbookId,
                question: problemData.question,
                userAnswer: attemptData.userAnswer,
                correctAnswer: attemptData.correctAnswer,
                explanation: problemData.explanation || problemData.solution,
                concepts: problemData.concepts || [],
                difficulty: problemData.difficulty,
                questionType: problemData.type,
                wrongReason: wrongReason,
                hintUsed: attemptData.usedHint || false
            });

            return wrongAnswerId;
        } catch (error) {
            console.error('오답 저장 실패:', error);
            return null;
        }
    },    /**
     * 오답 복습 처리
     */
    async processReview(wrongAnswerId, isCorrect) {
        try {
            if (isCorrect) {
                await WrongAnswerDB.markAsResolved(wrongAnswerId);
            } else {
                await WrongAnswerDB.incrementWrongCount(wrongAnswerId);
            }

            // 통계 시스템 연동
            const wrongAnswer = await WrongAnswerDB.getAllWrongAnswers();
            const targetWrongAnswer = wrongAnswer.find(wa => wa.wrongAnswerId === wrongAnswerId);
            if (targetWrongAnswer && window.WrongAnswerStatsIntegration) {
                await window.WrongAnswerStatsIntegration.updateStatsOnReview(targetWrongAnswer, isCorrect);
            }
        } catch (error) {
            console.error('오답 복습 처리 실패:', error);
        }
    }
};

/**
 * 오답-통계 통합 시스템
 */
const WrongAnswerStatsIntegration = {
    /**
     * 복습 완료 시 통계 업데이트
     */
    async updateStatsOnReview(wrongAnswer, isCorrect) {
        try {
            if (!window.StatsDB) return;

            // 복습 결과를 새로운 시도로 기록
            await StatsDB.saveAttempt({
                questionId: wrongAnswer.questionId,
                workbookId: wrongAnswer.workbookId,
                concepts: wrongAnswer.concepts,
                questionType: wrongAnswer.questionType,
                difficulty: wrongAnswer.difficulty,
                isCorrect: isCorrect,
                usedHint: false,
                hintLevel: 0,
                timeSpent: 0,
                question: wrongAnswer.question,
                userAnswer: isCorrect ? wrongAnswer.correctAnswer : wrongAnswer.userAnswer,
                correctAnswer: wrongAnswer.correctAnswer
            });

            console.log(`[복습 기록] ${wrongAnswer.question.substring(0, 30)}... - ${isCorrect ? '정답' : '오답'}`);
        } catch (error) {
            console.error('복습 통계 기록 실패:', error);
        }
    }
};

// 초기화
WrongAnswerDB.init().catch(err => console.error('WrongAnswerDB 초기화 실패:', err));
