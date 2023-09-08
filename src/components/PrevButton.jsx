function PrevButton({ dispatch, index }) {
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
