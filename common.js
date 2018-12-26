var range = new BubbleRange({
    wrapper: '.test',
    opacity: 0.5
});

console.log(range.test);

setTimeout( function () {
    console.log(BubbleRange.test);
}, 5000 );
