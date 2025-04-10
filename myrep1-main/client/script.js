import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
      element.textContent += '.';
      if(element.textContent === '....'){
        element.textContent = '';
      }
    }, 300);
}

function typeText(element, text){
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 20 );
}

function generateUniqueID() {
  const timestamp = Date.now();
  const randomnumber = Math.random();
  const hexadecimalString = randomnumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueID){
  return (
    `<div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id=${uniqueID}>${value}</div>
      </div>
    </div>`
  );
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueID);

  loader(messageDiv);

  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: data.get('prompt')
      })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = ' ';

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      console.error('Error:', err);
      messageDiv.innerHTML = "Sorry, there was an error. Please try again.";
    }
  } catch (error) {
    console.error('Error:', error);
    clearInterval(loadInterval);
    messageDiv.innerHTML = "Sorry, there was an error. Please try again.";
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
});
