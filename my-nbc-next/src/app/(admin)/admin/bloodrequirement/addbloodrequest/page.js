import AddBloodRequestForm from '@/components/Forms/AddBloodRequestForm'
import React from 'react'

const page = () => {
    return (
        <>
            <div id="content">
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-10">
                        <div className="row my-4">
                            <div className="text-center">
                                <h3>Add Blood Requirement Request</h3>
                            </div>
                            <div className="card-body pt-0">
                                <div className="volunteer-contact-form"></div>
                                <AddBloodRequestForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page