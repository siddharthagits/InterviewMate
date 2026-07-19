// import { useEffect, useState } from "react";

// function Timer() {
//   const [time, setTime] = useState(600); // 10 minutes

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime((prev) => {
//         if (prev === 0) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const minutes = Math.floor(time / 60);
//   const seconds = time % 60;

//   return (
//     <h2 className="text-right text-xl font-bold">
//       {minutes}:{seconds.toString().padStart(2, "0")}
//     </h2>
//   );
// }

// export default Timer;

function Timer() {
  return (
    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold">
      10:00
    </div>
  );
}

export default Timer;