import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import PrevButton from "./PrevButton";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  currentQuestionSet: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answers: [],
  points: 0,
  highscore: 0,
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
      const newAnswer = state.answers.map((answer, i) => {
        return i === state.index ? action.payload : answer;
      });

      return {
        ...state,
        answers: newAnswer,
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

export default function App() {
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
    fetch("http://127.0.0.1:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
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

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
          />
        )}
        {(status === "active" || status === "history") && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answers={answers}
            />
            <Question
              question={currentQuestionSet[index]}
              dispatch={dispatch}
              answers={answers}
              index={index}
            />
            <Footer>
              {status !== "history" && (
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
              )}
              {status === "history" && (
                <PrevButton dispatch={dispatch} index={index} />
              )}
              <NextButton
                dispatch={dispatch}
                answers={answers}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
