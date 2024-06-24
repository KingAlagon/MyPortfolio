var Typed = new Typed(".multiple-text", {
    strings: ["Programmer.", "Virtual Assistant.", "WARAGUD."],
    typeSpeed: 50,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

document.addEventListener('DOMContentLoaded', function() {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbot = document.getElementById('chatbot');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const faqContainer = document.getElementById('faq-container');
    const faqList = document.getElementById('faq-list');

    // Event listener for clicking the chatbot icon
    chatbotIcon.addEventListener('click', function() {
        chatbot.classList.add('active');
        chatbotIcon.style.display = 'none';
        faqContainer.style.display = 'block'; // Show the FAQ container
    });

    // Event listener for closing the chatbot
    chatbotClose.addEventListener('click', function() {
        chatbot.classList.remove('active');
        chatbotIcon.style.display = 'flex';
        faqContainer.style.display = 'none'; // Hide the FAQ container when closing chatbot
    });

    // Event listener for FAQ buttons
    faqList.addEventListener('click', async function(e) {
        if (e.target.classList.contains('faq-button')) {
            const faq = e.target.textContent; // Get the text content of the button
            let intent; // Define the intent variable
        
            // Map FAQ titles to their corresponding intents
            switch (faq) {
              case 'About King?':
                intent = 'about';
                break;
              case 'How can I contact you?':
                intent = 'contact';
                break;
              case 'Educational Background?':
                intent = 'background';
                break;
              // Add more cases for each FAQ title
              default:
                intent = 'nlu_fallback'; // Fallback intent if no match is found
            }
        
            const message = `/${intent}`; // Format the message as per Rasa intent
  
      console.log('Sending message to Rasa:', message);
      addMessage(`${faq}`, true); // Notify user about the click
  
      try {
        const responses = await sendMessageToRasa(message); // Send the FAQ intent to Rasa
        responses.forEach(response => {
          setTimeout(() => {
            addMessage(response.text);
          }, 1000); // Add delay between messages (optional)
        });
      } catch (error) {
        console.error('Error sending message to Rasa:', error);
        addMessage('Sorry, I encountered an error. Please try again.');
      }
    }
  });
    
    

    // Function to add messages to the chat window
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.textAlign = isUser ? 'right' : 'left';
        messageElement.style.margin = '5px';
        messageElement.style.padding = '5px';
        messageElement.style.borderRadius = '5px';
        if (isUser) {
            messageElement.style.backgroundColor = '#cff';
            messageElement.style.color = '#444';
            messageElement.style.fontSize = '0.8em'; // make user message text smaller
        } else {
            messageElement.style.backgroundColor = '#1ba0d4';
            messageElement.style.color = '#fff';
            messageElement.style.fontSize = '0.8em'; // make Rasa bot message text smaller
        }
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to handle user input and send it to Rasa
    async function handleUserInput() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, true); // Display user's message in the chat
            chatbotInput.value = ''; // Clear the input box after sending message
    
            try {
                const responses = await sendMessageToRasa(userMessage); // Send user message to Rasa
                responses.forEach(response => {
                    setTimeout(() => {
                        addMessage(response.text); // Display Rasa's response
                    }, 1000); // Add delay between messages (optional)
                });
            } catch (error) {
                console.error('Error sending message to Rasa:', error);
                addMessage('Sorry, I encountered an error. Please try again.');
            }
        }
    }
    

    // Function to send message to Rasa
    async function sendMessageToRasa(message) {
        const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: 'user', message: message }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return response.json(); // Return JSON response from Rasa
    }
    
    
    // Event listeners for sending user input
    chatbotSend.addEventListener('click', handleUserInput);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});

