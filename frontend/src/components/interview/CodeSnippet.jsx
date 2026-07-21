import MCQOptions from "./MCQOptions";

function CodeSnippet({ question, code, options, selected, onSelect, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <p style={{ color: "var(--text-dim)", fontSize: "14px", fontWeight: 500 }}>
        {question}
      </p>
      <pre className="code-block">{code}</pre>
      <div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
          Select the correct output:
        </p>
        <MCQOptions
          options={options}
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default CodeSnippet;
