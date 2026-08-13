import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { logUserActivity } from "../utils/activityTracker";

// ── Word banks ────────────────────────────────────────────────────────────────
const WORD_BANKS = {
  common: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know",
    "take", "people", "into", "year", "your", "good", "some", "could",
    "them", "see", "other", "than", "then", "now", "look", "only", "come",
    "its", "over", "think", "also", "back", "after", "use", "two", "how",
    "our", "work", "first", "well", "way", "even", "new", "want", "because",
    "any", "these", "give", "day", "most", "us", "great", "between", "need",
    "large", "often", "hand", "high", "place", "hold", "turn", "part",
  ],
  punctuation: [
    "hello,", "world.", "say:", "it's", "code;", "data.", "user,", "state?",
    "value!", "result=", "count,", "item.", "array[0]", "list,", "key:",
    "true,", "false;", "(name)", "[id]", "function()", "ready!", "done.",
    "\"quoted\"", "element,", "type:", "error;", "success!", "res.send()",
    "req.body", "param=", "key-value", "node.js", "v1.0", "index.html",
    "style.css", "app.jsx", "next()", "prev()", "event.target", "{data}",
    "config;", "process.env", "log()", "console.log()", "item_id", "status:200",
    "path/to/file", "return;", "if(valid)", "else{", "sum+=1", "active?", "flag!"
  ],
  numbers: [
    "2026", "100", "42", "7", "3.14", "99", "500", "8080", "2024", "1st",
    "2nd", "3rd", "10", "50", "1234", "0", "24/7", "50%", "$100", "#1",
    "99.9%", "365", "12", "60", "30", "15", "90", "120", "2000", "404",
    "500", "80", "443", "3000", "5173", "100%", "24", "0.05", "10k", "1m",
    "25", "18", "21", "200", "999", "1.5", "2.0"
  ],
  quotes: [
    "the only way to do great work is to love what you do",
    "in the middle of every difficulty lies opportunity",
    "it does not matter how slowly you go as long as you do not stop",
    "success is not final failure is not fatal it is the courage to continue that counts",
    "the future belongs to those who believe in the beauty of their dreams",
    "code is like humor when you have to explain it it is not that good",
    "first solve the problem then write the code",
    "simplicity is the soul of efficiency",
    "make it work make it right make it fast",
    "any fool can write code that a computer can understand good programmers write code that humans can understand",
  ],
  codeSnippets: [
    `const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return { data, loading };
};`,
    `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    `interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
}
function isAdmin(user: UserProfile): boolean {
  return user.role === 'admin';
}`,
    `async function processQueue(tasks) {
  const completed = [];
  for (const task of tasks) {
    if (!task.enabled) continue;
    const res = await task.run();
    completed.push(res);
  }
  return completed;
}`,
    `const transformProducts = (items, minPrice) => {
  return items
    .filter(item => item.price >= minPrice)
    .map(item => ({
      id: item.id,
      title: item.name.toUpperCase(),
      discount: item.price * 0.1,
    }))
    .sort((a, b) => a.discount - b.discount);
};`,
    `function StatusBadge({ active, label }) {
  const color = active ? 'green' : 'gray';
  return (
    <span className={\`badge badge-\${color}\`}>
      {label}
    </span>
  );
}`,
    `struct Point {
    double x, y;
    double dist(const Point& p) const {
        double dx = x - p.x, dy = y - p.y;
        return std::sqrt(dx * dx + dy * dy);
    }
};`,
    `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`
  ]
};

const DURATIONS = [15, 30, 60, 90, 120];
const MODES = ["words", "punctuation", "numbers", "quotes", "programming"];

function generateWords(mode, count = 80) {
  if (mode === "quotes") {
    const q = WORD_BANKS.quotes[Math.floor(Math.random() * WORD_BANKS.quotes.length)];
    return q.split(" ");
  }
  if (mode === "programming") {
    const snippet = WORD_BANKS.codeSnippets[Math.floor(Math.random() * WORD_BANKS.codeSnippets.length)];
    return snippet.trim().split(/\s+/);
  }

  if (mode === "punctuation") {
    const out = [];
    let wordsInSentence = 0;
    let targetSentenceLength = Math.floor(Math.random() * 4) + 4; // 4 to 7 words
    let capitalizeNext = true;

    for (let i = 0; i < count; i++) {
      let word = WORD_BANKS.common[Math.floor(Math.random() * WORD_BANKS.common.length)];

      if (capitalizeNext) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        capitalizeNext = false;
      }

      wordsInSentence++;
      const isEnd = wordsInSentence >= targetSentenceLength || i === count - 1;

      // Wrap with quotes, parentheses, or single quotes
      if (!isEnd && wordsInSentence >= 2) {
        const wrapRand = Math.random();
        if (wrapRand < 0.07) {
          word = `"${word}"`;
        } else if (wrapRand < 0.14) {
          word = `'${word}'`;
        } else if (wrapRand < 0.20) {
          word = `(${word})`;
        }
      }

      if (isEnd) {
        // Natural sentence ending: ., ?, or !
        const endMark = Math.random() < 0.75 ? "." : (Math.random() < 0.6 ? "?" : "!");
        word += endMark;
        capitalizeNext = true;
        wordsInSentence = 0;
        targetSentenceLength = Math.floor(Math.random() * 4) + 4;
      } else if (wordsInSentence >= 2 && wordsInSentence < targetSentenceLength - 1) {
        const midPuncRand = Math.random();
        if (midPuncRand < 0.18) {
          word += ",";
        } else if (midPuncRand < 0.25) {
          word += ";";
        } else if (midPuncRand < 0.30) {
          word += ":";
        }
      }

      out.push(word);
    }
    return out;
  }

  if (mode === "numbers") {
    const out = [];
    const numberList = [
      "2026", "100", "42", "7", "3.14", "99", "500", "8080", "2024", "1st",
      "2nd", "3rd", "10", "50", "1234", "0", "24/7", "50%", "$100", "#1",
      "99.9%", "365", "12", "60", "30", "15", "90", "120", "2000", "404",
      "80", "443", "3000", "5173", "100%", "24", "0.05", "10k", "1m", "25",
      "18", "21", "200", "999", "1.5", "2.0"
    ];

    for (let i = 0; i < count; i++) {
      // ~18% chance of a number (1 in ~5-6 words), 82% regular common words
      if (Math.random() < 0.18) {
        const num = numberList[Math.floor(Math.random() * numberList.length)];
        out.push(num);
      } else {
        const word = WORD_BANKS.common[Math.floor(Math.random() * WORD_BANKS.common.length)];
        out.push(word);
      }
    }
    return out;
  }

  // default: words
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(WORD_BANKS.common[Math.floor(Math.random() * WORD_BANKS.common.length)]);
  }
  return out;
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ label, value, sub, color = "var(--violet-light)" }) {
  return (
    <div className="glass typing-result-card">
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 38, fontWeight: 900, color, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── WPM Bar Chart ─────────────────────────────────────────────────────────────
function WpmChart({ data }) {
  if (!data.length) return null;
  const maxWpm = Math.max(...data.map(d => d.wpm), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: "100%",
            height: `${Math.max(3, (d.wpm / maxWpm) * 72)}px`,
            background: "linear-gradient(180deg, var(--violet) 0%, var(--cyan) 100%)",
            borderRadius: "3px 3px 0 0",
            opacity: 0.85,
          }} />
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TypingTest() {
  const [mode, setMode]               = useState("words");
  const [duration, setDuration]       = useState(30);
  const [words, setWords]             = useState(() => generateWords("words"));
  const [typedHistory, setTypedHistory] = useState([]); // committed words
  const [currentInput, setCurrentInput] = useState("");  // chars in current word
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [timeLeft, setTimeLeft]       = useState(30);
  const [started, setStarted]         = useState(false);
  const [finished, setFinished]       = useState(false);
  const [isFocused, setIsFocused]     = useState(false);
  const [wpmHistory, setWpmHistory]   = useState([]);

  // refs that don't need to trigger re-render
  const containerRef   = useRef(null);
  const hiddenInputRef = useRef(null);
  const wordsRef       = useRef(null);
  const caretRef       = useRef(null);
  const timerRef       = useRef(null);
  const wpmRef         = useRef(null);
  const startTimeRef   = useRef(null);
  // mirror state in refs so interval callbacks always see fresh values
  const typedHistRef   = useRef([]);
  const wordsRef2      = useRef(words);
  const startedRef     = useRef(false);
  const finishedRef    = useRef(false);
  const currentWordIdxRef = useRef(0);

  // keep refs in sync
  useEffect(() => { typedHistRef.current = typedHistory; }, [typedHistory]);
  useEffect(() => { wordsRef2.current = words; }, [words]);
  useEffect(() => { startedRef.current = started; }, [started]);
  useEffect(() => { finishedRef.current = finished; }, [finished]);
  useEffect(() => { currentWordIdxRef.current = currentWordIdx; }, [currentWordIdx]);

  // ── Start timer ───────────────────────────────────────────────────────────
  const startTimer = useCallback((dur) => {
    startTimeRef.current = Date.now();
    startedRef.current   = true;
    setStarted(true);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          clearInterval(wpmRef.current);
          finishedRef.current = true;
          setFinished(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    // WPM snapshot every second
    wpmRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 60000;
      if (elapsed <= 0) return;
      const th = typedHistRef.current;
      const ws = wordsRef2.current;
      const correct = th.filter((t, i) => t === ws[i]).length;
      const wpm = Math.round(correct / elapsed);
      const sec = Math.round((Date.now() - startTimeRef.current) / 1000);
      setWpmHistory(h => [...h, { sec, wpm }]);
    }, 1000);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback((newMode, newDuration) => {
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    const m = newMode  ?? mode;
    const d = newDuration ?? duration;
    const w = generateWords(m);
    wordsRef2.current        = w;
    typedHistRef.current     = [];
    startedRef.current       = false;
    finishedRef.current      = false;
    currentWordIdxRef.current = 0;
    startTimeRef.current     = null;
    setWords(w);
    setTypedHistory([]);
    setCurrentInput("");
    if (hiddenInputRef.current) hiddenInputRef.current.value = "";
    setCurrentWordIdx(0);
    setTimeLeft(d);
    setStarted(false);
    setFinished(false);
    setWpmHistory([]);
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [mode, duration]);

  // reset when mode / duration buttons change
  const handleSetMode = (m) => {
    const nextDuration = m === "quotes" ? 30 : duration;
    setMode(m);
    if (m === "quotes") {
      setDuration(30);
    }
    reset(m, nextDuration);
  };
  const handleSetDuration = (d) => {
    if (mode === "quotes") return;
    setDuration(d);
    reset(mode, d);
  };

  // focus on mount
  useEffect(() => {
    const t = setTimeout(() => hiddenInputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  // cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!wordsRef.current || !caretRef.current) return;
    const activeWord = wordsRef.current.querySelector(".typing-word.active");
    if (!activeWord) {
      caretRef.current.style.opacity = "0";
      return;
    }

    activeWord.scrollIntoView({ block: "nearest", inline: "start" });

    const chars = activeWord.querySelectorAll(".typing-char");
    let target = null;
    let placeAfter = false;

    if (currentInput.length === 0) {
      target = chars[0] || activeWord;
      placeAfter = false;
    } else if (currentInput.length < chars.length) {
      target = chars[currentInput.length];
      placeAfter = false;
    } else if (currentInput.length === chars.length) {
      target = chars[chars.length - 1];
      placeAfter = true;
    } else {
      const extraChars = activeWord.querySelectorAll(".char-extra");
      if (extraChars.length) {
        target = extraChars[extraChars.length - 1];
      } else {
        target = chars[chars.length - 1];
      }
      placeAfter = true;
    }

    if (!target) {
      caretRef.current.style.opacity = "0";
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = wordsRef.current.getBoundingClientRect();
    const x = (placeAfter ? targetRect.right + 1 : targetRect.left) - containerRect.left;
    const y = targetRect.top - containerRect.top;

    const fontSize = target.style.fontSize || window.getComputedStyle(target).fontSize;
    const lineHeight = target.style.lineHeight || window.getComputedStyle(target).lineHeight;
    const height = parseFloat(lineHeight) || parseFloat(fontSize) * 1.2 || targetRect.height;

    caretRef.current.style.height = `${height}px`;
    caretRef.current.style.transform = `translate(${x}px, ${y}px)`;
    caretRef.current.style.opacity = isFocused ? "1" : "0.5";
  }, [currentInput, currentWordIdx, words, started, isFocused]);

  // ── Word commit helper ────────────────────────────────────────────────────
  const commitWord = useCallback((typed) => {
    if (!startedRef.current) startTimer(duration);

    const newHistory = [...typedHistRef.current, typed];
    typedHistRef.current = newHistory;
    setTypedHistory(newHistory);

    const nextIdx = currentWordIdxRef.current + 1;
    currentWordIdxRef.current = nextIdx;
    setCurrentWordIdx(nextIdx);
    setCurrentInput("");
    if (hiddenInputRef.current) hiddenInputRef.current.value = "";

    // Refill words if running low
    if (nextIdx >= wordsRef2.current.length - 10) {
      setWords(prev => {
        const extended = [...prev, ...generateWords(mode, 40)];
        wordsRef2.current = extended;
        return extended;
      });
    }
  }, [duration, mode, startTimer]);

  // ── Native Input Change Handler (works on Mobile virtual keyboards & Desktop) ─
  const handleInputChange = (e) => {
    if (finishedRef.current) return;
    const val = e.target.value;

    if (!startedRef.current && val.length > 0) {
      startTimer(duration);
    }

    // Space or newline at end = word submitted
    if (val.endsWith(" ") || val.endsWith("\n")) {
      const typed = val.slice(0, -1).trim();
      if (typed !== "") {
        commitWord(typed);
      } else {
        setCurrentInput("");
        if (hiddenInputRef.current) hiddenInputRef.current.value = "";
      }
      return;
    }

    // Multi-word input from mobile predictive text / autocomplete
    if (val.includes(" ")) {
      const parts = val.split(" ");
      if (parts.length > 1) {
        const firstWord = parts[0].trim();
        if (firstWord !== "") {
          commitWord(firstWord);
        }
        const remainder = parts.slice(1).join(" ");
        setCurrentInput(remainder);
        if (hiddenInputRef.current) hiddenInputRef.current.value = remainder;
        return;
      }
    }

    setCurrentInput(val);
  };

  // ── Keyboard shortcuts & special keys ─────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (finishedRef.current) return;

    // Reset shortcuts
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      reset();
      return;
    }

    // Space with empty input -> prevent page scroll
    if (e.key === " ") {
      if (currentInput.trim() === "") {
        e.preventDefault();
        return;
      }
    }

    // Backspace to previous word when current word is empty
    if (e.key === "Backspace") {
      if (currentInput.length === 0 && currentWordIdxRef.current > 0) {
        e.preventDefault();
        const prevTyped = typedHistRef.current[typedHistRef.current.length - 1] || "";
        const newHistory = typedHistRef.current.slice(0, -1);
        typedHistRef.current = newHistory;
        setTypedHistory(newHistory);
        const prevIdx = currentWordIdxRef.current - 1;
        currentWordIdxRef.current = prevIdx;
        setCurrentWordIdx(prevIdx);
        setCurrentInput(prevTyped);
        if (hiddenInputRef.current) hiddenInputRef.current.value = prevTyped;
      }
    }
  }, [currentInput, reset]);

  // ── Focus trigger ─────────────────────────────────────────────────────────
  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const computeStats = () => {
    const elapsed = Math.max(1, duration - timeLeft) / 60;
    let correctWords = 0, incorrectChars = 0;

    typedHistory.forEach((typed, i) => {
      const target = words[i] || "";
      if (typed === target) {
        correctWords++;
      } else {
        for (let c = 0; c < Math.max(typed.length, target.length); c++) {
          if (typed[c] !== target[c]) incorrectChars++;
        }
      }
    });

    const wpm      = Math.round(correctWords / elapsed);
    const rawWpm   = Math.round(typedHistory.length / elapsed);
    const accuracy = typedHistory.length === 0
      ? 100
      : Math.round((correctWords / typedHistory.length) * 100);

    return { wpm, rawWpm, accuracy, correctWords, incorrectChars };
  };

  useEffect(() => {
    if (finished) {
      const stats = computeStats();
      if (stats.rawWpm > 0) {
        logUserActivity({
          type: "typing",
          title: `${duration}s ${mode.toUpperCase()} Typing Test`,
          category: "Typing Test",
          score: Math.min(100, Math.round(stats.wpm)),
          metrics: {
            wpm: `${stats.wpm} WPM`,
            accuracy: `${stats.accuracy}%`,
            raw: `${stats.rawWpm} WPM`,
          },
          icon: "⌨️",
          color: "#10b981",
          badge: `${stats.wpm} WPM`,
        });
      }
    }
  }, [finished]);

  // ── Live WPM ──────────────────────────────────────────────────────────────
  const liveWpm = (() => {
    if (!started || finished || timeLeft === duration) return 0;
    const elapsed = Math.max(1, duration - timeLeft) / 60;
    const correct = typedHistory.filter((t, i) => t === words[i]).length;
    return Math.round(correct / elapsed);
  })();

  const timerColor = timeLeft <= 5
    ? "var(--red)"
    : timeLeft <= 10
    ? "var(--gold)"
    : "var(--violet-light)";

  // ── Render words with char-level highlighting ─────────────────────────────
  const renderWords = () =>
    words.slice(0, currentWordIdx + 80).map((word, wi) => {
      const isActive  = wi === currentWordIdx;
      const isPast    = wi < currentWordIdx;
      const isCorrect = isPast && typedHistory[wi] === word;
      const isWrong   = isPast && typedHistory[wi] !== word;
      const typed     = isActive ? currentInput : (isPast ? (typedHistory[wi] || "") : "");

      const charElements = [];

      word.split("").forEach((char, ci) => {
        let cls = "typing-char";
        if (ci < typed.length) {
          cls += typed[ci] === char ? " char-correct" : " char-wrong";
        } else if (isPast) {
          cls += " char-missed";
        }

        charElements.push(<span key={ci} className={cls}>{char}</span>);
      });

      return (
        <span
          key={wi}
          className={[
            "typing-word",
            isActive  ? "active"  : "",
            isCorrect ? "correct" : "",
            isWrong   ? "wrong"   : "",
          ].join(" ").trim()}
        >
          {charElements}
          {/* Extra characters typed beyond word length */}
          {typed.length > word.length &&
            typed.slice(word.length).split("").map((xc, xi) => (
              <span key={`x${xi}`} className="typing-char char-extra">{xc}</span>
            ))
          }
          {isActive && typed.length > word.length && <span className="typing-caret-inline" />}
        </span>
      );
    });

  // ── Results screen ────────────────────────────────────────────────────────
  if (finished) {
    const stats = computeStats();
    return (
      <DashboardLayout>
        <div className="fade-up" style={{ maxWidth: 860, margin: "0 auto", padding: "0 12px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="typing-badge" style={{ marginBottom: 16 }}>⌨️ Test Complete</div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>
              Your Results
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {mode} · {duration}s · {new Date().toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 28 }}>
            <ResultCard label="WPM"      value={stats.wpm}             sub="words/min"   color={stats.wpm >= 80 ? "var(--green)" : stats.wpm >= 50 ? "var(--violet-light)" : "var(--gold)"} />
            <ResultCard label="Accuracy" value={`${stats.accuracy}%`}  sub={`${stats.correctWords} words`} color={stats.accuracy >= 98 ? "var(--green)" : stats.accuracy >= 90 ? "var(--violet-light)" : "var(--gold)"} />
            <ResultCard label="Raw WPM"  value={stats.rawWpm}          sub="raw speed"    color="var(--cyan)" />
            <ResultCard label="Errors"   value={stats.incorrectChars}  sub="mistakes"    color={stats.incorrectChars === 0 ? "var(--green)" : "var(--red)"} />
          </div>

          <div className="glass" style={{ padding: "16px 22px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Performance</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>
                {stats.wpm >= 100 ? "🚀 Speed Demon" : stats.wpm >= 80 ? "⚡ Fast Typist" : stats.wpm >= 60 ? "✅ Above Average" : stats.wpm >= 40 ? "👍 Average" : "💪 Keep Practicing"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Time</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "var(--violet-light)" }}>{duration}s</div>
            </div>
          </div>

          {wpmHistory.length > 1 && (
            <div className="glass" style={{ padding: "20px", marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                WPM Over Time
              </div>
              <WpmChart data={wpmHistory} />
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => reset()} style={{ padding: "12px 32px", fontSize: 14 }}>
              ↺ Try Again
            </button>
            <button className="btn btn-outline" onClick={() => { setMode("words"); setDuration(30); reset("words", 30); }}
              style={{ padding: "12px 24px", fontSize: 14 }}>
              New Test
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Main test screen ──────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1050, margin: "0 auto", padding: "0 8px" }}>

        <div style={{ marginBottom: 24 }}>
          <div className="typing-badge" style={{ marginBottom: 10 }}>⌨️ Typing Speed Test</div>
          <h1 style={{ fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 900, letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif" }}>
            How fast do you type?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
            Tap the box or start typing · <kbd className="typing-kbd">Tab</kbd> or <kbd className="typing-kbd">Esc</kbd> to restart
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div className="typing-seg-group">
            {MODES.map(m => (
              <button key={m} className={`typing-seg${mode === m ? " active" : ""}`}
                onClick={() => handleSetMode(m)} disabled={started && !finished}>
                {m === "words" ? "📝 Words" :
                 m === "punctuation" ? "🔣 Punctuation" :
                 m === "numbers" ? "🔢 Numbers" :
                 m === "quotes" ? "💬 Quotes" : "💻 Code"}
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: "var(--glass-border)", display: "inline-block" }} />
          <div className="typing-seg-group">
            {DURATIONS.map(d => (
              <button key={d} className={`typing-seg${duration === d ? " active" : ""}`}
                onClick={() => handleSetDuration(d)}
                disabled={(started && !finished) || (mode === "quotes" && d !== 30)}>
                {d}s
              </button>
            ))}
          </div>
          {started && !finished && (
            <div style={{ marginLeft: "auto", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>WPM</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "var(--violet-light)", fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{liveWpm}</div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            display: "inline-block", fontSize: "clamp(36px, 7vw, 52px)", fontWeight: 900,
            fontFamily: "'JetBrains Mono', monospace", color: timerColor,
            lineHeight: 1, transition: "color 0.3s",
            filter: timeLeft <= 5 ? `drop-shadow(0 0 12px ${timerColor})` : "none",
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Mobile tap banner hint */}
        {!isFocused && !finished && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <button
              onClick={focusInput}
              className="typing-mobile-tap-hint"
              style={{ cursor: "pointer", border: "1px solid rgba(6,182,212,0.35)", background: "rgba(6,182,212,0.12)" }}
            >
              📱 Tap here to open keyboard & start typing
            </button>
          </div>
        )}

        {/* Typing area with invisible real input to trigger mobile keyboards */}
        <div
          ref={containerRef}
          onClick={focusInput}
          onTouchStart={focusInput}
          className={`typing-area${started || isFocused ? " typing-area--active" : ""}`}
          style={{
            outline: isFocused ? "1px solid rgba(6,182,212,0.3)" : "none",
            boxShadow: isFocused ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
            position: "relative",
            cursor: "text"
          }}
        >
          {/* Real hidden native input to summon iOS & Android keyboards and capture text */}
          <input
            ref={hiddenInputRef}
            type="text"
            className="typing-hidden-input"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            inputMode="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Typing test input"
          />

          <div className="typing-viewport">
            <span ref={caretRef} className="typing-caret-inline" />
            <div ref={wordsRef} className="typing-words">
              {renderWords()}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "0 4px" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {!started ? "Tap above to start typing…" : `Word ${currentWordIdx + 1}`}
          </span>
          <button className="btn btn-outline" onClick={() => reset()}
            style={{ padding: "6px 16px", fontSize: 12, borderRadius: 8 }}>
            ↺ Restart
          </button>
        </div>

        {!started && (
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { icon: "🎯", title: "Accuracy first",  desc: "Focus on typing correctly — speed will follow naturally." },
              { icon: "🔄", title: "Reset anytime",   desc: "Press Tab or Esc at any point to restart with new words." },
              { icon: "📈", title: "Track progress",  desc: "Live WPM and accuracy update as you type." },
            ].map(tip => (
              <div key={tip.title} className="glass" style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{tip.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: "var(--text-dim)" }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
