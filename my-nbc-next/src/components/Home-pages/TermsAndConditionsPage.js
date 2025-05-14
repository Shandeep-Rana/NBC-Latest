import Head from 'next/head';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
    return (
        <>
            <Head>
                <title>Terms and Conditions | Nangal By Cycle</title>
                <meta
                    name="description"
                    content="Read the Terms and Conditions of Nangal By Cycle to understand the guidelines and policies for our services, rentals, and tours. Ensure a smooth and informed cycling experience with us."
                />
            </Head>

            <main id="content" className="site-main">
                <div className="page-header parallaxie">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="page-header-box">
                                    <h1 className="text-anime-style-2" data-cursor="-opaque">
                                        <span>Member</span> Terms & Conditions
                                    </h1>
                                    <nav className="wow fadeInUp">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link href="/">Home</Link>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Terms & Conditions
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="volunteer-wrap">
                    <div className="container">
                        <div className="section-head mt-5 mb-3">
                            <div className="row align-items-end">
                                <div className="col-lg-12">
                                    <div className="section-disc">
                                        <p>
                                            By registering on our community support website, you agree to the following
                                            terms and conditions. Please read them carefully before proceeding with your
                                            registration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="event-content">
                            <h3>Data Usage and Privacy</h3>
                            <ul style={{ listStyleType: 'square' }} className="m-0">
                                <li className="mb-3">
                                    <b>Consent to Use Data: </b> By providing your personal information during
                                    registration, you consent to the use of this data by our community support website.
                                    Your information may be accessed and utilized by other community members and the
                                    general public for the purposes of promoting healthy lifestyles, sports activities,
                                    volunteer efforts, blood donation drives, and other community-focused initiatives.
                                </li>
                                <li className="mb-3">
                                    <b>Public Accessibility: </b> The data you provide, including but not limited to
                                    your name, contact information, and participation details, may be displayed on our
                                    website and other related platforms. This is to facilitate community engagement and
                                    promote transparency within our initiatives.
                                </li>
                                <li className="mb-3">
                                    <b>Data Security: </b> While we take reasonable measures to protect your personal
                                    information, we cannot guarantee absolute security. By registering, you acknowledge
                                    and accept the potential risks associated with sharing your data online.
                                </li>
                                <li className="mb-3">
                                    <b>Use of Images and Stories: </b> By participating in our activities and events,
                                    you grant us permission to use any photographs, videos, or stories you share for
                                    promotional purposes. This includes featuring your contributions in our Local Heroes
                                    section and other related content on our website.
                                </li>
                            </ul>

                            <h3>Community Conduct</h3>
                            <ul style={{ listStyle: 'square' }} className="m-0">
                                <li className="mb-3">
                                    <b>Respect and Integrity: </b> We expect all members to engage respectfully and
                                    uphold the integrity of our community. Any form of harassment, discrimination, or
                                    inappropriate behavior will not be tolerated and may result in the termination of
                                    your membership.
                                </li>
                                <li className="mb-3">
                                    <b>Accuracy of Information: </b> You agree to provide accurate and truthful
                                    information during registration and in all interactions within our community. Any
                                    falsification or misleading information may result in suspension or removal from the
                                    website.
                                </li>
                                <li className="mb-3">
                                    <b>Volunteering and Participation: </b> Participation in sports activities,
                                    volunteering efforts, and blood donation drives is at your own risk. We are not
                                    liable for any injuries, losses, or damages incurred during these activities.
                                </li>
                            </ul>

                            <div className="section-disc">
                                <h3>Modifications to Terms</h3>
                                <p>
                                    We reserve the right to modify these terms and conditions at any time. Changes will
                                    be communicated through our website, and continued use of our services implies
                                    acceptance of the updated terms.
                                </p>
                                <p>
                                    By registering on our website, you confirm that you have read, understood, and agree
                                    to abide by these terms and conditions. Thank you for being a part of our community
                                    and contributing to a healthier, more active, and connected society.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
