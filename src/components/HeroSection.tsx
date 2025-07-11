"use client";

import { motion } from "motion/react";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = "/media/landing-video.mp4";
  const particlesRef = useRef<HTMLDivElement>(null);

  function createParticles(particleContainer: HTMLDivElement) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.width = Math.random() * 4 + 2 + "px";
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = Math.random() * 10 + 10 + "s";
      particleContainer.appendChild(particle);
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented:", error);
      });
    }
    if (particlesRef.current) {
      createParticles(particlesRef.current);
    }

    return () => {
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".particle");
        particles.forEach((particle) => particle.remove());
      }
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden pt-16">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute h-full w-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle gradient fade at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div
        ref={particlesRef}
        id="particles"
        className="particles z-0 absolute inset-0 w-full h-full"
      />
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.1 }}
      />

      <div className="relative z-10 flex h-full items-center justify-center flex-col gap-4">
        <motion.img
          src="/media/logo_solid_white.png"
          className="md:scale-50 scale-80 font-bold text-white text-center px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.75,
            duration: 0.75,
            ease: "easeInOut",
          }}
        />
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.0,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="cta-button"
        >
          Shop Now
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
