stateGMachine
=============

### State Gandzo Machine

Micro state machine, with states as monads.

Simply initialize state machine:

> var machine = new GMachine (states);

#### States

States are objects that will be wrapped by monads.
You can either pass a single object to the GMachine constructor or an array of objects.

#### Monads

stateGMachine also gives you the GMonad object constructor.

Simply construct a new monad holding the value 5 like this:

> var m = new GMonad (5);

To get the value of the monad use the val method:

> m.val(); //returns 5

You can execute some function on the monad value by using the bind method:

> function addOne (x) {
>   return x+1;
> }
> m.bind(addOne);

This will return 6 but will not mutate the original monad value.

If you want to get back a new monad from some function, use the lift method

> m.lift(addOne);

This will return a new GMonad object holding the value 6.
lift method does not mutate the original object, instead it returns a new monad.

#### Chaining

When using lift, you can chain operations together, because lift will always return you a new monad:

> m.lift(addOne).lift(addOne).lift(addOne);

This will return a new monad holding the value 8.

We can also chain in a completely different way. Using then method - then returns the same monad, not a new copy. This enables you to chain operations that might take some time. A good example are Front-End animations that you can chain together.
At the end of every operation you should call the step method of the monad that will signal the monad that the operation was completed and it can stop the execution or execute the next one in chain.
Here's an example using setTimeout as our time consuming operation.

> m.then(function(){setTimeout(function(){console.log(m.val()); m.step();}, 1000)})
>  .then(function(){console.log("I'm executed a second late.");m.step();});

#### Chaining states

An example of using monadic states would be a web app or site that is heavy on animated effects.
You could define your states as content page and gallery page. Put in activate and deactivate methods in both states that use then method and do some DOM animation magic, call step() method in the callbacks. Then to do the state transition you can use simply:

> machine.contentPage.deactivate().then(galleryPage.activate());

####Stuff

I know this is super vague, it's also a work in progress ;)
