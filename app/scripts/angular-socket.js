/* A slightly modified code from this tutorial
 * http://code.tutsplus.com/tutorials/more-responsive-single-page-applications-with-angularjs-socketio-creating-the-library--cms-21738
 */
angular.module('socket.io', [])
  .provider('$socket', function $socketProvider(){
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

      return {
        on: function on(event, callback) {
          socket.on(event, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          });
        },
        off: function off(event, callback) {
          if(typeof callback == 'function') {
            socket.removeListener(event, callback);
          } else {
            socket.removeAllListeners(event);
          }
        },
        emit: function emit(event, data, callback) {
          if(typeof callback == 'function') {
            socket.emit(event, data, function() {
              var args = arguments;

              $rootScope.$apply(function () {
                callback.apply(socket, args);
              })
            });
          } else {
            socket.emit(event, data);
          }
        }
      };
    };
  });
