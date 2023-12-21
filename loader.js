// webchat-loader.js
const endpoint = 'http://localhost:3001'
const beEndpoint = 'http://localhost:8000'
const startSessionUrl = '/v1/webchat/session/initiate'
const WC_SESSION_KEY = 'app0-webchat-session'

const authentication = {
  "x-api-key": "test__NzI1YzkwYWUtOTUxMy00OGJhLWEyZTktYWFhZGRiYzljYzUxOjpzaU02bmpocl9rOXJkMHhUdWVDYm43NGtTcGlpM2FRRkI0eVZhTWU5TGcw"
}

function toggleChatWidget(clientId, visible) {
  const chatFrame = document.getElementById(`app0-webchat-frame-${clientId}`)
  chatFrame.setAttribute('style', `display: ${visible ? 'block' : 'none'}`)
}

// Function to load the WebChat widget
async function loadChatWidget(visitorId, clientId) {
  console.log('loadChatWidget called');
  const data = { visitorId, clientId }
  var session_token = localStorage.getItem(`${WC_SESSION_KEY}-${visitorId}`)
  if(!session_token) {
    const response = await fetch(`${beEndpoint}${startSessionUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authentication
      },
      body: JSON.stringify(data),
    });
    const session = await response.json()
    localStorage.setItem(`${WC_SESSION_KEY}-${visitorId}`, session.data)
    session_token = session.data
  }
  const frameDiv = document.createElement('div');
  frameDiv.setAttribute('id', `app0-webchat-frame-${clientId}`);
  const chatFrame = document.createElement('iframe');
  chatFrame.src = `${endpoint}/?t=${session_token}`;
  chatFrame.setAttribute('data-webchat', '1');
  chatFrame.setAttribute('data-uid', clientId);
  chatFrame.setAttribute('id', `app0-webchat-iframe-${clientId}`)
  const closeDiv = document.createElement('div');
  closeDiv.setAttribute('id', `app0-webchat-frame-close-${clientId}`)
  const closeImg = document.createElement('img');
  closeImg.src = "/Users/souvikdey/Documents/App0/sturdy-waffle/Loader/close.svg"
  closeDiv.onclick = () => toggleChatWidget(clientId, false);
  closeDiv.appendChild(closeImg)
  frameDiv.appendChild(chatFrame)
  frameDiv.appendChild(closeDiv);
  document.body.appendChild(frameDiv);
  showBubble(visitorId, clientId)
}

function showBubble(visitorId, clientId) {
  // Add CSS styles for the chat bubble
  const styles = document.createElement('style');
  styles.innerHTML = `
    /* Add your custom CSS styles for the chat bubble here */
    #app0-webchat-bubble-${clientId} {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed !important;
      bottom: 20px;
      right: 20px;
      background-color: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      z-index: 9998;
      box-shadow: 5px 5px 10px #ddd;
      cursor: pointer;
    }
    #app0-webchat-frame-${clientId} {
      display: none;
      position: fixed !important;
      bottom: 20px;
      right: 20px;
      background-color: #fff;
      min-width: 320px;
      width: 320px;
      min-height: 360px;
      height: 50vh;
      z-index: 9999;
      box-shadow: 5px 5px 10px #ddd;
      cursor: pointer;
    }
    #app0-webchat-iframe-${clientId} {
      min-width: 320px;
      width: 320px;
      min-height: 360px;
      height: 50vh;
    }
    #app0-webchat-frame-close-${clientId} {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
    #app0-webchat-frame-close-${clientId} > img {
      width: 25px;
    }
  `;
  document.head.appendChild(styles);
  const chatBubble = document.createElement('div');
  const bubbleImg = document.createElement('img');
  bubbleImg.src = 'https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-chatbot-icon-chat-bot-robot-png-image_4841963.png'
  chatBubble.appendChild(bubbleImg)
  chatBubble.setAttribute('id', `app0-webchat-bubble-${clientId}`);
  chatBubble.onclick = () => toggleChatWidget(clientId, true);
  document.body.appendChild(chatBubble);
}

// Load the WebChat widget when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const webchatId = 'token0';
  const visitorId = 'ABC1234';
  loadChatWidget(visitorId, webchatId)
});
