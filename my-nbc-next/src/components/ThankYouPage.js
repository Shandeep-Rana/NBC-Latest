import Image from 'next/image';
import Link from 'next/link';

export default function ThankYouPage() {
    return (
        <main id="content" className="site-main">
            <div className="inner-baner-container relative">
                <Image
                    src='/images/Event-bg-01-01.jpg'
                    alt="Event Background"
                    fill
                    className="object-cover object-center -z-10"
                    priority
                />
                <div className="container relative z-10">
                    <div className="vh-100 d-flex justify-content-center align-items-center">
                        <div className="col-md-4">
                            <div className="border border-3 border-success"></div>
                            <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="bi bi-check-circle text-success"
                                        width="75"
                                        height="75"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h1>Thank You !</h1>
                                    <p>
                                        We sincerely appreciate your involvement and support. Your
                                        participation is invaluable, and it helps us move closer to
                                        achieving our goals.
                                    </p>
                                    <Link href="/">
                                        <div className="btn btn-outline-success">Back Home</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
