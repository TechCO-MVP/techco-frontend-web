"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatOnboarding } from "./ChatOnboarding";
import { Button } from "@/components/ui/button";

export default function AnimatedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Update button position on mount and resize
  useEffect(() => {
    const updateButtonPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);

    return () => window.removeEventListener("resize", updateButtonPosition);
  }, []);

  // Handle modal open
  const openModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
    setIsAnimating(true);
    setIsOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setAnimateButton(true);
  };

  // Handle animation end
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  useEffect(() => {
    if (animateButton && buttonRef.current) {
      buttonRef.current.classList.add("animate-custom-pulse");
      const timeout = setTimeout(() => {
        buttonRef.current?.classList.remove("animate-custom-pulse");
        setAnimateButton(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [animateButton]);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={openModal}
        className="max-w-[200px] bg-[#FCFCFC] text-[#007AFF] hover:bg-[#FCFCFC]"
        disabled={isAnimating}
      >
        Ver cómo funciona
      </Button>

      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, transition: { duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              className="fixed z-50"
              style={{
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                transformOrigin: "center center",
              }}
              initial={{
                opacity: 0,
                scale: 0.01,
                x:
                  buttonPosition.x +
                  buttonPosition.width / 2 -
                  window.innerWidth / 2,
                y:
                  buttonPosition.y +
                  buttonPosition.height / 2 -
                  window.innerHeight / 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200, // Lower stiffness for slower animation
                  damping: 25,
                  mass: 1.2, // Higher mass makes it move slower
                  duration: 0.7, // Explicitly set longer duration
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.01,
                x:
                  buttonPosition.x +
                  buttonPosition.width / 2 -
                  window.innerWidth / 2,
                y:
                  buttonPosition.y +
                  buttonPosition.height / 2 -
                  window.innerHeight / 2,
                transition: {
                  type: "spring",
                  stiffness: 200, // Lower stiffness for slower animation
                  damping: 25,
                  mass: 1.2, // Higher mass makes it move slower
                  duration: 0.7, // Explicitly set longer duration
                },
              }}
              onAnimationComplete={handleAnimationComplete}
            >
              <ChatOnboarding onFinish={closeModal} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
