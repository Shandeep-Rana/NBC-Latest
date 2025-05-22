'use client';

import Image from 'next/image';
import Head from 'next/head';

export default function UnAuthorizedPage() {
  return (
    <>

      <main id="content" className="site-main">
        <div className="no-content-section 404-page relative w-full h-screen">
          <Image
            src='/images/404-page-img1.jpg'
            alt="Unauthorized"
            fill
            className="object-cover z-[-1]"
            priority
          />

          <div className="container relative z-10 flex items-center justify-center h-full">
            <div className="no-content-wrap text-center bg-white/80 p-6 rounded shadow-lg">
              <span className="text-6xl font-bold text-red-600">401</span>
              <h1 className="text-3xl mt-2 font-semibold">Oops!</h1>
              <p className="mt-2 text-lg">This page is Un-Authorized</p>

              <div className="search-form-wrap mt-4">
                <form
                  className="search-form flex items-center justify-center"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-2 rounded-l"
                  />
                  <button
                    className="search-btn bg-blue-600 text-white px-4 py-2 rounded-r"
                    type="submit"
                  >
                    <i className="fas fa-search" aria-hidden="true"></i>
                    <span className="sr-only">Search</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="overlay absolute inset-0 bg-black/30 z-0" />
        </div>
      </main>
    </>
  );
}
