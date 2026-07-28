import os, json, random
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai as _genai
    _client = _genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
except Exception:
    _client = None

# ── Fallback question banks ────────────────────────────────────────────────────

_MCQ_JS = {
    "Easy": [
        {"q":"What does `typeof null` return?","opts":["'object'","'null'","'undefined'","'boolean'"],"c":0},
        {"q":"Which method adds to end of an array?","opts":["push()","pop()","shift()","unshift()"],"c":0},
        {"q":"What is `===` in JavaScript?","opts":["Strict equality","Assignment","Loose equality","Bitwise AND"],"c":0},
        {"q":"How do you declare a constant?","opts":["const","let","var","static"],"c":0},
        {"q":"What does `Array.isArray([])` return?","opts":["true","false","null","undefined"],"c":0},
        {"q":"Which removes the last array element?","opts":["pop()","push()","shift()","slice()"],"c":0},
        {"q":"What is NaN?","opts":["Not a Number","Null and None","Negative Number","None"],"c":0},
        {"q":"What does JSON.parse() do?","opts":["Converts JSON string to object","Converts object to JSON","Parses HTML","Encodes URL"],"c":0},
        {"q":"How do you check if a variable is an array?","opts":["Array.isArray()","isArray()","typeof","instanceof"],"c":0},
        {"q":"Which keyword exits a loop?","opts":["break","exit","stop","return"],"c":0},
        {"q":"What is `undefined` in JS?","opts":["Declared but not assigned","null value","Empty string","Zero"],"c":0},
        {"q":"Which loop is guaranteed to run at least once?","opts":["do...while","while","for","for...of"],"c":0},
        {"q":"How do you convert a string to integer?","opts":["parseInt()","toInt()","Integer()","Number.parse()"],"c":0},
        {"q":"What is a function in programming?","opts":["Reusable block of code","A variable","A data type","A loop"],"c":0},
        {"q":"What does `length` property return on a string?","opts":["Number of characters","Number of words","Index of last char","undefined"],"c":0},
        {"q":"Which HTML element runs JavaScript?","opts":["<script>","<js>","<code>","<run>"],"c":0},
        {"q":"How to write a single-line comment in JS?","opts":["// comment","# comment","<!-- comment -->","/* comment"],"c":0},
        {"q":"What is the default value of an uninitialized variable?","opts":["undefined","null","0","''"],"c":0},
        {"q":"Which method joins array elements into a string?","opts":["join()","concat()","toString()","merge()"],"c":0},
        {"q":"What is an object in JavaScript?","opts":["Key-value pair collection","A function","A number type","An array"],"c":0},
        {"q":"How do you write a string in JS?","opts":["'text' or \"text\"","<text>","[text]","{text}"],"c":0},
        {"q":"Which is NOT a JS data type?","opts":["integer","string","boolean","undefined"],"c":0},
        {"q":"What does `console.log()` do?","opts":["Prints to console","Opens a log file","Saves data","Alerts user"],"c":0},
        {"q":"How do you create an empty array?","opts":["[]","{}","()","<>"],"c":0},
        {"q":"What does `==` do?","opts":["Loose equality check","Strict equality","Assignment","Comparison with type"],"c":0},
        {"q":"How to get array length?","opts":["arr.length","arr.size()","arr.count","len(arr)"],"c":0},
        {"q":"What is a boolean?","opts":["true or false value","0 or 1 number","Yes/No string","null value"],"c":0},
        {"q":"Which method returns index of element in array?","opts":["indexOf()","find()","search()","locate()"],"c":0},
        {"q":"What does `return` do in a function?","opts":["Exits and returns value","Loops back","Pauses execution","Throws error"],"c":0},
        {"q":"How do you access object property `name` on obj?","opts":["obj.name","obj[name]","obj->name","obj::name"],"c":0},
    ],
    "Medium": [
        {"q":"What is event bubbling?","opts":["Event propagates from child to parent","Event from parent to child","Event cancellation","Event cloning"],"c":0},
        {"q":"What does `Promise.all()` do?","opts":["Runs all promises in parallel","Runs promises in series","Cancels all promises","Returns first resolved"],"c":0},
        {"q":"What is a closure?","opts":["Function retaining outer scope","Global variable","Async function","Class method"],"c":0},
        {"q":"What does `Object.freeze()` do?","opts":["Prevents mutation","Copies object","Deletes object","Sorts properties"],"c":0},
        {"q":"What is the difference between `call` and `apply`?","opts":["call uses list; apply uses array","call is async; apply sync","call is for classes","No difference"],"c":0},
        {"q":"What is prototypal inheritance?","opts":["Objects inherit from other objects","Class-based inheritance","Mixin pattern","None"],"c":0},
        {"q":"What is the purpose of `use strict`?","opts":["Enables strict mode catching more errors","Speeds up JS","Enables ES6","Disables hoisting"],"c":0},
        {"q":"What does `Array.prototype.map()` return?","opts":["New array","Modified original","undefined","Boolean"],"c":0},
        {"q":"What is a Promise?","opts":["Object for async operations","Sync function wrapper","Error handler","Loop construct"],"c":0},
        {"q":"What is hoisting?","opts":["Declarations moved to top of scope","Variables copied","Functions deleted","Scope chaining"],"c":0},
        {"q":"What is `this` in an arrow function?","opts":["Inherits from enclosing scope","Refers to the function","Refers to window","undefined"],"c":0},
        {"q":"What does `spread operator` (...) do?","opts":["Expands iterable into elements","Merges types","Creates generator","Destructures"],"c":0},
        {"q":"What is destructuring?","opts":["Extracts values from arrays/objects","Deletes properties","Freezes variables","Clones objects"],"c":0},
        {"q":"What is `async/await`?","opts":["Syntactic sugar for Promises","New loop type","Class decorator","Module syntax"],"c":0},
        {"q":"What does `Array.filter()` return?","opts":["New array with matching elements","Boolean","Count","Mutated original"],"c":0},
        {"q":"What is a higher-order function?","opts":["Takes or returns functions","Runs faster","Uses recursion","Runs in parallel"],"c":0},
        {"q":"What is `localStorage`?","opts":["Browser persistent key-value storage","Server-side storage","Session-only storage","Cookie"],"c":0},
        {"q":"What does `preventDefault()` do?","opts":["Stops default browser action","Stops propagation","Removes event","Cancels fetch"],"c":0},
        {"q":"What is a module in JS?","opts":["File with exports/imports","A class","A function","An object"],"c":0},
        {"q":"What does `Array.reduce()` do?","opts":["Reduces array to single value","Removes elements","Sorts array","Flattens array"],"c":0},
        {"q":"What is the purpose of `try/catch`?","opts":["Handle runtime errors","Speed up code","Define async code","Create closures"],"c":0},
        {"q":"What is `null` in JavaScript?","opts":["Intentional absence of value","Undefined variable","Empty string","Zero"],"c":0},
        {"q":"What does `Object.keys()` return?","opts":["Array of property names","Array of values","Object copy","Boolean"],"c":0},
        {"q":"What is an IIFE?","opts":["Immediately Invoked Function Expression","Inline If-Else","Internal Import","Iterable Interface"],"c":0},
        {"q":"What is `event.stopPropagation()`?","opts":["Stops event from bubbling","Cancels default action","Removes listener","Fires event"],"c":0},
        {"q":"What is `typeof` used for?","opts":["Returns type of variable","Converts type","Compares types","Assigns type"],"c":0},
        {"q":"What is a callback function?","opts":["Function passed as argument","Async function","Class method","Return value"],"c":0},
        {"q":"What does `fetch()` return?","opts":["Promise","Data directly","String","Array"],"c":0},
        {"q":"What is optional chaining (`?.`)?","opts":["Safely access nested properties","Spread operator","Ternary shorthand","Null coalescing"],"c":0},
        {"q":"What is the nullish coalescing operator (`??`)?","opts":["Returns right side if left is null/undefined","Logical OR","Logical AND","Ternary"],"c":0},
    ],
    "Hard": [
        {"q":"What is the Temporal Dead Zone?","opts":["Period before let/const is initialized","Async delay","Garbage collected area","Frozen scope"],"c":0},
        {"q":"What is memoization?","opts":["Caching function results","Memory management","Async queuing","Recursive optimization"],"c":0},
        {"q":"What does `Symbol()` create?","opts":["Unique primitive value","String alias","Object key","Number"],"c":0},
        {"q":"What is a WeakMap?","opts":["Map with weak object references (GC-able)","Immutable map","Sorted map","Async map"],"c":0},
        {"q":"What is tail call optimization?","opts":["Reuses stack frame for tail calls","Sorts tail values","Removes recursion","Parallelizes calls"],"c":0},
        {"q":"What does `Object.create(null)` produce?","opts":["Object with no prototype","Empty array","Frozen object","Null object"],"c":0},
        {"q":"What is a Proxy object?","opts":["Intercepts object operations","Copies an object","Async wrapper","Module proxy"],"c":0},
        {"q":"What is currying?","opts":["Transform multi-arg fn to chain of single-arg fns","Loop technique","Type conversion","Memoization"],"c":0},
        {"q":"What is the difference between microtask and macrotask?","opts":["Microtasks run before macrotasks in event loop","Macrotasks are faster","No difference","Microtasks are synchronous"],"c":0},
        {"q":"What is a generator function?","opts":["Function that can pause/resume with yield","Async function","Recursive function","Factory function"],"c":0},
        {"q":"What does `Reflect.apply()` do?","opts":["Calls function with target and args","Reflects object","Applies CSS","None"],"c":0},
        {"q":"What is structural sharing in immutability?","opts":["Reusing unchanged parts of data structures","Copying all data","Deleting old references","Hashing"],"c":0},
        {"q":"What is the event loop?","opts":["Mechanism to handle async operations in JS","A for loop","Network loop","UI render loop"],"c":0},
        {"q":"What are Web Workers?","opts":["Background JS threads","Service workers","DOM workers","Async functions"],"c":0},
        {"q":"What does `Object.defineProperty()` do?","opts":["Defines/modifies property descriptor","Creates object","Freezes property","Deletes property"],"c":0},
        {"q":"What is `Function.prototype.bind()`?","opts":["Creates new function with fixed `this`","Calls function","Applies arguments","Clones function"],"c":0},
        {"q":"What is tree shaking?","opts":["Removing unused code in bundling","DOM manipulation","Sorting algorithm","Memory cleanup"],"c":0},
        {"q":"What is the difference between `__proto__` and `prototype`?","opts":["__proto__ is instance link; prototype is constructor property","Same thing","prototype is deprecated","__proto__ is for classes"],"c":0},
        {"q":"What is a pure function?","opts":["Same input always gives same output, no side effects","Function with no arguments","Async function","Recursive function"],"c":0},
        {"q":"What is `requestAnimationFrame()`?","opts":["Schedules callback before next paint","Delays execution","Runs on each event","Async timer"],"c":0},
        {"q":"What is content security policy (CSP)?","opts":["HTTP header preventing XSS/injection","Browser cache policy","CORS header","Cookie policy"],"c":0},
        {"q":"What is `AbortController`?","opts":["Cancels fetch/async operations","Controls DOM","Stops event loop","Manages workers"],"c":0},
        {"q":"What is a memory leak in JavaScript?","opts":["Unreleased memory no longer needed","Fast allocation","Garbage collection","Stack overflow"],"c":0},
        {"q":"What is `structuredClone()`?","opts":["Deep copies an object","Shallow copy","Freezes object","Clones DOM"],"c":0},
        {"q":"What is the module pattern?","opts":["IIFE that exposes a public API hiding internals","Import/export syntax","Class pattern","Singleton"],"c":0},
        {"q":"What is `Object.assign()` limitation?","opts":["Only shallow copy; nested objects are referenced","Cannot copy arrays","Slow performance","Mutates source"],"c":0},
        {"q":"What is throttling vs debouncing?","opts":["Throttle limits rate; debounce waits for pause","Same concept","Throttle is async","Debounce is sync"],"c":0},
        {"q":"What does `Promise.race()` do?","opts":["Resolves/rejects with first settled promise","Waits for all","Returns array","Cancels others"],"c":0},
        {"q":"What is the purpose of `Symbol.iterator`?","opts":["Makes object iterable with for...of","Unique symbol","Iterator factory","Generator key"],"c":0},
        {"q":"What is lazy evaluation?","opts":["Delay computation until result needed","Async evaluation","Cached evaluation","Event-driven eval"],"c":0},
    ],
}

_TEXT = {
    "Easy": [
        "Introduce yourself and describe your experience as a {role}.",
        "What made you choose {language} as your primary programming language?",
        "Describe a small project you built and what you learned from it.",
        "How do you stay updated with new technologies in your field?",
        "What do you consider your biggest technical strength?",
        "Explain in simple terms what a {role} does on a daily basis.",
        "How do you approach debugging a problem in {language}?",
        "Describe a time you worked in a team. What was your contribution?",
    ],
    "Medium": [
        "Describe a challenging project you led as a {role}. What was the outcome?",
        "How do you ensure code quality and maintainability in {language}?",
        "Tell me about a production bug you fixed. What was your debugging process?",
        "How do you approach system design for a new feature?",
        "Describe a situation where you disagreed with a teammate. How did you resolve it?",
        "How do you balance technical debt with feature delivery?",
        "What design patterns do you use most in {language} and why?",
        "How do you mentor junior developers?",
    ],
    "Hard": [
        "Design a scalable microservices architecture for a high-traffic application. Walk me through your decisions.",
        "Describe the most complex performance optimization you've implemented. What metrics improved?",
        "How would you approach migrating a monolith to microservices without downtime?",
        "Explain a situation where you made a difficult architectural trade-off and the long-term impact.",
        "How do you approach incident management and postmortems?",
        "Describe how you would design a distributed caching layer for a global application.",
        "How do you evaluate and introduce new technologies to your team?",
        "Explain how you handle security vulnerabilities discovered in a live system.",
    ],
}

_CODE = {
    "JavaScript": [
        {"q":"What is the output of this code?",
         "code":"let x = 5;\nconsole.log(x++);\nconsole.log(x);",
         "opts":["5\n6","6\n6","5\n5","6\n5"],"c":0},
        {"q":"What does this code print?",
         "code":"console.log(typeof typeof 42);",
         "opts":["'string'","'number'","'object'","'undefined'"],"c":0},
        {"q":"What is the output?",
         "code":"const a = [1,2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);",
         "opts":["3","2","1","Error"],"c":0},
        {"q":"What does this print?",
         "code":"function greet() {\n  return\n  'Hello';\n}\nconsole.log(greet());",
         "opts":["undefined","'Hello'","null","SyntaxError"],"c":0},
        {"q":"What is logged?",
         "code":"console.log(0.1 + 0.2 === 0.3);",
         "opts":["false","true","NaN","TypeError"],"c":0},
        {"q":"What is the output?",
         "code":"const obj = {a:1};\nObject.freeze(obj);\nobj.a = 2;\nconsole.log(obj.a);",
         "opts":["1","2","undefined","TypeError"],"c":0},
        {"q":"What does this print?",
         "code":"console.log([] == ![]);",
         "opts":["true","false","TypeError","undefined"],"c":0},
        {"q":"What is logged?",
         "code":"const fn = () => arguments;\ntry { fn(); } catch(e) { console.log(e.constructor.name); }",
         "opts":["ReferenceError","TypeError","Error","undefined"],"c":0},
    ],
    "Python": [
        {"q":"What does this print?",
         "code":"x = [1,2,3]\ny = x\ny.append(4)\nprint(len(x))",
         "opts":["4","3","1","Error"],"c":0},
        {"q":"What is the output?",
         "code":"print(type(1/2))",
         "opts":["<class 'float'>","<class 'int'>","<class 'number'>","Error"],"c":0},
        {"q":"What does this print?",
         "code":"a = [1,2,3]\nprint(a[-1])",
         "opts":["3","1","-1","Error"],"c":0},
        {"q":"What is the output?",
         "code":"d = {'a':1,'b':2}\nprint(d.get('c', 0))",
         "opts":["0","None","Error","'c'"],"c":0},
        {"q":"What is printed?",
         "code":"print(bool('') or bool('hello'))",
         "opts":["True","False","hello","Error"],"c":0},
        {"q":"What does this output?",
         "code":"x = 10\ndef f():\n    x = 20\nf()\nprint(x)",
         "opts":["10","20","None","Error"],"c":0},
        {"q":"What is the output?",
         "code":"nums = [1,2,3,4]\nprint(nums[1:3])",
         "opts":["[2, 3]","[1, 2]","[2, 3, 4]","[1, 2, 3]"],"c":0},
        {"q":"What is logged?",
         "code":"print(3 * 'ab')",
         "opts":["ababab","ab3","Error","abababab"],"c":0},
    ],
    "Java": [
        {"q":"What does this print?",
         "code":"int x = 5;\nSystem.out.println(x++);",
         "opts":["5","6","Error","4"],"c":0},
        {"q":"What is the output?",
         "code":"String s = null;\nSystem.out.println(s instanceof String);",
         "opts":["false","true","NullPointerException","Error"],"c":0},
        {"q":"What does this print?",
         "code":"int[] arr = {1,2,3};\nSystem.out.println(arr.length);",
         "opts":["3","2","arr.length","Error"],"c":0},
        {"q":"What is logged?",
         "code":"System.out.println(10 / 3);",
         "opts":["3","3.33","3.0","Error"],"c":0},
        {"q":"What is the output?",
         "code":"System.out.println(\"5\" + 3 + 2);",
         "opts":["532","10","53","Error"],"c":0},
        {"q":"What does this print?",
         "code":"int i=0;\nwhile(i<3) { i++; }\nSystem.out.println(i);",
         "opts":["3","2","4","0"],"c":0},
        {"q":"What is output?",
         "code":"System.out.println(Integer.toBinaryString(10));",
         "opts":["1010","10","1001","1100"],"c":0},
        {"q":"What is printed?",
         "code":"String a = \"hi\";\nString b = \"hi\";\nSystem.out.println(a == b);",
         "opts":["true","false","Error","null"],"c":0},
    ],
    "C++": [
        {"q":"What does this output?",
         "code":"int x = 5;\ncout << x++;",
         "opts":["5","6","Error","4"],"c":0},
        {"q":"What is printed?",
         "code":"cout << 10/3;",
         "opts":["3","3.33","3.0","Error"],"c":0},
        {"q":"What does this print?",
         "code":"int a=1, b=2;\ncout << (a > b ? a : b);",
         "opts":["2","1","true","Error"],"c":0},
        {"q":"What is the output?",
         "code":"int arr[]={1,2,3};\ncout << sizeof(arr)/sizeof(arr[0]);",
         "opts":["3","4","1","Error"],"c":0},
        {"q":"What is printed?",
         "code":"cout << !0 << !1;",
         "opts":["10","01","11","00"],"c":0},
        {"q":"What does this output?",
         "code":"int x=10;\nint &r=x;\nr=20;\ncout << x;",
         "opts":["20","10","Error","undefined"],"c":0},
        {"q":"What is the result?",
         "code":"cout << (7 & 3);",
         "opts":["3","7","1","4"],"c":0},
        {"q":"What is printed?",
         "code":"int x=5;\ncout << (x<<1);",
         "opts":["10","5","2","Error"],"c":0},
    ],
}

_GENERIC_CODE = [
    {"q":"What does this pseudocode return for input [3,1,4,1,5]?",
     "code":"function maxVal(arr):\n  m = arr[0]\n  for x in arr:\n    if x > m: m = x\n  return m",
     "opts":["5","3","4","1"],"c":0},
    {"q":"How many times does this loop run?",
     "code":"i = 0\nwhile i < 10:\n  i += 3",
     "opts":["4","3","10","5"],"c":0},
    {"q":"What is the output of this recursion for n=4?",
     "code":"function f(n):\n  if n==0: return 0\n  return n + f(n-1)",
     "opts":["10","4","6","8"],"c":0},
    {"q":"What does this return?",
     "code":"arr = [1,2,3,4,5]\nresult = [x*2 for x in arr if x%2==0]",
     "opts":["[4, 8]","[2, 4, 6, 8, 10]","[4, 6, 8]","[2, 4]"],"c":0},
    {"q":"What is the time complexity of binary search?",
     "code":"# Binary search on sorted array of n elements",
     "opts":["O(log n)","O(n)","O(n²)","O(1)"],"c":0},
]


def _get_code_bank(language):
    for key in _CODE:
        if key.lower() in language.lower():
            return _CODE[key]
    return _GENERIC_CODE



_MCQ_PYTHON = {
    "Easy": [{"q":"What is type(1/2) in Python 3?","opts":["<class 'float'>","<class 'int'>","<class 'number'>","Error"],"c":0}, {"q":"How to declare a list?","opts":["[]","{}","()","<>"],"c":0}, {"q":"Keyword for function?","opts":["def","func","function","define"],"c":0}],
    "Medium": [{"q":"What is a decorator?","opts":["A function that modifies another function","A class","A variable","An error handler"],"c":0}, {"q":"What does `yield` do?","opts":["Returns a generator","Exits a loop","Raises an exception","Creates a thread"],"c":0}],
    "Hard": [{"q":"What is the GIL?","opts":["Mutex that protects access to Python objects","A security feature","A package manager","A memory leak"],"c":0}, {"q":"What are metaclasses?","opts":["Classes of classes","Base classes","Abstract classes","Decorators"],"c":0}]
}

_MCQ_JAVA = {
    "Easy": [{"q":"Size of int?","opts":["32 bits","16 bits","64 bits","8 bits"],"c":0}, {"q":"Keyword for inheritance?","opts":["extends","implements","inherits","super"],"c":0}],
    "Medium": [{"q":"== vs .equals()?","opts":["== compares reference, equals compares value","== compares value, equals compares reference","No difference","== is for strings only"],"c":0}, {"q":"Runtime exception is?","opts":["Unchecked exception","Checked exception","Error","Compile error"],"c":0}],
    "Hard": [{"q":"Type erasure?","opts":["Compiler removes generic type info at runtime","Garbage collection of types","Converting generic to Object","A runtime exception"],"c":0}]
}

_MCQ_CPP = {
    "Easy": [{"q":"Output text?","opts":["cout <<","print()","System.out","console.log"],"c":0}, {"q":"Pointer symbol?","opts":["*","&","#","@"],"c":0}],
    "Medium": [{"q":"Reference variable?","opts":["Alias for another variable","Pointer","Memory address","Constant"],"c":0}, {"q":"What does 'new' do?","opts":["Allocates memory on heap","Creates file","Starts thread","Initializes class"],"c":0}],
    "Hard": [{"q":"RAII?","opts":["Resource Acquisition Is Initialization","Random Access Memory","Runtime Application Interface","Reference Array"],"c":0}]
}

def _get_mcq_bank(language):
    lang = language.lower()
    if "python" in lang: return _MCQ_PYTHON
    if "java" in lang and "script" not in lang: return _MCQ_JAVA
    if "c++" in lang or "cpp" in lang: return _MCQ_CPP
    return _MCQ_JS

def _get_all_mcqs():
    all_mcqs = []
    for bank in (_MCQ_JS, _MCQ_PYTHON, _MCQ_JAVA, _MCQ_CPP):
        for questions in bank.values():
            all_mcqs.extend(questions)
    return all_mcqs


def _dedupe_mcqs(mcqs):
    seen = set()
    unique = []
    for q in mcqs:
        key = q["q"].strip().lower()
        if key not in seen:
            seen.add(key)
            unique.append(q)
    return unique


def _build_fallback(data):
    mcq_bank = _get_mcq_bank(data.language)
    diff = data.difficulty if data.difficulty in mcq_bank else "Medium"
    primary_mcqs = mcq_bank.get(diff, [])[:]
    other_mcqs = []
    for k in mcq_bank:
        if k != diff:
            other_mcqs.extend(mcq_bank[k])

    random.shuffle(primary_mcqs)
    random.shuffle(other_mcqs)

    available_mcqs = _dedupe_mcqs(primary_mcqs + other_mcqs)
    if len(available_mcqs) < 25:
        extra_mcqs = _dedupe_mcqs(_get_all_mcqs())
        random.shuffle(extra_mcqs)
        for q in extra_mcqs:
            if len(available_mcqs) >= 25:
                break
            if q["q"].strip().lower() not in {x["q"].strip().lower() for x in available_mcqs}:
                available_mcqs.append(q)

    if len(available_mcqs) < 25:
        available_mcqs = (available_mcqs + available_mcqs)[:25]

    mcqs = available_mcqs[:25]
    texts = random.sample(_TEXT[diff], min(5, len(_TEXT[diff])))
    codes = random.sample(_get_code_bank(data.language), min(5, len(_get_code_bank(data.language))))

    questions = []
    qid = 1
    for m in mcqs:
        ans = m["opts"][m["c"]]
        questions.append({"id":qid,"type":"mcq","question":m["q"],"options":m["opts"],"correct":m["c"], "explanation": f"The correct answer is '{ans}'."})
        qid += 1
    for t in texts:
        questions.append({"id":qid,"type":"text","question":t.format(role=data.role, language=data.language), "explanation": "A strong answer should include clear structure, relevant examples, and demonstrate deep understanding of the core concepts."})
        qid += 1
    for co in codes:
        ans = co["opts"][co["c"]]
        questions.append({"id":qid,"type":"code","question":co["q"],"code":co["code"],"options":co["opts"],"correct":co["c"], "explanation": f"When executing this code, the exact output will be '{ans}'."})
        qid += 1

    random.shuffle(questions)
    for i, q in enumerate(questions):
        q["id"] = i + 1
    return questions


# Company interview style hints
_COMPANY_HINTS = {
    "Google":    "Focus on algorithmic complexity, system design scalability, and abstract problem-solving. Questions should be similar to Google's FAANG-level interviews.",
    "Amazon":    "Emphasize Leadership Principles, customer obsession, and scalable system design. Include behavioral questions tied to Amazon's 16 LPs.",
    "Meta":      "Focus on product thinking, large-scale distributed systems, and coding efficiency. Mirror Meta's loop-style interview pattern.",
    "Microsoft": "Blend of OOP design, coding patterns, and system design. Questions should reflect Microsoft's structured, methodical interview style.",
    "TCS":       "Focus on basic programming concepts, aptitude-style coding, database queries, and core CS fundamentals. Reflect TCS NQT/Ninja style.",
    "Wipro":     "Emphasize core programming, data structures, and scenario-based problem solving. Reflect Wipro Elite/WILP interview patterns.",
    "Infosys":   "Focus on fundamental CS concepts, basic algorithms, and logical reasoning. Reflect Infosys InfyTQ and Specialist Programmer style.",
    "Startup":   "Prioritize full-stack thinking, practical problem solving, product intuition, and ability to work independently.",
}


def _gemini_generate(data):
    if _client is None:
        return None

    company     = getattr(data, 'company', None) or ""
    company_ctx = ""
    if company and company in _COMPANY_HINTS:
        company_ctx = f"\nCompany Style — {company}: {_COMPANY_HINTS[company]}\nTailor question style and content to reflect {company}'s known interview patterns."

    prompt = f"""Generate exactly 35 unique interview questions for a {data.role} with {data.experience} experience.
Programming Language: {data.language}
Difficulty Level: {data.difficulty.upper()}{company_ctx}

CRITICAL INSTRUCTION: You MUST strictly enforce the {data.difficulty.upper()} difficulty level.
- EASY: Basic syntax, core concepts, simple definitions, and common methods.
- MEDIUM: Intermediate features, application architecture, performance, and moderate debugging.
- HARD: Deep language internals, complex system design, memory management, obscure edge cases, and highly complex code snippets.

Return ONLY a JSON array with exactly:
- 25 objects with type "mcq": {{"id":N,"type":"mcq","question":"...","options":["A","B","C","D"],"correct":0,"explanation":"Short explanation of why this is correct."}}
- 5 objects with type "text": {{"id":N,"type":"text","question":"...","explanation":"Short key points to look for in a good answer."}}
- 5 objects with type "code": {{"id":N,"type":"code","question":"What is the exact output?","code":"...actual {data.language} code...","options":["out1","out2","out3","out4"],"correct":0,"explanation":"Short explanation of the code execution."}}

Return ONLY valid JSON array, no markdown."""

    for model in ("gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"):
        try:
            resp = _client.models.generate_content(model=model, contents=prompt)
            text = resp.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.startswith("```"):     text = text[3:]
            if text.endswith("```"):       text = text[:-3]
            text  = text.strip()
            start = text.find('[')
            end   = text.rfind(']')
            if start != -1 and end != -1:
                text = text[start:end+1]
            parsed = json.loads(text)
            if isinstance(parsed, list) and len(parsed) >= 35:
                return parsed[:35]
        except Exception:
            continue
    return None


def generate_questions(data):
    result = _gemini_generate(data)
    if result:
        return result
    return _build_fallback(data)


def get_questions_map(questions: list) -> dict:
    """Convert question list to {id: question_dict} for fast lookup."""
    return {q.get("id", i): q for i, q in enumerate(questions)}