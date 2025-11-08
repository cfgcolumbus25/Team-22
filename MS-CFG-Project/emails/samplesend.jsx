import React from 'react'

const samplesend = () => {
  const handleSendToInstitution = () => {
    console.log('Sending to institution...');
    // Add logic to send email to institution
  };

  const handleSendToLearner = () => {
    console.log('Sending to learner...');
    // Add logic to send email to learner
  };

  return (
    <div>
      <button onClick={handleSendToInstitution} className="send-to-inst">
        Send to Institution
      </button>
      <button onClick={handleSendToLearner} className="send-to-learner">
        Send to Learner
      </button>
    </div>
  )
}

export default samplesend
