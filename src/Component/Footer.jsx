import React from "react";
import { Link } from "react-router";
import Logo from "./Logo";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-l from-[#021d10] via-[#094222] to-[#021d10] border-t border-green-500/20">
      
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-white">
        
        {/* Brand */}
        <div className="-ml-2">
          <Logo />
          <p className="text-sm mt-3 text-gray-200 leading-relaxed">
            Share your thoughts, stories, and ideas with the world.  
            A modern blogging platform built with love 💚
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-green-300/50">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {["/", "/about", "/contact", "/add-blog"].map((path, i) => {
              const names = ["Home", "About", "Contact", "Add Blog"];
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className="relative inline-block group"
                  >
                    {names[i]}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-green-300/50">
            Follow Us
          </h3>

          <div className="flex gap-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=100089627922381/"
              target="_blank"
              className="group w-10 h-10 flex items-center justify-center rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-green-500/50 hover:scale-110 
              transition duration-300 shadow-md"
            >
              <FaFacebookF className="text-white group-hover:text-white" />
            </a>

            
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mahfuzur-rahman-280471392/"
              target="_blank"
              className="group w-10 h-10 flex items-center justify-center rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-green-500/50 hover:scale-110 
              transition duration-300 shadow-md"
            >
              <FaLinkedinIn className="text-white group-hover:text-white" />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/ripon301252/"
              target="_blank"
              className="group w-10 h-10 flex items-center justify-center rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-green-500/50 hover:scale-110 
              transition duration-300 shadow-md"
            >
              <FaGithub className="text-white group-hover:text-white" />
            </a>

            {/* Twitter */}
            <a
              href="https://x.com/"
              target="_blank"
              className="group w-10 h-10 flex items-center justify-center rounded-full 
              bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-green-500/50 hover:scale-110 
              transition duration-300 shadow-md"
            >
              <FaTwitter className="text-white group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-300 border-t border-white/10 py-4">
        © {new Date().getFullYear()} Developer Blog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;