export default function Loading() {
  return (
    <div aria-live="polite" aria-busy="true">
      <p className="eyebrow">Loading workspace</p>
      <div className="metrics-grid">
        {[1, 2, 3, 4].map((item) => <div className="metric-card" key={item} />)}
      </div>
    </div>
  );
}
