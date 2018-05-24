/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	window.StepBuilder = __webpack_require__(2);
	
	StepBuilder.get('wrapper-1').configure({
	    callbacks: {
	        beforeLeaveStep4(instance){
	            var $checkedRadio = instance.$step().find('input[type="radio"]:checked');
	
	            if($checkedRadio.length == 0){
	                alert ('Choose a pill!');
	                return false;
	            }
	
	            if($checkedRadio.val() == 1){
	                return 5;
	            }
	
	            if($checkedRadio.val() == 2){
	                return 6;
	            }
	        }
	    }
	});
	
	new Vue({
	    el: '#app',
	    data: {
	        path_of_the_chosen_one: StepBuilder.get('wrapper-1'),
	        pat_history: StepBuilder.get('wrapper-1').history(),
	        pat_log: StepBuilder.get('wrapper-1').log(),
	    }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){
	    let Steps = __webpack_require__(3);
	
	    let Builder = {
	        data: [],
	        get(name){
	            return this.data.filter(function (instance) {
	                return instance.name() == name;
	            })[0];
	        },
	        all(){
	            return this.data;
	        },
	        autoload(){
	            $('[sb-wrapper]').not('[sb-autoload="false"]').not('[sb-initialized]').each(function (index, wrapper) {
	                var $wrapper = $(wrapper);
	
	                $wrapper.attr('sb-initialized', true);
	
	                let name = $wrapper.attr('sb-wrapper');
	
	                if(this.data.filter((instance) => {return instance.name == name})[0]){
	                    throw `The wrapper with name ${name} is not unique`;
	                }
	
	                let instance = new Steps(name);
	
	                this.data.push(instance);
	            }.bind(this));
	        },
	        init(name, settings){
	            let instance = new Steps(name, settings);
	
	            this.data.push(instance);
	        }
	    };
	
	    function getWrapperInstance(button){
	        return Builder.get($(button).parents('[sb-wrapper]').first().attr('sb-wrapper'))
	    }
	
	    $('body')
	        .on('click', '[sb-wrapper] [sb-next]', function () {
	            getWrapperInstance(this).next();
	        })
	        .on('click', '[sb-wrapper] [sb-previous]', function(){
	            getWrapperInstance(this).previous();
	        })
	        .on('click', '[sb-wrapper] [sb-restart]', function () {
	            getWrapperInstance(this).restart();
	        });
	
	    Builder.autoload();
	
	    return Builder;
	}();
	


/***/ },
/* 3 */
/***/ function(module, exports) {

	let defaults = {
	    step: 1,
	};
	
	let callbacks = {
	    leave(instance, done){
	        instance.$step().hide();
	        done();
	    },
	    enter(instance){
	        instance.$step().show();
	    },
	    beforeRestart(instance){
	        return true;
	    },
	    restart(instance, done){
	        done();
	    },
	    afterRestart(instance){
	
	    }
	};
	
	let history = [];
	
	let log = [];
	
	let wrapper = '';
	
	let Steps = function(name, settings = {}){
	    wrapper = name;
	
	    this.configure(settings);
	
	    log.push(this.step);
	
	    return this;
	};
	
	Steps.prototype.navigate = function(type){
	    if(this.step == (type == 'next' ? this.total : 1)){
	        return;
	    }
	
	    var beforeNextCallback = callbacks[`beforeLeaveStep${this.step}`];
	
	    let nextValue = beforeNextCallback && type == 'next' ? beforeNextCallback(this) : true;
	
	    if(nextValue === false){
	        return;
	    }
	
	    callbacks.leave(this, function(){
	        if(type == 'next'){
	            history.push(this.step);
	            this.step = !isNaN(parseFloat(nextValue)) && nextValue > 0 ? nextValue : this.step + 1;
	            log.push(this.step);
	        }
	
	        if(type == 'previous'){
	            this.step = history[history.length - 1];
	            history.splice(-1, 1);
	            log.push(this.step);
	        }
	
	        callbacks.enter(this);
	
	        if(callbacks[`enterStep${this.step}`]){
	            callbacks[`enterStep${this.step}`](this);
	        }
	    }.bind(this));
	};
	
	Steps.prototype.next = function(){
	    this.navigate('next');
	};
	
	Steps.prototype.previous = function(){
	    this.navigate('previous');
	};
	
	Steps.prototype.restart = function(){
	    if(callbacks.beforeRestart(this) === false){
	        return;
	    }
	
	    callbacks.leave(this, function(){
	        this.step = 1;
	
	        callbacks.enter(this);
	
	        if(callbacks[`enterStep${this.step}`]){
	            callbacks[`enterStep${this.step}`](this);
	        }
	    }.bind(this));
	};
	
	Steps.prototype.configure = function(settings){
	    if(settings.name){
	        throw 'You are not allowed to modify the name of the instance'
	    }
	
	    Object.assign(defaults, settings);
	
	    Object.assign(this, defaults);
	
	    Object.assign(callbacks, settings.callbacks);
	
	    this.total = this.total ? this.total : Math.max.apply(null, this.$wrapper().find('[sb-number]').map(function(index, step){
	        return parseInt($(step).attr('sb-number'));
	    }));
	
	    if(!this.total){
	        throw `The total number of steps for the instance ${wrapper} must be provided.`;
	    }
	};
	
	Steps.prototype.$wrapper = function(){
	    return $(`[sb-wrapper="${wrapper}"]`);
	};
	
	Steps.prototype.$step = function(){
	    return this.$wrapper().find(`[sb-number="${this.step}"]`);
	};
	
	Steps.prototype.history = function(){
	    return history;
	};
	
	Steps.prototype.log = function(){
	    return log;
	};
	
	Steps.prototype.name = function(){
	    return wrapper;
	};
	
	module.exports = Steps;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWI0YzNlMzc2MDljNzYyMDk0MTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvc3RlcC1uYXZpZ2F0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zdGVwcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUM5QkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxvREFBbUQsNkJBQTZCO0FBQ2hGLG9EQUFtRCxLQUFLO0FBQ3hEOztBQUVBOztBQUVBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7O0FBRUE7QUFDQSxFQUFDOzs7Ozs7OztBQ3ZERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx5Q0FBd0M7QUFDeEM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwREFBeUQsVUFBVTs7QUFFbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGtDQUFpQyxVQUFVO0FBQzNDLG1DQUFrQyxVQUFVO0FBQzVDO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxrQ0FBaUMsVUFBVTtBQUMzQyxtQ0FBa0MsVUFBVTtBQUM1QztBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLDZEQUE0RCxRQUFRO0FBQ3BFO0FBQ0E7O0FBRUE7QUFDQSw4QkFBNkIsUUFBUTtBQUNyQzs7QUFFQTtBQUNBLGdEQUErQyxVQUFVO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWI0YzNlMzc2MDljNzYyMDk0MTMiLCJ3aW5kb3cuU3RlcEJ1aWxkZXIgPSByZXF1aXJlKCcuL3N0ZXAtbmF2aWdhdGlvbicpO1xyXG5cclxuU3RlcEJ1aWxkZXIuZ2V0KCd3cmFwcGVyLTEnKS5jb25maWd1cmUoe1xyXG4gICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgYmVmb3JlTGVhdmVTdGVwNChpbnN0YW5jZSl7XHJcbiAgICAgICAgICAgIHZhciAkY2hlY2tlZFJhZGlvID0gaW5zdGFuY2UuJHN0ZXAoKS5maW5kKCdpbnB1dFt0eXBlPVwicmFkaW9cIl06Y2hlY2tlZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYoJGNoZWNrZWRSYWRpby5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICBhbGVydCAoJ0Nob29zZSBhIHBpbGwhJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCRjaGVja2VkUmFkaW8udmFsKCkgPT0gMSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoJGNoZWNrZWRSYWRpby52YWwoKSA9PSAyKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiA2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gICAgZWw6ICcjYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBwYXRoX29mX3RoZV9jaG9zZW5fb25lOiBTdGVwQnVpbGRlci5nZXQoJ3dyYXBwZXItMScpLFxyXG4gICAgICAgIHBhdF9oaXN0b3J5OiBTdGVwQnVpbGRlci5nZXQoJ3dyYXBwZXItMScpLmhpc3RvcnkoKSxcclxuICAgICAgICBwYXRfbG9nOiBTdGVwQnVpbGRlci5nZXQoJ3dyYXBwZXItMScpLmxvZygpLFxyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IFN0ZXBzID0gcmVxdWlyZSgnLi9zdGVwcycpO1xyXG5cclxuICAgIGxldCBCdWlsZGVyID0ge1xyXG4gICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgIGdldChuYW1lKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2UubmFtZSgpID09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWxsKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdXRvbG9hZCgpe1xyXG4gICAgICAgICAgICAkKCdbc2Itd3JhcHBlcl0nKS5ub3QoJ1tzYi1hdXRvbG9hZD1cImZhbHNlXCJdJykubm90KCdbc2ItaW5pdGlhbGl6ZWRdJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHdyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQod3JhcHBlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuYXR0cignc2ItaW5pdGlhbGl6ZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9ICR3cmFwcGVyLmF0dHIoJ3NiLXdyYXBwZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmRhdGEuZmlsdGVyKChpbnN0YW5jZSkgPT4ge3JldHVybiBpbnN0YW5jZS5uYW1lID09IG5hbWV9KVswXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYFRoZSB3cmFwcGVyIHdpdGggbmFtZSAke25hbWV9IGlzIG5vdCB1bmlxdWVgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbnN0YW5jZSA9IG5ldyBTdGVwcyhuYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0KG5hbWUsIHNldHRpbmdzKXtcclxuICAgICAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IFN0ZXBzKG5hbWUsIHNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFdyYXBwZXJJbnN0YW5jZShidXR0b24pe1xyXG4gICAgICAgIHJldHVybiBCdWlsZGVyLmdldCgkKGJ1dHRvbikucGFyZW50cygnW3NiLXdyYXBwZXJdJykuZmlyc3QoKS5hdHRyKCdzYi13cmFwcGVyJykpXHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpXHJcbiAgICAgICAgLm9uKCdjbGljaycsICdbc2Itd3JhcHBlcl0gW3NiLW5leHRdJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBnZXRXcmFwcGVySW5zdGFuY2UodGhpcykubmV4dCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdjbGljaycsICdbc2Itd3JhcHBlcl0gW3NiLXByZXZpb3VzXScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGdldFdyYXBwZXJJbnN0YW5jZSh0aGlzKS5wcmV2aW91cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdjbGljaycsICdbc2Itd3JhcHBlcl0gW3NiLXJlc3RhcnRdJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBnZXRXcmFwcGVySW5zdGFuY2UodGhpcykucmVzdGFydCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIEJ1aWxkZXIuYXV0b2xvYWQoKTtcclxuXHJcbiAgICByZXR1cm4gQnVpbGRlcjtcclxufSgpO1xyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvc3RlcC1uYXZpZ2F0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBkZWZhdWx0cyA9IHtcclxuICAgIHN0ZXA6IDEsXHJcbn07XHJcblxyXG5sZXQgY2FsbGJhY2tzID0ge1xyXG4gICAgbGVhdmUoaW5zdGFuY2UsIGRvbmUpe1xyXG4gICAgICAgIGluc3RhbmNlLiRzdGVwKCkuaGlkZSgpO1xyXG4gICAgICAgIGRvbmUoKTtcclxuICAgIH0sXHJcbiAgICBlbnRlcihpbnN0YW5jZSl7XHJcbiAgICAgICAgaW5zdGFuY2UuJHN0ZXAoKS5zaG93KCk7XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlUmVzdGFydChpbnN0YW5jZSl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgcmVzdGFydChpbnN0YW5jZSwgZG9uZSl7XHJcbiAgICAgICAgZG9uZSgpO1xyXG4gICAgfSxcclxuICAgIGFmdGVyUmVzdGFydChpbnN0YW5jZSl7XHJcblxyXG4gICAgfVxyXG59O1xyXG5cclxubGV0IGhpc3RvcnkgPSBbXTtcclxuXHJcbmxldCBsb2cgPSBbXTtcclxuXHJcbmxldCB3cmFwcGVyID0gJyc7XHJcblxyXG5sZXQgU3RlcHMgPSBmdW5jdGlvbihuYW1lLCBzZXR0aW5ncyA9IHt9KXtcclxuICAgIHdyYXBwZXIgPSBuYW1lO1xyXG5cclxuICAgIHRoaXMuY29uZmlndXJlKHNldHRpbmdzKTtcclxuXHJcbiAgICBsb2cucHVzaCh0aGlzLnN0ZXApO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU3RlcHMucHJvdG90eXBlLm5hdmlnYXRlID0gZnVuY3Rpb24odHlwZSl7XHJcbiAgICBpZih0aGlzLnN0ZXAgPT0gKHR5cGUgPT0gJ25leHQnID8gdGhpcy50b3RhbCA6IDEpKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJlZm9yZU5leHRDYWxsYmFjayA9IGNhbGxiYWNrc1tgYmVmb3JlTGVhdmVTdGVwJHt0aGlzLnN0ZXB9YF07XHJcblxyXG4gICAgbGV0IG5leHRWYWx1ZSA9IGJlZm9yZU5leHRDYWxsYmFjayAmJiB0eXBlID09ICduZXh0JyA/IGJlZm9yZU5leHRDYWxsYmFjayh0aGlzKSA6IHRydWU7XHJcblxyXG4gICAgaWYobmV4dFZhbHVlID09PSBmYWxzZSl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrcy5sZWF2ZSh0aGlzLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKHR5cGUgPT0gJ25leHQnKXtcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoKHRoaXMuc3RlcCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcCA9ICFpc05hTihwYXJzZUZsb2F0KG5leHRWYWx1ZSkpICYmIG5leHRWYWx1ZSA+IDAgPyBuZXh0VmFsdWUgOiB0aGlzLnN0ZXAgKyAxO1xyXG4gICAgICAgICAgICBsb2cucHVzaCh0aGlzLnN0ZXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodHlwZSA9PSAncHJldmlvdXMnKXtcclxuICAgICAgICAgICAgdGhpcy5zdGVwID0gaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBoaXN0b3J5LnNwbGljZSgtMSwgMSk7XHJcbiAgICAgICAgICAgIGxvZy5wdXNoKHRoaXMuc3RlcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYWxsYmFja3MuZW50ZXIodGhpcyk7XHJcblxyXG4gICAgICAgIGlmKGNhbGxiYWNrc1tgZW50ZXJTdGVwJHt0aGlzLnN0ZXB9YF0pe1xyXG4gICAgICAgICAgICBjYWxsYmFja3NbYGVudGVyU3RlcCR7dGhpcy5zdGVwfWBdKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5TdGVwcy5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm5hdmlnYXRlKCduZXh0Jyk7XHJcbn07XHJcblxyXG5TdGVwcy5wcm90b3R5cGUucHJldmlvdXMgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5uYXZpZ2F0ZSgncHJldmlvdXMnKTtcclxufTtcclxuXHJcblN0ZXBzLnByb3RvdHlwZS5yZXN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKGNhbGxiYWNrcy5iZWZvcmVSZXN0YXJ0KHRoaXMpID09PSBmYWxzZSl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrcy5sZWF2ZSh0aGlzLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuc3RlcCA9IDE7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrcy5lbnRlcih0aGlzKTtcclxuXHJcbiAgICAgICAgaWYoY2FsbGJhY2tzW2BlbnRlclN0ZXAke3RoaXMuc3RlcH1gXSl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrc1tgZW50ZXJTdGVwJHt0aGlzLnN0ZXB9YF0odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcblN0ZXBzLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbihzZXR0aW5ncyl7XHJcbiAgICBpZihzZXR0aW5ncy5uYW1lKXtcclxuICAgICAgICB0aHJvdyAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBtb2RpZnkgdGhlIG5hbWUgb2YgdGhlIGluc3RhbmNlJ1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHNldHRpbmdzKTtcclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRlZmF1bHRzKTtcclxuXHJcbiAgICBPYmplY3QuYXNzaWduKGNhbGxiYWNrcywgc2V0dGluZ3MuY2FsbGJhY2tzKTtcclxuXHJcbiAgICB0aGlzLnRvdGFsID0gdGhpcy50b3RhbCA/IHRoaXMudG90YWwgOiBNYXRoLm1heC5hcHBseShudWxsLCB0aGlzLiR3cmFwcGVyKCkuZmluZCgnW3NiLW51bWJlcl0nKS5tYXAoZnVuY3Rpb24oaW5kZXgsIHN0ZXApe1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCgkKHN0ZXApLmF0dHIoJ3NiLW51bWJlcicpKTtcclxuICAgIH0pKTtcclxuXHJcbiAgICBpZighdGhpcy50b3RhbCl7XHJcbiAgICAgICAgdGhyb3cgYFRoZSB0b3RhbCBudW1iZXIgb2Ygc3RlcHMgZm9yIHRoZSBpbnN0YW5jZSAke3dyYXBwZXJ9IG11c3QgYmUgcHJvdmlkZWQuYDtcclxuICAgIH1cclxufTtcclxuXHJcblN0ZXBzLnByb3RvdHlwZS4kd3JhcHBlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gJChgW3NiLXdyYXBwZXI9XCIke3dyYXBwZXJ9XCJdYCk7XHJcbn07XHJcblxyXG5TdGVwcy5wcm90b3R5cGUuJHN0ZXAgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuJHdyYXBwZXIoKS5maW5kKGBbc2ItbnVtYmVyPVwiJHt0aGlzLnN0ZXB9XCJdYCk7XHJcbn07XHJcblxyXG5TdGVwcy5wcm90b3R5cGUuaGlzdG9yeSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gaGlzdG9yeTtcclxufTtcclxuXHJcblN0ZXBzLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIGxvZztcclxufTtcclxuXHJcblN0ZXBzLnByb3RvdHlwZS5uYW1lID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdGVwcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9zdGVwcy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9