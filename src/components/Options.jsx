function Options({ question, dispatch, answers, index }) {
  const hasAnswered = answers[index] !== null;

  return (
    <div className="options">
      {question.options.map((option, optionIndex) => (
        <button
          className={`btn btn-option ${
            optionIndex === answers[index] ? "answer" : ""
          } ${
            hasAnswered
              ? optionIndex === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: optionIndex })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
