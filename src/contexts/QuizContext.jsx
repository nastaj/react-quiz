import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  currentQuestionSet: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answers: [],
  points: 0,
  highscore: JSON.parse(localStorage.getItem("highscore")) || null,
  secondsRemaining: null,
  difficulty: "medium",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": {
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    }
    case "dataFailed": {
      return {
        ...state,
        status: "error",
      };
    }
    case "setDifficulty": {
      return {
        ...state,
        difficulty: action.payload,
      };
    }
    case "setCurrentQuestions": {
      return {
        ...state,
        currentQuestionSet: action.payload,
        answers: Array.from({ length: action.payload.length }, () => null),
      };
    }
    case "start": {
      return {
        ...state,
        status: "active",
        secondsRemaining: state.currentQuestionSet.length * SECS_PER_QUESTION,
      };
    }
    case "newAnswer": {
      const question = state.currentQuestionSet.at(state.index);

      return {
        ...state,
        answers: state.answers.map((answer, i) => {
          return i === state.index ? action.payload : answer;
        }),
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion": {
      return {
        ...state,
        index: state.index + 1,
        // answer: state.status === "history" ? state.answer : null,
      };
    }
    case "checkAnswers": {
      return {
        ...state,
        status: "history",
      };
    }
    case "prevQuestion": {
      return {
        ...state,
        index: state.index - 1,
      };
    }
    case "finish": {
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    }
    case "restart": {
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        currentQuestionSet: state.currentQuestionSet,
        highscore: state.highscore,
        answers: Array.from(
          { length: state.currentQuestionSet.length },
          () => null
        ),
      };
    }
    case "tick": {
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    }
    default: {
      throw new Error("Action unknown");
    }
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answers,
      points,
      highscore,
      secondsRemaining,
      currentQuestionSet,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = currentQuestionSet.length;
  const maxPossiblePoints = currentQuestionSet.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("questions.json")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataReceived", payload: data.questions })
      )
      .catch((err) => dispatch({ type: "dataFailed", payload: err }));
  }, []);

  useEffect(
    function () {
      const questionsEasy = questions.filter(
        (question) => question.points === 10
      );
      const questionsMedium = questions.filter(
        (question) => question.points === 20
      );
      const questionsHard = questions.filter(
        (question) => question.points === 30
      );

      difficulty === "easy" &&
        dispatch({ type: "setCurrentQuestions", payload: questionsEasy });
      difficulty === "medium" &&
        dispatch({ type: "setCurrentQuestions", payload: questionsMedium });
      difficulty === "hard" &&
        dispatch({ type: "setCurrentQuestions", payload: questionsHard });
    },
    [questions, difficulty]
  );

  useEffect(
    function () {
      localStorage.setItem("highscore", JSON.stringify(highscore));
    },
    [highscore]
  );

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentQuestionSet,
        status,
        index,
        answers,
        points,
        highscore,
        secondsRemaining,
        difficulty,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("QuizContext was used outside the QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
