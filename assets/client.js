$(document).ready(function() {
	$("#username-modal").modal({
		show: true,
		backdrop: "static",
		keyboard: false
	});

	scrollBottom();
});

function scrollBottom() {
	$("#chat-window").animate({
		scrollTop: $("#chat-window").height()
	});
}

function submitUsername() {
	if ($("#username-input").val() === "") {
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

resizeChat();

$(window).resize(function() {
	resizeChat();
});

var chatTemplateSource = $("#chat-row-template").html();
var chatTemplate = Handlebars.compile(chatTemplateSource);

var socket = io();

socket.on("chat", function(chatInfo) {
	var html = chatTemplate(chatInfo);
	$("#chat-window").append(html);
	scrollBottom();
});

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