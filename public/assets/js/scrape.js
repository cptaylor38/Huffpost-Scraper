$('#scrapeBtn').on('click', () => {
    $('#postsArea').empty();
    location.href = '/scrape';
})

$('#contBtn').on('click', () => {
    location.href = '/all';
})