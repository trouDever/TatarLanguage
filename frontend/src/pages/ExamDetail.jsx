import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ExamDetail.css';

// Реальные данные вопросов из файла
const questionsData = {
  1: [ // A1
    {
      id: 1,
      type: 'multiple',
      question: 'Найди правильные окончания для слова «китап» (книгу):',
      options: ['китапны', 'китапта', 'китаплар', 'китапсыз'],
      correct: [0, 1, 3],
      image: null
    },
    {
      id: 2,
      type: 'multiple',
      question: 'Отметь татарские слова, означающие «еда»:',
      options: ['аш', 'ризык', 'су', 'китап'],
      correct: [0, 1],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Какая из этих фраз означает приветствие?',
      options: ['Исәнмесез', 'Сау бул', 'Рәхмәт', 'Әйе'],
      correct: [0],
      image: null
    },
    {
      id: 4,
      type: 'single',
      question: '«Мин алма ашыйм» — что делает говорящий?',
      options: ['Ест яблоко', 'Читает книгу', 'Готовит обед', 'Пишет письмо'],
      correct: [0],
      image: null
    },
    {
      id: 5,
      type: 'multiple',
      question: 'Что из этого — цвета?',
      options: ['зәңгәр', 'кызыл', 'аш', 'китап'],
      correct: [0, 1],
      image: null
    },
    {
      id: 6,
      type: 'single',
      question: 'Выбери правильный перевод: «Мин татарча сөйләшәм».',
      options: ['Я говорю по-татарски', 'Я учу татарский', 'Я пишу на татарском', 'Я читаю по-татарски'],
      correct: [0],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'Как переводится слово «әни»?',
      options: ['Отец', 'Мама', 'Брат', 'Дочка'],
      correct: [1],
      image: null
    },
    {
      id: 8,
      type: 'multiple',
      question: 'Что из этого — местоимения?',
      options: ['мин', 'син', 'мәктәп', 'китап'],
      correct: [0, 1],
      image: null
    },
    {
      id: 9,
      type: 'single',
      question: 'Выберите перевод слова «рәхмәт»:',
      options: ['Пожалуйста', 'Спасибо', 'Доброе утро', 'До свидания'],
      correct: [1],
      image: null
    },
    {
      id: 10,
      type: 'single',
      question: 'Что изображено на картинке?',
      options: ['Сыер', 'Тавык', 'Эт', 'Ат'],
      correct: [1],
      image: 'https://via.placeholder.com/300x200/F24539/white?text=Курица'
    }
  ],
  2: [ // A2
    {
      id: 1,
      type: 'single',
      question: 'Бу нәрсә?',
      options: ['Сөт', 'Йомырка', 'Ипи', 'Су'],
      correct: [2],
      image: 'https://via.placeholder.com/300x200/7D5079/white?text=Хлеб'
    },
    {
      id: 2,
      type: 'single',
      question: 'Какой правильный перевод предложения? «Мин китап укыйм.»',
      options: ['Я читаю газету', 'Я читаю книгу', 'Я пишу книгу', 'Я покупаю книгу'],
      correct: [1],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Выберите правильный вариант окончания слова: «Мин мәктәп___ барам.»',
      options: ['–да', '–кә', '–ны', '–тан'],
      correct: [1],
      image: null
    },
    {
      id: 4,
      type: 'single',
      question: 'Что изображено на картинке?',
      options: ['Календарь', 'Сәгать (часы)', 'Китап', 'Машина'],
      correct: [1],
      image: 'https://via.placeholder.com/300x200/1059B2/white?text=Часы'
    },
    {
      id: 5,
      type: 'multiple',
      question: 'Сколько правильных ответов? Выберите все верные варианты перевода слова «йокы»:',
      options: ['сон', 'отдых', 'еда', 'работа'],
      correct: [0, 1],
      image: null
    },
    {
      id: 6,
      type: 'single',
      question: 'Выберите правильный вариант ответа: «Бу китап ___ кызыклы.»',
      options: ['бик', 'гади', 'начар', 'зур'],
      correct: [0],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'Как правильно сказать по-татарски: «Я хочу пить»?',
      options: ['Мин ашыйм', 'Мин эчәсе килә', 'Мин барам', 'Мин йоклыйм'],
      correct: [1],
      image: null
    },
    {
      id: 8,
      type: 'multiple',
      question: 'Отметьте правильные формы глагола «бар» (идти) в настоящем времени:',
      options: ['мин барам', 'син барасың', 'мин бармыйм', 'сез барлар'],
      correct: [0, 1],
      image: null
    },
    {
      id: 9,
      type: 'single',
      question: 'Что изображено на картинке?',
      options: ['Кояш', 'Ай', 'Яңгыр', 'Кар'],
      correct: [0],
      image: 'https://via.placeholder.com/300x200/F59E0B/white?text=Солнце'
    },
    {
      id: 10,
      type: 'multiple',
      question: 'Выберите правильные переводы слова «тиңдәш»:',
      options: ['ровный', 'равный', 'высокий', 'быстрый'],
      correct: [0, 1],
      image: null
    }
  ],
  3: [ // B1
    {
      id: 1,
      type: 'single',
      question: 'Выберите правильный перевод предложения: «Мин быел җәйге ялга барырга планлаштырам.»',
      options: [
        'В этом году я планирую поехать в летний отпуск.',
        'В этом году я уже уехал в отпуск.',
        'В этом году я не люблю лето.',
        'Я боюсь летнего отдыха.'
      ],
      correct: [0],
      image: null
    },
    {
      id: 2,
      type: 'single',
      question: 'Какое слово является синонимом слова «яхшы»?',
      options: ['авыр', 'әйбәт', 'начар', 'тиз'],
      correct: [1],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Выберите правильный вариант: «Әнием миңа һәрвакыт ярдәм ____.»',
      options: ['итте', 'итә', 'итә', 'итәчәк'],
      correct: [1],
      image: null
    },
    {
      id: 4,
      type: 'single',
      question: 'Что означает выражение «башыма авыр»?',
      options: [
        'Мне больно в голове',
        'Я устал',
        'У меня проблемы или трудности',
        'Я хочу спать'
      ],
      correct: [2],
      image: null
    },
    {
      id: 5,
      type: 'single',
      question: 'Выберите правильный вариант перевода: «Ул иртә белән йөгерергә чыкты, ләкин яңгыр ява башлады.»',
      options: [
        'Он вышел бегать утром, но начался дождь.',
        'Он спал утром из-за дождя.',
        'Он любит дождь и бегает вечером.',
        'Он не любит бегать утром.'
      ],
      correct: [0],
      image: null
    },
    {
      id: 6,
      type: 'multiple',
      question: 'Отметьте все правильные варианты перевода слова «хәрәкәт»:',
      options: ['движение', 'активность', 'покой', 'отдых'],
      correct: [0, 1],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'Как перевести предложение: «Әнием миңа татарча китаплар бирде.»',
      options: [
        'Моя мама дала мне книги на татарском языке.',
        'Моя мама читает мне книги.',
        'Моя мама купила книгу.',
        'Моя мама учит меня.'
      ],
      correct: [0],
      image: null
    }
  ],
  4: [ // B2
    {
      id: 1,
      type: 'single',
      question: 'Что означает выражение «башын югалту»?',
      options: [
        'терять голову (волноваться, паниковать)',
        'расслабляться',
        'отдыхать',
        'думать'
      ],
      correct: [0],
      image: null
    },
    {
      id: 2,
      type: 'single',
      question: 'Какое слово означает «опыт»?',
      options: ['тәҗрибә', 'уңыш', 'тырышлык', 'ярдәм'],
      correct: [0],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Что значит слово «аралашу»?',
      options: ['отдых', 'общение', 'работа', 'учеба'],
      correct: [1],
      image: null
    },
    {
      id: 4,
      type: 'single',
      question: 'Что значит слово «сабырлык»?',
      options: ['торопливость', 'терпение', 'гнев', 'страх'],
      correct: [1],
      image: null
    },
    {
      id: 5,
      type: 'single',
      question: 'Выберите правильный синоним к слову «тәнәфес»:',
      options: ['эш', 'ял', 'туганлык', 'сөйләшү'],
      correct: [1],
      image: null
    },
    {
      id: 6,
      type: 'single',
      question: 'Выберите правильный вариант глагола в прошедшем времени: «Без кичә ___ (бару) базарга.»',
      options: ['барырбыз', 'барабыз', 'бардык', 'барыр'],
      correct: [2],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'Что означает слово «хәтер»?',
      options: ['забывать', 'память', 'учиться', 'слышать'],
      correct: [1],
      image: null
    },
    {
      id: 8,
      type: 'single',
      question: 'Выберите правильное значение слова «язмыш»:',
      options: ['случай', 'судьба', 'ошибка', 'время'],
      correct: [1],
      image: null
    },
    {
      id: 9,
      type: 'single',
      question: 'Какой предлог правильно использовать в предложении? «Мин китапны өстәл ___ куйдым.»',
      options: ['эчендә', 'өстендә', 'өстендә', 'артында'],
      correct: [1],
      image: null
    },
    {
      id: 10,
      type: 'single',
      question: 'Какой глагол стоит в будущем времени?',
      options: ['бардым', 'барам', 'барачакмын', 'бара'],
      correct: [2],
      image: null
    }
  ],
  5: [ // C1
    {
      id: 1,
      type: 'single',
      question: 'Что изображено на картинке?',
      options: ['Гармун', 'Домбра', 'Курай', 'Саксофон'],
      correct: [2],
      image: 'https://via.placeholder.com/300x200/8B5CF6/white?text=Курай'
    },
    {
      id: 2,
      type: 'single',
      question: 'Выберите правильный перевод пословицы: «Ишек ачылса, ияр»',
      options: [
        'Если дверь открыта, заходи.',
        'Если есть возможность, воспользуйся ей.',
        'Не надо входить без приглашения.',
        'Закрой дверь, чтобы не заходили.'
      ],
      correct: [1],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Выберите правильное слово к изображению:',
      options: ['Кыстыбый', 'Чәк-чәк', 'Бәлиш', 'Плов'],
      correct: [0],
      image: 'https://via.placeholder.com/300x200/EC4899/white?text=Кыстыбый'
    },
    {
      id: 4,
      type: 'single',
      question: 'Что означает выражение «башы өстендә»?',
      options: ['под контролем', 'под контролем, под надзором', 'неважно', 'далеко'],
      correct: [1],
      image: null
    },
    {
      id: 5,
      type: 'single',
      question: 'Какой синоним подходит к слову «тәэсирле»?',
      options: ['вак', 'йогынтылы', 'күңелсез', 'авыр'],
      correct: [1],
      image: null
    },
    {
      id: 6,
      type: 'single',
      question: 'Выберите правильную форму деепричастия от глагола «аңлау» (понимать):',
      options: ['аңлап', 'аңлап', 'аңлаган', 'аңлами'],
      correct: [0],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'Что означает идиома «утка карап сугарга»?',
      options: [
        'торопиться',
        'действовать осторожно',
        'рисковать, идти на опасный шаг',
        'отдыхать'
      ],
      correct: [2],
      image: null
    },
    {
      id: 8,
      type: 'single',
      question: 'Выберите правильный вариант перевода: «Несмотря на трудности, он не отступил и продолжил борьбу.»',
      options: [
        'Кыенлыкларга карамастан, ул кире чигенде һәм көрәшне дәвам иттерде.',
        'Кыенлыкларга карамастан, ул бирешмәде һәм көрәшне дәвам итте.',
        'Кыенлыклар аркасында, ул тукталды һәм көрәшне ташлады.',
        'Кыенлыклар булса да, ул көрәшне туктатты.'
      ],
      correct: [1],
      image: null
    },
    {
      id: 9,
      type: 'single',
      question: 'Что изображено на картинке?',
      options: ['Камзол', 'Калфак', 'Түбәтәй', 'Шарф'],
      correct: [1],
      image: 'https://via.placeholder.com/300x200/10B981/white?text=Калфак'
    },
    {
      id: 10,
      type: 'multiple',
      question: 'Какие из этих выражений описывают эмоции страха или волнения?',
      options: ['Йөрәге туктап калу', 'Башы әйләнү', 'Күңел күтәрү', 'Көлү'],
      correct: [0, 1],
      image: null
    }
  ],
  6: [ // C2
    {
      id: 1,
      type: 'single',
      question: 'Выберите правильный перевод: «Его аргументы были настолько убедительны, что никто не осмелился возразить.»',
      options: [
        'Аның дәлилләре бик көчле иде, ләкин кем дә булса каршы чыкты.',
        'Аның дәлилләре шулкадәр ышандырырлык иде, кем дә булса каршы чыга алмады.',
        'Аның дәлилләре көчсез иде, һәм кешеләр каршы чыкты.',
        'Аның дәлилләре аңлашылмый торган иде, шуңа каршы чыкмадылар.'
      ],
      correct: [1],
      image: null
    },
    {
      id: 2,
      type: 'single',
      question: 'Выберите правильное объяснение фразеологизма «кыл янында» в контексте: «Ул һәрчак кыл янында йөри.»',
      options: [
        'Куркынычсыз хәлдә булу',
        'Тынычлыкта булу',
        'Куркыныч астында булу, хәвефтә булу',
        'Ирекле һәм бәхетле булу'
      ],
      correct: [2],
      image: null
    },
    {
      id: 3,
      type: 'single',
      question: 'Заполните пропуск в сложном предложении: «___ сөйләшүләрдә катнашкан кешеләрнең фикерләре бик төрле иде.»',
      options: ['Бу', 'Әлеге', 'Шул', 'Бер'],
      correct: [1],
      image: null
    },
    {
      id: 4,
      type: 'multiple',
      question: 'Выберите все правильные значения слова «сүз йөртү»:',
      options: ['сплетничать', 'распространять слухи', 'разговаривать', 'говорить официально'],
      correct: [0, 1],
      image: null
    },
    {
      id: 5,
      type: 'single',
      question: 'Выберите правильную форму деепричастия для глагола «килергә» (приходить):',
      options: ['килеп', 'килеп', 'килереп', 'килү'],
      correct: [0],
      image: null
    },
    {
      id: 6,
      type: 'single',
      question: 'Какое из предложений корректно с точки зрения употребления падежей?',
      options: [
        'Мин сезгә китапны бирдем.',
        'Мин сезгә китап бирдем.',
        'Мин сезгә китап бирдемне.',
        'Мин сезгә китапны бирдемне.'
      ],
      correct: [1],
      image: null
    },
    {
      id: 7,
      type: 'single',
      question: 'На картинке показана страница из старинной книги, написанной на классическом татарском языке. Как называется стиль литературного языка, характерный для таких текстов?',
      options: ['Халык теле', 'Әдәби тел', 'Гади сөйләм', 'Журналистика'],
      correct: [1],
      image: 'https://via.placeholder.com/300x200/3B82F6/white?text=Старинная+книга'
    },
    {
      id: 8,
      type: 'single',
      question: 'Выберите верное объяснение выражения «көчле җил»:',
      options: [
        'Крепкий, сильный ветер',
        'Тихий ветерок',
        'Шум дождя',
        'Солнечный свет'
      ],
      correct: [0],
      image: null
    },
    {
      id: 9,
      type: 'single',
      question: 'Что означает выражение «сыерчык кайтып килә» в татарской деревне?',
      options: [
        'Весна наступила',
        'Весна пришла, пора работы в поле',
        'Птицы улетели',
        'Начинается зима'
      ],
      correct: [1],
      image: null
    },
    {
      id: 10,
      type: 'single',
      question: 'Что означает выражение «балага сүз әйтү»?',
      options: [
        'Рассказывать сказку',
        'Делать замечание, ругать ребёнка',
        'Играть с ребёнком',
        'Учить ребёнка'
      ],
      correct: [1],
      image: null
    }
  ]
};

export default function ExamDetail() {
  const { id } = useParams();
  const { access } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 минут
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/exam/${id}`, {
          headers: { 'Authorization': `Bearer ${access}` },
        });
        if (!response.ok) throw new Error('Ошибка загрузки теста');
        const data = await response.json();
        setExam(data);
        
        // Используем реальные вопросы вместо API
        const realQuestions = questionsData[data.level] || questionsData[1];
        setQuestions(realQuestions);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, access]);

  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, selectedAnswers) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const handleOptionClick = (questionId, optionIndex) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    if (question.type === 'single') {
      handleAnswerChange(questionId, [optionIndex]);
    } else {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(i => i !== optionIndex)
        : [...currentAnswers, optionIndex];
      handleAnswerChange(questionId, newAnswers);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const answeredCount = Object.keys(answers).length;
    
    // Навигация к результатам
    navigate('/exam-result', { 
      state: { 
        score, 
        exam,
        totalQuestions: questions.length,
        answeredQuestions: answeredCount,
        answers: answers,
        questions: questions
      } 
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correct;
      
      if (JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort())) {
        correct++;
      }
    });
    
    return Math.round((correct / questions.length) * 100);
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const handleExitExam = () => {
    if (window.confirm('Вы уверены, что хотите выйти из теста? Прогресс будет потерян.')) {
      navigate('/exams');
    }
  };

  if (loading) return <div className="exam-loading">Загрузка теста...</div>;
  if (error) return <div className="exam-error">{error}</div>;
  if (!exam || !questions.length) return <div className="exam-error">Тест не найден</div>;

  const currentQ = questions[currentQuestion];

  return (
    <div className="modern-exam-test">
      <div className="modern-exam-header">
        <div className="modern-exam-info">
          <div className="modern-exam-meta">
            <button className="modern-exit-btn" onClick={handleExitExam}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Выйти
            </button>
            <h1 className="modern-exam-title">{exam.title}</h1>
          </div>
          <div className="modern-exam-progress">
            <div className="progress-info">
              <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
              <span>Отвечено: {getAnsweredCount()}/{questions.length}</span>
            </div>
            <div className="modern-progress-bar">
              <div 
                className="modern-progress-fill" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="modern-exam-timer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="modern-exam-content">
        <div className="modern-question-card">
          <div className="modern-question-header">
            <div className="modern-question-meta">
              <span className="modern-question-number">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              <span className="modern-question-type">
                {currentQ.type === 'single' ? 'Выберите один правильный ответ' : 'Выберите все правильные ответы'}
              </span>
            </div>
          </div>

          <div className="modern-question-content">
            <h2 className="modern-question-text">{currentQ.question}</h2>
            
            {currentQ.image && (
              <div className="modern-question-image">
                <img src={currentQ.image} alt="Вопрос" loading="lazy" />
              </div>
            )}

            <div className="modern-options-list">
              {currentQ.options.map((option, index) => {
                const isSelected = (answers[currentQ.id] || []).includes(index);
                return (
                  <button
                    key={index}
                    className={`modern-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(currentQ.id, index)}
                  >
                    <div className="modern-option-indicator">
                      {currentQ.type === 'single' ? (
                        <div className="modern-radio">
                          {isSelected && <div className="modern-radio-dot" />}
                        </div>
                      ) : (
                        <div className="modern-checkbox">
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="modern-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            {(answers[currentQ.id] || []).length > 0 && (
              <div className="modern-answer-status">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>
                  {currentQ.type === 'single' 
                    ? 'Ответ выбран' 
                    : `Выбрано ответов: ${(answers[currentQ.id] || []).length}`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modern-exam-navigation">
        <button 
          className="modern-nav-btn modern-nav-btn--secondary"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Назад
        </button>

        <div className="modern-question-indicators">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`modern-question-indicator ${
                index === currentQuestion ? 'active' : ''
              } ${
                answers[questions[index].id] ? 'answered' : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
              title={`Вопрос ${index + 1}${answers[questions[index].id] ? ' (отвечен)' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button 
            className="modern-nav-btn modern-nav-btn--primary modern-submit-btn"
            onClick={() => setShowConfirmDialog(true)}
          >
            Завершить тест
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </button>
        ) : (
          <button 
            className="modern-nav-btn modern-nav-btn--primary"
            onClick={nextQuestion}
          >
            Далее
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}
      </div>

      {showConfirmDialog && (
        <div className="modern-confirm-dialog">
          <div className="dialog-backdrop" onClick={() => setShowConfirmDialog(false)}></div>
          <div className="dialog-content">
            <h3>Завершить тест?</h3>
            <p>Вы ответили на {getAnsweredCount()} из {questions.length} вопросов.</p>
            <p>После завершения вы не сможете вернуться к тесту.</p>
            <div className="dialog-buttons">
              <button 
                className="modern-nav-btn modern-nav-btn--secondary"
                onClick={() => setShowConfirmDialog(false)}
              >
                Отмена
              </button>
              <button 
                className="modern-nav-btn modern-nav-btn--primary"
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleSubmit();
                }}
              >
                Завершить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
