// HR Interview Questions & Answers
// Questions sourced from common HR interview topics; answers are original content.

export const HR_QUESTIONS = [
  // ─── FOR FRESHERS ──────────────────────────────────────────────────────────
  {
    id: 1,
    category: "freshers",
    question: "Tell me about yourself.",
    answer: `Start with a brief professional introduction that covers your educational background, key skills, and what drives you. Keep it concise (2–3 minutes) and relevant to the role.

**Sample Answer:**
"My name is [Name], and I recently completed my [Degree] in [Field] from [University]. During my studies, I developed strong skills in [relevant skills] and completed projects such as [brief project description].

I'm passionate about [industry/domain] because [genuine reason]. I enjoy [relevant activity, e.g., problem-solving, teamwork] and thrive in environments where I can continuously learn and contribute. I'm now looking forward to beginning my career with a company where I can apply my knowledge, grow professionally, and make a meaningful impact."`,
    tips: [
      "Keep it under 3 minutes",
      "Start with education, move to skills, end with career goals",
      "Avoid personal details like family or hobbies unless directly relevant",
      "Practice until it sounds natural, not rehearsed",
    ],
    tags: ["introduction", "self-presentation"],
  },
  {
    id: 2,
    category: "freshers",
    question: "Why should I hire you?",
    answer: `This question lets you sell yourself. Focus on the unique value you bring — skills, attitude, and potential — that aligns with the company's needs.

**Sample Answer:**
"You should hire me because I bring a combination of strong technical foundation, a collaborative mindset, and a genuine enthusiasm for this role and your company.

During my degree, I consistently worked on projects that required [relevant skills]. I'm a fast learner — when I encounter new challenges, I approach them systematically and am not afraid to ask for guidance or do independent research.

Most importantly, I'm committed and dependable. I understand that as a fresher, I have a lot to learn, and I'm genuinely excited about the opportunity to grow within your organisation. I believe I'll add value from day one and grow into a long-term asset for your team."`,
    tips: [
      "Link your skills directly to the job requirements",
      "Show enthusiasm and confidence — not arrogance",
      "Mention at least one concrete example or achievement",
      "End with your commitment to contribute long-term",
    ],
    tags: ["self-promotion", "value proposition"],
  },
  {
    id: 3,
    category: "freshers",
    question: "What are your strengths and weaknesses?",
    answer: `Be honest and strategic. Choose strengths relevant to the job and frame weaknesses as areas you are actively improving.

**Strengths (Sample):**
"One of my key strengths is my ability to break down complex problems into smaller, manageable parts. For example, during a group project in college, I led the technical architecture which helped us finish two weeks ahead of schedule.

I'm also a strong communicator — I can explain technical concepts clearly to non-technical audiences."

**Weaknesses (Sample):**
"My weakness is that I sometimes spend too much time perfecting details before moving on. I've been working on this by setting strict time-boxes for tasks and using agile techniques like stand-ups to keep myself accountable. This has noticeably improved my productivity."`,
    tips: [
      "Choose a real weakness — not a disguised strength like 'I work too hard'",
      "Always follow a weakness with what you're doing to fix it",
      "Pick a strength that directly benefits the employer",
      "Provide brief examples to make your claims credible",
    ],
    tags: ["self-awareness", "personal qualities"],
  },
  {
    id: 4,
    category: "freshers",
    question: "Why do you want to work at our company?",
    answer: `Show you've done your research. Connect the company's mission, culture, or products to your own goals and values.

**Sample Answer:**
"I've admired [Company Name] for its focus on [specific value — e.g., innovation, customer-centricity, sustainability]. When I researched your recent work on [specific project or product], I was genuinely impressed by how the team approached [specific challenge].

Your company's culture of [e.g., continuous learning / collaborative teams] aligns perfectly with who I am as a professional. I want to be in an environment where I can grow quickly, work on meaningful problems, and make a real impact — and from everything I've read, [Company Name] offers exactly that.

I'm not just looking for any job; I specifically want to be part of what you're building here."`,
    tips: [
      "Research the company thoroughly before the interview",
      "Mention specific products, projects, or values you admire",
      "Avoid generic answers like 'it's a good company'",
      "Connect the company's future to your personal goals",
    ],
    tags: ["company research", "motivation"],
  },
  {
    id: 5,
    category: "freshers",
    question: "What is the difference between confidence and over-confidence?",
    answer: `This tests your self-awareness and emotional intelligence.

**Sample Answer:**
"Confidence is having a realistic, well-founded belief in your abilities based on preparation, knowledge, and experience. A confident person says, 'I can handle this challenge' — and backs it up with action.

Over-confidence, on the other hand, is an inflated or unrealistic self-assessment that ignores one's limitations. An over-confident person may skip preparation, dismiss feedback, and underestimate the difficulty of a task — leading to mistakes and failures.

The key difference is self-awareness. Confidence grows from knowing both what you're capable of and what you still need to learn. Over-confidence comes from ignoring the second part. I always try to stay in the confident zone by seeking feedback and acknowledging the limits of my current knowledge."`,
    tips: [
      "Show maturity and self-awareness in your answer",
      "Give a clear, crisp definition of both",
      "Optionally share a personal example of staying grounded",
    ],
    tags: ["self-awareness", "attitude"],
  },
  {
    id: 6,
    category: "freshers",
    question: "What is the difference between hard work and smart work?",
    answer: `**Sample Answer:**
"Hard work means putting in full effort and persistence toward a goal — it's about dedication and commitment, regardless of the method.

Smart work means finding the most efficient and effective way to achieve that goal. It's about prioritising, leveraging tools, delegating when appropriate, and working with strategy.

The ideal professional combines both: the discipline of hard work with the efficiency of smart work. For example, during exam preparation, I used to study for 10 hours a day without a clear strategy. Once I switched to structured revision, spaced repetition, and identifying key topics, I achieved better results in half the time — that's smart work backed by dedication.

In a work environment, I aim to be results-driven: working diligently and also asking myself, 'Is there a better way to achieve this outcome?'"`,
    tips: [
      "Avoid dismissing either approach — both have value",
      "Give a concrete example from your own life",
      "Emphasise the combination of both as ideal",
    ],
    tags: ["work ethic", "productivity"],
  },
  {
    id: 7,
    category: "freshers",
    question: "How do you feel about working nights and weekends?",
    answer: `**Sample Answer:**
"I understand that in certain roles or critical project phases, working beyond standard hours is sometimes necessary, and I'm fully prepared to do that when the situation genuinely calls for it.

That said, I also believe in sustainable productivity. I'm at my best when I maintain a healthy work-life balance in the long run. I would approach any overtime positively and professionally, making sure it contributes to a clear goal.

I would appreciate transparency about expectations upfront so I can plan accordingly and continue delivering my best work. I'm flexible and committed — and if deadlines demand extra hours, I'll absolutely step up."`,
    tips: [
      "Don't flatly refuse or flatly agree — show flexibility with boundaries",
      "Express commitment while noting sustainability",
      "Avoid sounding like you expect overtime to be frequent",
    ],
    tags: ["flexibility", "work ethic"],
  },
  {
    id: 8,
    category: "freshers",
    question: "Can you work under pressure?",
    answer: `**Sample Answer:**
"Yes, I can work effectively under pressure. I've learned to manage it by breaking large tasks into smaller milestones, prioritising ruthlessly, and communicating proactively with my team.

During my final year, I had to submit a major project, prepare for competitive exams, and manage two other coursework deadlines simultaneously. Instead of panicking, I created a detailed schedule, identified which tasks were time-sensitive, and worked systematically. I delivered everything on time without compromising quality.

I also find that a moderate level of pressure actually sharpens my focus. I perform well in high-stakes situations because I've trained myself to stay calm, think clearly, and keep moving forward."`,
    tips: [
      "Always back your claim with a real example",
      "Mention specific techniques you use to manage pressure",
      "Show calmness and problem-solving, not just endurance",
    ],
    tags: ["pressure", "resilience"],
  },
  {
    id: 9,
    category: "freshers",
    question: "Are you willing to relocate or travel?",
    answer: `**Sample Answer:**
"Yes, I am open to relocation or travel if it's required for this role or for the growth of my career. I understand that opportunities don't always come in our preferred location, and I'm at a stage in my life where flexibility is possible.

I would appreciate knowing in advance what the travel expectations are — frequency, duration, or destination — so I can plan accordingly. I don't have current constraints that would prevent me from travelling or relocating, and I'm genuinely excited about the possibility of working in new environments and experiencing different work cultures."`,
    tips: [
      "Be honest if you have constraints — it's better to discuss upfront",
      "Show enthusiasm rather than reluctance",
      "Ask a clarifying question to show you're taking it seriously",
    ],
    tags: ["flexibility", "relocation"],
  },
  {
    id: 10,
    category: "freshers",
    question: "What are your goals?",
    answer: `**Sample Answer:**
"My short-term goal is to join a company like yours where I can build a strong professional foundation in [relevant domain]. I want to contribute meaningfully from the start, learn from experienced mentors, and become proficient in the core skills this role requires.

In the medium term (3–5 years), I aim to grow into a senior role where I can lead projects, mentor junior team members, and drive measurable results.

Long-term, I aspire to become a subject-matter expert in my domain — someone who not only executes but also contributes to strategy and innovation within an organisation.

All my goals revolve around continuous growth and meaningful contribution. I'm excited about this role because it directly aligns with that journey."`,
    tips: [
      "Align your goals with what the company can offer you",
      "Have short, medium, and long-term goals ready",
      "Avoid overly vague answers like 'I want to grow and learn'",
      "Don't mention goals that conflict with the role (e.g., wanting to start a business in 1 year)",
    ],
    tags: ["career planning", "ambition"],
  },
  {
    id: 11,
    category: "freshers",
    question: "What motivates you to do a good job?",
    answer: `**Sample Answer:**
"I'm primarily motivated by the sense of accomplishment that comes from solving a difficult problem or completing a project that actually makes a difference. When I see my work create a positive impact — whether it's a feature that users love or a process that saves the team time — that drives me to keep raising my standards.

I'm also motivated by growth. I genuinely enjoy learning new things and becoming more capable over time. When I'm in an environment that challenges me to stretch beyond my current abilities, I naturally give my best effort.

Collaboration also energises me — working with a team where everyone brings their strengths and builds on each other's ideas. That kind of dynamic makes even difficult work feel rewarding."`,
    tips: [
      "Be genuine — interviewers can tell when answers are hollow",
      "Mention intrinsic motivators, not just salary or job title",
      "Connect your motivators to the role and company culture",
    ],
    tags: ["motivation", "drive"],
  },
  {
    id: 12,
    category: "freshers",
    question: "What makes you angry?",
    answer: `**Sample Answer:**
"I'm someone who generally maintains my composure at work. However, I do feel frustrated when there's a persistent lack of accountability — when team members consistently don't follow through on commitments and it affects others' work.

I also find it difficult when there's a culture of avoiding honest feedback. I believe constructive criticism is essential for growth, and when that's absent, teams stagnate.

That said, I've learned to channel frustration productively. When I notice something isn't working, I try to raise it calmly and constructively rather than reacting emotionally. I find that focusing on the problem — not the person — usually leads to better outcomes."`,
    tips: [
      "Avoid answers that make you seem hot-tempered or unprofessional",
      "Pick a professional context, not personal anger",
      "Always pivot to how you manage the emotion constructively",
    ],
    tags: ["emotional intelligence", "self-management"],
  },
  {
    id: 13,
    category: "freshers",
    question: "Give me an example of your creativity.",
    answer: `**Sample Answer:**
"During my final year project, our team was building a [type of application]. We hit a performance bottleneck with our data processing pipeline — the existing approach was too slow for real-time use.

Instead of just optimising the same algorithm, I suggested a completely different architectural approach: using [e.g., caching / a streaming architecture / a different data structure] that none of us had initially considered. I researched it independently, built a proof-of-concept over a weekend, and presented it to the team.

We adopted it, and the system ran 4x faster. The approach also made our codebase cleaner and easier to maintain. It was rewarding to see a creative solution actually work at that scale."`,
    tips: [
      "Use a concrete, specific example — not vague claims",
      "Show the problem, your creative insight, and the outcome",
      "Creativity doesn't have to be artistic — process innovations count",
    ],
    tags: ["creativity", "problem-solving"],
  },
  {
    id: 14,
    category: "freshers",
    question: "How long would you expect to work for us if hired?",
    answer: `**Sample Answer:**
"I'm looking for a long-term opportunity, not just a stepping stone. My goal is to join an organisation where I can genuinely contribute, grow, and become an increasingly valuable team member over time.

If this role and company turn out to be the right fit — which based on my research and this conversation, I believe it will be — I'd happily envision myself here for many years.

I believe loyalty is mutual: if I'm growing, contributing meaningfully, and feel valued, there's no reason to look elsewhere. I'd love to be part of building something together over the long run."`,
    tips: [
      "Never say a specific short timeline like 'one or two years'",
      "Frame your answer around mutual fit and long-term growth",
      "Show genuine interest in the company's future",
    ],
    tags: ["commitment", "retention"],
  },
  {
    id: 15,
    category: "freshers",
    question: "Are you not overqualified for this position?",
    answer: `**Sample Answer:**
"I understand why that concern might arise, but I don't see myself as overqualified for this role — I see it as the right starting point.

While I do have [specific qualification or skill], I'm at the beginning of my professional career, and I'm fully aware that academic knowledge and real-world experience are very different things. This position offers me the opportunity to apply my knowledge, learn how things work in practice, and grow within your organisation.

I'm also excited about [specific aspect of the role], which genuinely interests me. I'm not looking for the easiest job — I'm looking for the right one. And I believe this is it."`,
    tips: [
      "Acknowledge the concern respectfully before countering it",
      "Emphasise what this role uniquely offers you",
      "Show genuine interest rather than desperation",
    ],
    tags: ["self-positioning", "expectations"],
  },
  {
    id: 16,
    category: "freshers",
    question: "Describe your ideal company, location, and job.",
    answer: `**Sample Answer:**
"My ideal company is one that values continuous learning, encourages innovation, and treats its employees as contributors rather than just resources. I thrive in environments where ideas can come from anyone, and where feedback — both giving and receiving — is part of the culture.

In terms of location, I'm flexible and open to wherever the opportunity takes me. What matters more to me is the quality of the work and the team.

My ideal job involves meaningful work — projects where my contributions make a tangible difference. I enjoy roles that challenge me technically and professionally, involve some degree of collaboration, and give me ownership over my outcomes. From everything I've learned about this company and role, it closely matches what I'm looking for."`,
    tips: [
      "Describe ideals that genuinely match the role and company you're interviewing for",
      "Be flexible on location unless you genuinely aren't",
      "End by connecting your ideal to the company in front of you",
    ],
    tags: ["expectations", "fit"],
  },
  {
    id: 17,
    category: "freshers",
    question: "What are your career options right now?",
    answer: `**Sample Answer:**
"I'm currently in active discussions with a few companies in the [industry] space, and I've received one offer that I'm evaluating. However, this opportunity with [Company Name] is my top preference because of [specific reason — e.g., the team's reputation, the product's impact, the growth trajectory].

I'm being thoughtful about my first role because I want it to be the right foundation for my career — not just any opportunity. I believe that where you start shapes the trajectory of your professional life. And from my research, this role and company offer the best path forward for where I want to go."`,
    tips: [
      "Don't lie about other offers, but it's okay to mention you're exploring options",
      "Always make the interviewer feel that their company is your priority",
      "Avoid sounding desperate or indifferent — show you're in demand but selective",
    ],
    tags: ["career options", "negotiation context"],
  },
  {
    id: 18,
    category: "freshers",
    question: "Explain how you would be an asset to this organisation.",
    answer: `**Sample Answer:**
"I would be an asset to this organisation in several key ways.

First, I bring strong technical skills in [relevant area], which directly applies to [specific job requirement]. I've spent the past [years] building this expertise through [projects/coursework/self-learning].

Second, I'm adaptable and a fast learner. Whenever I've stepped into unfamiliar territory, I've been able to ramp up quickly and start contributing without much hand-holding. That saves the team time and reduces onboarding friction.

Third, I bring a positive and collaborative attitude. I genuinely enjoy working with people, sharing ideas, and helping the team succeed collectively — not just individually.

Finally, I'm deeply motivated by [this specific domain or type of work], which means I'm likely to stay committed, improve continuously, and give my full effort — not just because I have to, but because I genuinely care about doing good work."`,
    tips: [
      "Be specific — general claims without evidence are weak",
      "Map your skills and traits to real company needs",
      "Show enthusiasm for the work, not just the job title",
    ],
    tags: ["value proposition", "fit"],
  },
  {
    id: 19,
    category: "freshers",
    question: "What are your outside interests?",
    answer: `**Sample Answer:**
"Outside of work, I'm passionate about [genuine hobby]. I've been doing it for [X years], and it's taught me [relevant trait — e.g., discipline, creativity, team coordination].

I also enjoy [second interest — e.g., reading non-fiction about technology and entrepreneurship / contributing to open-source projects / playing team sports]. It keeps me mentally active and exposes me to ideas I wouldn't encounter in my day-to-day work.

I believe a well-rounded life makes for a more effective professional. Having interests outside work helps me recharge, approach problems with fresh perspective, and bring different kinds of thinking to the table."`,
    tips: [
      "Be genuine — don't fabricate interests",
      "Try to connect at least one interest to a positive professional trait",
      "Avoid controversial hobbies or anything that might seem unprofessional",
    ],
    tags: ["personality", "hobbies"],
  },
  {
    id: 20,
    category: "freshers",
    question: "Would you lie for the company?",
    answer: `**Sample Answer:**
"No, I wouldn't lie — and I believe a company that values its integrity wouldn't want me to. I understand there are situations where diplomacy, tact, and confidentiality are required, and I'm completely comfortable exercising those.

But outright lying — whether to customers, stakeholders, or colleagues — creates risks that far outweigh any short-term gain. It erodes trust, can expose the company to legal liability, and damages its reputation in the long run.

I would advocate for honest, ethical communication even in difficult situations. If I ever found myself in a position where I was pressured to act dishonestly, I would raise my concerns with leadership through appropriate channels."`,
    tips: [
      "Don't just say 'no' — explain your reasoning",
      "Acknowledge grey areas like diplomacy and confidentiality",
      "Show strong ethical grounding without sounding preachy",
    ],
    tags: ["ethics", "integrity"],
  },
  {
    id: 21,
    category: "freshers",
    question: "Who has inspired you in your life and why?",
    answer: `**Sample Answer:**
"My greatest source of inspiration has been [mentor/parent/public figure]. What I admire most is not just their achievements, but their journey — specifically [specific quality: e.g., resilience in the face of failure / consistency over decades / willingness to challenge the status quo].

Seeing how [he/she/they] approached setbacks — [brief example] — showed me that success is a product of character, not just talent. That perspective has shaped how I handle challenges in my own life.

I've also been inspired by [optional: a teacher, colleague, or public figure in your field]. They demonstrated what it means to [specific quality relevant to the role — e.g., lead with empathy / build something meaningful]. I carry that example with me in how I approach my work and relationships."`,
    tips: [
      "Choose someone you genuinely admire, not just a famous name",
      "Explain why, not just who — the 'why' shows your values",
      "Connect the inspiration to how it shapes your professional approach",
    ],
    tags: ["values", "inspiration"],
  },
  {
    id: 22,
    category: "freshers",
    question: "What was the toughest decision you ever had to make?",
    answer: `**Sample Answer:**
"One of the toughest decisions I had to make was [genuine example — e.g., choosing between two career paths, leaving a project mid-way for ethical reasons, or choosing one opportunity over another].

What made it difficult was [reason — e.g., both options had real merit, there was significant uncertainty, or I had strong obligations to multiple parties].

I approached it by writing out the pros and cons, consulting people I trust, and ultimately letting my core values guide me. I chose [option] because [reason rooted in values or long-term thinking].

Looking back, I believe it was the right call, and it taught me that the hardest decisions are usually the ones where both options have costs — and that's exactly why you have to know what you stand for."`,
    tips: [
      "Don't choose a trivial example",
      "Show your decision-making process, not just the outcome",
      "Demonstrate that you learned from the experience",
    ],
    tags: ["decision-making", "maturity"],
  },
  {
    id: 23,
    category: "freshers",
    question: "Have you considered starting your own business?",
    answer: `**Sample Answer:**
"Yes, entrepreneurship is something I find genuinely exciting, and I've thought about it. However, I believe that before founding a business, the most valuable thing I can do is gain deep industry experience, develop professional skills, and truly understand how successful organisations operate from the inside.

My goal right now is to contribute meaningfully within an established team, learn from experienced professionals, and build a foundation that would make me a more effective entrepreneur in the future — if I ever pursue that path.

So while I admire entrepreneurship and don't rule it out long-term, I'm fully committed to growing within this organisation right now. That's where my energy and focus are."`,
    tips: [
      "Be honest if you're entrepreneurially inclined, but reassure the interviewer of your commitment",
      "Frame the company experience as essential to your overall journey",
      "Don't promise you'll never start a business — focus on your current commitment",
    ],
    tags: ["ambition", "commitment"],
  },
  {
    id: 24,
    category: "freshers",
    question: "How do you define success and how do you measure up to your own definition?",
    answer: `**Sample Answer:**
"To me, success is the consistent achievement of meaningful goals through effort, growth, and positive impact — both for myself and for those around me.

It's not just about outcomes; it's about the process. Success means I'm continuously improving, maintaining my integrity, and doing work I'm genuinely proud of.

By my own definition, I believe I'm on a strong trajectory. I've [specific achievement — e.g., completed my degree with distinction / led a team project successfully / learned X skill through self-study]. I've been honest with myself about my gaps and have a clear plan to address them.

I don't see success as a destination — it's a direction. And I'm focused on making sure I'm always moving in the right direction."`,
    tips: [
      "Avoid defining success purely by money or titles",
      "Be honest when measuring yourself — humility with confidence is the right balance",
      "Connect your definition of success to what you can deliver for the company",
    ],
    tags: ["success", "values"],
  },
  {
    id: 25,
    category: "freshers",
    question: "Tell me something about our company.",
    answer: `**Sample Answer:**
"[Company Name] was founded in [year] and has grown to become [description of company's position]. What stands out to me is [specific aspect — product, mission, market position, recent initiative].

I'm particularly impressed by [specific recent news, product, or milestone]. It demonstrates your commitment to [specific value — e.g., innovation, customer experience, social impact].

Your company culture also stood out to me during my research — [e.g., the engineering blog posts on your website / the emphasis on employee growth / the diversity initiatives]. I appreciate organisations that walk the talk on their values.

I see [Company Name] as a place where ambitious, skilled professionals can do their best work — and that's exactly why I'm here today."`,
    tips: [
      "Research the company thoroughly before the interview — glassdoor, website, LinkedIn, news",
      "Mention specific facts, not generic praise",
      "Show that you've connected the company's values to your own",
    ],
    tags: ["research", "preparation"],
  },
  {
    id: 26,
    category: "freshers",
    question: "How much salary do you expect?",
    answer: `**Sample Answer:**
"I've researched industry standards for this role and for someone at my level of experience, and I believe a package in the range of [X to Y] would be fair and competitive.

That said, I'm more focused on the overall opportunity — the growth potential, mentorship, the work I'll get to do, and the culture. Compensation is important, but it's not the only factor I'm weighing.

I'm also flexible if the offer includes a strong benefits package, learning opportunities, or performance-based increments. I'd love to hear more about the compensation structure your company typically offers for this role and discuss from there."`,
    tips: [
      "Research market salaries before the interview using platforms like LinkedIn, Glassdoor, AmbitionBox",
      "Give a range, not a single number",
      "Express openness to discussion — don't make it sound like your only motivation",
      "If pressed without enough information, it's okay to ask what budget they have in mind",
    ],
    tags: ["salary", "negotiation"],
  },
  {
    id: 27,
    category: "freshers",
    question: "Where do you see yourself five years from now?",
    answer: `**Sample Answer:**
"In five years, I see myself having built a deep expertise in [relevant domain] and having grown into a senior role where I can lead projects, mentor junior team members, and contribute to strategic decisions.

I want to have shipped meaningful work that I'm proud of — projects that either solved real user problems, scaled a product, or improved an important process. I also hope to have expanded my network and cultivated mentoring relationships both as a mentee and a mentor.

Most importantly, I want to still be energised by my work — that means staying in a role and company where I'm continuously learning. I'm hopeful that five years from now, I'm looking back on a journey that started right here."`,
    tips: [
      "Show ambition, but ensure your goals are achievable within the company",
      "Avoid answers that suggest you'll leave in 1–2 years",
      "Frame your future within the context of the company's trajectory",
    ],
    tags: ["career planning", "ambition"],
  },
  {
    id: 28,
    category: "freshers",
    question: "On a scale of one to ten, rate me as an interviewer.",
    answer: `**Sample Answer:**
"I'd give you an 8 out of 10. You've asked thoughtful, behavioural questions that gave me a real opportunity to demonstrate my thinking and values, which I appreciate. The conversation has been engaging and professional.

I'm leaving a little room because every interaction has potential for growth — for instance, I would have loved to discuss [specific topic — e.g., what the team's biggest current challenge is, or how performance is measured in this role], as that would have given me an even richer picture.

But overall, this has been one of the more genuine and comfortable interviews I've had — and that reflects well on your style as an interviewer."`,
    tips: [
      "Never give a 10 — it sounds insincere",
      "Never give below 7 — it's professional suicide",
      "Give genuine, specific feedback",
      "Be diplomatic and end on a positive note",
    ],
    tags: ["communication", "tact"],
  },
  {
    id: 29,
    category: "freshers",
    question: "Do you have any questions for me?",
    answer: `**Always ask questions — it shows genuine interest and preparation.**

**Strong questions to ask:**

1. "What does success look like in this role in the first 90 days?"
2. "What are the biggest challenges someone in this position typically faces?"
3. "How would you describe the team culture and working style?"
4. "What opportunities for growth and learning does the company offer?"
5. "What do you enjoy most about working here?"
6. "How is performance measured and how often are reviews conducted?"

**Questions to avoid:**
- Salary questions at this stage (unless they bring it up)
- Questions easily answered by the company's website
- Anything that signals entitlement or a lack of preparation`,
    tips: [
      "Prepare 3–5 genuine questions before the interview",
      "Prioritise questions that show you're thinking about how to succeed in the role",
      "Ask about the team, culture, and growth — not just perks",
    ],
    tags: ["questions to ask", "engagement"],
  },

  // ─── FOR EXPERIENCED ───────────────────────────────────────────────────────
  {
    id: 30,
    category: "experienced",
    question: "Why did you resign from your previous job?",
    answer: `**Sample Answer:**
"I'm grateful for the experience and growth I gained at my previous company. The primary reason I'm looking to move on is that I've reached a point where my growth trajectory has plateaued.

I'm looking for a role that offers [specific opportunity — e.g., greater technical challenge, leadership responsibility, broader scope, or a domain that aligns more closely with my long-term goals]. This opportunity with [Company Name] represents exactly the kind of challenge and environment I'm seeking at this stage of my career.

I leave with a great relationship with my team and manager — in fact, my manager [optionally: has offered to be a reference], which speaks to how I approach my professional commitments even when I decide to move on."`,
    tips: [
      "Never speak negatively about your previous employer",
      "Focus on what you're moving TOWARD, not what you're running from",
      "If there was a layoff or restructuring, state it factually without bitterness",
      "Confirm you're leaving on good terms",
    ],
    tags: ["career transition", "experience"],
  },
  {
    id: 31,
    category: "experienced",
    question: "Why have you been out of work so long?",
    answer: `**Sample Answer:**
"I took a deliberate break from full-time employment to [genuine reason — e.g., pursue additional certifications / care for a family member / take time to be more strategic about my next career move / recover from burnout].

During this time, I [what you actually did — e.g., completed a certification in X, freelanced on projects in Y, contributed to open source, attended workshops, etc.]. So while I wasn't in a traditional role, I was actively maintaining and growing my professional skills.

I'm now fully refreshed and ready to commit fully to the right opportunity. I've been deliberate about my job search because I want to join a company where I can make a real long-term contribution — and based on my research, that's exactly what this role represents."`,
    tips: [
      "Never apologise for a gap — own it confidently",
      "Always mention what you did during the gap — even self-learning counts",
      "Avoid over-explaining or giving excessive personal details",
    ],
    tags: ["career gap", "resilience"],
  },
  {
    id: 32,
    category: "experienced",
    question: "Why have you had so many jobs?",
    answer: `**Sample Answer:**
"I understand how it might look on paper, and I appreciate the opportunity to address it directly. Each transition was intentional and contributed to my growth as a professional.

[Role 1] gave me [specific skill/experience]. When [Company 2] offered [something new — responsibility / domain / technology], it was the right move at that stage. [Role 3] then allowed me to [expand in a new direction].

Looking at my trajectory, each move built directly on the last — so rather than instability, I see it as a deliberately curated set of experiences. I'm now at a point where I'm ready for a long-term commitment with a company where I can apply the full depth of what I've built. That's why I'm here — not just for another role, but for a real home."`,
    tips: [
      "Never be defensive — be confident and articulate",
      "Show that each move had a clear purpose",
      "Demonstrate readiness for long-term commitment now",
      "If some moves were due to external factors (company closure, layoffs), say so factually",
    ],
    tags: ["job hopping", "career narrative"],
  },
  {
    id: 33,
    category: "experienced",
    question: "Tell me about a situation when your work was criticized.",
    answer: `**Sample Answer:**
"In one of my early projects at [Company], I delivered a technical solution that my manager felt prioritised elegance over practicality. The feedback was that while the code was clean, it over-engineered a simple problem, which made it harder for other team members to maintain.

Initially, I felt defensive — I had invested significant effort into the design. But I took a step back, listened carefully, and realised the feedback was entirely valid. I revised the solution with simplicity and team readability in mind.

That experience fundamentally changed how I approach design decisions. Now, I always ask myself: 'Is this the right solution for the team and the context, not just technically?' It also taught me to seek feedback earlier in the process, rather than waiting until delivery."`,
    tips: [
      "Choose a real example — preferably one with a clear resolution",
      "Show that you accepted the feedback gracefully",
      "Demonstrate the lesson you extracted and how you applied it",
      "Avoid blaming the critic",
    ],
    tags: ["feedback", "growth"],
  },
  {
    id: 34,
    category: "experienced",
    question: "Could you have done better in your last job?",
    answer: `**Sample Answer:**
"Yes — and I think anyone who genuinely reflects on their work will find areas where they could have done more or done differently.

Looking back, one area where I wish I had been more proactive was [specific example — e.g., speaking up sooner about a technical debt that later became a major issue / mentoring junior team members more formally / building cross-team relationships earlier].

I was focused on my own deliverables and didn't invest enough time in [the broader opportunity]. I've since recognised that impact at work often comes from what happens beyond your immediate responsibilities, and I'm much more intentional about that now."`,
    tips: [
      "Be honest but measured — don't be excessively self-critical",
      "Show that you've reflected and grown from the realisation",
      "Pick an example that shows professional maturity, not a failure of core competencies",
    ],
    tags: ["self-reflection", "growth"],
  },
  {
    id: 35,
    category: "experienced",
    question: "Tell me about the most boring job you have ever had.",
    answer: `**Sample Answer:**
"Early in my career, I had a role that involved a significant amount of repetitive data entry and report generation. While it wasn't intellectually stimulating, I chose to approach it as an opportunity rather than a burden.

I automated several of the repetitive tasks using [tool/script], which cut my processing time by over 60%. I then used the saved time to learn [relevant skill] and take on additional responsibilities in [adjacent area].

That experience taught me two things: first, that how you show up matters even in uninspiring work — because your colleagues and managers notice. Second, that there's often a creative or technical opportunity hidden inside 'boring' tasks, if you're willing to look for it."`,
    tips: [
      "Don't say 'this current job' or any recent role",
      "Show initiative — how did you make the best of it?",
      "Extract a genuine lesson from the experience",
    ],
    tags: ["attitude", "initiative"],
  },
  {
    id: 36,
    category: "experienced",
    question: "May I contact your present employer for a reference?",
    answer: `**Sample Answer:**
"I'd request that you hold off on contacting my current employer until we've reached a firm offer stage. As with most job searches, my employer is not yet aware that I'm exploring new opportunities, and I'd like to maintain a professional transition.

Once we've aligned on an offer, I'd be happy to provide references from my current company — including my manager, who I have a strong and professional relationship with. I can also provide references from previous employers immediately if that would be helpful.

I'm confident you'll hear only positive things about my work ethic, contributions, and professionalism."`,
    tips: [
      "This is a completely reasonable and standard request — don't be anxious about it",
      "Offer alternative references proactively",
      "Express confidence in what those references will say",
    ],
    tags: ["references", "current employment"],
  },
  {
    id: 37,
    category: "experienced",
    question: "How many hours a week do you normally work?",
    answer: `**Sample Answer:**
"In a typical week, I work the standard hours, though during critical delivery periods or when a challenging problem needs solving, I naturally put in more time — not out of obligation, but because I care about the outcome.

I've found that my most productive and sustainable state is when I have clear goals, focused work blocks, and healthy boundaries. Chronic overwork, in my experience, leads to burnout and reduced quality of output — so I try to work smart as well as hard.

I also believe in being transparent about capacity: if a deadline is at risk, I flag it early rather than quietly working until midnight without anyone knowing. That kind of proactive communication makes teams more effective overall."`,
    tips: [
      "Don't brag about working 80-hour weeks — it can signal poor efficiency",
      "Don't suggest you leave exactly at 5pm — show flexibility",
      "Emphasise quality of output over hours clocked",
    ],
    tags: ["work ethic", "productivity"],
  },
  {
    id: 38,
    category: "experienced",
    question: "What was the toughest challenge you have ever faced?",
    answer: `**Sample Answer:**
"The toughest professional challenge I faced was [specific situation — e.g., inheriting a legacy codebase with no documentation / leading a team through a product pivot / managing a critical project delivery with reduced resources after a layoff].

What made it especially difficult was [specific reason — e.g., the tight timeline, the lack of clear ownership, the technical debt involved].

I addressed it by [specific actions — e.g., breaking the problem into phases, establishing clear accountability, communicating risks to stakeholders, and rallying the team around a shared goal].

We ultimately [outcome — e.g., delivered on time / stabilised the system / shipped the MVP]. The experience built my resilience, my stakeholder management skills, and my ability to lead under uncertainty."`,
    tips: [
      "Choose a genuinely difficult challenge, not a trivial one",
      "Use the STAR format: Situation, Task, Action, Result",
      "Emphasise what you learned, not just what happened",
    ],
    tags: ["resilience", "leadership"],
  },
  {
    id: 39,
    category: "experienced",
    question: "Have you been absent from work more than a few days in any previous position?",
    answer: `**Sample Answer:**
"No significant unplanned absences. I had one period where I needed to take [X days] off for [a medical/family reason], which I communicated well in advance to my manager and made arrangements to ensure my responsibilities were covered.

I take attendance and reliability very seriously. If I'm going to miss work, I believe in giving as much notice as possible and ensuring there's no disruption to the team or deliverables. My track record reflects that commitment — consistent attendance and proactive communication when exceptions arose."`,
    tips: [
      "Be honest — if there was a health issue, say so briefly without over-sharing",
      "Emphasise that any absences were communicated professionally",
      "Reinforce your reliability and commitment to your team",
    ],
    tags: ["reliability", "attendance"],
  },
  {
    id: 40,
    category: "experienced",
    question: "What changes would you make if you came on board?",
    answer: `**Sample Answer:**
"That's a question I'm eager to explore, but I believe it would be premature of me to prescribe changes before I've fully understood the current state of things — the context, the constraints, the history, and the people involved.

In my first 30–60 days, I'd focus on listening and learning: understanding the existing processes, meeting the team, and identifying what's working well and what isn't. Only after building that understanding would I feel confident proposing meaningful changes.

From what I've learned so far, there might be opportunities around [something mentioned in the job description or interview], but I'd want to validate that with real context before making any recommendations. I believe good leaders earn the right to drive change — and that starts with respect and understanding."`,
    tips: [
      "Don't walk in claiming you know what to fix — you don't yet",
      "Show strategic humility while still demonstrating initiative",
      "Reference something you've already learned about the company",
    ],
    tags: ["leadership", "change management"],
  },
  {
    id: 41,
    category: "experienced",
    question: "What would you say to your boss if he is crazy about an idea, but you think it stinks?",
    answer: `**Sample Answer:**
"I'd find a thoughtful, private opportunity to share my honest perspective — respectfully and with data. I believe that one of the most valuable things a team member can do is provide honest, constructive input, even when it might not be what the boss wants to hear.

I'd frame it something like: 'I understand the appeal of this approach, and I want to make sure we've considered all angles. Here's what I'm concerned about: [specific risk]. Would it make sense to [alternative or mitigation]?'

My goal wouldn't be to 'win' — it would be to ensure the team makes the best decision possible. If after hearing my concerns the boss still wants to proceed, I'd support the decision and execute as effectively as I could. But I'd make sure my concerns were documented so we could learn from the outcome either way."`,
    tips: [
      "Show that you can push back professionally — this is a leadership quality",
      "Demonstrate that you'd do it privately and constructively",
      "Show that you can ultimately support a decision even if you disagree",
    ],
    tags: ["communication", "leadership", "disagreement"],
  },
  {
    id: 42,
    category: "experienced",
    question: "How could you have improved your career progress?",
    answer: `**Sample Answer:**
"Looking back with honest reflection, I believe I could have been more proactive about two things: seeking mentorship early in my career, and being more strategic about visibility.

In my early years, I was heads-down focused on technical execution — which was valuable — but I missed opportunities to build relationships with senior leaders and cross-functional peers who could have accelerated my growth.

I've since corrected course: I actively seek out mentors, participate in cross-functional projects, and am more deliberate about making my work and ideas visible to stakeholders. I've found that a combination of strong output and proactive communication has a multiplicative effect on career progression — and I wish I'd understood that sooner."`,
    tips: [
      "Show genuine reflection, not blame-shifting",
      "Pick something real — not a cliché like 'I should have worked harder'",
      "Show that you've already acted on your reflection",
    ],
    tags: ["career reflection", "growth"],
  },
  {
    id: 43,
    category: "experienced",
    question: "Tell me honestly about the strong points and weak points of your boss (company, management team, etc.)",
    answer: `**Sample Answer:**
"My manager's greatest strengths are [specific quality — e.g., strategic clarity, technical depth, or genuine care for the team's growth]. I've learned a tremendous amount from [his/her/their] ability to [specific example].

In terms of areas for growth — and I'd want to be thoughtful and fair here — I feel that [a genuine but diplomatically stated observation — e.g., communication of priorities could sometimes be more timely, or there are moments where decisions get made without enough input from the team]. That said, I recognise these challenges often stem from the pressures of the broader organisation, not from a lack of intent.

Overall, my relationship with my management has been positive and professional. I wouldn't be recommending my manager as a reference if I didn't genuinely respect and appreciate their leadership."`,
    tips: [
      "Be honest, but never savage — this question tests your professionalism",
      "Balance positives and negatives thoughtfully",
      "Keep weaknesses mild and contextually explained",
    ],
    tags: ["professionalism", "judgment"],
  },
  {
    id: 44,
    category: "experienced",
    question: "Looking back on your last position, have you done your best work?",
    answer: `**Sample Answer:**
"I gave my best effort at every stage of my tenure. I'm particularly proud of [specific achievement — e.g., leading a product launch, improving system performance by X%, building a high-performing team].

That said, 'best work' evolves. My best work in year one looks different from my best work in year three — because I was learning, growing, and being given increasingly complex challenges. So yes, I consistently gave what I was capable of at each stage.

If I look at the last year specifically, I'm proud of [recent achievement]. And I believe that this new role offers the opportunity to reach a new level of 'best work' that I haven't yet fully explored — which is a big part of why I'm excited about it."`,
    tips: [
      "Don't be falsely modest ('no I could have done much more')",
      "Don't be arrogant ('yes, I was perfect')",
      "Show progression — your best work should keep getting better",
    ],
    tags: ["self-reflection", "performance"],
  },
  {
    id: 45,
    category: "experienced",
    question: "Why should I hire you from the outside when I could promote someone from within?",
    answer: `**Sample Answer:**
"That's a fair and smart question. Internal promotions are often excellent choices — they reward loyalty and preserve institutional knowledge.

But there are also compelling reasons to hire externally. I bring a fresh perspective, free from the assumptions and blind spots that can develop when you've been in one environment for too long. I've seen how other organisations tackle similar problems, and I can bring those insights to bear here.

I also bring [specific skill or experience] that may not currently exist in-house. And because I'm coming in motivated to prove my value and earn the team's trust, I'm likely to bring an unusual level of energy and commitment to the role.

I'm not here to replace your internal candidates — I'm here to add something they genuinely can't provide: outside perspective and complementary experience."`,
    tips: [
      "Acknowledge the merit of the alternative — don't dismiss it",
      "Articulate what's unique and valuable about your external perspective",
      "Be confident without being dismissive of internal candidates",
    ],
    tags: ["value proposition", "hiring"],
  },
  {
    id: 46,
    category: "experienced",
    question: "How do you feel about reporting to a younger person?",
    answer: `**Sample Answer:**
"I don't have an issue with it at all. Leadership ability, technical expertise, and good judgment don't correlate with age — they come from experience, character, and continuous growth. Some of the best managers I've had were younger than me.

What matters to me is whether my manager is someone I can learn from, who communicates clearly, provides good feedback, and creates an environment where I can do my best work. Age simply isn't part of that equation.

I also believe that ego is one of the biggest obstacles to professional growth. If I can't report to someone younger because of pride, I'm the one losing out on potential learning and collaboration. I'd rather focus on the work and the mission."`,
    tips: [
      "Show genuine maturity and absence of ego",
      "Connect the answer to what you value in leadership",
      "Don't over-explain — confident simplicity is best here",
    ],
    tags: ["maturity", "attitude"],
  },
  {
    id: 47,
    category: "experienced",
    question: "Looking back, what would you do differently in your life?",
    answer: `**Sample Answer:**
"If I could do one thing differently, it would be to invest in networking and relationship-building much earlier in my career. I spent most of my early years focused almost entirely on technical skills — which served me well — but I underestimated how much careers are shaped by the connections you make and the trust you build with people across your industry.

I'd also have taken more calculated risks earlier. Early in your career, the cost of failure is relatively low, and the learning is enormous. I played it safe in a few situations where I should have been bolder.

That said, I don't believe in regret for its own sake. Every decision — including the ones I'd change — got me to where I am now, and I'm grateful for the lessons each experience provided."`,
    tips: [
      "Choose something genuinely meaningful, not trivial",
      "Show growth and self-awareness without excessive regret",
      "End on a forward-looking, positive note",
    ],
    tags: ["self-reflection", "growth"],
  },
  {
    id: 48,
    category: "experienced",
    question: "Why are you not earning more money at this stage of your career?",
    answer: `**Sample Answer:**
"That's an interesting question. My compensation has grown consistently throughout my career, and I'm confident it reflects the value I've delivered at each stage.

I'll be honest: I've made some intentional trade-offs. At one point, I chose a role that paid less than my market rate because it offered [specific opportunity — e.g., broader responsibility, exposure to a new technology, the chance to build something from scratch]. The learning I gained was worth far more in the long run than the short-term pay gap.

What I'm seeking now is a role where the compensation is aligned with both the value I bring and the market standard for my experience level — and ideally a company where performance is rewarded transparently. Based on my research, this role fits that criteria."`,
    tips: [
      "Don't be defensive or embarrassed about your compensation history",
      "Explain any genuine trade-offs confidently as deliberate choices",
      "Pivot to what you're looking for now — fair compensation aligned with value",
    ],
    tags: ["compensation", "career choices"],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Questions", count: HR_QUESTIONS.length },
  {
    id: "freshers",
    label: "For Freshers",
    count: HR_QUESTIONS.filter((q) => q.category === "freshers").length,
  },
  {
    id: "experienced",
    label: "For Experienced",
    count: HR_QUESTIONS.filter((q) => q.category === "experienced").length,
  },
];

export const ALL_TAGS = [
  ...new Set(HR_QUESTIONS.flatMap((q) => q.tags)),
];
