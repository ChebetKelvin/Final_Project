export function Input({ type, name, id, defaultValue }) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      defaultValue={defaultValue}
      className="border border-gray-400 p-4 rounded-lg"
    />
  );
}
