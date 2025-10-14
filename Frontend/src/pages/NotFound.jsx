import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-1 to-color-3 animate-pulse">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-color-1 to-color-3 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
            Well… this is awkward 🙃
          </h2>
          <p className="text-md sm:text-base leading-relaxed">
            Looks like the page you're hunting for has pulled a disappearing
            act. Don't worry though—happens to the best of us. Let's head back
            before we both start questioning our life choices. 🚶‍♂️💨
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-color-1 animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-color-1 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-color-1 hover:bg-color-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/home")}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-color-1 text-base font-medium rounded-lg text-color-1 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home Page
          </button>
        </div>

        <div className="mt-4 pt-6 border-t border-gray-200">
          <p className="text-md">
            Still lost?😏 Wow… our navigation skills are clearly top-tier. 🚀
            Maybe hit that Home button before we both need a map. 🗺️
          </p>
        </div>
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-1/4 -left-8 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-red-300 rounded-full opacity-25 animate-float"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
