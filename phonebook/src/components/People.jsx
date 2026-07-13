const People = ({ persons, searchString, onDelete }) => {
  let searchResult = persons
    .filter((person) =>
      person.name.toLowerCase().includes(searchString.toLowerCase()),
    )
    .map((person) => (
      <li key={person.id}>
        {person.name}: {person.number} <button onClick={() => onDelete(person.id)}>delete</button>
      </li>
    ))

  return (
    <>
      <h2>Numbers</h2>
      {searchResult}
    </>
  )
}

export default People
