import Options from "./Options";

function Question({ question, dispatch, answers, index }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answers={answers}
        index={index}
      />
    </div>
  );
}

export default Question;
