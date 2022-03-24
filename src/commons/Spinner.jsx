import Spinner from 'react-bootstrap/Spinner'

const SpinnerComp = () => {
  return (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default SpinnerComp