/**
 * 학습 통계 시스템 - 데이터 저장 및 계산 엔진
 * IndexedDB를 사용하여 로컬에 학습 데이터를 저장하고 통계를 계산합니다.
 */

const StatsDB = {
    dbName: 'StudyStats',
    version: 1,
    storeName: 'attempts',
    db: null,

    /**
     * IndexedDB 초기화
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
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'attemptId' });
                    store.createIndex('attemptedAt', 'attemptedAt', { unique: false });
                    store.createIndex('questionId', 'questionId', { unique: false });
                    store.createIndex('workbookId', 'workbookId', { unique: false });
                    store.createIndex('concepts', 'concepts', { unique: false, multiEntry: true });
                }
            };
        });
    },

    /**
     * 학습 기록 저장
     * @param {Object} attemptData - 풀이 데이터
     */
    async saveAttempt(attemptData) {
        if (!this.db) await this.init();

        const attempt = {
            attemptId: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questionId: attemptData.questionId || `q_${Date.now()}`,
            workbookId: attemptData.workbookId || 'default',
            concepts: attemptData.concepts || [],
            questionType: attemptData.questionType || 'multiple_choice',
            difficulty: attemptData.difficulty || 'medium',
            isCorrect: attemptData.isCorrect,
            usedHint: attemptData.usedHint || false,
            hintLevel: attemptData.hintLevel || 0,
            timeSpent: attemptData.timeSpent || 0, // 초 단위
            attemptedAt: new Date().toISOString(),
            question: attemptData.question || '',
            userAnswer: attemptData.userAnswer || '',
            correctAnswer: attemptData.correctAnswer || ''
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(attempt);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(attempt.attemptId);
        });
    },

    /**
     * 모든 학습 기록 조회
     */
    async getAllAttempts() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    /**
     * 날짜 범위로 학습 기록 조회
     */
    async getAttemptsByDateRange(startDate, endDate) {
        if (!this.db) await this.init();

        const attempts = await this.getAllAttempts();
        return attempts.filter(attempt => {
            const date = new Date(attempt.attemptedAt);
            return date >= startDate && date <= endDate;
        });
    },

    /**
     * 개념별 학습 기록 조회
     */
    async getAttemptsByConcept(concept) {
        if (!this.db) await this.init();

        const attempts = await this.getAllAttempts();
        return attempts.filter(attempt => attempt.concepts.includes(concept));
    },

    /**
     * 데이터 초기화 (테스트용)
     */
    async clearAll() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
};

/**
 * 통계 계산 엔진
 */
const StatsCalculator = {
    /**
     * 전체 정답률 계산
     */
    calculateOverallAccuracy(attempts) {
        if (attempts.length === 0) return 0;
        const correctCount = attempts.filter(a => a.isCorrect).length;
        return Math.round((correctCount / attempts.length) * 100);
    },

    /**
     * 날짜별 정답률 계산
     */
    calculateDailyAccuracy(attempts) {
        const grouped = {};

        attempts.forEach(attempt => {
            const date = new Date(attempt.attemptedAt).toLocaleDateString('ko-KR');
            if (!grouped[date]) {
                grouped[date] = { correct: 0, total: 0 };
            }
            grouped[date].total++;
            if (attempt.isCorrect) grouped[date].correct++;
        });

        return Object.keys(grouped)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => ({
                date,
                accuracy: Math.round((grouped[date].correct / grouped[date].total) * 100),
                correct: grouped[date].correct,
                total: grouped[date].total
            }));
    },

    /**
     * 문제 유형별 정답률 계산
     */
    calculateTypeAccuracy(attempts) {
        const types = {
            'multiple_choice': { correct: 0, total: 0, label: '객관식' },
            'short_answer': { correct: 0, total: 0, label: '단답형' },
            'essay': { correct: 0, total: 0, label: '서술형' },
            'calculation': { correct: 0, total: 0, label: '계산형' }
        };

        attempts.forEach(attempt => {
            const type = attempt.questionType;
            if (types[type]) {
                types[type].total++;
                if (attempt.isCorrect) types[type].correct++;
            }
        });

        return Object.keys(types)
            .filter(type => types[type].total > 0)
            .map(type => ({
                type,
                label: types[type].label,
                accuracy: Math.round((types[type].correct / types[type].total) * 100),
                correct: types[type].correct,
                total: types[type].total
            }))
            .sort((a, b) => b.accuracy - a.accuracy);
    },

    /**
     * 난이도별 정답률 계산
     */
    calculateDifficultyAccuracy(attempts) {
        const difficulties = {
            'easy': { correct: 0, total: 0, label: '하' },
            'medium': { correct: 0, total: 0, label: '중' },
            'hard': { correct: 0, total: 0, label: '상' }
        };

        attempts.forEach(attempt => {
            const diff = attempt.difficulty;
            if (difficulties[diff]) {
                difficulties[diff].total++;
                if (attempt.isCorrect) difficulties[diff].correct++;
            }
        });

        return Object.keys(difficulties)
            .filter(diff => difficulties[diff].total > 0)
            .map(diff => ({
                difficulty: diff,
                label: difficulties[diff].label,
                accuracy: Math.round((difficulties[diff].correct / difficulties[diff].total) * 100),
                correct: difficulties[diff].correct,
                total: difficulties[diff].total
            }));
    },

    /**
     * 개념별 정답률 계산
     */
    calculateConceptAccuracy(attempts) {
        const concepts = {};

        attempts.forEach(attempt => {
            attempt.concepts.forEach(concept => {
                if (!concepts[concept]) {
                    concepts[concept] = { correct: 0, total: 0 };
                }
                concepts[concept].total++;
                if (attempt.isCorrect) concepts[concept].correct++;
            });
        });

        return Object.keys(concepts)
            .filter(concept => concepts[concept].total >= 3) // 최소 3문제 이상
            .map(concept => ({
                concept,
                accuracy: Math.round((concepts[concept].correct / concepts[concept].total) * 100),
                correct: concepts[concept].correct,
                total: concepts[concept].total
            }))
            .sort((a, b) => a.accuracy - b.accuracy);
    },

    /**
     * 취약 개념 분류
     */
    getWeakConcepts(attempts, topN = 5) {
        const conceptAccuracy = this.calculateConceptAccuracy(attempts);

        const weakConcepts = conceptAccuracy
            .filter(item => item.accuracy < 80) // 80% 미만
            .map(item => {
                let level = '숙달';
                if (item.accuracy < 60) level = '매우 취약';
                else if (item.accuracy < 70) level = '취약';
                else if (item.accuracy < 80) level = '보통';

                return { ...item, weakLevel: level };
            })
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, topN);

        return weakConcepts;
    },

    /**
     * 평균 풀이 시간 계산
     */
    calculateAverageTime(attempts) {
        if (attempts.length === 0) return 0;
        const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
        return Math.round(totalTime / attempts.length);
    },

    /**
     * 최근 N문제 정답률 계산
     */
    calculateRecentAccuracy(attempts, n = 20) {
        const recent = attempts.slice(-n);
        return this.calculateOverallAccuracy(recent);
    },

    /**
     * 연속 학습일 계산
     */
    calculateStudyStreak(attempts) {
        if (attempts.length === 0) return 0;

        const dates = [...new Set(attempts.map(a => new Date(a.attemptedAt).toLocaleDateString()))];
        dates.sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        let currentDate = new Date();

        for (const date of dates) {
            const attemptDate = new Date(date);
            const dayDiff = Math.floor((currentDate - attemptDate) / (1000 * 60 * 60 * 24));

            if (dayDiff === streak) {
                streak++;
                currentDate = attemptDate;
            } else {
                break;
            }
        }

        return streak;
    },

    /**
     * 최근 7일 풀이 수 계산
     */
    calculateLastWeekAttempts(attempts) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return attempts.filter(a => new Date(a.attemptedAt) >= sevenDaysAgo).length;
    },

    /**
     * 학습 성취도 계산 (0~100)
     */
    calculateAchievementScore(attempts) {
        if (attempts.length === 0) return 0;

        const accuracyScore = this.calculateOverallAccuracy(attempts); // 0~100
        const volumeScore = Math.min(attempts.length * 2, 100); // 풀이량 (50문제 이상 100점)
        const recentScore = this.calculateRecentAccuracy(attempts, 20); // 최근 20문제 정답률
        const streakScore = Math.min(this.calculateStudyStreak(attempts) * 10, 100); // 연속학습일

        // 가중치 적용
        const achievement = Math.round(
            accuracyScore * 0.4 + // 정답률 40%
            volumeScore * 0.2 +   // 풀이량 20%
            recentScore * 0.25 +  // 최근 성과 25%
            streakScore * 0.15    // 연속성 15%
        );

        return Math.min(achievement, 100);
    },

    /**
     * 개념 숙련도 추이 계산
     */
    calculateConceptProgress(attempts, concept) {
        const conceptAttempts = attempts.filter(a => a.concepts.includes(concept));
        
        // 시간순 정렬
        conceptAttempts.sort((a, b) => new Date(a.attemptedAt) - new Date(b.attemptedAt));

        // 5개 문제씩 그룹화
        const groups = [];
        for (let i = 0; i < conceptAttempts.length; i += 5) {
            const group = conceptAttempts.slice(i, i + 5);
            const accuracy = Math.round(
                (group.filter(a => a.isCorrect).length / group.length) * 100
            );
            groups.push({
                stage: Math.floor(i / 5) + 1,
                accuracy,
                count: group.length
            });
        }

        return groups;
    },

    /**
     * 최근 오답 조회
     */
    getRecentWrongAnswers(attempts, limit = 5) {
        return attempts
            .filter(a => !a.isCorrect)
            .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))
            .slice(0, limit)
            .map(a => ({
                question: a.question,
                userAnswer: a.userAnswer,
                correctAnswer: a.correctAnswer,
                concepts: a.concepts,
                difficulty: a.difficulty,
                attemptedAt: a.attemptedAt
            }));
    },

    /**
     * 학습 요약 문장 생성
     */
    generateStudySummary(attempts) {
        if (attempts.length === 0) return '아직 풀이한 문제가 없습니다.';

        const overall = this.calculateOverallAccuracy(attempts);
        const recent = this.calculateRecentAccuracy(attempts, 20);
        const typeStats = this.calculateTypeAccuracy(attempts);
        const diffStats = this.calculateDifficultyAccuracy(attempts);
        const weakConcepts = this.getWeakConcepts(attempts, 1);
        const lastWeek = this.calculateLastWeekAttempts(attempts);
        const streak = this.calculateStudyStreak(attempts);

        let summary = '';

        // 기본 통계
        summary += `총 ${attempts.length}개 문제 중 ${overall}% 정답 | `;

        // 최근 성과
        if (attempts.length >= 20) {
            const diff = recent - overall;
            if (diff > 0) {
                summary += `최근 20문제에서 ${recent}%로 ${diff}% 상승했습니다. | `;
            } else if (diff < 0) {
                summary += `최근 20문제에서 ${recent}%로 ${Math.abs(diff)}% 하락했습니다. | `;
            }
        }

        // 가장 약한 유형
        if (typeStats.length > 0) {
            const lowestType = typeStats[typeStats.length - 1];
            summary += `${lowestType.label}(${lowestType.accuracy}%)가 가장 취약합니다. | `;
        }

        // 난이도별
        const hardStats = diffStats.find(d => d.difficulty === 'hard');
        if (hardStats) {
            summary += `상 난이도는 ${hardStats.accuracy}%입니다. | `;
        }

        // 취약 개념
        if (weakConcepts.length > 0) {
            summary += `"${weakConcepts[0].concept}"(${weakConcepts[0].accuracy}%)를 중점 학습하세요. | `;
        }

        // 학습 활동도
        summary += `지난주 ${lastWeek}문제, 연속 ${streak}일 학습 중입니다.`;

        return summary;
    }
};

// 초기화
StatsDB.init().catch(err => console.error('StatsDB 초기화 실패:', err));
