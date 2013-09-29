//State Gandzo Machine - includes Monads
//States in this state machine are monads, and allow for classic monad features such as lift and bind
//Chaining monads is possible with the combinations of then and step methods
;
(function (exports) {

  function Monad(value) {
    this.value = value;
    this.actions = [];
    this.executing = false;
  }

  Monad.prototype.val = function () {
    return this.value;
  };

  Monad.prototype.bind = function(fn) {
    var that = this;
    return fn.call(that,that.value);
  };

  Monad.prototype.lift = function (fn) {
    var that = this;
    return new Monad (fn(that.value));
  };

  Monad.prototype.step = function() {
    this.executing = false;
    if (this.actions.length > 0) {
      this.executing = true;
      this.actions.shift().call(this);
    }
  };

  Monad.prototype.then = function(fn) {
    if (typeof fn === 'undefined') return this;
    if (typeof fn !== 'function') throw new Error('Invalid argument type. "then" method accepts only function as an argument.');

    this.actions.push(fn);
    if (!this.executing) this.step();
    return this;
  };

  Monad.prototype.pause = function(time) {
    if (typeof time !== 'number' || isNaN(time)) throw new Error ('Method argument not a number. Method pause accepts only a single number type argument.');
    var that = this;
    this.then(function(){
      setTimeout(function(){
        that.step();
      }, time);
    });
    return this;
  }

  function GMachine (states) {
    if (typeof states !== 'object') throw new Error('invalid argument type, state must be an object or array of objects');
    this.currentState = 0;
    if (Object.prototype.toString.call(states) === '[object Object]'){
      this[states.name] = new Monad(states);
    } else {
      if (typeof states[0] !== 'object') throw new Error('invalid argument type, state must be an object or array of objects');
      for (var i = 0; i < states.length; i+=1) {
        this[states[i].name] = new Monad(states[i]);
      }
    }
  }
  
  exports.GMachine = GMachine;

  exports.GMonad = Monad;



})(typeof window === 'undefined' ? global : window);