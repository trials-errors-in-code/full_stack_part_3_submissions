import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import People from './components/People'
import Search from './components/Search'
import dataModify from './services/data'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchString, setSearchString] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    dataModify.getAll().then((data) => setPersons(data))
  }, [])

  if (!persons) {
    return null
  }

  let changeName = (e) => setNewName(e.target.value)
  let changeNumber = (e) => setNewNumber(e.target.value)
  let changeSearchString = (e) => setSearchString(e.target.value)

  const removePerson = (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return
    }
    let personName = persons.find((p) => p.id === id).name
    dataModify
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id))
      })
      .then(() => {
        setMessage(`removed the person "${personName}" with id "${id}"`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        setPersons(persons.filter((p) => p.id !== id))
        console.log(error)
        setErrorMessage(
          `the person "${personName}" with id "${id}" has already been removed from the server`,
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      setMessage('Name and number are required')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      return
    }
    let personAlreadyInData = persons.find((person) => person.name === newName)

    if (personAlreadyInData) {
      if (
        window.confirm(
          `${newName} is already in phonebook, do you want to change the old number with the new one?`,
        )
      ) {
        let id = personAlreadyInData.id
        let updatedPerson = { ...personAlreadyInData, number: newNumber }
        dataModify
          .updateNumber(id, updatedPerson)
          .then((data) => {
            setPersons(persons.map((p) => (p.id === id ? data : p)))
          })
          .then(() => {
            setMessage(`Updated the number of ${newName} successfully`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })

        setNewName('')
        setNewNumber('')
      }
      return
    }

    let newPerson = {
      name: newName,
      number: newNumber,
    }

    dataModify
      .create(newPerson)
      .then((data) => setPersons(persons.concat(data)))
      .then(() => {
        setMessage(`Added ${newName} successfully with number ${newNumber}`)
        setTimeout(() => {
          setMessage(null)
        }, 1000)
      })
      .catch((error) => {
        console.log(error.response.data.error)
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error)
        } else {
          setErrorMessage('something bad happened, try again')
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Error errorMessage={errorMessage} />
      <Search value={searchString} onChange={changeSearchString} />
      <br />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        changeName={changeName}
        newNumber={newNumber}
        changeNumber={changeNumber}
      />

      <People
        persons={persons}
        searchString={searchString}
        onDelete={removePerson}
      />
    </div>
  )
}

export default App
