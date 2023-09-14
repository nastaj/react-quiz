import { useQuiz } from "../contexts/QuizContext";

function PrevButton() {
  const { index, dispatch } = useQuiz();

  if (index === 0) return;

  return (
    <button
      className="btn btn-prev"
      onClick={() => dispatch({ type: "prevQuestion" })}
    >
      Previous
    </button>
  );
}

export default PrevButton;
