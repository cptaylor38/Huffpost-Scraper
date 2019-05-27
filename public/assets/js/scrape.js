$('#scrapeBtn').on('click', () => {
    $('#postsArea').empty();
    location.href = '/scrape';
});

$('#contBtn').on('click', () => {
    location.href = '/all';
});

$('.deleteComment').on('click', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        method: "PUT",
        url: "/delete/note/" + id
    }).then(
        function (res) {
            location.href = '/all';
        });
});

$('.commentBtn').on('click', function () {
    let id = $(this).attr('data-id');
    let user = $(`[data-user="${id}"]`).val().trim();
    let body = $(`[data-comment="${id}"]`).val().trim();

    let data = {
        user: user,
        body: body
    }

    if (data) {
        console.log(data);
        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: data
        }).then(
            function (res) {
                location.href = '/all';
            });
    }
    else {
        console.log(user + body);
    }
    $('#userText').val().trim();
    $('#commentText').val().trim();

})