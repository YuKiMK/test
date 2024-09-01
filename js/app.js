const app = Vue.createApp({
    data() {
        return {
            loggedIn: false,
            name: '',
            roomNumber: '',
            quizCompleted: false,
            currentQuestionIndex: 0,
            currentAnswer: '',
            score: 0,
            answers: [],
            selectedLanguage: 'ja',
            answered: false,  // 現在の問題に回答したかどうか
            feedback: '',
            textsData: {
                ja: {
                    welcome: 'ようこそ！',
                    loginButton: 'ログイン',
                    roomNumberPlaceholder: 'ルームナンバーを入力してください',
                    namePlaceholder: 'お名前を入力してください',
                    quizTitle: 'クイズを開始します',
                    submitButton: '回答',
                    nextButton: '次へ',
                    showResultsButton: '結果を見る',
                    correct: '正解！',
                    incorrect: '不正解！',
                    explanation: '解説',
                    resultsTitle: '結果',
                    yourScore: 'あなたのスコア',
                    questionLabel: '質問',
                    yourAnswer: 'あなたの回答',
                    correctAnswer: '正解'
                },
                en: {
                    welcome: 'Welcome!',
                    loginButton: 'Login',
                    roomNumberPlaceholder: 'Enter your room number',
                    namePlaceholder: 'Enter your name',
                    quizTitle: 'Start the Quiz',
                    submitButton: 'Submit Answer',
                    nextButton: 'Next',
                    showResultsButton: 'Show Results',
                    correct: 'Correct!',
                    incorrect: 'Incorrect!',
                    explanation: 'Explanation',
                    resultsTitle: 'Results',
                    yourScore: 'Your Score',
                    questionLabel: 'Question',
                    yourAnswer: 'Your Answer',
                    correctAnswer: 'Correct Answer'
                },
                zh: {
                    welcome: '欢迎！',
                    loginButton: '登录',
                    roomNumberPlaceholder: '请输入您的房间号',
                    namePlaceholder: '请输入您的名字',
                    quizTitle: '开始测试',
                    submitButton: '提交答案',
                    nextButton: '下一个',
                    showResultsButton: '查看结果',
                    correct: '正确！',
                    incorrect: '错误！',
                    explanation: '解释',
                    resultsTitle: '结果',
                    yourScore: '你的得分',
                    questionLabel: '问题',
                    yourAnswer: '你的回答',
                    correctAnswer: '正确答案'
                }
            },
            texts: {},
            questions: [
                {
                    text: '淡島ホテルが開業したのはいつでしょう。',
                    options: ['1991年(平成3年)', '1995年(平成7年)', '1987年(昭和62年)', '2000年(平成12年)'],
                    correct: '1991年(平成3年)',
                    explanation: '淡島ホテルは1991年(平成3年)に開業しました。'
                },
                {
                    text: '淡島ホテルは静岡県のどこの地区に属すでしょう',
                    options: ['熱海市', '三島市', '沼津市内浦地区', '浜松市'],
                    correct: '沼津市内浦地区',
                    explanation: '淡島ホテルは静岡県沼津市内浦地区に属しています。'
                },
                {
                    text: '淡島ホテルの蛇口からでる水はある湧水群の水です。それはどこでしょう',
                    options: ['柿田川湧水', '富士山湧水', '箱根湧水', '井川湧水'],
                    correct: '柿田川湧水',
                    explanation: '淡島ホテルの蛇口からでる水は、柿田川湧水の水です。'
                },
                {
                    text: '淡島ホテルはあるものをテーマにしています。それは何でしょう。',
                    options: ['スポーツ', '食文化', '芸術と音楽', '歴史と伝統'],
                    correct: '芸術と音楽',
                    explanation: '淡島ホテルは芸術と音楽をテーマにしています。'
                },
                {
                    text: '淡島ホテルは何階建でしょう。',
                    options: ['5階建', '6階建', '7階建', '8階建'],
                    correct: '7階建',
                    explanation: '淡島ホテルは7階建てです。'
                },
                {
                    text: '淡島ホテルの庭にあるこの芸術作品はある日本の芸術家の作品です。その芸術家は誰でしょうか？',
                    image: 'assets/yasuda_art.jpg',  // 画像のパスを追加
                    options: ['草間彌生', '安田侃', '村上隆', '横尾忠則'],
                    correct: '安田侃',
                    explanation: 'この芸術作品は、日本の芸術家「安田侃」の作品です。'
                }
            ]
        };
    },
    created() {
        this.texts = this.textsData[this.selectedLanguage];
    },
    mounted() {
        this.shuffleQuestions();
        this.shuffleOptions();
        const notes = ['♪', '♫', '♬', '♩', '♭', '♮'];
        const numNotes = 10;
        for (let i = 0; i < numNotes; i++) {
            const note = document.createElement('div');
            note.className = 'music-note';
            note.style.top = `${Math.random() * 80 + 10}vh`; // 画面の上下端に近づきすぎないように調整
            note.style.left = `${Math.random() * 80 + 10}vw`; // 画面の左右端に近づきすぎないように調整
            note.style.fontSize = `${20 + Math.random() * 30}px`;
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.addEventListener('click', () => { // Arrow functionに変更
                note.classList.add('fade-out');
                setTimeout(() => {
                    note.remove();
                    this.reappearNote();  // フェードアウト後に再び音符が現れる
                }, 1000);
            });
            document.body.appendChild(note);
        }
    },
    methods: {
        shuffleQuestions() {
            // Fisher-Yatesアルゴリズムで問題をシャッフル
            for (let i = this.questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
            }
        },
        shuffleOptions() {
            // 各質問の選択肢をシャッフル
            this.questions.forEach(question => {
                for (let i = question.options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
                }
            });
        },
        submitAnswer() {
            this.answered = true;

            // 選択された回答を保存
            this.answers[this.currentQuestionIndex] = this.currentAnswer;

            if (this.currentAnswer === this.currentQuestion.correct) {
                this.score++;
            }
        },
        reappearNote() {
            // 音符が再びランダムにフェードインする
            setTimeout(() => {
                const note = document.createElement('div');
                const notes = ['♪', '♫', '♬', '♩', '♭', '♮'];
                note.className = 'music-note';
                note.style.top = `${Math.random() * 80 + 10}vh`;
                note.style.left = `${Math.random() * 80 + 10}vw`;
                note.style.fontSize = `${20 + Math.random() * 30}px`;
                note.style.opacity = 0;
                note.textContent = notes[Math.floor(Math.random() * notes.length)];
                document.body.appendChild(note);
                setTimeout(() => {
                    note.style.opacity = 0.4;  // フェードイン
                }, 100);
                note.addEventListener('click', () => {
                    note.classList.add('fade-out');
                    setTimeout(() => {
                        note.remove();
                        this.reappearNote();  // 再び音符をフェードイン
                    }, 1000);
                });
            }, 3000);  // 3秒後に音符が再び現れる
        },
        login() {
            if (this.name && this.roomNumber) {
                this.loggedIn = true;
            } else {
                alert(this.texts.roomNumberPlaceholder);
            }
        },
        nextQuestion() {
            this.currentQuestionIndex++;
            this.currentAnswer = '';
            this.answered = false;  // 次の問題に進むため、解答状態をリセット
        },
        showResults() {
            this.quizCompleted = true;
        },
        changeLanguage() {
            this.texts = this.textsData[this.selectedLanguage];
        },
        submitFeedback() {
            const feedbackData = {
                roomNumber: this.roomNumber,
                name: this.name,
                score: this.score,
                feedback: this.feedback
            };
    
            // ここにデータ送信の処理を記述（APIエンドポイントが必要）
            console.log('Feedback submitted:', feedbackData);
            alert('ご意見ありがとうございます！');
        } 
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        }
    }
});

app.mount('#app');
