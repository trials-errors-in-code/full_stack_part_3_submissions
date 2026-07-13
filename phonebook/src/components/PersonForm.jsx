const Form = ({ addPerson, newName, changeName, newNumber, changeNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div className="form">
        <h4>Add/Update</h4>
        Name: <input type="text" value={newName} onChange={changeName} />
        <br />
        Number: <input type="text" value={newNumber} onChange={changeNumber} />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

export default Form
