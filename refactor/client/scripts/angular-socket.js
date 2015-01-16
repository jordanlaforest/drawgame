/* A slightly modified code from this tutorial
 * http://code.tutsplus.com/tutorials/more-responsive-single-page-applications-with-angularjs-socketio-creating-the-library--cms-21738
 */
angular.module('socket.io', [])
  .provider('socket', function socketProvider(){
    var url = '';
    var opts = {};

    this.getUrl = function () {
      return url;
    };
    this.setUrl = function (newUrl){
      url = newUrl;
    };
    this.getOptions = function () {
      return opts;
    };
    this.setOptions = function (newOpts) {
      opts = newOpts;
    };

    this.$get = function socketFactory($rootScope) {
      var socket = io(url, opts);
      var wrappedFunctions = {};

      var wrapFunction = function(callback) {
        if(!wrappedFunctions[callback]){
          wrappedFunctions[callback] = function() {
            var args = arguments;
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          };
        }
        return wrappedFunctions[callback];
      };
      var removeFunction = function(callback) {
        var func = wrappedFunctions[callback];
        delete wrappedFunctions[callback];
        return func;
      };

      socket.on('uid', function(uid) {
        localStorage.setItem('uid', uid);
      });

      var obj = {
        on: function on(event, callback) {
          socket.on(event, wrapFunction(callback));
          return {
            destroyWith: function(scope){
              if(scope){
                scope.$on('$destroy', function(){
                  obj.off(event, callback);
                });
              }
            }
          };
        },
        off: function off(event, callback) {
          if(typeof callback === 'function') {
            socket.removeListener(event, removeFunction(callback));
          } else {
            socket.removeAllListeners(event);
          }
        },
        emit: function emit(event, data, callback) {
          if('init' === event){ //Automatically add the uid during init
            data.uid = this.uid();
          }
          if(typeof callback === 'function') {
            socket.emit(event, data, function() {
              var args = arguments;

              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
            });
          } else {
            socket.emit(event, data);
          }
        },
        uid: function uid() {
          var id = localStorage.getItem('uid');
          if(!id){
            id = socket.io.engine.id;
            localStorage.setItem('uid', id);
          }
          return uid;
        }
      };
      return obj;
    };
  });
