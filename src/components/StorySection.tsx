"use client";

import { motion } from "motion/react";

const StorySection = () => {
  return (
    <section className="relative min-h-screen w-full bg-gradient flex items-start justify-center p-8 pt-32">
      <motion.div
        className="max-w-4xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-64 -mt-32 -z-10" />
        <h2 className="text-5xl font-bold mb-8 text-white">OUR STORY</h2>
        <div className="space-y-6 text-lg text-white">
          <p>
            Welcome to ETERNAL, where timeless elegance meets modern design. Our
            journey began with a simple vision: to create pieces that transcend
            trends and become cherished heirlooms.
          </p>
          <p>
            Each creation is meticulously crafted by skilled artisans who share
            our passion for quality and attention to detail. We believe in the
            beauty of enduring design that tells a story.
          </p>
          <p>
            Join us as we continue to write our story, one exquisite piece at a
            time.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default StorySection;
