// Comprehensive question bank — mirrors the Python backend fallback logic
// Used as client-side fallback when the backend is unreachable

const MCQ_JS = {
  Easy: [
    { q: "What does `typeof null` return?", opts: ["'object'", "'null'", "'undefined'", "'boolean'"], c: 0 },
    { q: "Which method adds to end of an array?", opts: ["push()", "pop()", "shift()", "unshift()"], c: 0 },
    { q: "What is `===` in JavaScript?", opts: ["Strict equality", "Assignment", "Loose equality", "Bitwise AND"], c: 0 },
    { q: "How do you declare a constant?", opts: ["const", "let", "var", "static"], c: 0 },
    { q: "What does `Array.isArray([])` return?", opts: ["true", "false", "null", "undefined"], c: 0 },
    { q: "Which removes the last array element?", opts: ["pop()", "push()", "shift()", "slice()"], c: 0 },
    { q: "What is NaN?", opts: ["Not a Number", "Null and None", "Negative Number", "None"], c: 0 },
    { q: "What does JSON.parse() do?", opts: ["Converts JSON string to object", "Converts object to JSON", "Parses HTML", "Encodes URL"], c: 0 },
    { q: "How do you check if a variable is an array?", opts: ["Array.isArray()", "isArray()", "typeof", "instanceof"], c: 0 },
    { q: "Which keyword exits a loop?", opts: ["break", "exit", "stop", "return"], c: 0 },
    { q: "What is `undefined` in JS?", opts: ["Declared but not assigned", "null value", "Empty string", "Zero"], c: 0 },
    { q: "Which loop is guaranteed to run at least once?", opts: ["do...while", "while", "for", "for...of"], c: 0 },
    { q: "How do you convert a string to integer?", opts: ["parseInt()", "toInt()", "Integer()", "Number.parse()"], c: 0 },
    { q: "What is a function in programming?", opts: ["Reusable block of code", "A variable", "A data type", "A loop"], c: 0 },
    { q: "What does `length` property return on a string?", opts: ["Number of characters", "Number of words", "Index of last char", "undefined"], c: 0 },
    { q: "How to write a single-line comment in JS?", opts: ["// comment", "# comment", "<!-- comment -->", "/* comment"], c: 0 },
    { q: "What is the default value of an uninitialized variable?", opts: ["undefined", "null", "0", "''"], c: 0 },
    { q: "Which method joins array elements into a string?", opts: ["join()", "concat()", "toString()", "merge()"], c: 0 },
    { q: "What is an object in JavaScript?", opts: ["Key-value pair collection", "A function", "A number type", "An array"], c: 0 },
    { q: "How do you create an empty array?", opts: ["[]", "{}", "()", "<>"], c: 0 },
    { q: "What does `==` do?", opts: ["Loose equality check", "Strict equality", "Assignment", "Comparison with type"], c: 0 },
    { q: "How to get array length?", opts: ["arr.length", "arr.size()", "arr.count", "len(arr)"], c: 0 },
    { q: "What is a boolean?", opts: ["true or false value", "0 or 1 number", "Yes/No string", "null value"], c: 0 },
    { q: "Which method returns index of element in array?", opts: ["indexOf()", "find()", "search()", "locate()"], c: 0 },
    { q: "How do you access object property `name` on obj?", opts: ["obj.name", "obj[name]", "obj->name", "obj::name"], c: 0 },
    { q: "What does `console.log()` do?", opts: ["Prints to console", "Opens a log file", "Saves data", "Alerts user"], c: 0 },
    { q: "What does `return` do in a function?", opts: ["Exits and returns value", "Loops back", "Pauses execution", "Throws error"], c: 0 },
    { q: "Which is NOT a JS data type?", opts: ["integer", "string", "boolean", "undefined"], c: 0 },
    { q: "How do you write a string in JS?", opts: ["'text' or \"text\"", "<text>", "[text]", "{text}"], c: 0 },
    { q: "What does `JSON.stringify()` do?", opts: ["Converts object to JSON string", "Parses JSON", "Validates JSON", "Encodes URI"], c: 0 },
  ],
  Medium: [
    { q: "What is event bubbling?", opts: ["Event propagates from child to parent", "Event from parent to child", "Event cancellation", "Event cloning"], c: 0 },
    { q: "What does `Promise.all()` do?", opts: ["Runs all promises in parallel", "Runs promises in series", "Cancels all promises", "Returns first resolved"], c: 0 },
    { q: "What is a closure?", opts: ["Function retaining outer scope", "Global variable", "Async function", "Class method"], c: 0 },
    { q: "What does `Object.freeze()` do?", opts: ["Prevents mutation", "Copies object", "Deletes object", "Sorts properties"], c: 0 },
    { q: "What is prototypal inheritance?", opts: ["Objects inherit from other objects", "Class-based inheritance", "Mixin pattern", "None"], c: 0 },
    { q: "What is the purpose of `use strict`?", opts: ["Enables strict mode catching more errors", "Speeds up JS", "Enables ES6", "Disables hoisting"], c: 0 },
    { q: "What does `Array.prototype.map()` return?", opts: ["New array", "Modified original", "undefined", "Boolean"], c: 0 },
    { q: "What is a Promise?", opts: ["Object for async operations", "Sync function wrapper", "Error handler", "Loop construct"], c: 0 },
    { q: "What is hoisting?", opts: ["Declarations moved to top of scope", "Variables copied", "Functions deleted", "Scope chaining"], c: 0 },
    { q: "What is `this` in an arrow function?", opts: ["Inherits from enclosing scope", "Refers to the function", "Refers to window", "undefined"], c: 0 },
    { q: "What does `spread operator` (...) do?", opts: ["Expands iterable into elements", "Merges types", "Creates generator", "Destructures"], c: 0 },
    { q: "What is destructuring?", opts: ["Extracts values from arrays/objects", "Deletes properties", "Freezes variables", "Clones objects"], c: 0 },
    { q: "What is `async/await`?", opts: ["Syntactic sugar for Promises", "New loop type", "Class decorator", "Module syntax"], c: 0 },
    { q: "What does `Array.filter()` return?", opts: ["New array with matching elements", "Boolean", "Count", "Mutated original"], c: 0 },
    { q: "What is a higher-order function?", opts: ["Takes or returns functions", "Runs faster", "Uses recursion", "Runs in parallel"], c: 0 },
    { q: "What does `preventDefault()` do?", opts: ["Stops default browser action", "Stops propagation", "Removes event", "Cancels fetch"], c: 0 },
    { q: "What does `Array.reduce()` do?", opts: ["Reduces array to single value", "Removes elements", "Sorts array", "Flattens array"], c: 0 },
    { q: "What is the purpose of `try/catch`?", opts: ["Handle runtime errors", "Speed up code", "Define async code", "Create closures"], c: 0 },
    { q: "What does `Object.keys()` return?", opts: ["Array of property names", "Array of values", "Object copy", "Boolean"], c: 0 },
    { q: "What is `event.stopPropagation()`?", opts: ["Stops event from bubbling", "Cancels default action", "Removes listener", "Fires event"], c: 0 },
    { q: "What is `typeof` used for?", opts: ["Returns type of variable", "Converts type", "Compares types", "Assigns type"], c: 0 },
    { q: "What is a callback function?", opts: ["Function passed as argument", "Async function", "Class method", "Return value"], c: 0 },
    { q: "What does `fetch()` return?", opts: ["Promise", "Data directly", "String", "Array"], c: 0 },
    { q: "What is optional chaining (`?.`)?", opts: ["Safely access nested properties", "Spread operator", "Ternary shorthand", "Null coalescing"], c: 0 },
    { q: "What is the nullish coalescing operator (`??`)?", opts: ["Returns right side if left is null/undefined", "Logical OR", "Logical AND", "Ternary"], c: 0 },
    { q: "What is `localStorage`?", opts: ["Browser persistent key-value storage", "Server-side storage", "Session-only storage", "Cookie"], c: 0 },
    { q: "What is a module in JS?", opts: ["File with exports/imports", "A class", "A function", "An object"], c: 0 },
    { q: "What is an IIFE?", opts: ["Immediately Invoked Function Expression", "Inline If-Else", "Internal Import", "Iterable Interface"], c: 0 },
    { q: "What does `Array.find()` return?", opts: ["First matching element", "All matching elements", "Index of match", "Boolean"], c: 0 },
    { q: "What does `Object.values()` return?", opts: ["Array of property values", "Array of keys", "Object copy", "Boolean"], c: 0 },
  ],
  Hard: [
    { q: "What is the Temporal Dead Zone?", opts: ["Period before let/const is initialized", "Async delay", "Garbage collected area", "Frozen scope"], c: 0 },
    { q: "What is memoization?", opts: ["Caching function results", "Memory management", "Async queuing", "Recursive optimization"], c: 0 },
    { q: "What does `Symbol()` create?", opts: ["Unique primitive value", "String alias", "Object key", "Number"], c: 0 },
    { q: "What is a WeakMap?", opts: ["Map with weak object references (GC-able)", "Immutable map", "Sorted map", "Async map"], c: 0 },
    { q: "What is tail call optimization?", opts: ["Reuses stack frame for tail calls", "Sorts tail values", "Removes recursion", "Parallelizes calls"], c: 0 },
    { q: "What does `Object.create(null)` produce?", opts: ["Object with no prototype", "Empty array", "Frozen object", "Null object"], c: 0 },
    { q: "What is a Proxy object?", opts: ["Intercepts object operations", "Copies an object", "Async wrapper", "Module proxy"], c: 0 },
    { q: "What is currying?", opts: ["Transform multi-arg fn to chain of single-arg fns", "Loop technique", "Type conversion", "Memoization"], c: 0 },
    { q: "What is the difference between microtask and macrotask?", opts: ["Microtasks run before macrotasks in event loop", "Macrotasks are faster", "No difference", "Microtasks are synchronous"], c: 0 },
    { q: "What is a generator function?", opts: ["Function that can pause/resume with yield", "Async function", "Recursive function", "Factory function"], c: 0 },
    { q: "What is the event loop?", opts: ["Mechanism to handle async operations in JS", "A for loop", "Network loop", "UI render loop"], c: 0 },
    { q: "What are Web Workers?", opts: ["Background JS threads", "Service workers", "DOM workers", "Async functions"], c: 0 },
    { q: "What does `Object.defineProperty()` do?", opts: ["Defines/modifies property descriptor", "Creates object", "Freezes property", "Deletes property"], c: 0 },
    { q: "What is `Function.prototype.bind()`?", opts: ["Creates new function with fixed `this`", "Calls function", "Applies arguments", "Clones function"], c: 0 },
    { q: "What is tree shaking?", opts: ["Removing unused code in bundling", "DOM manipulation", "Sorting algorithm", "Memory cleanup"], c: 0 },
    { q: "What is a pure function?", opts: ["Same input always gives same output, no side effects", "Function with no arguments", "Async function", "Recursive function"], c: 0 },
    { q: "What is `requestAnimationFrame()`?", opts: ["Schedules callback before next paint", "Delays execution", "Runs on each event", "Async timer"], c: 0 },
    { q: "What is `AbortController`?", opts: ["Cancels fetch/async operations", "Controls DOM", "Stops event loop", "Manages workers"], c: 0 },
    { q: "What is throttling vs debouncing?", opts: ["Throttle limits rate; debounce waits for pause", "Same concept", "Throttle is async", "Debounce is sync"], c: 0 },
    { q: "What does `Promise.race()` do?", opts: ["Resolves/rejects with first settled promise", "Waits for all", "Returns array", "Cancels others"], c: 0 },
    { q: "What is `structuredClone()`?", opts: ["Deep copies an object", "Shallow copy", "Freezes object", "Clones DOM"], c: 0 },
    { q: "What is `Object.assign()` limitation?", opts: ["Only shallow copy; nested objects are referenced", "Cannot copy arrays", "Slow performance", "Mutates source"], c: 0 },
    { q: "What is the module pattern?", opts: ["IIFE that exposes a public API hiding internals", "Import/export syntax", "Class pattern", "Singleton"], c: 0 },
    { q: "What is `Promise.allSettled()`?", opts: ["Waits for all promises regardless of outcome", "Same as Promise.all", "Returns first settled", "Cancels on first failure"], c: 0 },
    { q: "What is `structuredClone()` vs JSON parse/stringify?", opts: ["structuredClone handles Dates/Maps; JSON doesn't", "Same result", "JSON is faster always", "structuredClone is deprecated"], c: 0 },
  ],
};

const MCQ_PYTHON = {
  Easy: [
    { q: "What is type(1/2) in Python 3?", opts: ["<class 'float'>", "<class 'int'>", "<class 'number'>", "Error"], c: 0 },
    { q: "How to declare a list?", opts: ["[]", "{}", "()", "<>"], c: 0 },
    { q: "Keyword for function?", opts: ["def", "func", "function", "define"], c: 0 },
    { q: "How do you print in Python?", opts: ["print()", "echo()", "console.log()", "log()"], c: 0 },
    { q: "What is the keyword for a loop over a sequence?", opts: ["for", "foreach", "loop", "iterate"], c: 0 },
    { q: "How do you get the length of a list?", opts: ["len(list)", "list.length", "list.size()", "count(list)"], c: 0 },
    { q: "What is None in Python?", opts: ["Absence of value (like null)", "False", "0", "Empty string"], c: 0 },
    { q: "How do you create a dictionary?", opts: ["{}", "[]", "()", "<>"], c: 0 },
    { q: "What operator is used for exponentiation?", opts: ["**", "^", "^^", "exp"], c: 0 },
    { q: "How do you add a comment in Python?", opts: ["# comment", "// comment", "/* comment */", "<!-- comment -->"], c: 0 },
    { q: "What does range(5) produce?", opts: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "1,2,3,4"], c: 0 },
    { q: "How do you check a data type?", opts: ["type()", "typeof()", "datatype()", "gettype()"], c: 0 },
    { q: "What keyword is used to import a module?", opts: ["import", "include", "require", "use"], c: 0 },
    { q: "How do you slice a list (first 3 items)?", opts: ["list[:3]", "list[0:3:1]", "list[1:3]", "list.slice(3)"], c: 0 },
    { q: "What is a tuple?", opts: ["Immutable sequence", "Mutable list", "Dictionary key", "Set type"], c: 0 },
    { q: "What is the boolean value of 0 in Python?", opts: ["False", "True", "None", "Error"], c: 0 },
    { q: "How do you convert string '5' to int?", opts: ["int('5')", "str2int('5')", "Integer('5')", "parse('5')"], c: 0 },
    { q: "What does `in` keyword do in Python?", opts: ["Checks membership", "Imports module", "Declares variable", "Loops"], c: 0 },
    { q: "What is string concatenation operator in Python?", opts: ["+", "&", "|", "~"], c: 0 },
    { q: "What is `pass` in Python?", opts: ["No-operation placeholder", "Skip current iteration", "Exit block", "Return nothing"], c: 0 },
    { q: "How do you define a class?", opts: ["class MyClass:", "define MyClass:", "new MyClass:", "create MyClass:"], c: 0 },
    { q: "What is `__init__`?", opts: ["Constructor method", "Destructor", "Import statement", "Module init"], c: 0 },
    { q: "What does `append()` do to a list?", opts: ["Adds element at end", "Removes element", "Sorts list", "Copies list"], c: 0 },
    { q: "What is `self` in Python class?", opts: ["Reference to current instance", "Global variable", "Class name", "Static method"], c: 0 },
    { q: "How do you check if a key exists in a dictionary?", opts: ["key in dict", "dict.has(key)", "dict.contains(key)", "exists(key, dict)"], c: 0 },
  ],
  Medium: [
    { q: "What is a decorator?", opts: ["A function that modifies another function", "A class", "A variable", "An error handler"], c: 0 },
    { q: "What does `yield` do?", opts: ["Returns a generator", "Exits a loop", "Raises an exception", "Creates a thread"], c: 0 },
    { q: "What is list comprehension?", opts: ["Concise way to create lists", "List documentation", "List sorting", "List copying"], c: 0 },
    { q: "What is the difference between `is` and `==`?", opts: ["is checks identity; == checks value", "is checks value; == checks identity", "No difference", "is is for strings only"], c: 0 },
    { q: "What is *args in Python?", opts: ["Variable number of positional arguments", "Required arguments", "Keyword arguments", "Default arguments"], c: 0 },
    { q: "What is **kwargs?", opts: ["Variable number of keyword arguments", "Positional arguments", "Default values", "Required parameters"], c: 0 },
    { q: "What is a lambda function?", opts: ["Anonymous single-expression function", "Class method", "Async function", "Recursive function"], c: 0 },
    { q: "What does `map()` do in Python?", opts: ["Applies function to each element", "Filters elements", "Reduces to single value", "Sorts elements"], c: 0 },
    { q: "What does `filter()` do?", opts: ["Returns elements where function returns True", "Transforms elements", "Counts elements", "Removes duplicates"], c: 0 },
    { q: "What is a set in Python?", opts: ["Unordered collection of unique elements", "Ordered list", "Key-value pairs", "Immutable sequence"], c: 0 },
    { q: "What is `with` statement used for?", opts: ["Context management (auto cleanup)", "Loop syntax", "Import alias", "Exception handling"], c: 0 },
    { q: "What does `zip()` do in Python?", opts: ["Pairs elements from multiple iterables", "Compresses data", "Combines strings", "Creates tuples"], c: 0 },
    { q: "What is `enumerate()`?", opts: ["Adds counter to iterable", "Counts elements", "Creates index", "Converts to list"], c: 0 },
    { q: "What is `sorted()` vs `.sort()`?", opts: ["sorted() returns new list; .sort() modifies in-place", "Same", "sorted() is faster", ".sort() returns new list"], c: 0 },
    { q: "What is the difference between `copy()` and `deepcopy()`?", opts: ["copy() is shallow; deepcopy() is recursive", "No difference", "copy() is recursive", "deepcopy() copies only top level"], c: 0 },
    { q: "What is `@property`?", opts: ["Decorator to make method accessible as attribute", "Class property", "Static method", "Abstract method"], c: 0 },
    { q: "What is duck typing?", opts: ["Type checking by behavior, not class", "Dynamic typing", "Strong typing", "Type casting"], c: 0 },
    { q: "What does `any()` return?", opts: ["True if any element is truthy", "True if all elements are truthy", "Count of truthy elements", "List of truthy elements"], c: 0 },
    { q: "What does `all()` return?", opts: ["True if all elements are truthy", "True if any element is truthy", "Count of truthy elements", "Boolean list"], c: 0 },
    { q: "What is exception handling in Python?", opts: ["try/except block to handle errors", "Raising errors", "Logging errors", "Ignoring errors"], c: 0 },
    { q: "What is `functools.lru_cache`?", opts: ["Memoization decorator", "Sorting function", "Async utility", "Thread lock"], c: 0 },
    { q: "What does `collections.defaultdict` do?", opts: ["Dict with default value for missing keys", "Ordered dict", "Immutable dict", "Sorted dict"], c: 0 },
    { q: "What is a generator expression?", opts: ["Lazy evaluated version of list comprehension", "Generator function", "yield statement", "Async iterator"], c: 0 },
    { q: "What is `__str__` in Python?", opts: ["Returns human-readable string representation", "Type checker", "Comparison method", "Constructor"], c: 0 },
    { q: "What is global and local variable scope?", opts: ["Global: module-level; Local: function-level", "Same thing", "Global is faster", "Local is persistent"], c: 0 },
  ],
  Hard: [
    { q: "What is the GIL?", opts: ["Mutex that protects access to Python objects", "A security feature", "A package manager", "A memory leak"], c: 0 },
    { q: "What are metaclasses?", opts: ["Classes of classes", "Base classes", "Abstract classes", "Decorators"], c: 0 },
    { q: "What is `__slots__`?", opts: ["Restricts instance attributes to save memory", "Defines class slots", "Creates slots for methods", "Abstract attribute"], c: 0 },
    { q: "What is a context manager?", opts: ["Object implementing __enter__ and __exit__", "Thread manager", "Memory manager", "Import manager"], c: 0 },
    { q: "What is the MRO (Method Resolution Order)?", opts: ["Order Python looks up methods in class hierarchy", "Method call priority", "Module resolution", "Memory order"], c: 0 },
    { q: "What is `asyncio`?", opts: ["Library for writing concurrent code using async/await", "Thread library", "Process management", "IO buffering"], c: 0 },
    { q: "What is `__new__` vs `__init__`?", opts: ["__new__ creates; __init__ initializes", "Same", "__init__ creates object", "__new__ is deprecated"], c: 0 },
    { q: "What is `functools.partial`?", opts: ["Creates function with pre-filled arguments", "Sorts partial lists", "Async wrapper", "Memory optimizer"], c: 0 },
    { q: "What is monkey patching?", opts: ["Dynamically modifying module/class at runtime", "Debugging technique", "Testing method", "Memory optimization"], c: 0 },
    { q: "What is `@staticmethod`?", opts: ["Defines method that doesn't receive self or cls", "Creates static variable", "Caches method", "Makes method abstract"], c: 0 },
    { q: "What is `@classmethod`?", opts: ["Method that receives class as first argument", "Method for class creation", "Static method", "Abstract method"], c: 0 },
    { q: "What is `namedtuple`?", opts: ["Tuple with named fields", "Named dictionary", "Class with defaults", "Immutable class"], c: 0 },
    { q: "What is the difference between multiprocessing and threading in Python?", opts: ["Multiprocessing bypasses GIL; threading doesn't", "Same in Python", "Threading is faster", "Multiprocessing uses less memory"], c: 0 },
    { q: "What is `weakref` in Python?", opts: ["Reference that doesn't prevent garbage collection", "Strong reference", "Circular reference", "Thread-safe reference"], c: 0 },
    { q: "What is `abc` module?", opts: ["Abstract Base Classes", "Alphabetical sorting", "Async byte consumer", "Array binary converter"], c: 0 },
    { q: "What is `dataclasses` module?", opts: ["Decorator to auto-generate boilerplate class methods", "Data storage class", "ORM model", "NamedTuple alternative"], c: 0 },
    { q: "What does `__iter__` and `__next__` define?", opts: ["Protocol for making custom iterators", "String methods", "Dict methods", "List methods"], c: 0 },
    { q: "What is tail recursion in Python?", opts: ["Recursion at end; Python does NOT optimize it", "Recursion Python optimizes", "First recursion call", "Loop equivalent"], c: 0 },
    { q: "What is `__call__` in Python?", opts: ["Makes instance callable like a function", "Constructor", "Destructor", "Copy method"], c: 0 },
    { q: "What is `__repr__` vs `__str__`?", opts: ["repr for debugging; str for user-friendly display", "Same", "repr is deprecated", "str is for logging"], c: 0 },
    { q: "What is `itertools.chain()`?", opts: ["Chains multiple iterables into one", "Creates chain of functions", "Links objects", "Merges dicts"], c: 0 },
    { q: "What is Python's `__hash__`?", opts: ["Returns integer hash value for use in dicts/sets", "Encrypts data", "Validates data", "Compares objects"], c: 0 },
    { q: "What is a descriptor in Python?", opts: ["Object defining __get__, __set__, __delete__", "Class attribute", "Property", "Method decorator"], c: 0 },
    { q: "What is `copy-on-write` semantics?", opts: ["Data shared until modified, then copied", "Always copy on assignment", "Write before read", "Lazy loading"], c: 0 },
    { q: "What does `@property.setter` do?", opts: ["Defines a setter for a property", "Overrides property", "Creates writable attribute", "Validates property"], c: 0 },
  ],
};

const MCQ_JAVA = {
  Easy: [
    { q: "Size of int in Java?", opts: ["32 bits", "16 bits", "64 bits", "8 bits"], c: 0 },
    { q: "Keyword for inheritance in Java?", opts: ["extends", "implements", "inherits", "super"], c: 0 },
    { q: "What is the entry point of a Java program?", opts: ["public static void main(String[] args)", "main()", "start()", "run()"], c: 0 },
    { q: "How do you print in Java?", opts: ["System.out.println()", "print()", "console.log()", "echo()"], c: 0 },
    { q: "What is a String in Java?", opts: ["Immutable sequence of characters", "Mutable character array", "Primitive type", "Character pointer"], c: 0 },
    { q: "Which keyword creates an object in Java?", opts: ["new", "create", "make", "allocate"], c: 0 },
    { q: "What is `null` in Java?", opts: ["Absence of object reference", "Empty string", "Zero", "False"], c: 0 },
    { q: "What is a constructor?", opts: ["Method called when object is created", "Destructor", "Static initializer", "Main method"], c: 0 },
    { q: "What does `static` keyword mean in Java?", opts: ["Belongs to class, not instance", "Constant value", "Immutable field", "Private access"], c: 0 },
    { q: "What is `final` keyword in Java?", opts: ["Prevents modification/override/inheritance", "Makes field public", "Creates constant method", "Seals package"], c: 0 },
    { q: "What is an interface in Java?", opts: ["Abstract type defining a contract", "Concrete class", "Utility class", "Package"], c: 0 },
    { q: "What is `ArrayList`?", opts: ["Resizable array implementation of List", "Fixed array", "Linked list", "Set implementation"], c: 0 },
    { q: "What does `instanceof` do in Java?", opts: ["Checks if object is instance of a class", "Creates instance", "Compares instances", "Counts instances"], c: 0 },
    { q: "What is method overloading?", opts: ["Same method name with different parameters", "Overriding parent method", "Multiple inheritance", "Abstract method"], c: 0 },
    { q: "What is the `this` keyword in Java?", opts: ["Reference to current object", "Parent class reference", "Static reference", "Null reference"], c: 0 },
    { q: "What is `super` keyword in Java?", opts: ["Reference to parent class", "Static reference", "Self reference", "Package reference"], c: 0 },
    { q: "What is encapsulation?", opts: ["Bundling data and methods, hiding internals", "Inheriting from class", "Creating interface", "Overriding methods"], c: 0 },
    { q: "What is `HashMap` in Java?", opts: ["Key-value store with O(1) average lookup", "Sorted map", "Thread-safe map", "Ordered map"], c: 0 },
    { q: "What is autoboxing in Java?", opts: ["Auto conversion between primitives and wrappers", "Auto import", "Auto casting", "Auto serialization"], c: 0 },
    { q: "What does `break` do in a Java loop?", opts: ["Exits the loop immediately", "Skips current iteration", "Pauses execution", "Exits method"], c: 0 },
    { q: "What are access modifiers in Java?", opts: ["public, private, protected, package-private", "static, final, abstract", "void, int, String", "try, catch, finally"], c: 0 },
    { q: "What is `void` return type?", opts: ["Method returns nothing", "Returns null", "Returns 0", "Returns empty string"], c: 0 },
    { q: "What is the `for-each` loop?", opts: ["Enhanced loop for iterating collections", "Counting loop", "Indexed loop", "Infinite loop"], c: 0 },
    { q: "What is casting in Java?", opts: ["Converting one type to another", "Creating new instance", "Copying object", "Type comparison"], c: 0 },
    { q: "What is an array in Java?", opts: ["Fixed-size collection of same-type elements", "Dynamic list", "Key-value pairs", "Ordered set"], c: 0 },
  ],
  Medium: [
    { q: "== vs .equals() in Java?", opts: ["== compares reference, equals compares value", "== compares value, equals compares reference", "No difference", "== is for strings only"], c: 0 },
    { q: "What is a runtime exception?", opts: ["Unchecked exception", "Checked exception", "Error", "Compile error"], c: 0 },
    { q: "What is polymorphism in Java?", opts: ["Same interface, different implementations", "Multiple inheritance", "Type conversion", "Method hiding"], c: 0 },
    { q: "What is method overriding?", opts: ["Subclass provides its own implementation", "Same class new method", "Static method override", "Constructor override"], c: 0 },
    { q: "What is an abstract class?", opts: ["Class that cannot be instantiated directly", "Class with no methods", "Fully implemented class", "Private class"], c: 0 },
    { q: "What is `StringBuilder`?", opts: ["Mutable string builder (faster for concatenation)", "Immutable string", "String formatter", "Pattern matcher"], c: 0 },
    { q: "What is `generics` in Java?", opts: ["Type-safe containers and methods", "Generic programming", "Type casting", "Auto-boxing"], c: 0 },
    { q: "What is `Optional` in Java 8?", opts: ["Container for possibly absent value", "Optional parameter", "Nullable type", "Default value"], c: 0 },
    { q: "What is a `Stream` in Java 8?", opts: ["Functional pipeline for processing data", "File stream", "Network stream", "Input stream"], c: 0 },
    { q: "What is the `Lambda` expression in Java 8?", opts: ["Anonymous function syntax", "Loop shorthand", "Class shorthand", "Import shorthand"], c: 0 },
    { q: "What is garbage collection in Java?", opts: ["Automatic memory management", "Manual memory free", "Object deletion", "Null assignment"], c: 0 },
    { q: "What is the `finally` block?", opts: ["Always executes after try/catch", "Only runs on exception", "Optional cleanup", "Returns value"], c: 0 },
    { q: "What is `enum` in Java?", opts: ["Fixed set of named constants", "Variable group", "Interface type", "Abstract class"], c: 0 },
    { q: "What is the difference between `List`, `Set`, and `Map` in Java?", opts: ["List ordered+dups; Set no-dups; Map key-value", "Same interface", "List is fastest", "Map allows duplicates"], c: 0 },
    { q: "What is `@Override` annotation?", opts: ["Marks method as overriding parent method", "Creates new method", "Hides parent method", "Makes method final"], c: 0 },
    { q: "What is `ConcurrentHashMap`?", opts: ["Thread-safe HashMap implementation", "Sorted HashMap", "Linked HashMap", "Weak reference map"], c: 0 },
    { q: "What is `Comparable` interface?", opts: ["Defines natural ordering via compareTo()", "Compares two external objects", "Sorting utility", "Equality check"], c: 0 },
    { q: "What is `synchronization` in Java?", opts: ["Controlling access to shared resources in threads", "Sequential execution", "Method locking", "Data copying"], c: 0 },
    { q: "What is `try-with-resources` in Java?", opts: ["Auto-closes resources after try block", "Multiple try blocks", "Nested try", "Exception grouping"], c: 0 },
    { q: "What is `HashMap` vs `LinkedHashMap`?", opts: ["HashMap unordered; LinkedHashMap insertion-ordered", "Same", "LinkedHashMap is faster", "HashMap is sorted"], c: 0 },
    { q: "What is `Iterator` in Java?", opts: ["Object for traversing collections", "Interface for sorting", "Loop construct", "Index pointer"], c: 0 },
    { q: "What is `varargs` in Java?", opts: ["Variable-length argument list", "Verified arguments", "Virtual arguments", "Default arguments"], c: 0 },
    { q: "What is `Runnable` interface?", opts: ["Functional interface for thread execution", "Thread class", "Task scheduler", "Process manager"], c: 0 },
    { q: "What is `Collections` utility class?", opts: ["Static methods for collection operations", "Abstract collection", "Generic list", "Sorted set"], c: 0 },
    { q: "What is `instanceof` pattern matching in Java 16?", opts: ["Combines instanceof check with cast", "New instanceof operator", "Pattern class", "Type switch"], c: 0 },
  ],
  Hard: [
    { q: "What is type erasure in Java?", opts: ["Compiler removes generic type info at runtime", "Garbage collection of types", "Converting generic to Object", "A runtime exception"], c: 0 },
    { q: "What is the Java Memory Model (JMM)?", opts: ["Specification for thread interaction with memory", "Garbage collection model", "Object lifecycle", "Stack allocation model"], c: 0 },
    { q: "What is `volatile` keyword in Java?", opts: ["Ensures variable visibility across threads", "Constant value", "Thread-local variable", "Atomic operation"], c: 0 },
    { q: "What is `ReentrantLock`?", opts: ["Explicit lock allowing reentry by same thread", "Read-only lock", "Distributed lock", "Database lock"], c: 0 },
    { q: "What is `CompletableFuture`?", opts: ["Async computation with callback chaining", "Future with blocking get", "Thread future", "Scheduled task"], c: 0 },
    { q: "What is JIT compilation?", opts: ["Runtime compilation of bytecode to native code", "Just-in-time testing", "Incremental compilation", "Ahead-of-time compilation"], c: 0 },
    { q: "What is `WeakReference` in Java?", opts: ["Reference eligible for GC if no strong refs", "Soft reference", "Phantom reference", "Strong reference"], c: 0 },
    { q: "What is `double-checked locking`?", opts: ["Singleton pattern optimization for thread safety", "Locking twice for reliability", "Double mutex", "Two-phase locking"], c: 0 },
    { q: "What is `ClassLoader`?", opts: ["Loads classes into JVM at runtime", "Creates class instances", "Compiles classes", "Validates bytecode"], c: 0 },
    { q: "What is `ThreadLocal`?", opts: ["Provides per-thread variable copies", "Shared thread variable", "Thread-safe variable", "Local thread scope"], c: 0 },
    { q: "What does `serialVersionUID` do?", opts: ["Version identifier for serializable classes", "Unique object ID", "Class hash", "Thread ID"], c: 0 },
    { q: "What is `G1 GC` in Java?", opts: ["Garbage-first garbage collector for large heaps", "Generation 1 GC", "Generational GC", "Global GC"], c: 0 },
    { q: "What is `record` class in Java 16+?", opts: ["Immutable data class with auto-generated methods", "Read-only class", "Abstract data type", "Sealed class"], c: 0 },
    { q: "What is a sealed class in Java 17?", opts: ["Class restricting which classes can extend it", "Immutable class", "Final class with interface", "Abstract sealed type"], c: 0 },
    { q: "What is `var` keyword in Java 10?", opts: ["Local variable type inference", "Global variable", "Variant type", "Void alternative"], c: 0 },
    { q: "What is the Fork/Join framework?", opts: ["Work-stealing parallel execution framework", "Thread pooling", "Async framework", "Message passing"], c: 0 },
    { q: "What are phantom references in Java?", opts: ["References enqueued after finalization", "Weak references", "Soft references", "Strong references"], c: 0 },
    { q: "What is `Project Loom`?", opts: ["Virtual threads for lightweight concurrency", "Async IO project", "New GC algorithm", "Module system"], c: 0 },
    { q: "What is the `Strategy` design pattern?", opts: ["Defines family of algorithms, encapsulates each", "Factory method", "Observer pattern", "Singleton"], c: 0 },
    { q: "What is the `Visitor` design pattern?", opts: ["Separates algorithm from object structure", "Visits all objects", "Observer pattern", "Chain of responsibility"], c: 0 },
    { q: "What is `StackOverflowError` in Java?", opts: ["Stack exhausted due to deep recursion", "Heap overflow", "Array overflow", "Buffer overflow"], c: 0 },
    { q: "What is `Phaser` in Java concurrency?", opts: ["Flexible barrier for phased computations", "Thread phase manager", "Async phase controller", "Lock alternative"], c: 0 },
    { q: "What is `instanceof` vs `getClass()` in Java?", opts: ["instanceof allows subtypes; getClass() exact match", "Same", "getClass() allows subtypes", "instanceof is deprecated"], c: 0 },
    { q: "What is bytecode in Java?", opts: ["Compiled Java code run by JVM", "Machine code", "Source code binary", "JIT compiled code"], c: 0 },
    { q: "What is the `Decorator` design pattern?", opts: ["Adds behavior dynamically without subclassing", "Modifies class definition", "Wraps constructor", "Copies behavior"], c: 0 },
  ],
};

const MCQ_CPP = {
  Easy: [
    { q: "How do you output text in C++?", opts: ["cout <<", "print()", "System.out", "console.log"], c: 0 },
    { q: "What symbol declares a pointer in C++?", opts: ["*", "&", "#", "@"], c: 0 },
    { q: "How do you include a header in C++?", opts: ["#include <header>", "import header", "using header", "require header"], c: 0 },
    { q: "What is `cin` used for?", opts: ["Reading input from user", "Output to console", "File reading", "String input"], c: 0 },
    { q: "What does `endl` do in C++?", opts: ["Newline and flush stream", "End of file", "Loop end", "End of string"], c: 0 },
    { q: "What should `int main()` return for success?", opts: ["0", "1", "-1", "void"], c: 0 },
    { q: "What is a reference variable in C++?", opts: ["Alias for another variable", "Pointer to variable", "Copy of variable", "Global variable"], c: 0 },
    { q: "What does `new` do in C++?", opts: ["Allocates memory on heap", "Creates stack variable", "Imports class", "Initializes array"], c: 0 },
    { q: "What is `delete` keyword in C++?", opts: ["Frees heap memory", "Removes variable", "Destroys class", "Clears array"], c: 0 },
    { q: "What is a namespace in C++?", opts: ["Scope for identifiers to avoid name collisions", "Memory space", "Class scope", "Function scope"], c: 0 },
    { q: "What is `const` in C++?", opts: ["Makes variable/parameter immutable", "Creates constant pointer", "Declares constant class", "Fixed-size array"], c: 0 },
    { q: "What is the difference between `struct` and `class` in C++?", opts: ["struct defaults public; class defaults private", "Same", "struct has no methods", "class has no fields"], c: 0 },
    { q: "What is a destructor in C++?", opts: ["Called when object is destroyed", "Constructor variant", "Memory allocator", "Virtual method"], c: 0 },
    { q: "What is `std::vector`?", opts: ["Dynamic resizable array", "Static array", "Linked list", "Set container"], c: 0 },
    { q: "What is `sizeof()` operator in C++?", opts: ["Returns size of type/variable in bytes", "Counts elements", "Returns bit size", "Measures string length"], c: 0 },
    { q: "What is `auto` keyword in C++11?", opts: ["Type inference from initializer", "Automatic memory", "Auto increment", "Automatic loop"], c: 0 },
    { q: "What is function overloading in C++?", opts: ["Same name functions with different parameters", "Override virtual function", "Lambda function", "Template function"], c: 0 },
    { q: "What are access specifiers in C++?", opts: ["public, private, protected", "static, const, volatile", "inline, extern, register", "virtual, override, final"], c: 0 },
    { q: "What is `nullptr` in C++11?", opts: ["Null pointer constant (type-safe)", "NULL macro", "Zero integer", "Void pointer"], c: 0 },
    { q: "What is `static` in class context in C++?", opts: ["Shared across all instances", "Immutable member", "Private member", "Virtual member"], c: 0 },
    { q: "What is the scope resolution operator in C++?", opts: ["::", "->", ".", "::>"], c: 0 },
    { q: "What is `this` pointer in C++?", opts: ["Pointer to current object instance", "Null pointer", "Parent class pointer", "Static pointer"], c: 0 },
    { q: "What is `inline` function in C++?", opts: ["Hint to compiler to expand at call site", "Inner function", "Static function", "Recursive function"], c: 0 },
    { q: "What is `std::string` in C++?", opts: ["String class in C++ standard library", "Primitive string type", "Character array", "String literal"], c: 0 },
    { q: "What is `bool` type in C++?", opts: ["true or false", "0 or 1 integer", "Yes or No string", "Bit value"], c: 0 },
  ],
  Medium: [
    { q: "What is a virtual function in C++?", opts: ["Enables runtime polymorphism", "Inline function", "Static function", "Templated function"], c: 0 },
    { q: "What is a pure virtual function?", opts: ["Abstract function = 0; must be overridden", "Virtual with body", "Static virtual", "Deleted function"], c: 0 },
    { q: "What is a template in C++?", opts: ["Generic programming for type-independent code", "Design pattern", "Macro expansion", "Class blueprint"], c: 0 },
    { q: "What is the Rule of Three in C++?", opts: ["If one of destructor/copy ctor/copy assign defined, define all", "Three constructors rule", "Memory allocation rule", "Pointer rule"], c: 0 },
    { q: "What is `std::unique_ptr`?", opts: ["Smart pointer with exclusive ownership", "Shared pointer", "Weak pointer", "Raw pointer wrapper"], c: 0 },
    { q: "What is `std::shared_ptr`?", opts: ["Reference-counted smart pointer", "Exclusive ownership pointer", "Stack pointer", "Weak pointer"], c: 0 },
    { q: "What is RAII in C++?", opts: ["Resource Acquisition Is Initialization", "Random Access Memory", "Runtime Application Interface", "Reference Array"], c: 0 },
    { q: "What is move semantics in C++11?", opts: ["Transfer ownership instead of copying", "Moving objects in memory", "Relocating pointers", "Copy optimization"], c: 0 },
    { q: "What does `std::move()` do?", opts: ["Cast to rvalue reference for move semantics", "Physically moves memory", "Swaps objects", "Copies object"], c: 0 },
    { q: "What is `constexpr` in C++?", opts: ["Evaluated at compile time", "Constant reference", "Static const", "Immutable pointer"], c: 0 },
    { q: "What is `explicit` keyword in C++?", opts: ["Prevents implicit type conversion", "Explicit export", "Explicit template", "Explicit inline"], c: 0 },
    { q: "What is `std::optional` in C++17?", opts: ["Value that may or may not be present", "Optional parameter", "Nullable pointer", "Default value"], c: 0 },
    { q: "What is `std::variant` in C++17?", opts: ["Type-safe union", "Multiple inheritance", "Polymorphic container", "Type alias"], c: 0 },
    { q: "What is a lambda expression in C++11?", opts: ["Anonymous function object", "Macro", "Template function", "Static function"], c: 0 },
    { q: "What is `std::mutex`?", opts: ["Mutual exclusion synchronization primitive", "Memory utility", "Message utility", "Multi-threading utility"], c: 0 },
    { q: "What is perfect forwarding in C++?", opts: ["Forwarding arguments preserving value category", "Moving arguments", "Copying arguments", "Casting arguments"], c: 0 },
    { q: "What is `std::function`?", opts: ["General-purpose function wrapper", "Lambda wrapper", "Method pointer", "Callback type"], c: 0 },
    { q: "What is `std::map` in C++?", opts: ["Sorted associative container (key-value pairs)", "Hash map", "Unordered map", "Multimap"], c: 0 },
    { q: "What is `std::unordered_map`?", opts: ["Hash map with O(1) average lookup", "Sorted map", "Tree-based map", "Ordered map"], c: 0 },
    { q: "What is exception safety in C++?", opts: ["Guarantees about state after exception", "No exceptions allowed", "Exception handling", "Error codes"], c: 0 },
    { q: "What is `std::thread` in C++11?", opts: ["C++11 portable thread class", "Process class", "Async class", "Fiber class"], c: 0 },
    { q: "What is an rvalue reference (`&&`) in C++?", opts: ["Reference to temporary/movable object", "Double reference", "Const reference", "Pointer reference"], c: 0 },
    { q: "What is `std::algorithm` header?", opts: ["STL header with algorithms like sort, find", "Custom algorithm", "Sorting library", "Data structure"], c: 0 },
    { q: "What does `explicit` prevent?", opts: ["Implicit type conversion in constructor calls", "All conversions", "Copy construction", "Move construction"], c: 0 },
    { q: "What is the Rule of Five in C++11?", opts: ["If one of 5 special functions defined, define all", "5 constructors rule", "5 access specifiers", "5 inheritance types"], c: 0 },
  ],
  Hard: [
    { q: "What is CRTP (Curiously Recurring Template Pattern)?", opts: ["Derived class as template parameter of base", "Recursive template", "Circular template", "Template RTTI"], c: 0 },
    { q: "What is undefined behavior in C++?", opts: ["Code with no guaranteed behavior per standard", "Runtime error", "Compile error", "Warning"], c: 0 },
    { q: "What is `std::atomic` in C++?", opts: ["Type for lock-free atomic operations", "Thread-safe string", "Constant value", "Memory barrier"], c: 0 },
    { q: "What is the pimpl idiom?", opts: ["Pointer-to-implementation to hide details", "Private implementation", "Pointer manipulation", "Public interface"], c: 0 },
    { q: "What is template specialization?", opts: ["Custom implementation for specific template types", "Template inheritance", "Template overloading", "Template aliasing"], c: 0 },
    { q: "What is SFINAE?", opts: ["Substitution Failure Is Not An Error", "Strict Function Interface And Evaluation", "Static Function Inline Attribute", "Structured Format Interface"], c: 0 },
    { q: "What is `decltype` in C++?", opts: ["Queries type of expression at compile time", "Declares type", "Default type", "Delete type"], c: 0 },
    { q: "What is a virtual table (vtable)?", opts: ["Runtime dispatch table for virtual functions", "Variable table", "Value table", "Template table"], c: 0 },
    { q: "What is structured binding in C++17?", opts: ["Decompose object into named variables", "Binding interface", "Reference binding", "Template binding"], c: 0 },
    { q: "What is `if constexpr` in C++17?", opts: ["Compile-time conditional branch", "Constexpr if-statement", "Template if", "Static if"], c: 0 },
    { q: "What are concepts in C++20?", opts: ["Named requirements for template parameters", "Interface contracts", "Class concepts", "Abstract types"], c: 0 },
    { q: "What is EBO (Empty Base Optimization)?", opts: ["Zero size for empty base class subobjects", "Empty object optimization", "Base class removal", "Inline base class"], c: 0 },
    { q: "What is return value optimization (RVO)?", opts: ["Compiler elides copy/move on return", "Returns reference", "Returns pointer", "Move optimization"], c: 0 },
    { q: "What is name mangling in C++?", opts: ["Compiler encodes function name with type info", "Renaming variables", "Obfuscation", "Symbol compression"], c: 0 },
    { q: "What is `std::enable_if` used for?", opts: ["SFINAE conditional type trait", "Enable feature flag", "Conditional compilation", "Type check"], c: 0 },
    { q: "What is `std::span` in C++20?", opts: ["Non-owning view over contiguous memory", "Span container", "Smart pointer", "String view"], c: 0 },
    { q: "What is `std::ranges` in C++20?", opts: ["Range-based algorithms and views", "Range for loop", "Array range", "Iterator range"], c: 0 },
    { q: "What is `std::jthread` in C++20?", opts: ["Joinable thread with automatic join", "Joinable thread wrapper", "Detached thread", "Thread pool"], c: 0 },
    { q: "What is `std::latch` in C++20?", opts: ["One-time countdown synchronization", "Mutex variant", "Barrier", "Semaphore"], c: 0 },
    { q: "What is `memory_order` in atomics?", opts: ["Specifies memory ordering constraints", "Memory allocation order", "Cache order", "Thread order"], c: 0 },
    { q: "What is a fold expression in C++17?", opts: ["Expands parameter pack with binary operator", "Folded lambda", "Recursive template fold", "Pack expansion"], c: 0 },
    { q: "What is `std::coroutine` in C++20?", opts: ["Language-level coroutine support", "Async function", "Thread coroutine", "Generator class"], c: 0 },
    { q: "What does `[[nodiscard]]` attribute do?", opts: ["Warns if return value is ignored", "Marks function as pure", "Disables optimization", "Marks deprecated"], c: 0 },
    { q: "What is `std::allocator`?", opts: ["Custom memory allocation interface", "Stack allocator", "Garbage collector", "Pool allocator"], c: 0 },
    { q: "What is `std::string_view` in C++17?", opts: ["Non-owning view into string", "Mutable string", "String slice", "String reference wrapper"], c: 0 },
  ],
};

const TEXT = {
  Easy: [
    "Introduce yourself and describe your experience as a {role}.",
    "What made you choose {language} as your primary programming language?",
    "Describe a small project you built and what you learned from it.",
    "How do you stay updated with new technologies in your field?",
    "What do you consider your biggest technical strength?",
    "Explain in simple terms what a {role} does on a daily basis.",
    "How do you approach debugging a problem in {language}?",
    "Describe a time you worked in a team. What was your contribution?",
  ],
  Medium: [
    "Describe a challenging project you led as a {role}. What was the outcome?",
    "How do you ensure code quality and maintainability in {language}?",
    "Tell me about a production bug you fixed. What was your debugging process?",
    "How do you approach system design for a new feature?",
    "Describe a situation where you disagreed with a teammate. How did you resolve it?",
    "How do you balance technical debt with feature delivery?",
    "What design patterns do you use most in {language} and why?",
    "How do you mentor junior developers?",
  ],
  Hard: [
    "Design a scalable microservices architecture for a high-traffic application. Walk me through your decisions.",
    "Describe the most complex performance optimization you've implemented. What metrics improved?",
    "How would you approach migrating a monolith to microservices without downtime?",
    "Explain a situation where you made a difficult architectural trade-off and the long-term impact.",
    "How do you approach incident management and postmortems?",
    "Describe how you would design a distributed caching layer for a global application.",
    "How do you evaluate and introduce new technologies to your team?",
    "Explain how you handle security vulnerabilities discovered in a live system.",
  ],
};

const CODE = {
  JavaScript: [
    { q: "What is the output?", code: "let x = 5;\nconsole.log(x++);\nconsole.log(x);", opts: ["5\n6", "6\n6", "5\n5", "6\n5"], c: 0 },
    { q: "What does this print?", code: "console.log(typeof typeof 42);", opts: ["'string'", "'number'", "'object'", "'undefined'"], c: 0 },
    { q: "What is the output?", code: "const a = [1,2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);", opts: ["3", "2", "1", "Error"], c: 0 },
    { q: "What does this print?", code: "function greet() {\n  return\n  'Hello';\n}\nconsole.log(greet());", opts: ["undefined", "'Hello'", "null", "SyntaxError"], c: 0 },
    { q: "What is logged?", code: "console.log(0.1 + 0.2 === 0.3);", opts: ["false", "true", "NaN", "TypeError"], c: 0 },
    { q: "What is the output?", code: "const obj = {a:1};\nObject.freeze(obj);\nobj.a = 2;\nconsole.log(obj.a);", opts: ["1", "2", "undefined", "TypeError"], c: 0 },
    { q: "What does this print?", code: "console.log([] == ![]);", opts: ["true", "false", "TypeError", "undefined"], c: 0 },
    { q: "What is the output?", code: "console.log(1 + '2' + 3);", opts: ["'123'", "6", "'15'", "Error"], c: 0 },
  ],
  Python: [
    { q: "What does this print?", code: "x = [1,2,3]\ny = x\ny.append(4)\nprint(len(x))", opts: ["4", "3", "1", "Error"], c: 0 },
    { q: "What is the output?", code: "print(type(1/2))", opts: ["<class 'float'>", "<class 'int'>", "<class 'number'>", "Error"], c: 0 },
    { q: "What does this print?", code: "a = [1,2,3]\nprint(a[-1])", opts: ["3", "1", "-1", "Error"], c: 0 },
    { q: "What is the output?", code: "d = {'a':1,'b':2}\nprint(d.get('c', 0))", opts: ["0", "None", "Error", "'c'"], c: 0 },
    { q: "What is printed?", code: "print(bool('') or bool('hello'))", opts: ["True", "False", "hello", "Error"], c: 0 },
    { q: "What does this output?", code: "x = 10\ndef f():\n    x = 20\nf()\nprint(x)", opts: ["10", "20", "None", "Error"], c: 0 },
    { q: "What is the output?", code: "nums = [1,2,3,4]\nprint(nums[1:3])", opts: ["[2, 3]", "[1, 2]", "[2, 3, 4]", "[1, 2, 3]"], c: 0 },
    { q: "What is printed?", code: "print(3 * 'ab')", opts: ["ababab", "ab3", "Error", "abababab"], c: 0 },
  ],
  Java: [
    { q: "What does this print?", code: "int x = 5;\nSystem.out.println(x++);", opts: ["5", "6", "Error", "4"], c: 0 },
    { q: "What is the output?", code: "String s = null;\nSystem.out.println(s instanceof String);", opts: ["false", "true", "NullPointerException", "Error"], c: 0 },
    { q: "What does this print?", code: "int[] arr = {1,2,3};\nSystem.out.println(arr.length);", opts: ["3", "2", "arr.length", "Error"], c: 0 },
    { q: "What is logged?", code: "System.out.println(10 / 3);", opts: ["3", "3.33", "3.0", "Error"], c: 0 },
    { q: "What is the output?", code: "System.out.println(\"5\" + 3 + 2);", opts: ["532", "10", "53", "Error"], c: 0 },
    { q: "What does this print?", code: "int i=0;\nwhile(i<3) { i++; }\nSystem.out.println(i);", opts: ["3", "2", "4", "0"], c: 0 },
    { q: "What is output?", code: "System.out.println(Integer.toBinaryString(10));", opts: ["1010", "10", "1001", "1100"], c: 0 },
    { q: "What is printed?", code: "String a = \"hi\";\nString b = \"hi\";\nSystem.out.println(a == b);", opts: ["true", "false", "Error", "null"], c: 0 },
  ],
  "C++": [
    { q: "What does this output?", code: "int x = 5;\ncout << x++;", opts: ["5", "6", "Error", "4"], c: 0 },
    { q: "What is printed?", code: "cout << 10/3;", opts: ["3", "3.33", "3.0", "Error"], c: 0 },
    { q: "What does this print?", code: "int a=1, b=2;\ncout << (a > b ? a : b);", opts: ["2", "1", "true", "Error"], c: 0 },
    { q: "What is the output?", code: "int arr[]={1,2,3};\ncout << sizeof(arr)/sizeof(arr[0]);", opts: ["3", "4", "1", "Error"], c: 0 },
    { q: "What is printed?", code: "cout << !0 << !1;", opts: ["10", "01", "11", "00"], c: 0 },
    { q: "What does this output?", code: "int x=10;\nint &r=x;\nr=20;\ncout << x;", opts: ["20", "10", "Error", "undefined"], c: 0 },
    { q: "What is the result?", code: "cout << (7 & 3);", opts: ["3", "7", "1", "4"], c: 0 },
    { q: "What is printed?", code: "int x=5;\ncout << (x<<1);", opts: ["10", "5", "2", "Error"], c: 0 },
  ],
};

const GENERIC_CODE = [
  { q: "What does this pseudocode return for input [3,1,4,1,5]?", code: "function maxVal(arr):\n  m = arr[0]\n  for x in arr:\n    if x > m: m = x\n  return m", opts: ["5", "3", "4", "1"], c: 0 },
  { q: "How many times does this loop run?", code: "i = 0\nwhile i < 10:\n  i += 3", opts: ["4", "3", "10", "5"], c: 0 },
  { q: "What is the output of this recursion for n=4?", code: "function f(n):\n  if n==0: return 0\n  return n + f(n-1)", opts: ["10", "4", "6", "8"], c: 0 },
  { q: "What does this return?", code: "arr = [1,2,3,4,5]\nresult = [x*2 for x in arr if x%2==0]", opts: ["[4, 8]", "[2, 4, 6, 8, 10]", "[4, 6, 8]", "[2, 4]"], c: 0 },
  { q: "What is the time complexity of binary search?", code: "# Binary search on sorted array of n elements", opts: ["O(log n)", "O(n)", "O(n²)", "O(1)"], c: 0 },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMCQBank(language) {
  const lang = (language || "").toLowerCase();
  if (lang.includes("python")) return MCQ_PYTHON;
  if (lang.includes("java") && !lang.includes("script")) return MCQ_JAVA;
  if (lang.includes("c++") || lang.includes("cpp")) return MCQ_CPP;
  return MCQ_JS;
}

function getCodeBank(language) {
  const lang = (language || "").toLowerCase();
  for (const key of Object.keys(CODE)) {
    if (key.toLowerCase() === lang || lang.includes(key.toLowerCase())) {
      return CODE[key];
    }
  }
  return GENERIC_CODE;
}

function getAllMCQs() {
  return [MCQ_JS, MCQ_PYTHON, MCQ_JAVA, MCQ_CPP].flatMap((bank) =>
    Object.values(bank).flat()
  );
}

function dedupeMCQs(mcqs) {
  const seen = new Set();
  return mcqs.filter((q) => {
    const key = q.q.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Generates a full 35-question fallback set:
 * 25 MCQs + 5 Text + 5 Code questions
 * Used when the backend API is unreachable.
 */
export function buildFallbackQuestions({ role, language, difficulty }) {
  const mcqBank = getMCQBank(language);
  const diff = ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : "Medium";

  const primaryMCQs = shuffle(mcqBank[diff] || []);
  const otherMCQs = shuffle(
    Object.entries(mcqBank)
      .filter(([k]) => k !== diff)
      .flatMap(([, v]) => v)
  );

  let availableMCQs = dedupeMCQs([...primaryMCQs, ...otherMCQs]);

  if (availableMCQs.length < 25) {
    const existingKeys = new Set(availableMCQs.map((q) => q.q.trim().toLowerCase()));
    for (const q of shuffle(dedupeMCQs(getAllMCQs()))) {
      if (availableMCQs.length >= 25) break;
      if (!existingKeys.has(q.q.trim().toLowerCase())) {
        availableMCQs.push(q);
        existingKeys.add(q.q.trim().toLowerCase());
      }
    }
  }

  // Pad if still short
  while (availableMCQs.length < 25) {
    availableMCQs = [...availableMCQs, ...availableMCQs].slice(0, 25);
  }

  const mcqs = availableMCQs.slice(0, 25);
  const textPool = TEXT[diff] || TEXT["Medium"];
  const texts = shuffle(textPool).slice(0, 5);
  const codePool = getCodeBank(language);
  const codes = shuffle(codePool).slice(0, Math.min(5, codePool.length));

  const questions = [];
  let qid = 1;

  for (const m of mcqs) {
    const ans = m.opts[m.c];
    questions.push({
      id: qid++,
      type: "mcq",
      question: m.q,
      options: m.opts,
      correct: m.c,
      explanation: `The correct answer is '${ans}'.`,
    });
  }

  for (const t of texts) {
    questions.push({
      id: qid++,
      type: "text",
      question: t.replace(/{role}/g, role).replace(/{language}/g, language),
      explanation:
        "A strong answer should include clear structure, relevant examples, and demonstrate deep understanding.",
    });
  }

  for (const co of codes) {
    const ans = co.opts[co.c];
    questions.push({
      id: qid++,
      type: "code",
      question: co.q,
      code: co.code,
      options: co.opts,
      correct: co.c,
      explanation: `When executing this code, the exact output will be '${ans}'.`,
    });
  }

  const shuffled = shuffle(questions);
  shuffled.forEach((q, i) => { q.id = i + 1; });
  return shuffled;
}
