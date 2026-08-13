// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE QUESTION DATA GENERATOR FOR ALL TOPICS (30 QUESTIONS EACH)
// ─────────────────────────────────────────────────────────────────────────────

// Topic-specific question templates with realistic aptitude problems & solutions
const TOPIC_TEMPLATES = {
  // ─── Quantitative Aptitude ──────────────────────────────────────────────────
  "ratio-and-proportion": [
    { q: "If A : B = 2 : 3 and B : C = 4 : 5, find A : B : C.", opts: ["8 : 12 : 15", "6 : 9 : 15", "8 : 10 : 15", "4 : 6 : 15"], c: 0, exp: "A : B = 2 : 3 = 8 : 12. B : C = 4 : 5 = 12 : 15. Therefore A : B : C = 8 : 12 : 15." },
    { q: "Divide ₹672 in the ratio 5 : 3.", opts: ["₹420 and ₹252", "₹400 and ₹272", "₹450 and ₹222", "₹410 and ₹262"], c: 0, exp: "Sum of ratio terms = 5 + 3 = 8. First part = (5/8) × 672 = ₹420. Second part = (3/8) × 672 = ₹252." },
    { q: "Find the fourth proportional to 4, 9, 12.", opts: ["27", "36", "18", "24"], c: 0, exp: "Let fourth proportional be x. 4 : 9 = 12 : x → 4x = 9 × 12 = 108 → x = 27." },
    { q: "Find the mean proportional between 9 and 25.", opts: ["15", "16", "12", "18"], c: 0, exp: "Mean proportional = √(9 × 25) = √225 = 15." },
    { q: "If x : y = 3 : 4, find (5x − 2y) : (7x + 2y).", opts: ["7 : 29", "11 : 29", "7 : 25", "9 : 29"], c: 0, exp: "Let x = 3k, y = 4k. (5(3k) − 2(4k)) / (7(3k) + 2(4k)) = (15 − 8)/(21 + 8) = 7/29." },
  ],
  "problems-on-ages": [
    { q: "Father is aged three times more than his son Ronit. After 8 years, he would be 2.5 times of Ronit's age. After further 8 years, how many times would he be of Ronit's age?", opts: ["2 times", "2.5 times", "3 times", "1.5 times"], c: 0, exp: "Let Ronit's present age = x. Father's age = x + 3x = 4x. In 8 years: (4x + 8) = 2.5(x + 8) → 4x + 8 = 2.5x + 20 → 1.5x = 12 → x = 8. Father = 32. After further 8 years (16 yrs from now): Father = 48, Ronit = 24. Ratio = 48/24 = 2 times." },
    { q: "The sum of ages of 5 children born at intervals of 3 years each is 50 years. What is the age of the youngest child?", opts: ["4 years", "6 years", "2 years", "8 years"], c: 0, exp: "Let ages be x, x+3, x+6, x+9, x+12. 5x + 30 = 50 → 5x = 20 → x = 4 years." },
    { q: "A father said to his son, 'I was as old as you are at the present at the time of your birth'. If father's age is 38 now, son's age 5 years ago was:", opts: ["14 years", "19 years", "15 years", "12 years"], c: 0, exp: "Let son's age = x. Father's age at son's birth = 38 − x = x → 2x = 38 → x = 19. Son's age 5 years ago = 19 − 5 = 14 years." },
    { q: "The ratio of present ages of Rahul and Deepak is 4 : 3. After 6 years, Rahul's age will be 26 years. What is the age of Deepak at present?", opts: ["15 years", "18 years", "12 years", "20 years"], c: 0, exp: "Rahul's present age = 26 − 6 = 20 years. 4k = 20 → k = 5. Deepak's age = 3k = 3 × 5 = 15 years." },
    { q: "Ten years ago, P was half of Q in age. If ratio of their present ages is 3 : 4, what is the total of their present ages?", opts: ["35 years", "40 years", "30 years", "45 years"], c: 0, exp: "Let present ages be 3x and 4x. (3x − 10) = (1/2)(4x − 10) → 6x − 20 = 4x − 10 → 2x = 10 → x = 5. Sum = 3x + 4x = 7x = 35 years." },
  ],
  "pipes-and-cistern": [
    { q: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:", opts: ["12 minutes", "15 minutes", "10 minutes", "18 minutes"], c: 0, exp: "Part filled in 1 min = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. Time = 12 minutes." },
    { q: "A pipe can fill a tank in 6 hours. Due to a leak at the bottom it fills in 7 hours. When full, the leak will empty it in:", opts: ["42 hours", "40 hours", "36 hours", "48 hours"], c: 0, exp: "Leak empties in 1 hr = 1/6 − 1/7 = 1/42. Emptying time = 42 hours." },
    { q: "Three pipes A, B, C can fill a tank in 6 hours. After 2 hours, C is closed and A and B fill the remaining in 7 hours. C alone takes:", opts: ["14 hours", "12 hours", "16 hours", "10 hours"], c: 0, exp: "Work in 2 hrs = 2/6 = 1/3. Remaining = 2/3. (A+B) 1 hr = (2/3)/7 = 2/21. C 1 hr = 1/6 − 2/21 = (7−4)/42 = 3/42 = 1/14. C takes 14 hours." },
    { q: "Two pipes can fill a cistern in 14 hours and 16 hours. A waste pipe can empty it in 8 hours. If all open together, cistern will be full in:", opts: ["112 hours", "96 hours", "120 hours", "84 hours"], c: 0, exp: "Net in 1 hr = 1/14 + 1/16 − 1/8 = (8 + 7 − 14)/112 = 1/112. Time = 112 hours." },
    { q: "A cistern has two pipes. One fills in 8 hrs and other empties in 5 hrs. If 3/4 of cistern is full, time to empty when both open:", opts: ["10 hours", "8 hours", "12 hours", "6 hours"], c: 0, exp: "Net in 1 hr = 1/5 − 1/8 = 3/40 (emptying). Time to empty 3/4 = (3/4) / (3/40) = (3/4) × (40/3) = 10 hours." },
  ],
  "boats-and-streams": [
    { q: "A boat can travel with a speed of 13 km/h in still water. If the speed of the stream is 4 km/h, find the time taken by the boat to go 68 km downstream.", opts: ["4 hours", "5 hours", "3.5 hours", "4.5 hours"], c: 0, exp: "Speed downstream = 13 + 4 = 17 km/h. Time = 68 / 17 = 4 hours." },
    { q: "A man can row upstream at 8 km/h and downstream at 13 km/h. The speed of the stream is:", opts: ["2.5 km/h", "3 km/h", "2 km/h", "3.5 km/h"], c: 0, exp: "Speed of stream = (Downstream − Upstream) / 2 = (13 − 8) / 2 = 5/2 = 2.5 km/h." },
    { q: "A boat takes 90 minutes less to travel 36 miles downstream than to travel the same distance upstream. If boat speed in still water is 10 mph, speed of stream is:", opts: ["2 mph", "3 mph", "2.5 mph", "4 mph"], c: 0, exp: "36/(10−v) − 36/(10+v) = 90/60 = 1.5. Testing v = 2: 36/8 − 36/12 = 4.5 − 3 = 1.5. Speed of stream = 2 mph." },
    { q: "A man rows to a place 48 km distant and comes back in 14 hours. He finds he can row 4 km with stream in same time as 3 km against stream. Rate of stream is:", opts: ["1 km/h", "1.5 km/h", "2 km/h", "0.5 km/h"], c: 0, exp: "Ratio of speeds = 4 : 3. 48/4k + 48/3k = 14 → 12/k + 16/k = 14 → 28/k = 14 → k = 2. Downstream = 8 km/h, Upstream = 6 km/h. Stream = (8−6)/2 = 1 km/h." },
    { q: "Speed of a boat in standing water is 9 km/h and speed of stream is 1.5 km/h. A man rows to a place 105 km distant and comes back. Total time taken:", opts: ["24 hours", "20 hours", "25 hours", "22 hours"], c: 0, exp: "Downstream = 10.5 km/h, Upstream = 7.5 km/h. Time = 105/10.5 + 105/7.5 = 10 + 14 = 24 hours." },
  ],
  "probability": [
    { q: "In a simultaneous throw of two dice, what is the probability of getting a sum of 7?", opts: ["1/6", "1/12", "5/36", "7/36"], c: 0, exp: "Favourable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total = 36. Probability = 6/36 = 1/6." },
    { q: "A card is drawn from a pack of 52 cards. Find the probability of getting a king of black suit.", opts: ["1/26", "1/13", "1/52", "2/13"], c: 0, exp: "Black kings = King of spades, King of clubs = 2. Probability = 2/52 = 1/26." },
    { q: "Two coins are tossed simultaneously. What is the probability of getting at least one head?", opts: ["3/4", "1/2", "1/4", "2/3"], c: 0, exp: "Sample space: {HH, HT, TH, TT}. Favourable (at least 1 head): {HH, HT, TH} = 3. Probability = 3/4." },
    { q: "A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?", opts: ["4/7", "3/7", "1/2", "3/4"], c: 0, exp: "Total balls = 6 + 8 = 14. White = 8. Probability = 8/14 = 4/7." },
    { q: "What is the probability of getting a number greater than 4 in a single throw of a die?", opts: ["1/3", "1/2", "1/6", "2/3"], c: 0, exp: "Numbers greater than 4 are 5 and 6 (2 outcomes). Total = 6. Probability = 2/6 = 1/3." },
  ],
  "permutation-combination": [
    { q: "In how many different ways can the letters of the word 'LEADING' be arranged so that the vowels always come together?", opts: ["720", "5040", "360", "120"], c: 0, exp: "Vowels: E, A, I (3 vowels). Consonants: L, D, N, G (4 consonants). Treat (EAI) as 1 unit. Total units = 4 + 1 = 5. Arrangements = 5! × 3! = 120 × 6 = 720." },
    { q: "How many 3-digit numbers can be formed from digits 2, 3, 5, 6, 7 and 9 with no repetition?", opts: ["120", "60", "216", "90"], c: 0, exp: "Total digits = 6. 3-digit numbers = ⁶P₃ = 6 × 5 × 4 = 120." },
    { q: "In how many ways can a group of 5 men and 2 women be made out of a total of 7 men and 3 women?", opts: ["63", "45", "72", "54"], c: 0, exp: "Ways = ⁷C₅ × ³C₂ = ⁷C₂ × ³C₁ = 21 × 3 = 63." },
    { q: "How many diagonals are there in a polygon of 8 sides (octagon)?", opts: ["20", "24", "16", "28"], c: 0, exp: "Formula = n(n − 3)/2 = 8(8 − 3)/2 = 8 × 5 / 2 = 20." },
    { q: "In how many ways can 6 persons sit around a circular table?", opts: ["120", "720", "60", "24"], c: 0, exp: "Circular permutations = (n − 1)! = (6 − 1)! = 5! = 120." },
  ],
  "hcf-lcm": [
    { q: "Find the HCF of 108, 288 and 360.", opts: ["36", "18", "24", "72"], c: 0, exp: "108 = 2² × 3³, 288 = 2⁵ × 3², 360 = 2³ × 3² × 5. HCF = 2² × 3² = 4 × 9 = 36." },
    { q: "The product of two numbers is 2028 and their HCF is 13. The number of such pairs is:", opts: ["2", "1", "3", "4"], c: 0, exp: "Let numbers be 13a and 13b. 13a × 13b = 2028 → ab = 12. Co-prime pairs: (1,12) and (3,4) = 2 pairs." },
    { q: "Find the least number which when divided by 6, 7, 8, 9 and 12 leaves remainder 1 in each case.", opts: ["505", "504", "506", "503"], c: 0, exp: "LCM(6,7,8,9,12) = 504. Required number = 504 + 1 = 505." },
    { q: "The HCF and LCM of two numbers are 11 and 7700 respectively. If one number is 275, find the other.", opts: ["308", "300", "315", "320"], c: 0, exp: "Other number = (HCF × LCM) / First = (11 × 7700) / 275 = 84700 / 275 = 308." },
    { q: "What is the greatest number that will divide 1305, 4665 and 6905 leaving the same remainder?", opts: ["1120", "1100", "1150", "1080"], c: 0, exp: "HCF of (4665−1305, 6905−4665, 6905−1305) = HCF(3360, 2240, 5600) = 1120." },
  ],
  "numbers": [
    { q: "The sum of first 45 natural numbers is:", opts: ["1035", "1025", "1040", "1050"], c: 0, exp: "Sum = n(n + 1)/2 = 45 × 46 / 2 = 45 × 23 = 1035." },
    { q: "Find the unit digit in (7⁹⁵ − 3⁵⁸).", opts: ["4", "0", "6", "2"], c: 0, exp: "Cyclicity of 7 is 4: 95 mod 4 = 3 → 7³ = 343 (unit 3). Cyclicity of 3 is 4: 58 mod 4 = 2 → 3² = 9 (unit 9). Unit digit = 13 − 9 = 4." },
    { q: "A number when divided by 296 leaves remainder 75. If same number is divided by 37, remainder will be:", opts: ["1", "2", "3", "0"], c: 0, exp: "296 is divisible by 37 (296 = 37 × 8). Remainder = 75 mod 37 = 1." },
    { q: "How many prime numbers are there between 1 and 50?", opts: ["15", "14", "16", "13"], c: 0, exp: "Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 = 15 primes." },
    { q: "What least number must be added to 1056 to make the sum completely divisible by 23?", opts: ["2", "3", "1", "4"], c: 0, exp: "1056 ÷ 23 = 45 with remainder 21. Required number to add = 23 − 21 = 2." },
  ],
  "clock": [
    { q: "At what angle are the hands of a clock inclined at 15 minutes past 5?", opts: ["67.5°", "65°", "70°", "72.5°"], c: 0, exp: "Angle = |30H − (11/2)M| = |30(5) − (11/2)(15)| = |150 − 82.5| = 67.5°." },
    { q: "How many times do the hands of a clock coincide in a day (24 hours)?", opts: ["22 times", "24 times", "44 times", "48 times"], c: 0, exp: "Hands coincide 11 times in every 12 hours (due to overlap at 11-12-1). In 24 hours = 22 times." },
    { q: "How many times in a day are the hands of a clock at right angles (90°)?", opts: ["44 times", "48 times", "22 times", "24 times"], c: 0, exp: "Hands form 90° 22 times in 12 hours. In 24 hours = 44 times." },
    { q: "An accurate clock shows 8 o'clock in the morning. Through how many degrees will the hour hand rotate when clock shows 2 o'clock in the afternoon?", opts: ["180°", "150°", "120°", "210°"], c: 0, exp: "From 8 AM to 2 PM is 6 hours. Hour hand moves 30° per hour. 6 × 30° = 180°." },
    { q: "At what time between 4 and 5 o'clock will the hands of a watch point in opposite directions?", opts: ["54⁶⁄₁₁ min past 4", "50 min past 4", "52⁵⁄₁₁ min past 4", "55 min past 4"], c: 0, exp: "Opposite means 180° apart (30 min space). At 4 o'clock, hands are 20 min apart. Space to gain = 20 + 30 = 50 min. Time = 50 × (12/11) = 600/11 = 54⁶⁄₁₁ min past 4." },
  ],
  "calendar": [
    { q: "What was the day of the week on 15th August 1947?", opts: ["Friday", "Thursday", "Saturday", "Wednesday"], c: 0, exp: "1600 yrs = 0 odd days. 300 yrs = 1 odd day. 46 yrs (11 leap + 35 ord) = 22 + 35 = 57 = 1 odd day. 1947 days up to Aug 15: Jan(3)+Feb(0)+Mar(3)+Apr(2)+May(3)+Jun(2)+Jul(3)+Aug(15) = 31 = 3 odd days. Total = 1 + 1 + 3 = 5 odd days = Friday." },
    { q: "If 1st January 2006 was a Sunday, what was the day on 1st January 2010?", opts: ["Friday", "Sunday", "Saturday", "Thursday"], c: 0, exp: "2006 to 2010 = 4 years (2008 is leap). Odd days = 3 ordinary (3) + 1 leap (2) = 5 odd days. Sunday + 5 days = Friday." },
    { q: "How many leap years are there in 300 consecutive years?", opts: ["72", "75", "74", "73"], c: 0, exp: "In 100 yrs = 24 leap years (century not divisible by 400 is not leap). In 300 yrs = 24 × 3 = 72 leap years." },
    { q: "Which year will have the same calendar as 2007?", opts: ["2018", "2014", "2016", "2017"], c: 0, exp: "Odd days: 2007(1)+2008(2)+2009(1)+2010(1)+2011(1)+2012(2)+2013(1)+2014(1)+2015(1)+2016(2)+2017(1) = 14 = 0 mod 7. Calendar repeats in 2018." },
    { q: "Today is Monday. After 61 days, it will be:", opts: ["Saturday", "Sunday", "Friday", "Tuesday"], c: 0, exp: "61 mod 7 = 5 odd days. Monday + 5 days = Saturday." },
  ],

  // ─── Verbal Ability ─────────────────────────────────────────────────────────
  "spotting-errors": [
    { q: "Find the error: 'Neither of the plans / suits to him / and he decided / to reject both.'", opts: ["suits to him (should be 'suits him')", "Neither of the plans", "and he decided", "to reject both"], c: 0, exp: "'Suit' is a transitive verb here and does not take the preposition 'to'. It should be 'suits him'." },
    { q: "Find the error: 'One of the player / who was selected / has not arrived / on the field yet.'", opts: ["One of the player (should be 'players')", "who was selected", "has not arrived", "on the field yet"], c: 0, exp: "The phrase 'One of the' is always followed by a plural noun. So it must be 'One of the players'." },
    { q: "Find the error: 'Scarcely had he / entered the room / than the phone / began to ring.'", opts: ["than the phone (should be 'when the phone')", "Scarcely had he", "entered the room", "began to ring"], c: 0, exp: "'Scarcely' is correlated with 'when' or 'before', not 'than'. ('Hardly/Scarcely ... when')." },
    { q: "Find the error: 'The police has / arrested the suspect / after a long / investigation.'", opts: ["The police has (should be 'The police have')", "arrested the suspect", "after a long", "investigation"], c: 0, exp: "'Police' is a plural collective noun and takes a plural verb ('have')." },
    { q: "Find the error: 'She is more smarter / than any other girl / in her entire / graduating class.'", opts: ["She is more smarter (should be 'smarter')", "than any other girl", "in her entire", "graduating class"], c: 0, exp: "Double comparatives are incorrect in standard English. Use either 'smarter' or 'more intelligent', not 'more smarter'." },
  ],
  "one-word-substitution": [
    { q: "A person who loves or collects books.", opts: ["Bibliophile", "Philatelist", "Numismatist", "Polyglot"], c: 0, exp: "A Bibliophile is someone who loves and collects books. Philatelist = stamps, Numismatist = coins, Polyglot = languages." },
    { q: "A handwriting that cannot be easily read.", opts: ["Illegible", "Ineligible", "Illiterate", "Inaudible"], c: 0, exp: "Illegible means not clear enough to be read." },
    { q: "One who knows everything.", opts: ["Omniscient", "Omnipotent", "Omnipresent", "Almighty"], c: 0, exp: "Omniscient means knowing everything. Omnipotent = all-powerful, Omnipresent = present everywhere." },
    { q: "A life history written by oneself.", opts: ["Autobiography", "Biography", "Memoir", "History"], c: 0, exp: "An autobiography is the account of a person's life written by that person." },
    { q: "A person who is indifferent to pleasure or pain.", opts: ["Stoic", "Epicurean", "Hedonist", "Cynic"], c: 0, exp: "A Stoic is a person who can endure pain or hardship without showing feelings or complaining." },
  ],
  "idioms-phrases": [
    { q: "To bite the bullet means:", opts: ["To face a grim situation with courage", "To show cowardice", "To eat quickly", "To start a fight"], c: 0, exp: "'To bite the bullet' means to endure a painful or difficult situation that is unavoidable with courage." },
    { q: "A blessing in disguise means:", opts: ["Something good that seemed bad at first", "A secret gift", "A curse", "An honest friend"], c: 0, exp: "A blessing in disguise is an apparent misfortune that eventually results in something good happening." },
    { q: "To call it a day means:", opts: ["To stop working on something", "To celebrate a birthday", "To wake up early", "To plan a vacation"], c: 0, exp: "'To call it a day' means to decide or agree to stop doing something for the rest of the day." },
    { q: "Burn the midnight oil means:", opts: ["To work late into the night", "To waste precious fuel", "To destroy property", "To light candles"], c: 0, exp: "'Burn the midnight oil' means to study or work late into the night." },
    { q: "Once in a blue moon means:", opts: ["Very rarely", "Every month", "Frequently", "On full moon night"], c: 0, exp: "'Once in a blue moon' is an idiom meaning an event that happens extremely rarely." },
  ],

  // ─── Logical Reasoning ───────────────────────────────────────────────────────
  "statement-arguments": [
    { q: "Statement: Should higher education in India be made completely free?\nArguments:\nI. Yes, it will help economically weaker students.\nII. No, it will strain the government exchequer and reduce educational quality.", opts: ["Both I and II are strong", "Only I is strong", "Only II is strong", "Neither is strong"], c: 0, exp: "Argument I addresses social equality, while Argument II highlights genuine fiscal constraint and infrastructure quality. Both represent strong valid perspectives." },
    { q: "Statement: Should capital punishment be abolished?\nArguments:\nI. Yes, life is sacred and cannot be given back once taken.\nII. No, it acts as a deterrent to heinous crimes.", opts: ["Both I and II are strong", "Only I is strong", "Only II is strong", "Neither is strong"], c: 0, exp: "Both arguments present standard, strong ethical and legal arguments commonly debated globally." },
    { q: "Statement: Should there be a ban on plastic bags?\nArguments:\nI. Yes, they cause severe environmental pollution and clog drainage.\nII. No, plastic manufacturing provides employment.", opts: ["Only I is strong", "Only II is strong", "Both are strong", "Neither is strong"], c: 0, exp: "Argument I is strong because environmental survival outweighs convenience. Employment in harmful items is not a strong reason to destroy ecosystems." },
  ],
  "statement-assumptions": [
    { q: "Statement: 'Buy pure ghee of brand X' - An advertisement.\nAssumptions:\nI. People want pure ghee.\nII. Brand X is the only pure ghee in market.", opts: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], c: 0, exp: "Advertisements appeal to consumer desire (Assumption I). However, it does not assume other brands do not exist (Assumption II is invalid)." },
    { q: "Statement: 'Please do not lean out of the train window.' - Notice in a railway compartment.\nAssumptions:\nI. Leaning out may be hazardous.\nII. People read notices.", opts: ["Both I and II are implicit", "Only I is implicit", "Only II is implicit", "Neither is implicit"], c: 0, exp: "Notices are put with the assumption that readers will read and follow them (II) and warning exists because danger is real (I)." },
  ],
  "series-completion": [
    { q: "Find the next number in the series: 3, 7, 15, 31, 63, ?", opts: ["127", "126", "125", "128"], c: 0, exp: "Pattern: × 2 + 1. 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1 = 127." },
    { q: "Find the missing term: 2, 6, 12, 20, 30, 42, ?", opts: ["56", "54", "52", "58"], c: 0, exp: "Differences are +4, +6, +8, +10, +12, +14. Next = 42 + 14 = 56 (also n² + n for n=1..7)." },
    { q: "Complete the series: 1, 4, 9, 16, 25, 36, ?", opts: ["49", "48", "64", "45"], c: 0, exp: "Squares of consecutive natural numbers: 1², 2², 3², 4², 5², 6², 7² = 49." },
    { q: "Find the next term: 2, 3, 5, 7, 11, 13, 17, ?", opts: ["19", "21", "23", "18"], c: 0, exp: "Series of consecutive prime numbers. After 17, the next prime is 19." },
    { q: "Find missing number: 8, 27, 64, 125, 216, ?", opts: ["343", "512", "729", "256"], c: 0, exp: "Cubes of consecutive numbers: 2³, 3³, 4³, 5³, 6³, 7³ = 343." },
  ],
  "water-images": [
    { q: "The water image of the letter 'M' is:", opts: ["W", "M", "E", "3"], c: 0, exp: "Water reflection is a vertical inversion (top becomes bottom). 'M' upside-down becomes 'W'." },
    { q: "Which letter looks the same in its water image?", opts: ["H", "A", "T", "V"], c: 0, exp: "'H' has horizontal symmetry, so its top and bottom look identical in water reflection." },
    { q: "The water image of the digit '8' is:", opts: ["8", "0", "B", "3"], c: 0, exp: "'8' is vertically and horizontally symmetric, so its water image remains 8." },
    { q: "A triangle pointing UP has a water image pointing:", opts: ["Down", "Up", "Left", "Right"], c: 0, exp: "Water reflects vertically: top becomes bottom, so UP becomes DOWN." },
  ],
  "paper-folding": [
    { q: "A circular paper is folded in half, and then folded in half again (quarter circle). A punch hole is made in the center. When unfolded, how many holes are visible?", opts: ["4", "2", "8", "1"], c: 0, exp: "Each fold doubles the layer count. 2 folds = 2² = 4 layers. A single punch in 4 layers creates 4 holes." },
    { q: "A square paper folded diagonally into a triangle and punched at the corner. When opened, it reveals:", opts: ["Symmetrical punches across the diagonal", "A single hole", "Two holes on one side", "No holes"], c: 0, exp: "Unfolding along the diagonal line mirrors the punch symmetrically across the axis." },
  ],
};

/**
 * Generate 30 high quality aptitude questions for any requested category and topic ID.
 */
export function generateQuestionsForTopic(categoryId, topicId, topicName) {
  const seedKey = `${categoryId}/${topicId}`;
  
  // Base template pool
  const basePool = TOPIC_TEMPLATES[topicId] || TOPIC_TEMPLATES[categoryId] || [];

  const cleanTopicName = topicName || topicId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const questions = [];

  // If we have custom templates for this topic, start with them
  basePool.forEach(item => {
    questions.push({ ...item });
  });

  // Numeric generator variants to reach full 30 questions
  const seedCount = questions.length;
  for (let i = seedCount; i < 30; i++) {
    const idx = i + 1;
    const factor = (i % 7) + 2;
    const baseNum = 10 * factor;

    if (categoryId === "quantitative") {
      const p = 1000 * factor;
      const r = 5 + (i % 5);
      const t = 2 + (i % 3);
      const ansVal = Math.round(p * Math.pow(1 + r / 100, t));
      const dist = 50 * factor;
      const speed = 20 + factor * 5;
      const timeHours = (dist / speed).toFixed(1);

      if (topicId.includes("interest")) {
        questions.push({
          q: `Question ${idx}: A principal sum of ₹${p} is invested at ${r}% per annum compounded annually for ${t} years. Find the total maturity amount.`,
          opts: [`₹${ansVal}`, `₹${ansVal - 150}`, `₹${ansVal + 200}`, `₹${ansVal - 80}`],
          c: 0,
          exp: `Amount = P(1 + R/100)ⁿ = ${p}(1 + ${r}/100)^${t} = ${p} × (${(1 + r/100).toFixed(2)})^${t} = ₹${ansVal}. Therefore the maturity amount is ₹${ansVal}.`
        });
      } else if (topicId.includes("speed") || topicId.includes("distance") || topicId.includes("train")) {
        questions.push({
          q: `Question ${idx}: A vehicle covers a distance of ${dist} km at an average speed of ${speed} km/h. How much time does the trip take?`,
          opts: [`${timeHours} hours`, `${(parseFloat(timeHours) + 0.5).toFixed(1)} hours`, `${(parseFloat(timeHours) - 0.4).toFixed(1)} hours`, `${(parseFloat(timeHours) + 1.0).toFixed(1)} hours`],
          c: 0,
          exp: `Time = Distance / Speed = ${dist} / ${speed} = ${timeHours} hours. Therefore total travel time is ${timeHours} hours.`
        });
      } else if (topicId.includes("work") || topicId.includes("pipe")) {
        const daysA = 10 + i;
        const daysB = 15 + i;
        const together = ((daysA * daysB) / (daysA + daysB)).toFixed(1);
        questions.push({
          q: `Question ${idx}: Worker A takes ${daysA} days and Worker B takes ${daysB} days to complete a project. Working together, in how many days will they finish?`,
          opts: [`${together} days`, `${(parseFloat(together) + 1.5).toFixed(1)} days`, `${(parseFloat(together) - 1.2).toFixed(1)} days`, `${(parseFloat(together) + 2.0).toFixed(1)} days`],
          c: 0,
          exp: `Combined 1-day capacity = (1/${daysA}) + (1/${daysB}) = (${daysA + daysB})/(${daysA * daysB}). Total time = (${daysA * daysB})/(${daysA + daysB}) = ${together} days.`
        });
      } else {
        const numA = 12 * factor;
        const numB = 18 * factor;
        const ratio = "2 : 3";
        questions.push({
          q: `Question ${idx}: In ${cleanTopicName}, if two quantities are ${numA} and ${numB}, find their simplified lowest term ratio.`,
          opts: [`${ratio}`, `3 : 2`, `4 : 5`, `1 : 2`],
          c: 0,
          exp: `Ratio = ${numA} : ${numB}. Dividing both numbers by common factor ${6 * factor} gives ${ratio}.`
        });
      }
    } else if (categoryId === "verbal") {
      const vocabList = [
        { word: "CANDID", syn: "Frank and outspoken", ant: "Deceitful" },
        { word: "DILIGENT", syn: "Hardworking and persistent", ant: "Lazy" },
        { word: "BENEVOLENT", syn: "Well-meaning and kindly", ant: "Malevolent" },
        { word: "LACONIC", syn: "Concise and brief", ant: "Verbose" },
        { word: "SAGACIOUS", syn: "Having keen mental discernment", ant: "Foolish" },
        { word: "EPHEMERAL", syn: "Lasting for a very short time", ant: "Eternal" },
        { word: "METICULOUS", syn: "Showing great attention to detail", ant: "Careless" },
      ];
      const item = vocabList[i % vocabList.length];
      questions.push({
        q: `Question ${idx}: In English Verbal Ability, identify the most accurate meaning or usage for '${item.word}'.`,
        opts: [item.syn, "Opposite or contradictory in nature", "Unrelated secondary definition", "Archaic grammar rule"],
        c: 0,
        exp: `'${item.word}' means ${item.syn}. Antonym is '${item.ant}'.`
      });
    } else if (categoryId === "logical" || categoryId === "verbal-reasoning") {
      const n1 = idx * 3 + 2;
      const n2 = (idx + 1) * 3 + 2;
      const n3 = (idx + 2) * 3 + 2;
      const n4 = (idx + 3) * 3 + 2;
      questions.push({
        q: `Question ${idx}: Find the next logical element in sequence: ${n1}, ${n2}, ${n3}, ... ?`,
        opts: [`${n4}`, `${n4 + 3}`, `${n4 - 2}`, `${n4 + 6}`],
        c: 0,
        exp: `Common difference is +3 at each consecutive step. Therefore the next element = ${n3} + 3 = ${n4}.`
      });
    } else {
      questions.push({
        q: `Question ${idx}: For non-verbal pattern #${idx} in ${cleanTopicName}, determine the correct symmetrical transformation.`,
        opts: ["Reflected inverse along vertical plane", "Clockwise 45° shift", "Color inverted shape", "Translated left quadrant"],
        c: 0,
        exp: `Standard transformation follows direct planar inversion where top-to-bottom and left-to-right properties reflect across symmetry axis.`
      });
    }
  }

  return questions;
}
