const _URL = "ws://localhost:8000/";
let ws = null;
var message = "";
var username = "";
var userImage = "";
let messageObject = {
    "username": "",
    "image": "",
    "message": ""
}
$(document).ready(function () {
    init();
    connectToServer();
    receiveMessage();
})

function init() {
    username = "User" + Math.floor(Math.random() * 1011);
    userImage = "https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png";
    $('#txtUsername').val(username);
    $('#imgURL').val(userImage)
    $('#img').attr("src", $('#imgURL').val())
    $("#btnReg").text("Please register first !");
    $("#txtMessage").attr("disabled", true)
}

function onRegister() {
    $('#img').attr("src", $('#imgURL').val())
    $("#btnReg").text("Register Successfully!");
    $("#txtMessage").attr("disabled", false)
    $("#txtUsername").attr("disabled", true)
    $("#imgURL").attr("disabled", true)
    $('#chatUserLogo').attr("src", $('#imgURL').val())
    $("#chatUsername").text($('#txtUsername').val());

}

function connectToServer() {

    ws = new WebSocket(_URL)
    ws.onopen = function () {
        console.log("Connection Open!");
    }
}

$('#txtMessage').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        sendMessage();
        return false;
    }
});

function sendMessage() {
    username = $('#txtUsername').val()
    messageObject.username = username;
    messageObject.image = $('#imgURL').val();
    messageObject.message = $("#txtMessage").val();
    ws.send(JSON.stringify(messageObject));
    receiveMessage();

}

function receiveMessage() {
    ws.onmessage = function (evt) {
        updateChatRoom(evt.data)
    }
}

function updateChatRoom(obj) {
    messageObject = JSON.parse(obj)

    var html = '';
    html += username == messageObject.username ? '<div class="container d-flex flex-row-reverse">' : '<div class="container d-flex flex-row">';
    html += username == messageObject.username ? '<div class="alert alert-success w-50">' : '<div class="alert alert-primary w-50">';
    html += '        <div class="row">';
    html += '    <div class="col-md-2">';
    html += '    <img style="width: 2rem;height: auto;"';
    html += '        class="m-1 border border-success rounded-circle float-right"';
    html += '        src="' + messageObject.image + '">';
    html += '   </div>';
    html += '   <div class="col-md-10">';
    html += '       <div class="col-12">  ' + messageObject.message + '  </div>';
    html += '       <div class="col-12 text-right"><small><i>' + messageObject.username + '</i></small></div>';
    html += '    </div>';
    html += '        </div>';
    html += '    </div>';
    html += '</div>';

    $("#chatBox").append(html)
    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);

}


