function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span>Progress</span>
        <span>
          {current} / {total}
        </span>
      </div>

      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;