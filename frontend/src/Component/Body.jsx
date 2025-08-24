import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const backgroundImages = [
  "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?&w=600", // Cute Cat
  "https://images.unsplash.com/photo-1562176566-73c303ac1617?w=600", // Happy Dog
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600", // Little Hamster
  "https://images.unsplash.com/photo-1596982061507-8fb1af6a8235?w=600", // Small Rabbit
];

const Body = () => {
  // 2. Use state to keep track of the current image index.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Use an effect to change the image every 5 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      // Move to the next image, looping back to the start if at the end.
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up the timer when the component is unmounted.
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div
        className="relative min-h-[80vh] pt-24 flex items-center justify-center text-center transition-background-image duration-1000 ease-in-out"
        style={{
          // 4. Set the background image dynamically from our state.
          backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
          backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-300">
            Find Your New Best Friend
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            A unified platform where loving pet owners can list their pets for adoption, and caring individuals can find their new best friend. Join our community to give pets a second chance at happiness!
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-semibold py-2 px-6 rounded transition"
          onClick={() => navigate('/browsepets')}>
            Browse Pets
          </button>
        </div>
      </div>

      {/* "How It Works" Section */}
      <div className="bg-white text-gray-800 py-16 px-4 transition-background-image duration-1000 ease-in-out"
        style={{
            // 4. Set the background image dynamically from our state.
            backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            }}
        >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-200">How To Adopt?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">1. Search Pets</h3>
              <p className="text-red-50">Filter through hundreds of listings by location, species, age, and personality to find the perfect companion for your family.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">2. Connect & Meet</h3>
              <p className="text-red-50">Once you find a potential match, connect with the current owner to ask questions and schedule a meet-and-greet.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">3. Adopt & Welcome</h3>
              <p className="text-red-50">Finalize the adoption and welcome a new furry, feathered, or scaled member into your home.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Our Community Section */}
        <div className="bg-purple-50 py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-purple-800">Meet Our Community</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Happy dog" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Loyal Companions</h3>
                  <p className="text-gray-600">Find playful and loving dogs of all breeds and sizes waiting for a loving home.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Curious cat" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Curious Cats</h3>
                  <p className="text-gray-600">From cuddly lap cats to independent explorers, your purr-fect friend is here.</p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.pexels.com/photos/4001296/pexels-photo-4001296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Small pets" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">And Many More!</h3>
                  <p className="text-gray-600">Our community includes rabbits, hamsters, birds, and other small pets too!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Adopt? Section */}
        <div className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-purple-800">Why Choose Adoption?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left text-gray-700">
            <div>
                <h3 className="text-xl font-semibold mb-2">You Save a Life</h3>
                <p>When you adopt, you're not just giving a deserving animal a home. You're also freeing up a spot in a shelter for another animal in need.</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">You Get a Great Pet</h3>
                <p>Many shelter pets are already house-trained and accustomed to living with families. You'll find a wide range of wonderful animals waiting for a second chance.</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">It's Cost-Effective</h3>
                <p>Adoption fees are much lower than the cost of buying from a breeder. Plus, most shelter pets are already vaccinated.</p>
            </div>
            </div>
        </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-purple-700 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Start Showering Them With Love</h2>
            <p className="text-lg mb-8 text-purple-200">Your new best friend is waiting. Create an account today to start browsing pets in your area.</p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-8 rounded-lg transition text-lg"
            onClick={() => navigate('/register')}>
            Register Now
            </button>
        </div>
        </div>
    </main>
  );
};

export default Body;