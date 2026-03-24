export default function Filters({ users, setCity }) {
  const cities = [...new Set(users.map(u => u.address.city))].sort();

  return (
    <select 
      onChange={(e) => setCity(e.target.value)}
      className="select-input"
    >
      <option value=""> All Cities</option>
      {cities.map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
  );
}