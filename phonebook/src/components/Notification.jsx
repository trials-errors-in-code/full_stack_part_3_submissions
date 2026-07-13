const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className="messageDisplay">{message}</div>
}

export default Notification
