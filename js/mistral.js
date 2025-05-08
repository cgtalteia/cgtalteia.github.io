const API_KEY = 'uYhxuiZytyDQHsQJzwTzQHd7WSbdpizL';
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const messageList = document.getElementById('messageList');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
        let skeletonLoader = null;
        var context = "";
    
        function scrollToBottom() {
            messageList.scrollTop = messageList.scrollHeight; // Scroll to the bottom
        }
    
        // Function to show the skeleton loader
        function showSkeletonLoader() {
            if (!skeletonLoader) {
                skeletonLoader = document.createElement('div');
                skeletonLoader.className = 'skeleton-loader';
                skeletonLoader.innerHTML = `
                    <div class="message bot">
                        <div class="skeleton-message"></div>
                    </div>
                `;
                messageList.appendChild(skeletonLoader);
            }
            skeletonLoader.style.display = 'flex';
            scrollToBottom();
        }
    
        // Function to hide the skeleton loader
        function hideSkeletonLoader() {
            skeletonLoader.style.display = 'none';
            skeletonLoader.remove();
            skeletonLoader = null;
        }
    
        // Example function to add a new message
        function addMessage(messageText, isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
            const messageBubble = document.createElement('div');
            messageBubble.className = 'message-bubble';
            messageBubble.textContent = messageText;
    
            messageDiv.appendChild(messageBubble);
            messageList.appendChild(messageDiv);
    
            // Scroll to bottom after adding a new message
            scrollToBottom();
        }
    
        // Function to handle sending a message
        async function sendMessage() {
            const userMessage = userInput.value.trim();
            if (userMessage) {

                addMessage(userMessage, true);
                userInput.value = '';
    
                // Show skeleton loader while waiting for bot response
                showSkeletonLoader();
    
                // Simulate bot response (replace with your actual chatBot function call)
                const botMessage = await askMistral(userMessage, context);
                
                // Hide skeleton loader and add bot message
                hideSkeletonLoader();
                addMessage(botMessage, false);
                setTimeout(async () => {
                    await buildContext(userMessage, botMessage);
                }, 2000);
            }
        }

        async function buildContext(userMessage, botMessage) {
            context += "Utilisateur : " + userMessage + "\n";
            context += "Assistant : " + botMessage + "\n";
    
            const prompt = "Résume très brièvement chaque réplique précédente sans les supprimer.\n\n" + context;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt}],
                    max_tokens: 1000
                })
            });
            const data = await response.json();
            context = data.choices[0].message.content;
        }
    
        // Add event listener to the send button
        sendButton.addEventListener('click', sendMessage);
    
        // Add event listener for Enter key press
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    });

    /**
     * Ask Mistral AI
     * @param {string} prompt - The question to ask Mistral AI
     * @param {string} context - The context of the conversation
     * @returns {Promise<string>} The answer from Mistral AI
     */
    async function askMistral(prompt, context) {
        var pre_prompt = "Tu joues le jeu du chatbot de la CGT d'Alteia.\
        Tu réponds à des questions sur le droit du travail en France et le syndicalisme.\
        Ceux qui t'interrogent sont des salariés d'une entreprise qui s'appelle Alteia.\
        La convention collective est la convention de la métallurgie.\
        C'est une entreprise de développement de logiciels.\
        Tu ne connais rien d'autre que le droit du travail en France et le syndicalisme.\
        Par conséquent, tu dois répondre que tu ignores les réponses aux questions posées si elles n'ont rien à voir avec tes compétences.\
        Tu réponds uniquement en français et tu réponds de manière très concise et très efficace.\
        Tu dois tutoyer le lecteur.";
        if (context != "") {
            console.log("context", context);
            pre_prompt += " Conseille-le de prendre contact avec la section syndicale de la CGT d'Alteia.\n\n\
            Voici la conversation précédente : \n" + context;
            pre_prompt += "\n\n";
            pre_prompt += "Voici la question posée : \n\n" + prompt;
        } else {
            pre_prompt += "Voici la question posée : \n\n" + prompt;
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [{ role: 'user', content: pre_prompt}],
                max_tokens: 1000
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }

    function printBotMessage(answer) {
        chatContainer.innerHTML += "<div class='message bot'><div class='message-bubble'></div></div>";
        const messages = chatContainer.getElementsByClassName('message-bubble');
        const answerElement = messages[messages.length - 1];
        answerElement.innerHTML = '';
        let i = 0;
        const interval = setInterval(() => {
            answerElement.innerHTML += answer[i];
            i++;
            if (i >= answer.length) {
                clearInterval(interval);
            }
        }, 20);
    }
})();