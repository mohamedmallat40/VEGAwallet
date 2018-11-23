require('../premise.js');
var _ = require('underscore');
describe('premise', function() {
  var integers = [1, 2, 3, 4, 5, 6, 7];
  var strings  = ['apple', 'pear', 'banana', 'orange'];
  var posts  = [
    {
      post:   'Premise.js is really cool!',
      sticky: true,
      selected: true,
      date:   new Date('1999-12-31')
    },
    {
      post:   'How to use Premise.js with underscore or lodash',
      sticky: false,
      selected: false,
      date:   new Date('1999-12-31')
    },
    {
      post:   'New uses for premise.js',
      sticky: false,
      selected: true,
      date:   new Date()
    }
  ];

  it('defaults to a noop function', function() {
    var withPremise = _.map(integers, premise());
    expect(integers).toEqual(withPremise);
  });

  it('accepts chained premises on default', function() {
    var withPremise = _.map(strings, premise().eq('banana'));
    expect(withPremise).toEqual([false, false, true, false]);
    var withPremise = _.map(strings, premise().eq('pear'));
    expect(withPremise).toEqual([false, true, false, false]);
  });

  it('rejects not equal', function() {
    var notSticky = _.reject(posts, premise('sticky').ne(true));
    expect(notSticky).toEqual([ posts[0] ]);
    var not246or8 = _.select(integers, premise().ne(2).and().ne(4).and().ne(6));
    expect(not246or8).toEqual([1, 3, 5, 7])
  });

  it('accepts an attributes with noop', function() {
    var stringLengths = _.map(strings, premise('length'));
    expect(stringLengths).toEqual([5, 4, 6, 6]);
    
    var stickyPosts = _.select(posts, premise('sticky'));
    expect(stickyPosts).toEqual([ posts[0] ]);
  });

  it('selects numbers greater than', function() {
    var gt5 = _.select(integers, premise().gt(5));
    expect(gt5).toEqual([6, 7]);
  });

  it('maps numbers with less than', function() {
    var lt4 = _.map(integers, premise.lt(4));
    expect(lt4).toEqual([true, true, true, false, false, false, false]);
  });

  it('accepts chained OR premises with a property', function() {
    var stickyOrRecent = _.select(posts, premise('sticky').eq(true).or('date').gt(new Date('2009-12-31')));
    expect(stickyOrRecent).toEqual([ posts[0], posts[2] ]);
  });

  it('adds to integers', function() {
    var plusOne = _.map(integers, premise.add(1));
    expect(plusOne).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  it('subtracts integers', function() {
    var minusOne = _.map(integers, premise.sub(1));
  });

  it('multiplies integers', function() {
    var mult10 = _.map(integers, premise.mul(10));
    expect(mult10).toEqual([10, 20, 30, 40, 50, 60, 70]);
  });

  it('divides integers', function() {
    var divZero = _.map(integers, premise.div(10));
    expect(divZero).toEqual([.1, .2, .3, .4, .5, .6, .7]);
  });

  it('modulos integers', function() {
    var mod2 = _.map(integers, premise.mod(2));
    expect(mod2).toEqual([1, 0, 1, 0, 1, 0, 1]);
  });

  it('should accept shorthand premise syntax', function() {
    var shorthanded = _.map(strings, premise.eq('apple'));
    expect(shorthanded).toEqual( _.map(strings, function(str) { return str == 'apple'; }) );
  });

  it('accepts shorthand syntax for OR', function() {
    var shorthanded = _.map(strings, premise().eq('apple').or.eq('pear'));
    expect(shorthanded).toEqual([true, true, false, false]);
  });

  it('accepts shorthand syntax for OR with not', function() {
    var shorthanded = _.map(strings, premise.ne('apple').or.ne('pear'));
    var expectation = _.map(strings, function(str) { return str != 'pear' || str != 'apple' });
    expect(shorthanded).toEqual(expectation);
  });

  it('accepts shorthand AND syntac', function() {
    var shorthanded = _.map(integers, premise.mod(0).and.gt(5));
    var expectation = _.map(integers, function(int) { return int % 0 && int > 5; });
    expect(shorthanded).toEqual(expectation);
  });

  it('can make really long chains with a shorthand function', function() {
    var shorthand = _.map(integers, premise.eq(1).or.eq(2).or.eq(3).and.eq(4));
    var expectation = _.map(integers, function(i) { return i == 1 || i == 2 || i == 3 && i == 4 });
    expect(shorthand).toEqual(expectation);
  });

  it('should use short circuit or', function() {
    var added = _.map(integers, premise().add(6).or().add(5));
    expect(added).toEqual([7, 8, 9, 10, 11, 12, 13]);
  });

  it('allows premise objects to be passed in, and groups them logically', function() {
    var endDate = new Date('2015-02-02');
    var complexPremise = premise('date').lt(endDate).and( premise('sticky').eq(true).or('selected').eq(true) );
    var actual = _.select(posts, complexPremise)
    var expected = _.select(posts, function(post) {
      return post.date < endDate && (post.sticky == true || post.selected == true);
    });
    expect(actual).toEqual(actual);
    complexPremise     = premise().gt(5).or(premise().lt(4).and().gte(2));
    expect(_.map(integers, complexPremise)).toEqual(_.map(integers, function(integer) { return integer > 5 || (integer >= 2 && integer < 4) }));
  });

  it('can have doubly nested premises', function() {
    var nested   = premise.gt(5).and().lt(7);
    var doubleNested = premise.gt(1).and.lt(3);
    var actual   = _.select(integers, premise.eq(4).or(nested.or(doubleNested)));
    var expected = _.select(integers, function(i) { return i == 4 || (i > 5 && i < 7 || (i > 1 && i < 3)); });
    expect(actual).toEqual(expected);
  });
});
