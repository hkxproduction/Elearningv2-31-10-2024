import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-jecBlue shadow-md flex justify-between items-center p-2">
        <div className="flex justify-center items-center bg-white p-3 z-1 rounded-lg shadow-md">
          <Image
            src="/assets/jecacademy.png"
            alt="Ilustrasi JEC Academy"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
        <div>
          <Link
            href="/login"
            className="bg-white text-black py-2 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Login
          </Link>
        </div>
      </nav>

      <div
        className="mt-10 flex flex-col items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/bg.jpg')" }}
      >
        <h1 className="text-5xl font-bold mb-6 text-blue-900 text-center">
          Up Your Skills To Advance Your Career Path
        </h1>
        <p className="mb-4 text-lg text-blue-900 text-center">
          Provides you with the latest online learning system and material that
          help your knowledge growing.
        </p>

        {/* Ilustrasi */}
        <div className="mb-8">
          <Image
            src="/assets/jecacademy.png"
            alt="Ilustrasi Pria"
            width={500}
            height={500}
          />
        </div>

        <Link
          href="/features"
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
        >
          Our Features
        </Link>

        <p className="mt-4 text-md text-blue-900 text-center">
          A Learning Space That Inspires And Engages
        </p>
      </div>
    </div>
  );
}
