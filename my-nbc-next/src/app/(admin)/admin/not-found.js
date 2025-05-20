import Image from "next/image";

export default function NotFound() {
  return (
    <main id="content" className="site-main">
      <div className="no-content-section 404-page relative">
        <Image
          src='/images/404-page-img1.jpg'
          alt="404 Error"
          fill
          className="object-cover object-center -z-10"
          priority
        />

        <div className="container relative z-10">
          <div className="no-content-wrap">
            <span>404</span>
            <h1>Oops! That page can&apos;t be found</h1>
            <p>
              It looks like nothing was found at this location. Maybe try one of
              the links below or a search?
            </p>
            <div className="search-form-wrap">
              <form className="search-form">
                <input type="text" name="search" placeholder="Search..." />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="overlay absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>
    </main>
  );
}
