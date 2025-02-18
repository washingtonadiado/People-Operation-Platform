import React from 'react'
import ViewTrainings from './ViewTrainings'

const Trainings = ({trainings,setTrainings}) => {
      return (
    <div>
        <ViewTrainings trainings={trainings} setTrainings={setTrainings}/>
       
    </div>
  )
}

export default Trainings
