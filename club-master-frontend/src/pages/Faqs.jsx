import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; 
import './Faqs.css';

const Faqs = () => {
    
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    { question: "What is the University Club Management System?", answer: "It is a system to manage all the clubs in the university, including club membership, events, and communications." },
    { question: "How do I join a club?", answer: "You can join a club by registering through the system's website and filling out the necessary information." },
    { question: "Can I start my own club?", answer: "Yes, students can apply to start their own clubs by submitting a proposal for approval." },
    { question: "How can I register for club events?", answer: "You can register for club events through the event registration section on the club's page in the system." },
    { question: "Is there a fee to join a club?", answer: "Some clubs may have a membership fee, which will be mentioned on the club's registration page." },
    { question: "Can I leave a club after joining?", answer: "Yes, you can leave any club at any time via your profile settings." },
    { question: "How do I get in touch with club leaders?", answer: "Each club page has contact details for club leaders, including email and social media links." },
    { question: "What is the process for hosting a club event?", answer: "To host an event, club leaders must submit an event request through the system for approval." },
    { question: "Can I attend events of multiple clubs?", answer: "Yes, you can attend events from any club, as long as you are registered for that club." },
    { question: "Is there an app for the University Club Management System?", answer: "Currently, the system is accessible via web browsers, but we are planning to release an app soon." },
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faqs-container">
       <Navbar /> 
        
      <div className="faqs-background">
        <div className="faqs-header">
          <h1>Frequently Asked Questions</h1>
        </div>
        <div className="faqs-list">
          {questions.map((item, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => handleToggle(index)}>
                
                <span className="question-text">{item.question}</span>
                <span className="plus-minus">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
              
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;
