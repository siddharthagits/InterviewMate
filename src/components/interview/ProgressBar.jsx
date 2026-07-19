function ProgressBar({ current, total }) {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg">
        Question {current} of {total}
      </h2>
    </div>
  );
}

export default ProgressBar;