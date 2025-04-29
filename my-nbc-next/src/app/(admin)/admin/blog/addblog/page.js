import AddBlogForm from '@/components/Forms/AddBlogForm'
import React from 'react'

const page = () => {
    return (
        <>
            <div id="content">
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-md-12">
                        <div className="row my-4">
                            <div className="text-center">
                                <h3>Add Blog</h3>
                            </div>
                            <div className="card-body pt-0">
                                <div className="volunteer-contact-form">
                                    <AddBlogForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page