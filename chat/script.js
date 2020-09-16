// Add isEmpty function to String
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

// Add replaceAt function to String 
// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(a, b) {
		this.split(a).join(b);
	}
}

const chat = $("#chat");
const chatBox = $("#chatBox");

const buttonSend = $("#buttonSend");
const buttonSettings = $("#buttonSettings");

const settingsMenu = $("#settingsMenu");
const profanityCheckbox = $("#profanityCheckbox");
const systemMessagesCheckbox = $("#systemMessagesCheckbox");

let nick = "Guest";
let id = Math.floor(1000 + Math.random() * 9000).toString();

let lastMessageSnapshot;

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
	lastMessageSnapshot = snapshot.val();
	updateChat(lastMessageSnapshot);
});

$(document).on("keypress", "input", function(e) {
	if (e.which === 13) {
		onEnter();
	}
});

buttonSend.click(function() {
	onEnter();
});

buttonSettings.click(function() {
	settingsMenu.toggleClass("closed");
});

profanityCheckbox.click(function() { if (lastMessageSnapshot) updateChat(lastMessageSnapshot) });
systemMessagesCheckbox.click(function() { if (lastMessageSnapshot) updateChat(lastMessageSnapshot) });



function updateChat(messages) {
	chat.empty();

	for (const messageId in messages) {
		const message = messages[messageId];
		
		if (!systemMessagesCheckbox.prop("checked") && message.class.includes("m-system"))
			continue;
		
		chat.append($("<li class=\"" + classFilter(message.class) + "\"><span class=\"message-title\">" + filter(message.sender) + 
			"</span><span class=\"message-id\"> " + filter(message.sender_id) + "</span><br><span class=\"message-content\">" + filter(message.content) + "</span></li>"));
	}
	
	scrollChatToBottom();
}

function onEnter() {
	if (chatBox.val() === "/clear") {
		database.ref("messages").set({
			"0": {
				sender: "System",
				sender_id: "",
				content: nick + " cleared the chat. You can clear the chat with \"/clear\"",
				class: "m-system"
			}
		});
		database.ref("nextMessageId").set(1);
	} else if (chatBox.val().startsWith("/nick ")) {
		nick = chatBox.val().substr(6);
	} else if (chatBox.val().startsWith("/a ")) {
		sendMessage(" < Anonymous > ", chatBox.val().substr(3), "m-anonymous", "");
	
		scrollChatToBottom();
	} else if (!chatBox.val().isEmpty()) {
		sendMessage(nick, chatBox.val(), "", id);
		
		scrollChatToBottom();
	}
	
	chatBox.val("");
}

function sendMessage(author, content, classes, authorId) {
	database.ref("nextMessageId").once("value").then(function(snapshot) {
		database.ref("messages/" + snapshot.val()).set({
			sender: author,
			sender_id: authorId,
			content: content,
			class: classes
		});
		
		database.ref("nextMessageId").set(snapshot.val() + 1);
	});
}

function filter(str) {
	if (!str)
		return "";
	
	let modified = str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	
	if (profanityCheckbox.prop("checked")) {
		const profanityInfos = profanityFilter.check(modified);
	
		for (const profanityInfo of profanityInfos) {
			if (profanityInfo.info >= 1) {
				for (let i = 1; i < profanityInfo.replacedLen; i++) {
					modified = modified.replaceAt(profanityInfo.start + i, "*");
				}
			}
		}
	}
	
	return modified;
}

function classFilter(str) {
	if (!str)
		return "";
	
	return str.replaceAll("\"", "").replaceAll("\\", "").replaceAll("'", "")
}

function scrollChatToBottom() {
	chat.stop().animate({
		scrollTop: chat[0].scrollHeight
	}, 800);
}