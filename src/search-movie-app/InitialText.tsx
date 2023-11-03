export function InitialText() {
  return (
    <div className="flex flex-col items-center h-full border-red-300 w-full justify-center">
      <span className="tracking-wide text-xl">
        Press <em>Enter</em> to
      </span>
      <span className="uppercase text-4xl tracking-widest font-extrabold">
        Start
      </span>
      <span className="tracking-wide text-xl">searching a movie...</span>
    </div>
  );
}
