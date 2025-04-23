'use client' 

const Contact = () => {
  
  return (
    <>
      <div id="header"></div>

      {/* Page Header Start */}
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque"><span>Contact</span> us</h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index-2.html">home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">contact us</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Contact Form Section Start */}
      <div className="contact-form-section">
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-lg-6 order-lg-1 order-2">
              {/* Google Map Start */}
              <div className="google-map-iframe">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96737.10562045308!2d-74.08535042841811!3d40.739265258395164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1703158537552!5m2!1sen!2sin" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Google Map End */}
            </div>

            <div className="col-lg-6 order-lg-2 order-1">
              {/* Contact Form Start */}
              <div className="contact-form-box">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">contact us</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">Get in touch</h2>
                </div>
                {/* Section Title End */}

                <div className="contact-form">
                  <form 
                    id="contactForm" 
                    action="#" 
                    method="POST" 
                    data-toggle="validator" 
                    className="wow fadeInUp" 
                    data-wow-delay="0.2s"
                  >
                    <div className="row">
                      <div className="form-group col-md-6 mb-4">
                        <input type="text" name="fname" className="form-control" id="fname" placeholder="First name" required />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input type="text" name="lname" className="form-control" id="lname" placeholder="Last name" required />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-12 mb-4">
                        <input type="email" name="email" className="form-control" id="email" placeholder="Enter your e-mail" required />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-12 mb-4">
                        <input type="text" name="phone" className="form-control" id="phone" placeholder="Enter your phone no." required />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-12 mb-5">
                        <textarea name="message" className="form-control" id="message" rows="4" placeholder="Write message"></textarea>
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="col-md-12">
                        <button type="submit" className="btn-default"><span>send message</span></button>
                        <div id="msgSubmit" className="h3 hidden"></div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* Contact Form End */}
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Section End */}

      <div id="footer"></div>
    </>
  );
};

export default Contact;
