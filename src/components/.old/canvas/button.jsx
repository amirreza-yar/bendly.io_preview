const SingleButton = ({ children }) => {
  return (
    <button
      className="inline-flex p-2 justify-center items-center gap-2 rounded-[12px] bg-white shadow-md cursor-pointer"
      style={{ boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.15)" }}
    >
      {children}
    </button>
  );
};

export { SingleButton }