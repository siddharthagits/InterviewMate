import React from "react";

/**
 * Tokenize a math/text string and convert fractions like (50/3) or 5/18 into
 * visual stacked fractions identical to IndiaBIX styling.
 */
function MathText({ text }) {
  if (!text) return null;

  // Regular expression to match parenthesized expressions with fractions e.g. (60 x 5/18), (50/3), (40/3)
  // or standalone fractions like 5/18, 40/3, 50/3, 125/3, etc.
  const regex = /(\(\s*[^()]*?\d+\s*\/\s*\d+[^()]*?\s*\)|\b\d+\s*\/\s*\d+\b)/g;

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // Check if it's a parenthesized fraction expression e.g. "(60 x 5/18)" or "(50/3)" or "(50/3 x 9)"
        const parenMatch = part.match(/^\(\s*(.*?)\s*\)$/);
        if (parenMatch) {
          const inner = parenMatch[1];
          // Check if inner has a fraction e.g. "60 x 5/18" or "50/3" or "50/3 x 9"
          const innerFracMatch = inner.match(/^(.*?)\b(\d+)\s*\/\s*(\d+)\b(.*)$/);
          if (innerFracMatch) {
            const prefix = innerFracMatch[1].trim();
            const num = innerFracMatch[2];
            const den = innerFracMatch[3];
            const suffix = innerFracMatch[4].trim();

            return (
              <span key={index} className="ib-frac-bracket-group">
                <span className="ib-frac-bracket">(</span>
                {prefix && <span className="ib-math-term">{prefix.replace(/\*/g, "×").replace(/\bx\b/g, "×")} </span>}
                <span className="ib-math-frac">
                  <span className="ib-math-num">{num}</span>
                  <span className="ib-math-den">{den}</span>
                </span>
                {suffix && <span className="ib-math-term"> {suffix.replace(/\*/g, "×").replace(/\bx\b/g, "×")}</span>}
                <span className="ib-frac-bracket">)</span>
              </span>
            );
          }
        }

        // Check if it's a standalone fraction e.g. "50/3" or "5/18"
        const fracMatch = part.match(/^(\d+)\s*\/\s*(\d+)$/);
        if (fracMatch) {
          return (
            <span key={index} className="ib-math-frac">
              <span className="ib-math-num">{fracMatch[1]}</span>
              <span className="ib-math-den">{fracMatch[2]}</span>
            </span>
          );
        }

        // Clean up multiplication signs and arrows
        let cleaned = part
          .replace(/\s*\*\s*/g, " × ")
          .replace(/\s+x\s+/g, " × ")
          .replace(/->/g, " → ")
          .replace(/\btherefore\b/gi, "∴");

        return <span key={index}>{cleaned}</span>;
      })}
    </>
  );
}

/**
 * Split explanation string into logical step-by-step lines.
 */
function parseExplanationSteps(rawExp) {
  if (!rawExp) return [];

  // If newlines already exist, split by newline
  if (rawExp.includes("\n")) {
    return rawExp
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, idx, arr) => ({
        text: line.replace(/^[•\-\*]\s*/, ""),
        isConclusion: idx === arr.length - 1 && (line.includes("=") || line.includes("∴") || line.startsWith("So") || line.startsWith("Hence")),
      }));
  }

  // Split by sentences or step indicators e.g. ". ", " → ", "; "
  // Avoid splitting inside numbers e.g. "12.1 sec" or "41.67 m/s"
  const sentences = rawExp
    .split(/(?<=[a-zA-Z\)])\.\s+(?=[A-Z0-9∴LetTotalSpeedLengthTimeRatioActualProfitLossSoHence\(\[])/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    // Try splitting by " → " or ";"
    const subParts = rawExp.split(/\s*→\s*|\s*;\s*/).filter(Boolean);
    if (subParts.length > 1) {
      return subParts.map((part, idx) => ({
        text: part.endsWith(".") ? part : `${part}.`,
        isConclusion: idx === subParts.length - 1,
      }));
    }
    return [{ text: rawExp, isConclusion: false }];
  }

  return sentences.map((sent, idx) => {
    const text = sent.endsWith(".") ? sent : `${sent}.`;
    const isConclusion = idx === sentences.length - 1;
    return { text, isConclusion };
  });
}

export default function FormattedExplanation({ explanation, optionLabel }) {
  const steps = parseExplanationSteps(explanation);

  return (
    <div className="ib-solution-box">
      {/* Answer Line matching IndiaBIX style */}
      {optionLabel && (
        <div className="ib-ans-line">
          <span className="ib-ans-green-label">Answer:</span>
          <span className="ib-ans-option-text">Option</span>
          <span className="ib-ans-circle-badge">{optionLabel}</span>
        </div>
      )}

      {/* Explanation: Heading */}
      <div className="ib-exp-heading">
        Explanation:
      </div>

      {/* Step-by-step formatted lines with vertical fractions */}
      <div className="ib-exp-steps-list">
        {steps.map((step, idx) => {
          const startsWithTherefore = step.text.startsWith("∴");
          const shouldShowTherefore = (step.isConclusion || startsWithTherefore) && steps.length > 1;
          const cleanText = step.text.replace(/^∴\s*/, "");

          return (
            <div key={idx} className="ib-exp-step-item">
              {shouldShowTherefore ? (
                <span className="ib-step-therefore">∴ </span>
              ) : null}
              <span className="ib-step-body">
                <MathText text={cleanText} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
