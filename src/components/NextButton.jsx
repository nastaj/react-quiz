function NextButton({ dispatch, answers, index, numQuestions }) {
  if (answers[index] === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-next"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  }

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-next"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
