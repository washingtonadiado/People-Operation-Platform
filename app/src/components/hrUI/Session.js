import React from 'react';
import ViewSession from './ViewSession'

const Session = ({sessions, setSessions}) => {

  return (
   <>
    <ViewSession sessions={sessions} setSessions={setSessions}/>
   </>
  )
}

export default Session