import AddEventParticipant from '@/components/Forms/AddEventParticipant'
import React from 'react'

const page = () => {
    return (
        <div id="content">
            <div className="row justify-content-center">
                <div className="col-lg-12 col-md-10">
                    <div className="row my-4">
                        <div className="text-center">
                            <h3>Add Event Participant</h3>
                        </div>
                        <div className="card-body pt-0">
                            <div className="volunteer-contact-form">
                                <AddEventParticipant />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page