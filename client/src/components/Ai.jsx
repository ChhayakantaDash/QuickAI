import React, { useEffect, useState } from "react";
import image from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; // Clerk hook

function Ai() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [listening, setListening] = useState(false);

  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log("User said:", transcript);

      // Commands (public vs private)
      const commands = [
        { variations: [["dashboard"],["get started"],["Start creating now"],[" creating now"]], path: "/ai", message: "Opening dashboard", private: true },
        { variations: [["write", "article"], ["article"]], path: "/ai/write-article", message: "Opening write article", private: true },
        { variations: [["blog", "titles"], ["blog", "title"],["block", "title"]], path: "/ai/blog-titles", message: "Opening blog titles", private: true },
        { variations: [["generate", "images"], ["generate", "image"]], path: "/ai/generate-images", message: "Opening generate images", private: true },
        { variations: [["remove", "background"], ["background"]], path: "/ai/remove-background", message: "Opening remove background", private: true },
        { variations: [["remove", "object"], ["delete", "object"], ["object"]], path: "/ai/remove-object", message: "Opening remove object", private: true },
        { variations: [["review", "resume"], ["resume"]], path: "/ai/review-resume", message: "Opening review resume", private: true },
        { variations: [["community"]], path: "/ai/community", message: "Opening community", private: true },
        { variations: [["home","page"]], path: "/", message: "Going home", private: false }, // 👈 public route
      ];

      let matched = false;
      for (let cmd of commands) {
        for (let variation of cmd.variations) {
          if (variation.every((word) => transcript.includes(word))) {
            if (cmd.private && !isSignedIn) {
              // Protected route but user not logged in
              speak("You need to log in first.");
              navigate("/ai");
            } else {
              // Public route or logged in user
              speak(cmd.message);
              navigate(cmd.path);
            }
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      if (!matched) {
        speak("Sorry, I did not understand that command.");
      }
    };
  }, [recognition, navigate, isSignedIn]);

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] right-[2%]"
      onClick={() => recognition && recognition.start()}
    >
      <img
        src={image}
        alt="AI Bot"
        className={`w-[100px] cursor-pointer transition-all duration-300 ${
          listening ? "animate-pulse drop-shadow-[0_0_15px_purple]" : ""
        }`}
      />
    </div>
  );
}

export default Ai;
