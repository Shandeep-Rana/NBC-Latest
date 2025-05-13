export default function HowWeHelp() {
    const helpItems = [
      {
        title: "No poverty",
        svg: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 487 487.719"
            width="28"
            height="28"
            fill="currentColor"
            className="text-black"
          >
            <path d="M220.867 266.176a7.616..." />
            <path d="M104.195 222.5c0 64.07..." />
            <path d="m375.648 358.23-62.668..." />
            <path d="M228.203 84V8a8 8 0 0 0-16 0v76a8 8 0 0 0 16 0zM288.203 84V48a8 8 0 0 0-16 0v36a8 8 0 0 0 16 0zM168.203 84V48a8 8 0 0 0-16 0v36a8 8 0 0 0 16 0z" />
          </svg>
        ),
      },
      { title: "Best education" },
      { title: "Educational support" },
      { title: "Clean water" },
      { title: "Good health" },
      { title: "Nutrition" },
    ];
  
    return (
      <section className="how-we-help py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left content */}
            <div className="w-full lg:w-1/2">
              <div className="how-we-help-content space-y-6">
                <div className="section-title space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700">
                    How we help
                  </h3>
                  <h2 className="text-3xl font-bold text-anime-style-2">
                    Help is our main goal !!
                  </h2>
                  <p className="text-gray-600">
                    Join us on this incredible journey of community-driven
                    transformation. Explore our website today and discover how
                    you can be a part of something greater – a movement that
                    celebrates the power of collective action and the strength of
                    a united community.
                  </p>
                </div>
                <div>
                  <a
                    href="/contact"
                    className="btn-default inline-block bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    Contact Now
                  </a>
                </div>
              </div>
            </div>
  
            {/* Right items */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 gap-4">
                {helpItems.map((item, index) => (
                  <div
                    key={index}
                    className="how-help-item flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg"
                  >
                    <div className="icon-box w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {item.svg ?? (
                        <span className="text-gray-400 text-sm">Icon</span>
                      )}
                    </div>
                    <div className="how-help-item-content">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  