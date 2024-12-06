"use client";
 
import { FC } from 'react';
import Header from './components/Header';

const HomePage: FC = () => {
  console.log('HomePage');
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">
              Developer Reputation Tracker
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Track, measure, and showcase your development impact across platforms
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
              Get Started
            </button>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">GitHub Integration</h3>
              <p className="text-gray-300">
                Connect your GitHub account to track contributions, pull requests, and code quality metrics
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Reputation Score</h3>
              <p className="text-gray-300">
                Get a comprehensive score based on your development activities and community impact
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Developer Profile</h3>
              <p className="text-gray-300">
                Showcase your achievements and skills with a professional developer profile
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-10">Platform Statistics</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold text-blue-500">10K+</p>
                <p className="text-gray-300">Active Developers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-500">1M+</p>
                <p className="text-gray-300">Contributions Tracked</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-500">500+</p>
                <p className="text-gray-300">Organizations</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your Reputation?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers showcasing their expertise
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
              Sign Up Now
            </button>
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;