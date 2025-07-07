// components/Loader.tsx
const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 bg-opacity-90">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div
          className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-slow shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          style={{ animationDuration: "1.8s" }}
        ></div>

        {/* Inner ring */}
        <div
          className="absolute inset-4 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin"
          style={{ animationDuration: "1.2s" }}
        ></div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
      </div>
    </div>
  );
};

export default Loader;
