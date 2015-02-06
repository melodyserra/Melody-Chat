var chatTemplate;

$(document).ready(function() {
	var chatTemplateSource = $("#chat-row-template").html();
	chatTemplate = Handlebars.compile(chatTemplateSource);

	if (!localStorage.getItem("username")) {
		$("#username-modal").modal({
			show: true,
			backdrop: "static",
			keyboard: false
		});
	}

	var allChats = localStorage.getItem("all_chats");

	if (allChats) {
		var chats = JSON.parse(allChats);

		chats.forEach(function(chat) {
			var html = chatTemplate(chat);
			$("#chat-window").append(html);
		});
	}

	resizeChat();

	scrollBottom();
});

function scrollBottom() {
	$("#chat-window").animate({
		scrollTop: $("#chat-window")[0].scrollHeight
	});
}

function submitUsername() {
	if ($("#username-input").val() === "" || localStorage.getItem("username")) {
		return false;
	}

	localStorage.setItem("username", $("#username-input").val());

	$("#username-modal").modal("hide");
}

$(document).on("click", "#submit-username", function(event) {
	event.preventDefault();

	submitUsername();
});

$(document).on("keyup", "#username-input", function(event) {
	if (event.which === 13) {
		submitUsername();
	}
});

function resizeChat() {
	$("#chat-wrapper").css("height", $(window).height());
	$("#chat-window").css("height", ($(window).height() - 90));
}

$(window).resize(function() {
	resizeChat();
});

var socket = io();

socket.on("chat", function(chatInfo) {
	var html = chatTemplate(chatInfo);
	$("#chat-window").append(html);
	scrollBottom();
});

function addToStorage(chatInfo) {
	var allChats = localStorage.getItem("all_chats");

	if (allChats) {
		var chatJson = JSON.parse(allChats);
		chatJson.push(chatInfo);
		localStorage.setItem("all_chats", JSON.stringify(chatJson));
	} else {
		allChats = [];
		allChats.push(chatInfo);
		localStorage.setItem("all_chats", JSON.stringify(allChats));
	}
}

function sendMessage() {
	if ($("#chat-input").val() === "") {
		return false;
	}

	var chatInfo = {
		chatText: $("#chat-input").val(),
		userName: localStorage.getItem("username")
	};

	socket.emit("chat", chatInfo);

	$("#chat-input").val("");

	var html = chatTemplate(chatInfo);
	$("#chat-window").append(html);

	scrollBottom();

	addToStorage(chatInfo);
}

$(document).on("click", "#send-message-button", function(event) {
	event.preventDefault();

	sendMessage();
});

$(document).on("keyup", "#chat-input", function(event) {
	if (event.which === 13) {
		sendMessage();
	}
});