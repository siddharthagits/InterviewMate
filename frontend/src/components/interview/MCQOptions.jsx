const LETTERS = ["A", "B", "C", "D"];

function MCQOptions({ options, selected, onSelect, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {options.map((opt, i) => (
        <button
          key={i}
          className={`mcq-option${selected === i ? " selected" : ""}`}
          onClick={() => !disabled && onSelect(i)}
          disabled={disabled}
        >
          <span className="mcq-letter">{LETTERS[i]}</span>
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

export default MCQOptions;
