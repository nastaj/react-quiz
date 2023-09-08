function Difficulties({ dispatch, difficulty }) {
  return (
    <div className="difficulty-btns">
      <button
        className={`btn ${difficulty === "easy" ? "difficulty-active" : ""}`}
        onClick={() => dispatch({ type: "setDifficulty", payload: "easy" })}
      >
        Easy
      </button>
      <button
        className={`btn ${difficulty === "medium" ? "difficulty-active" : ""}`}
        onClick={() => dispatch({ type: "setDifficulty", payload: "medium" })}
      >
        Medium
      </button>
      <button
        className={`btn ${difficulty === "hard" ? "difficulty-active" : ""}`}
        onClick={() => dispatch({ type: "setDifficulty", payload: "hard" })}
      >
        Hard
      </button>
    </div>
  );
}

export default Difficulties;
