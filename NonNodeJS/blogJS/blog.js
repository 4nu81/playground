function submit () {
    var name = document.getElementById("name").value;
    var text = document.getElementById("text").value;

    var thread = document.getElementById("thread");
    var post = document.createElement("div");
    post.innerHTML = name + "<br>" + text;
    post.classList.add("post");
    thread.appendChild(post);

}