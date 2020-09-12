const chat = $("#chat");
const chatBox = $("#chatBox");

let nick = "Guest";

let firebaseConfig = {
	apiKey: "AIzaSyC0I4quaWku2AX5Qi7iHSBMDt8hzvf34X0",
	authDomain: "eliteasian123-chat.firebaseapp.com",
	databaseURL: "https://eliteasian123-chat.firebaseio.com",
	projectId: "eliteasian123-chat",
	storageBucket: "eliteasian123-chat.appspot.com",
	messagingSenderId: "49009909336",
	appId: "1:49009909336:web:6566afb0c61ee92633342d",
	measurementId: "G-7F0LX3D0GN"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

database.ref("messages").on("value", function(snapshot) {
	updateChat(snapshot.val());
});

$(document).on("keypress", "input", function(e) {
	if (e.which === 13) {
		sendMessage();
	}
});



function updateChat(messages) {
	chat.empty();

	for (const messageId in messages) {
		const message = messages[messageId];
		
		chat.append($("<li><b>" + filter(message.sender) + "</b><br>" + filter(message.content) + "</li>"));
	}
	
	scrollChatToBottom();
}

function sendMessage() {
	if (chatBox.val() === "/clear") {
		database.ref("messages").set({
			"0": {
				sender: "System",
				content: nick + " cleared the chat. You can clear the chat with \"/clear\""
			}
		});
		database.ref("nextMessageId").set(1);
		
		chatBox.val("");
	} else if (chatBox.val().startsWith("/nick")) {
		nick = chatBox.val().substr(6);
		
		chatBox.val("");
	} else if (!chatBox.val().isEmpty()) {
		database.ref("nextMessageId").once("value").then(function(snapshot) {
			database.ref("messages/" + snapshot.val()).set({
				sender: nick,
				content: chatBox.val()
			});
			
			database.ref("nextMessageId").set(snapshot.val() + 1);
			
			chatBox.val("");
			
			scrollChatToBottom();
		});
	}
}

function filter(str) {
	let modified = str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	
	const profanityInfos = profanityFilter.check(modified);
	
	for (const profanityInfo of profanityInfos) {
		if (profanityInfo.info >= 1) {
			for (let i = 1; i < profanityInfo.replacedLen; i++) {
				modified = modified.replaceAt(profanityInfo.start + i, "*");
			}
		}
	}
	
	return modified;
}

function scrollChatToBottom() {
	chat.stop().animate({
		scrollTop: chat[0].scrollHeight
	}, 800);
}

// Add isEmpty function to String
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

// Add replaceAt function to String 
// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}