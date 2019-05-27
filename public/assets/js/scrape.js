$('#scrapeBtn').on('click', () => {
    $('#postsArea').empty();
    location.href = '/scrape';
});

$('#contBtn').on('click', () => {
    location.href = '/all';
});

$('.deleteComment').on('click', () => {

});

$('.commentBtn').on('click', function () {
    let id = $(this).attr('data-id');
    let user = $('#userText').val().trim();
    let body = $('#commentText').val().trim();

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


})