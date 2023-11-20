
var elements = document.getElementsByClassName("like-button");
console.log(elements);
for (var i = 0; i < elements.length; i++) {
    console.log("at element index:" + i);
    index = elements[i].dataset.index
    id = elements[i].dataset.id;
    console.log(index);
    if (index != -1) {
        elements[i].style.color = "red";

    }
    else {
        elements[i].style.color = "black";
    }
}
function showComments(event) {
    let id = event.target.getAttribute("data-id");


    let display = document.getElementById(`comment-box-${id}`).style.display
    console.log(display);
    if (display == "none") {
        document.getElementById(`comment-box-${id}`).style.display = 'block'

    }
    else if (display == 'block') {
        document.getElementById(`comment-box-${id}`).style.display = 'none'

    }
}


function toggleLike(event) {
    const xhr = new XMLHttpRequest();
    var id = event.target.getAttribute("data-id");
    console.log("id is: " + id);
    xhr.open('POST', `/main/toggleLikes/${id}`, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.status == 'like') {
                var likes = parseInt(event.target.innerText);
                console.log('earlier ' + likes);
                likes++;
                event.target.innerHTML = `${likes}`;
                event.target.style.color = "red";
                // alert(response.message);
                console.log('now ' + likes);

            }
            if (response.status == 'unlike') {
                var likes = parseInt(event.target.innerText);
                console.log('earlier ' + likes);
                likes--;
                event.target.innerHTML = `${likes}`;
                event.target.style.color = "black";

                // alert(response.message);
                console.log('now ' + likes);
            }
            if (response.status == "error") {
                alert(response.message);
            }


        }
    }
    var formData = new FormData();

    formData.append("id", id);
    xhr.send(formData);


}
function addComment(event) {


    const xhr = new XMLHttpRequest();
    const id = event.target.getAttribute("data-id");
    console.log(id);
    let comment = document.getElementById("input-" + id).value;
    let commentElement = document.getElementById("input-" + id);
    console.log(comment);
    xhr.open('POST', `/main/${id}&${comment}`, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.status == "success") {
                let comments = parseInt(document.getElementById(`comment-button-${id}`).innerHTML);
                comments++;
                document.getElementById(`comment-button-${id}`).innerHTML = comments;
                let div = document.createElement('div');
                div.classList.add('card');
                div.classList.add('each-comment');
                div.setAttribute('style', "display: flex; flex-direction: row; justify-content: start ;height: auto;margin: 5px 2px;");
                div.innerHTML = `<div class="profile pr-0">
                        <img src="../../img/profile.png" class="mt-2" width="20%" height="40px" alt="...">
                        ${response.username}
                    </div>

                    <div class="card-body">
                        <p class="card-text" style="text-align: start; font-size: 1.2em;">
                            ${response.comment}
                        </p>
                    </div>`;
                document.querySelector(`#comment-box-${id}`).append(div);

            }
            else {
                alert(response.message);
            }

        }
        commentElement.value = "";
    }
    var formData = new FormData();
    // let comment = document.getElementById(id).value;
    formData.append("comment", comment);
    xhr.send(formData);

}
function addAnswers(event) {

    event.preventDefault();
    const xhr = new XMLHttpRequest();
    const id = event.target.getAttribute("data-id");
    let comment = document.getElementById("input-" + id).value;
    let commentElement = document.getElementById("input-" + id);
    console.log(comment);
    xhr.open('POST', `/qna/answers/${id}&${comment}`, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.status == "success") {
                let comments = parseInt(document.getElementById(`comment-button-${id}`).innerHTML);
                comments++;
                document.getElementById(`comment-button-${id}`).innerHTML = comments;
                let div = document.createElement('div');
                div.classList.add('card');
                div.classList.add('each-comment');
                div.setAttribute('style', "display: flex; flex-direction: row; justify-content: start ;height: auto;margin: 5px 2px;");
                div.innerHTML = `<div class="profile pr-0">
                        <img src="../../img/profile.png" class="mt-2" width="20%" height="40px" alt="...">
                        ${response.username}
                    </div>

                    <div class="card-body">
                        <p class="card-text" style="text-align: start; font-size: 1.2em;">
                            ${response.comment}
                        </p>
                    </div>`;
                document.querySelector(`#comment-box-${id}`).append(div);

            }
            else {
                alert(response.message);
            }

        }
        commentElement.value = "";
    }
    var formData = new FormData();
    // let comment = document.getElementById(id).value;
    formData.append("comment", comment);
    xhr.send(formData);

}
function sendMail(event) {
    console.log("sending mail");
    const id = event.target.getAttribute("data-id");

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/main/sendmail/${id}`, true);
    xhr.onreadystatechange = function () {
        var response = JSON.parse(this.responseText);
        alert(response.message);


    }
    var formData = new FormData();
    // let comment = document.getElementById(id).value;
    formData.append("id", id);
    xhr.send(formData);

}