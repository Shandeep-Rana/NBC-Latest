'use client'
import Loader from "@/common/Loader";
import { contactSchema } from "@/lib/utils/UtilsSchemas";
import { addrequest } from "@/Slice/contactRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";

const Contact = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state) => state.contact);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    const requestData = {
      name: data?.name,
      email: data?.email.toLowerCase(),
      subject: data?.subject,
      phone: data?.phone,
      description: data?.description,
    };
    dispatch(addrequest(requestData, reset, router));
  };

  return (
    <>
      <div id="header"></div>
      <div className="page-header parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque"><span>Contact</span> us</h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="index-2.html">home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">contact us</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-form-section">
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-lg-6 order-lg-1 order-2">
              <div className="google-map-iframe">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3427.415080279293!2d76.37143611493867!3d31.38982875952448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ae986a70e1a81%3A0xc5e0868aa942360e!2sNangal%2C%20Punjab%20140224!5e0!3m2!1sen!2sin!4v1703158537552!5m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="col-lg-6 order-lg-2 order-1">
              <div className="contact-form-box">
                <div className="section-title">
                  <h3 className="wow fadeInUp">contact us</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">Get in touch</h2>
                </div>

                {isLoading ? <Loader /> : (
                  <div className="contact-form">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="wow fadeInUp"
                    >
                      <div className="row">
                        <div className="form-group col-md-6 mb-4">
                          <Controller
                            name="name"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                placeholder="Your Name*"
                                type="text"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                                className="form-control"
                              />
                            )}
                            defaultValue=""
                          />
                          {errors?.name && (
                            <p style={{ color: "red", whiteSpace: "nowrap" }}>
                              {" "}
                              {errors?.name?.message}
                            </p>
                          )}
                          <div className="help-block with-errors"></div>
                        </div>

                        <div className="form-group col-md-6 mb-4">
                          <Controller
                            name="email"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                placeholder="Your Email*"
                                type="email"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                                className="form-control"
                              />
                            )}
                            defaultValue=""
                          />
                          {errors?.email && (
                            <p style={{ color: "red", whiteSpace: "nowrap" }}>
                              {" "}
                              {errors?.email?.message}
                            </p>
                          )}
                          <div className="help-block with-errors"></div>
                        </div>

                        <div className="form-group col-md-12 mb-4">
                          <Controller
                            name="subject"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                placeholder="Subject*"
                                type="text"
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                                className="form-control"
                              />
                            )}
                            defaultValue=""
                          />
                          {errors?.subject && (
                            <p style={{ color: "red", whiteSpace: "nowrap" }}>
                              {" "}
                              {errors?.subject?.message}
                            </p>
                          )}
                          <div className="help-block with-errors"></div>
                        </div>

                        <div className="form-group col-md-12 mb-4">
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <PhoneInput
                                country={"in"}
                                value={value}
                                onChange={(phone) => onChange(phone)}
                              />
                            )}
                            defaultValue=""
                          />
                          {errors?.phone && (
                            <p style={{ color: "red", whiteSpace: "nowrap" }}>
                              {" "}
                              {errors?.phone?.message}
                            </p>
                          )}
                          <div className="help-block with-errors"></div>
                        </div>

                        <div className="form-group col-md-12 mb-5">
                          <Controller
                            name="description"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <textarea
                                rows={8}
                                placeholder="Enter Your Message*"
                                type="text"
                                value={value}
                                onChange={onChange}
                                className="form-control"
                              />
                            )}
                            defaultValue=""
                          />
                          {errors?.description && (
                            <p style={{ color: "red", whiteSpace: "nowrap" }}> {errors?.description?.message}</p>
                          )}
                          <div className="help-block with-errors"></div>
                        </div>

                        <div className="col-md-12">
                          <button type="submit" className="btn-default"><span>send message</span></button>
                          <div id="msgSubmit" className="h3 hidden"></div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="footer"></div>
    </>
  );
};

export default Contact;
