const Search = ({ value, onChange }) => {
  return (
    <div>
      <b>Search:</b> <input type="text" value={value} onChange={onChange} />
    </div>
  )
}

export default Search
