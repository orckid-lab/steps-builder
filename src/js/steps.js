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