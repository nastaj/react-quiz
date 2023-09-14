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
import { useQuiz } from "../contexts/QuizContext";

export default function App() {
  const { status, currentQuestionSet, index } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {(status === "active" || status === "history") && (
          <>
            <Progress />
            <Question question={currentQuestionSet[index]} />
            <Footer>
              {status !== "history" && <Timer />}
              {status === "history" && <PrevButton />}
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}
