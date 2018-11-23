# premise.js

IMO javascript's saving grace is its built in asynchronousity with the ability to pass around functions.

```
get('something', function doThisAfterGettingSomething(data) {
  // Do stuff with data
});
```

but this creates a stylistic problem:

```
get('something', function(data) {
  var values = map(data, function(item) {
    return map(item.posts, function(otherItem) {
      return // finally return the thing you wanted
    });
  });
  // do something with values
});
```

This is also commonly referred to as callback hell. http://callbackhell.com

*What if there was a way to simplify logical predicates?*

# Examples

```
get('posts', function(posts) {
  var stickyPosts = _.select(posts, premise('sticky'));
});
```

But wait there's more!

You can do use any javascript operator sequence
`|| && + - / * < > <= >= == !=`

```
var recentPosts = _.select(posts, premise('pinned').or('timestamp').gt(new Date('2016-1-1')))

// Say you have a date range filter
var visiblePosts = _.select(posts, premise('date').gt(startDate).or('date').lt(endDate));

// Maybe you want to translate values
var percentages = _.map([ 0.3213, 0.5123, 0.7735 ], premise.mul(100));
//=> [32.13, 51.23, 77.35]
```

## Nesting
```
var sortedPostsPremise = premise('selected').and(premise('pinned').or('date'));
// logically equivalent to function(obj) { return obj.selected && (obj.pinned || obj.date) }
```

# Usage
```
predicate(attribute)
```
predicate returns a matcher object, on which you can call any of the chain functions `and, or, gt, lt, gte, lte, eq, ne, add, sub, mult, div, strictEq, strictNeq`

More to come. Enjoy!
